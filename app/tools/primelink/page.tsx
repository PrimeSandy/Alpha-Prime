"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Lock, User, Clock, ChevronRight, X } from 'lucide-react';
import RoomCreator from '@/components/primelink/RoomCreator';
import RoomJoin from '@/components/primelink/RoomJoin';
import ChatWindow from '@/components/primelink/ChatWindow';
import RoomStatusDot from '@/components/primelink/RoomStatusDot';

interface Identity {
    token: string;
    name: string;
}

interface RecentRoom {
    id: string;
    code: string;
    visual: string;
    lastJoined: Date;
}

export default function PrimeLinkPage() {
    const [identity, setIdentity] = useState<Identity | null>(null);
    const [tempName, setTempName] = useState('');
    const [isClient, setIsClient] = useState(false);

    const [activeRoom, setActiveRoom] = useState<{ id: string, code: string, visual: string } | null>(null);
    const [recentRooms, setRecentRooms] = useState<RecentRoom[]>([]);
    const [pendingInviteCode, setPendingInviteCode] = useState<string | null>(null);
    const [isJoiningViaInvite, setIsJoiningViaInvite] = useState(false);
    const [activeInviteLink, setActiveInviteLink] = useState<string | null>(null);

    useEffect(() => {
        setIsClient(true);
        let storedToken = localStorage.getItem('primelink_identity_token');
        const storedName = localStorage.getItem('primelink_identity_name');

        if (!storedToken) {
            storedToken = uuidv4();
            localStorage.setItem('primelink_identity_token', storedToken);
        }

        if (storedToken && storedName) {
            setIdentity({ token: storedToken, name: storedName });
        }

        const storedRecents = localStorage.getItem('primelink_recent_rooms');
        if (storedRecents) {
            try {
                const parsedRecents: RecentRoom[] = JSON.parse(storedRecents).map((room: { id: string; code: string; visual: string; lastJoined: string }) => ({
                    ...room,
                    lastJoined: new Date(room.lastJoined)
                }));
                setRecentRooms(parsedRecents);
            } catch (e) {
                console.error("Failed to parse recent rooms", e);
            }
        }

        const storedRoomId = localStorage.getItem('primelink_current_room_id');
        const storedRoomCode = localStorage.getItem('primelink_current_room_code');
        const storedVisualId = localStorage.getItem('primelink_current_visual_id');

        if (storedRoomId && storedRoomCode) {
            setActiveRoom({ id: storedRoomId, code: storedRoomCode, visual: storedVisualId || '💬' });
        }

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'primelink_recent_rooms' && e.newValue) {
                try {
                    const parsedRecents: RecentRoom[] = JSON.parse(e.newValue).map((room: { id: string; code: string; visual: string; lastJoined: string }) => ({
                        ...room,
                        lastJoined: new Date(room.lastJoined)
                    }));
                    setRecentRooms(parsedRecents);
                } catch (error) {
                    console.error("Failed to parse recent rooms from storage event", error);
                }
            } else if (e.key === 'primelink_recent_rooms' && e.newValue === null) {
                setRecentRooms([]);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Handle invite URL: ?invite=ROOMCODE — auto-join once identity is set
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const inviteCode = params.get('invite');
        if (inviteCode) {
            setPendingInviteCode(inviteCode.toUpperCase());
            // Clean the URL without reloading
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, '', cleanUrl);
        }
    }, []);

    const handleJoinRoom = useCallback(async (roomId: string, roomCode: string, visualId: string, inviteLink?: string) => {
        // NOTE: This is called after RPC verification from RoomCreator/RoomJoin.
        setActiveRoom({ id: roomId, code: roomCode, visual: visualId });
        if (inviteLink) setActiveInviteLink(inviteLink);
        localStorage.setItem('primelink_current_room_id', roomId);
        localStorage.setItem('primelink_current_room_code', roomCode);
        localStorage.setItem('primelink_current_visual_id', visualId);

        setRecentRooms(prev => {
            const filtered = prev.filter(r => r.id !== roomId);
            const newList = [
                { id: roomId, code: roomCode, visual: visualId, lastJoined: new Date() },
                ...filtered
            ].slice(0, 5);
            localStorage.setItem('primelink_recent_rooms', JSON.stringify(newList));
            window.dispatchEvent(new Event('storage'));
            return newList;
        });
    }, []);

    // When identity becomes available AND there is a pending invite, auto-join
    useEffect(() => {
        if (!identity || !pendingInviteCode || isJoiningViaInvite || activeRoom) return;

        const autoJoin = async () => {
            setIsJoiningViaInvite(true);
            const supabaseModule = (await import('@/lib/supabase'));
            const supabase = supabaseModule.createClient(identity.token);
            try {
                const { data, error: rpcError } = await supabase.rpc('join_room', {
                    p_room_code: pendingInviteCode,
                    p_token: identity.token,
                    p_name: identity.name
                });

                if (rpcError) {
                    if (rpcError.message.includes('ROOM_FULL:')) {
                        alert('⛔ This invite link has already been used. The room is full.');
                    } else if (rpcError.message.includes('INVALID_CODE')) {
                        alert('This invite link is no longer valid. The room may have been deleted.');
                    } else {
                        alert('Could not join via invite: ' + rpcError.message);
                    }
                    setPendingInviteCode(null);
                    return;
                }

                if (data && data.id) {
                    setPendingInviteCode(null);
                    handleJoinRoom(data.id, data.room_code, data.visual_id);
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                alert('Invite join failed: ' + errorMessage);
                setPendingInviteCode(null);
            } finally {
                setIsJoiningViaInvite(false);
            }
        };

        autoJoin();
    }, [identity, pendingInviteCode, isJoiningViaInvite, activeRoom, handleJoinRoom]);
    const handleSetName = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = tempName.trim();
        if (!trimmed) return;

        const token = localStorage.getItem('primelink_identity_token');
        if (token) {
            localStorage.setItem('primelink_identity_name', trimmed);
            setIdentity({ token, name: trimmed });
        }
    };
    const handleRejoinFromHistory = async (room: RecentRoom) => {
        // Re-joining from recent history MUST go through the RPC to verify the room
        // still exists and slot is available (prevents 3rd person re-entry after delete)
        if (!identity) return;

        const supabase = (await import('@/lib/supabase')).createClient(identity.token);

        try {
            const { data, error: rpcError } = await supabase.rpc('join_room', {
                p_room_code: room.code,
                p_token: identity.token,
                p_name: identity.name
            });

            if (rpcError) {
                if (rpcError.message.includes('ROOM_FULL:')) {
                    alert("⛔ Access Denied: This room is full. You are not a participant.");
                    // Remove from history since we can't access it
                    handleRemoveRecent(room.id);
                    return;
                } else if (rpcError.message.includes('INVALID_CODE')) {
                    alert("This room no longer exists. Removing from history.");
                    handleRemoveRecent(room.id);
                    return;
                }
                throw rpcError;
            }

            if (data && data.id) {
                handleJoinRoom(data.id, data.room_code, data.visual_id);
            }
        } catch (err: unknown) {
            console.error("Rejoin error:", err);
            const errorMessage = err instanceof Error ? err.message : "Could not rejoin room. It may have been destroyed.";
            alert(errorMessage);
            handleRemoveRecent(room.id);
        }
    };

    const handleLeaveRoom = () => {
        setActiveRoom(null);
        setActiveInviteLink(null);
        localStorage.removeItem('primelink_current_room_id');
        localStorage.removeItem('primelink_current_room_code');
        localStorage.removeItem('primelink_current_visual_id');
    };

    const handleRemoveRecent = (roomId: string) => {
        setRecentRooms(prev => {
            const newList = prev.filter(r => r.id !== roomId);
            localStorage.setItem('primelink_recent_rooms', JSON.stringify(newList));
            window.dispatchEvent(new Event('storage'));
            return newList;
        });
    };

    if (!isClient) return null;

    // Chat view uses full-screen fixed layout
    if (activeRoom && identity) {
        return (
            <div className="fixed inset-0 top-16 z-40 bg-gray-50 flex flex-col">
                <ChatWindow
                    roomId={activeRoom.id}
                    roomCode={activeRoom.code}
                    visualId={activeRoom.visual}
                    token={identity.token}
                    name={identity.name}
                    inviteLink={activeInviteLink}
                    onUpdateName={(newName: string) => {
                        localStorage.setItem('primelink_identity_name', newName);
                        setIdentity(prev => prev ? { ...prev, name: newName } : null);
                    }}
                    onLeave={handleLeaveRoom}
                />
            </div>
        );
    }

    // Lobby + Name Entry view — normal scroll layout
    return (
        <div className="min-h-0 sm:min-h-screen bg-gray-50 w-full pt-8 sm:pt-24 pb-8 sm:pb-20 px-4">
            <div className="container mx-auto max-w-5xl">

                {/* Page Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-4 bg-black rounded-2xl mb-6 shadow-xl">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-black">
                        PrimeLink Private Chat
                    </h1>
                    <p className="text-gray-800 max-w-2xl mx-auto text-lg">
                        A secure 2-participant room-based private chat tool with intrusion detection and no traditional login system.
                    </p>
                </div>

                {!identity ? (
                    /* Name Entry Step */
                    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                        {pendingInviteCode && (
                            <div className="mb-6 p-3 bg-blue-50 rounded-xl border border-blue-200 text-sm text-blue-700">
                                🔗 You&apos;ve been invited to a secure room. Enter your display name to join instantly.
                            </div>
                        )}
                        <h2 className="text-2xl font-bold text-black mb-2">Identify Yourself</h2>
                        <p className="text-gray-800 mb-8">
                            Enter a display name before entering a chat room. It stays local in your browser.
                        </p>
                        <form onSubmit={handleSetName} className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 w-5 h-5" />
                                <input
                                    type="text"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    placeholder="Enter your Display Name"
                                    maxLength={20}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-4 text-black focus:outline-none focus:border-black transition-all font-bold"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!tempName.trim()}
                                className="w-full py-4 bg-white text-black border-2 border-black rounded-xl font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50"
                            >
                                Continue to Lobby
                            </button>
                        </form>
                    </div>
                ) : (
                    /* Lobby View */
                    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
                        {/* Identity Header */}
                        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="bg-gray-200 p-2 rounded-xl">
                                    <User className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-800 font-bold uppercase tracking-wider">Your Display Name</p>
                                    <p className="text-lg font-bold text-black">{identity.name}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIdentity(null)}
                                className="px-4 py-2 text-sm font-bold text-black bg-gray-200 hover:bg-gray-200 rounded-xl transition-colors"
                            >
                                Edit Name
                            </button>
                        </div>

                        {/* Create & Join Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:border-black transition-colors">
                                <RoomCreator token={identity.token} name={identity.name} onJoinRoom={(id, code, visual, link) => handleJoinRoom(id, code, visual, link)} />
                            </div>
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:border-black transition-colors">
                                <RoomJoin token={identity.token} name={identity.name} onJoinRoom={handleJoinRoom} />
                            </div>
                        </div>

                        {/* Recent Rooms */}
                        {recentRooms.length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2 uppercase tracking-wider">
                                    <Clock className="w-4 h-4" /> Recent Rooms
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {recentRooms.map(room => (
                                        <div key={room.id} className="flex items-center gap-2 bg-white p-3 pr-4 rounded-2xl border border-gray-200 shadow-sm hover:border-black transition-all group">
                                            <div onClick={() => handleRejoinFromHistory(room)} className="flex items-center gap-3 cursor-pointer flex-grow pl-1">
                                                <span className="text-2xl">{room.visual}</span>
                                                <div className="flex flex-col flex-grow">
                                                    <span className="font-mono font-bold text-black tracking-widest text-sm">{room.code}</span>
                                                </div>
                                                {/* Live status dot */}
                                                <RoomStatusDot roomId={room.id} roomCode={room.code} token={identity.token} />
                                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleRemoveRecent(room.id); }}
                                                className="p-2 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                                                title="Remove from history"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Security Info Footer */}
                        <div className="mt-4 bg-gray-200 rounded-2xl p-6 border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <Lock className="w-5 h-5 text-black" />
                                <h3 className="font-bold text-black">Security First Approach</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                                <div>
                                    <h4 className="font-bold text-gray-700 mb-1">Anonymous Identity</h4>
                                    <p className="text-gray-800">You are identified only by a secure token stored in your browser.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-700 mb-1">Max 2 Participants</h4>
                                    <p className="text-gray-800">Rooms instantly lock when full. Intrusions are actively blocked and logged.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-700 mb-1">Self Destruct</h4>
                                    <p className="text-gray-800">Either participant can destroy the room instantly. Data is permanently purged.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

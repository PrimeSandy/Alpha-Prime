"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Send, LogOut, Trash2, Copy, Check, MessageSquare, Pencil, X, Link2 } from 'lucide-react';
import StatusIndicator from './StatusIndicator';

interface ChatWindowProps {
    roomId: string;
    roomCode: string;
    visualId: string;
    token: string;
    name: string;
    inviteLink?: string | null;
    onUpdateName: (newName: string) => void;
    onLeave: () => void;
}

interface Message {
    id: string;
    room_id: string;
    sender_token: string;
    sender_name: string;
    content: string;
    created_at: string;
    isSystem?: boolean;
}

export default function ChatWindow({ roomId, roomCode, visualId, token, name, inviteLink, onUpdateName, onLeave }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempNameEdit, setTempNameEdit] = useState('');
    const [inviteLinkCopied, setInviteLinkCopied] = useState(false);
    const [partnerOnline, setPartnerOnline] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [supabase] = useState(() => createClient(token));
    const [chatChannel, setChatChannel] = useState<RealtimeChannel | null>(null);

    const BANNER_KEY = 'primelink_room_banner_dismissed';
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem(BANNER_KEY)) {
            setShowBanner(true);
        }
    }, []);

    // Track partner's presence on the SAME channel as StatusIndicator — hide invite when they join
    useEffect(() => {
        if (!inviteLink) return;
        const presenceClient = createClient(token);
        // Use same channel key as StatusIndicator so we catch real partner presence
        const presenceChannel = presenceClient.channel(`room_${roomId}`, {
            config: { presence: { key: token } },
        });
        presenceChannel
            .on('presence', { event: 'sync' }, () => {
                const count = Object.keys(presenceChannel.presenceState()).length;
                if (count >= 2) setPartnerOnline(true);
            })
            .subscribe(async (s: string) => {
                if (s === 'SUBSCRIBED') {
                    await presenceChannel.track({ online_at: new Date().toISOString() });
                }
            });
        return () => { presenceClient.removeChannel(presenceChannel); };
    }, [inviteLink, roomId, token]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        let isMounted = true;

        const addSystemMessage = (content: string) => {
            if (!isMounted) return;
            setMessages(prev => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    room_id: roomId,
                    sender_token: 'system',
                    sender_name: 'System',
                    content,
                    created_at: new Date().toISOString(),
                    isSystem: true
                }
            ]);
        };

        const loadData = async () => {
            const { data: msgData } = await supabase
                .from('messages')
                .select('*')
                .eq('room_id', roomId)
                .order('created_at', { ascending: true });

            if (msgData && isMounted) {
                setMessages(msgData as Message[]);
            }
        };

        loadData();

        const channel = supabase.channel(`chat_${roomId}`);

        channel
            .on('broadcast', { event: 'new_message' }, ({ payload }: { payload: Message }) => {
                if (isMounted) {
                    setMessages(prev => {
                        if (prev.find(m => m.id === payload.id)) return prev;
                        return [...prev, payload];
                    });
                }
            })
            .on('broadcast', { event: 'name_change' }, ({ payload }: { payload: { content: string, from_token: string } }) => {
                // Both sender and receiver get this via broadcast.
                // We use `from_token` to avoid double-inserting on sender's side.
                if (isMounted && payload.from_token !== token) {
                    addSystemMessage(payload.content);
                }
            })
            .on('broadcast', { event: 'room_destroyed' }, () => {
                if (isMounted) {
                    alert("⚠️ The other participant has permanently destroyed this room.");
                    onLeave();
                }
            })
            .subscribe();

        setChatChannel(channel);

        return () => {
            isMounted = false;
            channel.untrack();
            supabase.removeChannel(channel);
        };
    }, [roomId, token, supabase, onLeave]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;

        const msgContent = newMessage.trim();
        setNewMessage('');
        setIsSending(true);

        try {
            const tempId = crypto.randomUUID();
            const newMsgObj: Message = {
                id: tempId,
                room_id: roomId,
                sender_token: token,
                sender_name: name,
                content: msgContent,
                created_at: new Date().toISOString()
            };

            setMessages(prev => [...prev, newMsgObj]);

            if (chatChannel) {
                chatChannel.send({
                    type: 'broadcast',
                    event: 'new_message',
                    payload: newMsgObj
                });
            }

            await supabase.from('messages').insert([newMsgObj]);
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsSending(false);
        }
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(roomCode);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleSaveNameEdit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = tempNameEdit.trim();
        if (!trimmed || trimmed === name) {
            setIsEditingName(false);
            return;
        }

        const oldName = name;
        const content = `${oldName} changed their name to "${trimmed}"`;

        // Update identity
        onUpdateName(trimmed);
        setIsEditingName(false);

        // Broadcast to the OTHER person only (from_token lets the receiver know to display it)
        if (chatChannel) {
            chatChannel.send({
                type: 'broadcast',
                event: 'name_change',
                payload: { content, from_token: token }
            });
        }

        // Add our own local system message (since we excluded sender in broadcast listener)
        setMessages(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                room_id: roomId,
                sender_token: 'system',
                sender_name: 'System',
                content,
                created_at: new Date().toISOString(),
                isSystem: true
            }
        ]);
    };

    const handleDestroyRoom = async () => {
        const confirmMsg = "🚨 SECURITY WARNING: This will permanently destroy this room and ALL messages for both participants. This cannot be undone.";
        if (!confirm(confirmMsg)) return;

        try {
            if (chatChannel) {
                chatChannel.send({ type: 'broadcast', event: 'room_destroyed' });
            }

            await supabase.from('rooms').delete().eq('id', roomId);

            const storedRecents = localStorage.getItem('primelink_recent_rooms');
            if (storedRecents) {
                try {
                    const filtered = JSON.parse(storedRecents).filter((r: { id: string }) => r.id !== roomId);
                    localStorage.setItem('primelink_recent_rooms', JSON.stringify(filtered));
                    window.dispatchEvent(new Event('storage'));
                } catch { /* ignore */ }
            }

            onLeave();
        } catch (err) {
            console.error("Failed to destroy room:", err);
        }
    };

    const formatTime = (iso: string) => {
        return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        const today = new Date();
        if (d.toDateString() === today.toDateString()) return 'Today';
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
    };

    // Group messages by date
    const messageGroups: { date: string; msgs: Message[] }[] = [];
    messages.forEach(msg => {
        const date = formatDate(msg.created_at);
        const last = messageGroups[messageGroups.length - 1];
        if (!last || last.date !== date) {
            messageGroups.push({ date, msgs: [msg] });
        } else {
            last.msgs.push(msg);
        }
    });

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex flex-col bg-white border-b border-gray-200 flex-shrink-0">
                {/* Row 1: Identity + Actions */}
                <div className="flex items-center gap-2 px-3 py-2.5">
                    {/* Visual ID */}
                    <span className="text-xl flex-shrink-0">{visualId}</span>

                    {/* Name section */}
                    <div className="flex-grow min-w-0">
                        {isEditingName ? (
                            <form onSubmit={handleSaveNameEdit} className="flex items-center gap-1.5">
                                <input
                                    type="text"
                                    value={tempNameEdit}
                                    onChange={e => setTempNameEdit(e.target.value)}
                                    className="bg-gray-200 border border-black px-2 py-1 rounded text-sm font-bold w-28 outline-none text-black"
                                    autoFocus
                                    maxLength={20}
                                />
                                <button type="submit" className="text-xs bg-white text-black border-2 border-black px-2 py-1 rounded-lg font-bold">OK</button>
                                <button type="button" onClick={() => setIsEditingName(false)} className="text-xs text-gray-800 px-1">✕</button>
                            </form>
                        ) : (
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-black text-sm truncate max-w-[120px]">{name}</span>
                                <span className="text-gray-700 text-xs flex-shrink-0">(You)</span>
                                <button
                                    onClick={() => { setTempNameEdit(name); setIsEditingName(true); }}
                                    className="p-1 hover:bg-gray-200 rounded-md transition-colors flex-shrink-0"
                                    title="Edit Name"
                                >
                                    <Pencil className="w-3 h-3 text-gray-700" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                            onClick={handleDestroyRoom}
                            className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                            title="Destroy Room"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onLeave}
                            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-200 text-gray-800 transition-colors"
                            title="Leave Room"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Row 2: Room code (styled pill) + Status Indicator */}
                <div className="flex items-center justify-between px-3 pb-2.5">
                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1" style={{ background: 'linear-gradient(135deg, #000000, #001247)' }}>
                            <span className="font-mono font-extrabold tracking-widest text-sm text-white">{roomCode}</span>
                            <button onClick={handleCopyCode} className="text-white/60 hover:text-white transition-colors" title="Copy code">
                                {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    </div>
                    <StatusIndicator roomId={roomId} token={token} />
                </div>
            </div>

            {/* Device Warning Banner — shown once per device until dismissed */}
            {showBanner && (
                <div className="flex items-start gap-2 px-3 py-2 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs flex-shrink-0">
                    <span className="flex-shrink-0 mt-0.5">⚠</span>
                    <p className="flex-grow leading-relaxed">
                        <span className="font-bold">PrimeLink does not use accounts.</span> If you clear browser data, you may permanently lose access to this room.
                    </p>
                    <button
                        onClick={() => {
                            localStorage.setItem(BANNER_KEY, '1');
                            setShowBanner(false);
                        }}
                        className="flex-shrink-0 p-0.5 hover:text-amber-900 transition-colors"
                        title="Dismiss"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Invite Link Banner — visible until partner joins */}
            {inviteLink && !partnerOnline && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border-b border-blue-200 flex-shrink-0">
                    <Link2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span className="text-xs font-bold text-blue-700 flex-shrink-0">Invite:</span>
                    <code className="flex-grow text-xs text-blue-600 font-mono truncate">{inviteLink}</code>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(inviteLink);
                            setInviteLinkCopied(true);
                            setTimeout(() => setInviteLinkCopied(false), 2000);
                        }}
                        className="flex-shrink-0 p-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                        title="Copy invite link"
                    >
                        {inviteLinkCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                </div>
            )}

            {/* Chat Area */}
            <div className="flex-grow overflow-y-auto p-3 sm:p-4 space-y-1" style={{ background: '#f9f9f9', color: '#0a0a0a' }}>
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-700 gap-3">
                        <MessageSquare className="w-10 h-10 opacity-30" />
                        <p className="text-sm">No messages yet. Say hi!</p>
                    </div>
                ) : (
                    messageGroups.map(group => (
                        <div key={group.date}>
                            {/* Date Divider */}
                            <div className="flex items-center gap-3 my-4">
                                <div className="flex-1 h-px bg-gray-200" />
                                <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">{group.date}</span>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>

                            {group.msgs.map((msg) => {
                                if (msg.isSystem) {
                                    return (
                                        <div key={msg.id} className="flex justify-center my-3">
                                            <span className="bg-amber-100 text-amber-800 text-[11px] font-semibold px-3 py-1 rounded-full italic">
                                                {msg.content}
                                            </span>
                                        </div>
                                    );
                                }

                                const isMe = msg.sender_token === token;

                                return (
                                    <div key={msg.id} className={`flex flex-col mb-2 ${isMe ? 'items-end' : 'items-start'}`}>
                                        {/* Sender name + time */}
                                        <div className={`flex items-baseline gap-2 mb-0.5 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <span className="text-[11px] font-bold text-gray-800">
                                                {isMe ? `${msg.sender_name || name} (You)` : (msg.sender_name || 'Partner')}
                                            </span>
                                            <span className="text-[10px] text-gray-700">{formatTime(msg.created_at)}</span>
                                        </div>

                                        {/* Bubble */}
                                        <div className={`max-w-[78%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 ${isMe
                                            ? 'bg-white text-black border-2 border-black rounded-tr-sm'
                                            : 'bg-white border border-gray-200 text-black rounded-tl-sm'
                                            }`}>
                                            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{msg.content}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="px-3 py-3 bg-white border-t border-gray-200 flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-grow bg-gray-200 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-all"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isSending || !newMessage.trim()}
                        className="p-2.5 bg-white text-black border-2 border-black rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-40 flex-shrink-0"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}

"use client";

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { LogIn, AlertTriangle } from 'lucide-react';

interface RoomJoinProps {
    token: string;
    name: string;
    onJoinRoom: (roomId: string, roomCode: string, visualId: string) => void;
}

export default function RoomJoin({ token, name, onJoinRoom }: RoomJoinProps) {
    const [roomCode, setRoomCode] = useState('');
    const [isJoining, setIsJoining] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSecurityAlert, setIsSecurityAlert] = useState(false);

    const handleJoinRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanCode = roomCode.trim().toUpperCase();
        if (cleanCode.length !== 10) {
            setError("Room code must be 10 characters.");
            return;
        }

        setIsJoining(true);
        setError(null);
        setIsSecurityAlert(false);

        try {
            const supabase = createClient(token);

            // Using the RPC to bypass RLS for checking fullness and safely locking the room in one transaction
            const { data, error: rpcError } = await supabase.rpc('join_room', {
                p_room_code: cleanCode,
                p_token: token,
                p_name: name
            });

            if (rpcError) {
                if (rpcError.message.includes('ROOM_FULL:')) {
                    const roomId = rpcError.message.split(':')[1];
                    setIsSecurityAlert(true);

                    // Fire an ephemeral broadcast to turn their light red!
                    const channel = supabase.channel(`room_${roomId}`);
                    channel.subscribe((status) => {
                        if (status === 'SUBSCRIBED') {
                            channel.send({
                                type: 'broadcast',
                                event: 'intrusion',
                                payload: { attempt: new Date().toISOString() }
                            });
                            supabase.removeChannel(channel);
                        }
                    });

                    throw new Error("ACCESS DENIED: Room is full. Intrusion attempt logged.");
                } else {
                    throw rpcError;
                }
            }

            if (data && data.id) {
                onJoinRoom(data.id, data.room_code, data.visual_id);
            }

        } catch (err: any) {
            console.error("Join Error:", err);
            setError(err.message || "Failed to join room.");
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <div className="flex flex-col h-full z-10 relative">
            <h2 className="text-2xl font-bold text-black mb-2">Join a Room</h2>
            <p className="text-gray-800 mb-8 flex-grow">
                Enter a 10-character room code to establish an encrypted connection with the host.
            </p>

            <form onSubmit={handleJoinRoom} className="space-y-4">
                <div>
                    <input
                        type="text"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                        placeholder="ENTER 10-DIGIT CODE"
                        maxLength={10}
                        className={`w-full bg-gray-50 border ${isSecurityAlert ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-black'} rounded-xl px-4 py-4 text-center text-lg font-mono text-black focus:outline-none transition-all placeholder-gray-600 uppercase tracking-widest font-bold`}
                        required
                    />
                </div>

                {error && (
                    <div className={`p-3 rounded-xl text-sm border flex items-center gap-2 ${isSecurityAlert ? 'bg-red-50 border-red-200 text-red-600 font-bold' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
                        {isSecurityAlert && <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isJoining || roomCode.length < 10}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black border-2 border-black rounded-xl font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                    {isJoining ? 'Authenticating...' : (
                        <>
                            <LogIn className="w-5 h-5" />
                            Connect
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

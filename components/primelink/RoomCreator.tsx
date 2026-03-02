"use client";

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Key } from 'lucide-react';

interface RoomCreatorProps {
    token: string;
    name: string;
    onJoinRoom: (roomId: string, roomCode: string, visualId: string, inviteLink: string) => void;
}

const EMOJIS = ['🚀', '👽', '👾', '🤖', '👻', '💀', '🎃', '⚡', '🔥', '🌟', '💎', '🔮', '🎲', '🦊', '🐼', '🐉', '🌵', '🍁', '🌊', '🌙'];

export default function RoomCreator({ token, name, onJoinRoom }: RoomCreatorProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateRoomCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 10; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    const generateVisualId = () => {
        const e1 = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        let e2 = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        while (e1 === e2) {
            e2 = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        }
        return `${e1}${e2}`;
    };

    const handleCreateRoom = async () => {
        setIsCreating(true);
        setError(null);

        try {
            const supabase = createClient(token);
            const code = generateRoomCode();
            const visual = generateVisualId();

            const { data, error: dbError } = await supabase
                .from('rooms')
                .insert([{
                    room_code: code,
                    visual_id: visual,
                    participant_1_token: token,
                    participant_1_name: name
                }])
                .select()
                .single();

            if (dbError) throw dbError;
            if (data) {
                const link = `${window.location.origin}/tools/primelink?invite=${data.room_code}`;
                // Immediately enter room — invite link is shown inside ChatWindow
                onJoinRoom(data.id, data.room_code, data.visual_id, link);
            }
        } catch (err: any) {
            console.error("Failed to create room:", err);
            setError(err.message || "Could not create room. Try again.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="flex flex-col h-full z-10 relative">
            <h2 className="text-2xl font-bold text-black mb-2">Create a Room</h2>
            <p className="text-gray-800 mb-8 flex-grow">
                Generate a secure, private room with a unique 10-character code. The room immediately locks when a second person joins.
            </p>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200">
                    {error}
                </div>
            )}

            <button
                onClick={handleCreateRoom}
                disabled={isCreating}
                className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black border-2 border-black rounded-xl font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
                {isCreating ? 'Securing Space...' : (
                    <>
                        <Key className="w-5 h-5" />
                        Generate Secure Room
                    </>
                )}
            </button>
        </div>
    );
}

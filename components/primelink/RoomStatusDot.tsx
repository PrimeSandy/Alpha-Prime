"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

interface RoomStatusDotProps {
    roomId: string;
    roomCode: string;
    token: string;
}

type RoomStatus = 'checking' | 'online' | 'empty' | 'deleted';

export default function RoomStatusDot({ roomId, roomCode, token }: RoomStatusDotProps) {
    const [status, setStatus] = useState<RoomStatus>('checking');

    useEffect(() => {
        let isMounted = true;
        const supabase = createClient(token);

        // First check if room still exists
        const checkRoom = async () => {
            const { data } = await supabase
                .from('rooms')
                .select('id')
                .eq('room_code', roomCode)
                .single();

            if (!data) {
                if (isMounted) setStatus('deleted');
                return false;
            }
            return true;
        };

        checkRoom().then((exists) => {
            if (!exists || !isMounted) return;

            // Subscribe to presence channel to see if anyone is online
            const channel = supabase.channel(`room_presence_${roomId}`);

            channel
                .on('presence', { event: 'sync' }, () => {
                    if (!isMounted) return;
                    const state = channel.presenceState();
                    const count = Object.keys(state).length;
                    setStatus(count > 0 ? 'online' : 'empty');
                })
                .subscribe(async (status) => {
                    if (status === 'SUBSCRIBED') {
                        // Don't actually track our presence here (lobby-only check)
                        const state = channel.presenceState();
                        const count = Object.keys(state).length;
                        if (isMounted) setStatus(count > 0 ? 'online' : 'empty');
                    }
                });

            return () => {
                supabase.removeChannel(channel);
            };
        });

        return () => {
            isMounted = false;
        };
    }, [roomId, roomCode, token]);

    const config: Record<RoomStatus, { color: string; label: string; pulse: boolean }> = {
        checking: { color: 'bg-gray-300', label: 'Checking...', pulse: false },
        online: { color: 'bg-green-500', label: 'Someone is online', pulse: true },
        empty: { color: 'bg-gray-400', label: 'No one online', pulse: false },
        deleted: { color: 'bg-red-500', label: 'Room deleted', pulse: false },
    };

    const { color, label, pulse } = config[status];

    return (
        <span
            className="relative inline-flex flex-shrink-0"
            title={label}
        >
            {pulse && (
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-60`} />
            )}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color}`} />
        </span>
    );
}

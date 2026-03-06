"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { ShieldAlert, ShieldCheck, Clock } from 'lucide-react';

interface StatusIndicatorProps {
    roomId: string;
    token: string;
}

export default function StatusIndicator({ roomId, token }: StatusIndicatorProps) {
    const [presenceCount, setPresenceCount] = useState(1);
    const [isAlert, setIsAlert] = useState(false);

    useEffect(() => {
        const supabase = createClient(token);

        // Create a unique channel for this specific room's realtime tracking
        const channel = supabase.channel(`room_${roomId}`, {
            config: {
                presence: {
                    key: token,
                },
            },
        });

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                // Count unique user keys in presence state
                setPresenceCount(Object.keys(state).length);
            })
            // Listen for broadcast intrusion alerts instead of postgres_changes
            .on(
                'broadcast',
                { event: 'intrusion' },
                () => {
                    // Turn red! Intrusion attempt detected.
                    setIsAlert(true);
                    setTimeout(() => {
                        setIsAlert(false);
                    }, 5000);
                }
            )
            .subscribe(async (status: string) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({ online_at: new Date().toISOString() });
                }
            });

        const handleUnload = () => {
            channel.untrack();
            supabase.removeChannel(channel);
        };

        window.addEventListener('beforeunload', handleUnload);

        return () => {
            window.removeEventListener('beforeunload', handleUnload);
            channel.untrack();
            supabase.removeChannel(channel);
        };
    }, [roomId, token]);

    // Determine status color & text
    let statusConfig = {
        color: 'bg-amber-500',
        pulse: 'bg-amber-400',
        text: 'WAITING FOR PARTNER',
        icon: <Clock className="w-4 h-4" />
    };

    if (isAlert) {
        statusConfig = {
            color: 'bg-red-500',
            pulse: 'bg-red-400',
            text: 'INTRUSION BLOCKED',
            icon: <ShieldAlert className="w-4 h-4" />
        };
    } else if (presenceCount >= 2) {
        statusConfig = {
            color: 'bg-green-500',
            pulse: 'bg-green-400',
            text: 'CHAT SECURE & ACTIVE',
            icon: <ShieldCheck className="w-4 h-4" />
        };
    }

    return (
        <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-200 rounded-full border border-gray-200">
            <div className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusConfig.pulse}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${statusConfig.color}`}></span>
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-bold tracking-wider ${isAlert ? 'text-red-600' : 'text-gray-700'
                }`}>
                {statusConfig.icon}
                {statusConfig.text}
            </div>
        </div>
    );
}

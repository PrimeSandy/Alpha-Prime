"use client";

import React, { useState, useEffect } from 'react';
import { Megaphone, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export interface Announcement {
    id: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'none';
    link?: string;
    linkText?: string;
    active: boolean;
}

const AdminBanner = () => {
    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // In a real pro-max setup, this would fetch from Firebase/Supabase
        // For now, we fetch from our internal data file or API
        const fetchAnnouncement = async () => {
            try {
                // We'll create this API route next
                const res = await fetch('/api/announcement');
                if (res.ok) {
                    const data = await res.json();
                    if (data.active) {
                        setAnnouncement(data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch announcement:", error);
            }
        };

        fetchAnnouncement();
    }, []);

    if (!isVisible || !announcement || !announcement.active) return null;

    const bgColors = {
        info: 'bg-black text-white',
        warning: 'bg-yellow-400 text-black',
        success: 'bg-green-600 text-white',
        none: 'bg-gray-100 text-black border-b border-gray-200'
    };

    return (
        <div className={`relative w-full ${bgColors[announcement.type || 'info']} py-3 px-4 transition-all duration-300 z-[49]`}>
            <div className="container mx-auto max-w-7xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-grow justify-center">
                    <Megaphone className="w-5 h-5 flex-shrink-0 animate-pulse" />
                    <p className="text-sm sm:text-base font-bold tracking-tight">
                        {announcement.message}
                        {announcement.link && (
                            <Link
                                href={announcement.link}
                                className="ml-3 inline-flex items-center gap-1 underline underline-offset-4 hover:opacity-80 transition-opacity"
                            >
                                {announcement.linkText || 'Learn More'}
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        )}
                    </p>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
                    aria-label="Close announcement"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default AdminBanner;

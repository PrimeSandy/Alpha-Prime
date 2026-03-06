"use client";

import React, { useState, useEffect } from 'react';
import { Megaphone, Save, Trash2, Send } from 'lucide-react';

const AdminAnnouncementPage = () => {
    const [announcement, setAnnouncement] = useState({
        id: '1',
        message: '',
        type: 'info' as 'info' | 'warning' | 'success' | 'none',
        link: '',
        linkText: '',
        active: true
    });
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchCurrent = async () => {
            try {
                const res = await fetch('/api/announcement');
                if (res.ok) {
                    const data = await res.json();
                    setAnnouncement(data);
                }
            } catch (error) {
                console.error("Failed to fetch admin data:", error);
            }
        };
        fetchCurrent();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Sending...');
        try {
            const res = await fetch('/api/announcement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(announcement)
            });
            if (res.ok) {
                setStatus('Announcement updated and live!');
                setTimeout(() => setStatus(''), 3000);
            } else {
                setStatus('Error updating banner.');
            }
        } catch (error) {
            setStatus('Network error.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-32 max-w-2xl bg-white shadow-xl rounded-3xl mt-20 border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-black text-white rounded-2xl">
                    <Megaphone className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-black">Admin Notification Center</h1>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Banner Message</label>
                    <textarea
                        value={announcement.message}
                        onChange={(e) => setAnnouncement({ ...announcement, message: e.target.value })}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:outline-none text-black leading-relaxed"
                        placeholder="Type your announcement here..."
                        rows={3}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Banner Color</label>
                        <select
                            value={announcement.type}
                            onChange={(e) => setAnnouncement({ ...announcement, type: e.target.value as any })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none text-black appearance-none"
                        >
                            <option value="info">Black (Info)</option>
                            <option value="warning">Yellow (Warning)</option>
                            <option value="success">Green (Success)</option>
                            <option value="none">Light Gray (Minimal)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Status</label>
                        <div className="flex items-center gap-2 mt-2">
                            <input
                                type="checkbox"
                                checked={announcement.active}
                                onChange={(e) => setAnnouncement({ ...announcement, active: e.target.checked })}
                                className="w-5 h-5 accent-black cursor-pointer"
                            />
                            <span className="text-black font-semibold">{announcement.active ? 'Active' : 'Hidden'}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Target URL (Optional)</label>
                        <input
                            type="text"
                            value={announcement.link}
                            onChange={(e) => setAnnouncement({ ...announcement, link: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none text-black"
                            placeholder="https://..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Button Text</label>
                        <input
                            type="text"
                            value={announcement.linkText}
                            onChange={(e) => setAnnouncement({ ...announcement, linkText: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none text-black"
                            placeholder="Learn More"
                        />
                    </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                    >
                        <Send className="w-5 h-5" />
                        Update Global Banner
                    </button>
                    {status && <span className="text-sm font-bold animate-fade-in text-gray-600">{status}</span>}
                </div>
            </form>

            <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <h3 className="text-black font-bold uppercase text-xs tracking-widest mb-4">Live Preview</h3>
                <div className={`p-4 rounded-xl flex items-center gap-3 ${announcement.type === 'info' ? 'bg-black text-white' :
                        announcement.type === 'warning' ? 'bg-yellow-400 text-black' :
                            announcement.type === 'success' ? 'bg-green-600 text-white' :
                                'bg-gray-100 text-black border border-gray-200'
                    }`}>
                    <Megaphone className="w-5 h-5" />
                    <p className="font-bold text-sm">
                        {announcement.message || "Your message will appear here..."}
                        {announcement.link && <span className="underline ml-2">{announcement.linkText || 'Learn More'}</span>}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminAnnouncementPage;

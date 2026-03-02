"use client";

import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setSubmitted(true);
    };

    return (
        <section className="py-16 sm:py-20 px-4 border-t border-gray-200 bg-white">
            <div className="container mx-auto max-w-xl text-center">
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Newsletter</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-black mb-3">Stay Updated</h2>
                <p className="text-gray-500 mb-8 text-base">
                    Get notified when new tools launch. No spam, ever.
                </p>

                {submitted ? (
                    <div className="flex flex-col items-center gap-3 py-6">
                        <div className="text-4xl">🎉</div>
                        <p className="text-black font-semibold text-lg">You&apos;re on the list!</p>
                        <p className="text-gray-500 text-sm">We&apos;ll notify you when something exciting launches.</p>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col sm:flex-row gap-3 justify-center"
                    >
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black text-black placeholder-gray-400 transition-all text-sm"
                        />
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 bg-black text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-gray-800 hover:scale-[1.02] transition-all duration-200 active:scale-100 flex-shrink-0"
                        >
                            <Send className="w-4 h-4" />
                            Subscribe
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}

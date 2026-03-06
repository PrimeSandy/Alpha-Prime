import React from 'react';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
    {
        name: 'Riya Sharma',
        role: 'CS Student',
        avatar: 'RS',
        avatarBg: 'bg-blue-100 text-blue-700',
        quote: 'The Online Compiler saved me during my assignments! No setup needed — I just open the page and start coding. Honestly better than most paid IDE subscriptions.',
        tool: 'Online Compiler',
    },
    {
        name: 'Aditya Mehta',
        role: 'Backend Developer',
        avatar: 'AM',
        avatarBg: 'bg-green-100 text-green-700',
        quote: 'Link Vault is a genius tool. I hide my staging environment credentials inside an innocent-looking link. My team loves it and it keeps things tidy.',
        tool: 'Link Vault',
    },
    {
        name: 'Priya Nair',
        role: 'UI/UX Designer',
        avatar: 'PN',
        avatarBg: 'bg-purple-100 text-purple-700',
        quote: 'Color Tools is now part of my daily workflow. The gradient builder and HEX/RGB picker work flawlessly. Exactly what I was searching for — no ads, no sign-up.',
        tool: 'Color Tools',
    },
];

function Stars() {
    return (
        <div className="flex gap-0.5 mb-3" aria-label="5 out of 5 stars">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
        </div>
    );
}

export default function Testimonials() {
    return (
        <section className="py-16 sm:py-24 px-4 bg-gray-50 border-t border-gray-200">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-12">
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Testimonials</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-black mb-3">What People Say</h2>
                    <p className="text-gray-500 max-w-md mx-auto">Real feedback from real users who use AlphaPrime every day.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t) => (
                        <div key={t.name} className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col hover:border-black hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                            <Stars />
                            <blockquote className="text-gray-700 text-sm leading-relaxed mb-5 flex-grow">
                                &ldquo;{t.quote}&rdquo;
                            </blockquote>
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${t.avatarBg}`}>
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-black">{t.name}</p>
                                    <p className="text-xs text-gray-400">{t.role} · {t.tool}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

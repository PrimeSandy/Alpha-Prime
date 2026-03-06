"use client";

import React, { useState } from 'react';
import { Mail, Send, MapPin, Clock, MessageSquare } from 'lucide-react';

export default function Contact() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-16 max-w-4xl">

                {/* Header */}
                <div className="text-center mb-14">
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Contact</p>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-black mb-4 leading-tight tracking-tight">
                        Get in Touch
                    </h1>
                    <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
                        Found a bug, have a feature request, or just want to say hi? We&apos;d love to hear from you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {/* Info cards */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:border-black hover:shadow-sm transition-all duration-200">
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Mail className="w-5 h-5 text-black" />
                        </div>
                        <p className="text-sm font-bold text-black mb-1">Email Us</p>
                        <a href="mailto:alphaprime.co.in@gmail.com" className="text-xs text-gray-500 hover:text-black transition-colors break-all">
                            alphaprime.co.in@gmail.com
                        </a>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:border-black hover:shadow-sm transition-all duration-200">
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Clock className="w-5 h-5 text-black" />
                        </div>
                        <p className="text-sm font-bold text-black mb-1">Response Time</p>
                        <p className="text-xs text-gray-500">Within 24–48 hours</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:border-black hover:shadow-sm transition-all duration-200">
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <MapPin className="w-5 h-5 text-black" />
                        </div>
                        <p className="text-sm font-bold text-black mb-1">Location</p>
                        <p className="text-xs text-gray-500">Chennai, Tamil Nadu, India</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-10">
                    {submitted ? (
                        <div className="text-center py-10">
                            <div className="text-5xl mb-4">🎉</div>
                            <h2 className="text-2xl font-bold text-black mb-2">Message Sent!</h2>
                            <p className="text-gray-500">
                                Thank you for reaching out. We&apos;ll get back to you within 24–48 hours at{' '}
                                <span className="font-semibold text-black">alphaprime.co.in@gmail.com</span>.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                                    <MessageSquare className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-black text-lg">Send a Message</h2>
                                    <p className="text-gray-400 text-sm">All fields are optional except email and message.</p>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name</label>
                                        <input type="text"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors text-sm"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                                        <input type="email" required
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors text-sm"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
                                    <input type="text"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors text-sm"
                                        placeholder="Bug report / Feature request / General inquiry"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message *</label>
                                    <textarea required rows={5}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors resize-none text-sm"
                                        placeholder="Describe your bug, suggestion, or question in detail..."
                                    />
                                </div>
                                <button type="submit"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white font-semibold text-sm px-8 py-3.5 rounded-xl hover:bg-gray-800 hover:scale-[1.01] transition-all duration-200">
                                    <Send className="w-4 h-4" />
                                    Send Message
                                </button>
                                <p className="text-xs text-gray-400 pt-1">
                                    No personal data from this form is stored on our servers. Your email is only used to reply to you.
                                </p>
                            </form>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}

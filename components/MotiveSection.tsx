"use client";

import React from 'react';
import { ShieldCheck, ServerOff, Database, Zap, WifiOff } from 'lucide-react';

const MotiveSection = () => {
    return (
        <section className="py-16 px-4 bg-gray-50 border-t border-gray-200">
            <div className="container mx-auto max-w-4xl">
                <div className="space-y-16">

                    {/* Section A: Architecture */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
                            <ShieldCheck className="w-4 h-4" />
                            Security First
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-black">The AlphaPrime Architecture</h2>
                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            AlphaPrime is a suite of web utilities focused on data privacy. Unlike traditional web tools that process data on a remote server, we utilize <strong className="text-black">Client-Side Processing</strong>.
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            By running 90% of our operations serverless, we ensure that your input data—whether it&apos;s text, code, or images—<strong>never leaves your browser</strong>. This architecture eliminates the risk of data breaches and server-side logging.
                        </p>
                    </div>

                    {/* Section B: Core Features */}
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-black">Key Technical Features</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="p-6 bg-white rounded-2xl border border-gray-200">
                                <ServerOff className="w-8 h-8 text-indigo-500 mb-4" />
                                <h3 className="text-xl font-bold mb-2 text-black">Local Execution</h3>
                                <p className="text-gray-800">Tools like the Word Counter and Base64 Converter run entirely via JavaScript in your browser.</p>
                            </div>
                            <div className="p-6 bg-white rounded-2xl border border-gray-200">
                                <Database className="w-8 h-8 text-emerald-500 mb-4" />
                                <h3 className="text-xl font-bold mb-2 text-black">Open Source Foundations</h3>
                                <p className="text-gray-800">Our tools are built using transparent, community-vetted logic to ensure reliability.</p>
                            </div>
                            <div className="p-6 bg-white rounded-2xl border border-gray-200">
                                <Zap className="w-8 h-8 text-amber-500 mb-4" />
                                <h3 className="text-xl font-bold mb-2 text-black">Minimal Latency</h3>
                                <p className="text-gray-800">Without the need for API calls or server round-trips, computations are near-instantaneous.</p>
                            </div>
                            <div className="p-6 bg-white rounded-2xl border border-gray-200">
                                <WifiOff className="w-8 h-8 text-rose-500 mb-4" />
                                <h3 className="text-xl font-bold mb-2 text-black">Offline Capability</h3>
                                <p className="text-gray-800">Since the logic is stored in the browser, many features continue to function even without a stable internet connection.</p>
                            </div>
                        </div>
                    </div>

                    {/* Section C: Technical Implementation */}
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-black">How it Works</h2>
                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            We leverage modern web APIs, including <strong>Web Workers</strong> for background processing and <strong>Local Storage</strong> for state management. This &quot;Serverless&quot; approach shifts the computational load from our infrastructure to your device.
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            This not only protects your privacy but also makes the tools lightweight and fast, even on low-bandwidth networks.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default MotiveSection;

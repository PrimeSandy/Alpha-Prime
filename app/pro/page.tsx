"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Rocket, ShieldCheck, Zap, Server, Database, Crown } from "lucide-react";
import Link from "next/link";

export default function ProFeatures() {
    return (
        <>
            <Navbar />
            <main className="flex-grow container mx-auto px-4 pt-32 pb-16 max-w-5xl">

                {/* Hero */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6">
                        <Crown className="w-4 h-4" />
                        AlphaPrime Pro
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
                        Unlock the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Full Potential</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
                        Take your productivity to the next level with cloud sync, advanced analytics, and priority support.
                        Coming soon to AlphaPrime.
                    </p>
                    <button disabled className="px-8 py-4 rounded-full bg-white/5 text-white/50 font-bold border border-white/10 cursor-not-allowed">
                        Join Waitlist (Coming Soon)
                    </button>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                    {/* Feature 1 */}
                    <div className="bg-card border border-border p-8 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Database className="w-24 h-24" />
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-6">
                            <Database className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Cloud Sync</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Sync your settings and data across all your devices securely with Firebase Cloud.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-card border border-border p-8 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <ShieldCheck className="w-24 h-24" />
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Advanced Security</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Multi-factor authentication and encrypted backups for your critical data.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-card border border-border p-8 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Zap className="w-24 h-24" />
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Priority Performance</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Access to dedicated high-performance server runners for the Online Compiler.
                        </p>
                    </div>
                </div>

            </main>
            <Footer />
        </>
    );
}

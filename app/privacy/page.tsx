import React from 'react';
import Link from 'next/link';
import { Shield, Database, Cookie, UserCog, Lock, Link as LinkIcon, Mail } from 'lucide-react';

export const metadata = {
    title: 'Privacy Policy - AlphaPrime',
    description: 'Privacy Policy for AlphaPrime tools and services.',
};

export default function Privacy() {
    return (
        <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-zinc-100 border border-zinc-200 mb-8 shadow-sm">
                    <Shield className="w-10 h-10 text-black" />
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight font-display text-black">
                    <span>Privacy Policy</span>
                </h1>
                <p className="text-lg text-gray-800 leading-relaxed max-w-2xl mx-auto">
                    Your trust is our top priority. We are committed to transparency and ensuring your data remains yours.
                </p>
                <div className="mt-8 text-sm text-gray-800 font-medium">
                    Last Updated: <span className="text-black font-bold">February 25, 2026</span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-zinc-200 shadow-sm">
                <div className="prose prose-zinc max-w-none">

                    {/* Section 1 */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <Database className="text-black w-8 h-8" />
                            <h2 className="text-2xl font-bold text-black m-0">1. Information Collection & Usage</h2>
                        </div>
                        <p className="text-gray-800 mb-4">
                            We are committed to data minimization. We only collect what is strictly necessary.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-800 mb-4">
                            <li><strong>Local Processing:</strong> Most tools (Word Counter, Password Generator, Image Resizer, Base64, Case Converter, Compiler, Color Tools, Diff Checker) run entirely in your browser. No input data is sent to our servers.</li>

                            <li><strong>PrimeLink Chat:</strong> PrimeLink utilizes Supabase for real-time WebSocket connections. We enforce a strict <strong>no message logging</strong> policy; messages are transient and not permanently stored in any database.</li>
                            <li><strong>Platform & Hosting:</strong> Our platform is hosted on Vercel globally, and your data may be processed on secure servers located outside your country of residence.</li>
                        </ul>
                    </div>

                    {/* Section 2 */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <Cookie className="text-black w-8 h-8" />
                            <h2 className="text-2xl font-bold text-black m-0">2. Cookies & Google AdSense</h2>
                        </div>
                        <p className="text-gray-800 mb-4">
                            We use cookies to enhance your experience and support our free services through advertising.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-800 mb-4">
                            <li><strong>Essential Cookies:</strong> Required for site functionality.</li>
                            <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site.</li>
                            <li><strong>Advertising Cookies:</strong> Used by Google and its partners to serve ads.</li>
                        </ul>
                    </div>

                    {/* Section 3 */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <UserCog className="text-black w-8 h-8" />
                            <h2 className="text-2xl font-bold text-black m-0">3. Your Privacy Rights</h2>
                        </div>
                        <p className="text-gray-800 mb-4">
                            Under the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and applicable Indian laws, you hold the following rights over your personal data:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-800 mb-4">
                            <li><strong>Right to Access & Portability:</strong> Request a copy of the data we hold about you in a standard format.</li>
                            <li><strong>Right to Deletion:</strong> Request the permanent deletion of your account and associated data.</li>
                            <li><strong>Right to Opt-Out (&quot;Do Not Sell&quot;):</strong> We do not sell your personal data. However, you may opt out of targeted Google AdSense cookies via your browser or Google Ad Settings.</li>
                        </ul>
                    </div>

                    {/* Section 4: Data Retention */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <Database className="text-black w-8 h-8" />
                            <h2 className="text-2xl font-bold text-black m-0">4. Data Retention</h2>
                        </div>
                        <ul className="list-disc pl-6 space-y-2 text-gray-800 mb-4">

                            <li><strong>PrimeLink Chat:</strong> Ephemeral. Messages exist only in memory during the real-time session via Supabase and are not written to persistent storage logs.</li>
                        </ul>
                    </div>

                    {/* Section 4 */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <Lock className="text-black w-8 h-8" />
                            <h2 className="text-2xl font-bold text-black m-0">4. Data Security</h2>
                        </div>
                        <p className="text-gray-800 mb-4">
                            We use industry-standard encryption (SSL/TLS) for all data in transit. However, no method of transmission over the internet is 100% secure.
                        </p>
                    </div>

                    {/* Section 6 */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <LinkIcon className="text-gray-700 w-8 h-8" />
                            <h2 className="text-2xl font-bold text-black m-0">6. Third-Party Links & PWA</h2>
                        </div>
                        <p className="text-gray-800 mb-4">
                            Our site contains links to other websites. We are not responsible for the privacy practices of these sites. This policy also applies identically when using AlphaPrime via our Progressive Web App (PWA) or the Android TWA app.
                        </p>
                    </div>

                    {/* Section 7 */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="text-black w-8 h-8" />
                            <h2 className="text-2xl font-bold text-black m-0">7. Children&#39;s Privacy</h2>
                        </div>
                        <p className="text-gray-800 mb-4">
                            AlphaPrime is not directed to children under 13. We do not knowingly collect personal information from children under 13 in compliance with COPPA. If we become aware that we have collected such data, we will delete it immediately.
                        </p>
                    </div>

                    <div className="border-t border-zinc-200 pt-8 mt-12 text-center">
                        <p className="text-gray-800 mb-4">Have questions about your privacy?</p>
                        <Link href="/contact" className="inline-flex items-center gap-2 text-black hover:text-gray-800 font-bold transition-colors">
                            <Mail className="w-5 h-5" />
                            Contact Privacy Team
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}

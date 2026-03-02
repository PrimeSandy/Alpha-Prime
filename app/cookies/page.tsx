import React from 'react';
import Link from 'next/link';
import { Cookie, Info, Settings, ShieldCheck, Mail } from 'lucide-react';

export const metadata = {
    title: 'Cookie Policy - AlphaPrime',
    description: 'Detailed information on how AlphaPrime uses cookies, including Google AdSense and functional storage.',
};

const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
    <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
            <span className="text-black w-8 h-8 flex-shrink-0">{icon}</span>
            <h2 className="text-2xl font-bold text-black m-0">{title}</h2>
        </div>
        <div className="text-gray-800 space-y-3">{children}</div>
    </div>
);

export default function CookiePolicy() {
    return (
        <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-zinc-100 border border-zinc-200 mb-8 shadow-sm">
                    <Cookie className="w-10 h-10 text-black" />
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-black">
                    Cookie Policy
                </h1>
                <p className="text-lg text-gray-800 leading-relaxed max-w-2xl mx-auto">
                    This policy explains how AlphaPrime uses cookies and similar technologies to recognize you when you visit our website.
                </p>
                <div className="mt-8 text-sm text-gray-800 font-medium">
                    Effective Date: <span className="text-black font-bold">February 25, 2026</span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-zinc-200 shadow-sm">
                <div className="prose prose-zinc max-w-none">

                    <Section icon={<Info className="w-8 h-8" />} title="1. What are cookies?">
                        <p>
                            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Website owners widely use cookies to make their websites work, or to work more efficiently, as well as to provide reporting information.
                        </p>
                    </Section>

                    <Section icon={<Settings className="w-8 h-8" />} title="2. Why do we use cookies?">
                        <p>We use first-party and third-party cookies for several reasons:</p>
                        <ul className="list-disc pl-6 space-y-2 text-sm">
                            <li><strong className="text-black">Essential/Technical Cookies:</strong> These are strictly necessary to provide you with services available through our website. For example, maintaining your PrimeLink session or authenticating your PrimeLink login via Firebase.</li>
                            <li><strong className="text-black">Performance & Analytics:</strong> These cookies collect information used in aggregate form to help us understand how our website is being used.</li>
                            <li><strong className="text-black">Advertising (Google AdSense):</strong> We use third-party advertising companies, specifically Google, to serve ads. Google uses cookies to serve ads based on your prior visits to our website or other websites.</li>
                        </ul>
                    </Section>

                    <Section icon={<ShieldCheck className="w-8 h-8" />} title="3. Google AdSense & Third-Party Cookies">
                        <p>
                            Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your visit to AlphaPrime and/or other sites on the Internet.
                        </p>
                        <p className="mt-2 text-sm">
                            You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-black underline">Google Ads Settings</a>.
                        </p>
                    </Section>

                    <Section icon={<Settings className="w-8 h-8" />} title="4. Local Storage vs Cookies">
                        <p>
                            Many of our tools utilize <strong className="text-black">Local Storage (IndexedDB/WebStorage)</strong> rather than traditional cookies. This data remains strictly on your device and is not transmitted to our servers for analytics or advertising. Clearing your browser&apos;s cache and site data will permanently delete this locally stored tool data.
                        </p>
                    </Section>

                    <Section icon={<Cookie className="w-8 h-8" />} title="5. How can you control cookies?">
                        <p>
                            You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website (like PrimeLink login) may be restricted.
                        </p>
                    </Section>

                    <div className="border-t border-zinc-200 pt-8 mt-12 text-center">
                        <p className="text-gray-800 mb-2">Questions about our Cookie Policy?</p>
                        <Link href="/contact" className="inline-flex items-center gap-2 text-black hover:text-gray-800 font-bold transition-colors">
                            <Mail className="w-5 h-5" />
                            Contact Support
                        </Link>
                        <p className="text-xs text-gray-700 mt-6">
                            AlphaPrime · <Link href="/privacy" className="underline hover:text-black">Privacy Policy</Link> · <Link href="/terms" className="underline hover:text-black">Terms</Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

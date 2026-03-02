import React from 'react';
import Link from 'next/link';
import { Gavel, ShieldCheck, AlertTriangle, UserX, Copyright, Scale, Mail, Lock, Clock } from 'lucide-react';

export const metadata = {
    title: 'Terms of Service - AlphaPrime',
    description: 'Terms of Service for AlphaPrime free online tools including Word Counter, Password Generator, Image Resizer, PrimeLink Private Chat, and more.',
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

export default function Terms() {
    return (
        <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-zinc-100 border border-zinc-200 mb-8 shadow-sm">
                    <Gavel className="w-10 h-10 text-black" />
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-black">
                    Terms of Service
                </h1>
                <p className="text-lg text-gray-800 leading-relaxed max-w-2xl mx-auto">
                    Please read these terms carefully before using AlphaPrime tools and services. These terms govern all tools available on this platform.
                </p>
                <div className="mt-8 text-sm text-gray-800 font-medium">
                    Effective Date: <span className="text-black font-bold">February 16, 2026</span>
                    &nbsp;·&nbsp; Last Updated: <span className="text-black font-bold">February 25, 2026</span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-zinc-200 shadow-sm">
                <div className="prose prose-zinc max-w-none">

                    <Section icon={<ShieldCheck className="w-8 h-8" />} title="1. Acceptance of Terms">
                        <p>
                            By accessing or using any tool on AlphaPrime (&quot;Service&quot;) via the website, Progressive Web App (PWA), or Android TWA app, you agree to be bound by these Terms of Service. If you do not agree, you may not use the Service. These terms apply to all tools including Word Counter, Password Generator, Image Resizer, Base64 Encoder/Decoder, Case Converter, Online Compiler, Color Tools, Diff Checker, and PrimeLink Private Chat.
                        </p>
                    </Section>

                    <Section icon={<AlertTriangle className="w-8 h-8" />} title="2. Tool Usage & Accuracy Disclaimer">
                        <p>
                            All tools on AlphaPrime are provided for assistance, productivity, and informational purposes only. While we strive for accuracy, <strong className="text-black">AlphaPrime does NOT guarantee 100% correctness</strong> of any tool output.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-sm">
                            <li><strong className="text-black">Word Counter / Case Converter / Diff Checker:</strong> Results are based on standard text parsing algorithms. Always verify outputs for critical content.</li>
                            <li><strong className="text-black">Password Generator:</strong> Passwords are generated client-side and are never transmitted to any server. You are responsible for storing passwords securely.</li>
                            <li><strong className="text-black">Image Resizer:</strong> Image processing is performed locally in your browser. We do not upload, store, or transmit your images.</li>
                            <li><strong className="text-black">Base64 Encoder/Decoder:</strong> All encoding and decoding operations are performed entirely in the browser with no data transmission.</li>
                            <li><strong className="text-black">Online Compiler:</strong> Code execution may be subject to time and resource limits. Do not use for production or safety-critical systems.</li>
                            <li><strong className="text-black">Expense Tracker:</strong> Financial data is stored locally in your browser. We are not responsible for data loss due to clearing browser storage.</li>
                            <li><strong className="text-black">Color Tools:</strong> Color conversions and palette outputs are provided for design reference only.</li>
                        </ul>
                    </Section>

                    {/* PrimeLink Specific */}
                    <div className="mb-12 bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Lock className="w-7 h-7 text-black flex-shrink-0" />
                            <h2 className="text-xl font-bold text-black m-0">3. PrimeLink Private Chat — Special Terms</h2>
                        </div>
                        <div className="text-gray-800 space-y-3 text-sm">
                            <p>PrimeLink is a browser-based secure 2-participant private chat tool utilizing Supabase WebSockets. By using PrimeLink, you further agree to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong className="text-black">No Account System & No Logging:</strong> PrimeLink uses anonymous browser tokens. Your identity is local to your device. We enforce a strict no message-logging policy—messages are totally ephemeral.</li>
                                <li><strong className="text-black">Room Ownership:</strong> Rooms are tied to the device that created them via a locally stored secure token. We cannot recover access to a destroyed or expired room.</li>
                                <li><strong className="text-black">Data Retention:</strong> Only the encrypted room configuration (not messages) is stored on our servers for up to 30 days of inactivity, after which the room is permanently purged.</li>
                                <li><strong className="text-black">Intrusion Detection:</strong> Unauthorized access attempts to full rooms are logged for security purposes only and are not used for any other purpose.</li>
                                <li><strong className="text-black">Room Destruction:</strong> Either participant may destroy a room permanently. This action is irreversible and purges all associated configuration data.</li>
                                <li><strong className="text-black">Invite Links:</strong> One-time invite links expire once both participants have connected. Do not share invite links publicly.</li>
                                <li><strong className="text-black">Prohibited Use:</strong> You must not use PrimeLink to transmit illegal content, engage in harassment, or conduct any activity that violates applicable laws.</li>
                            </ul>
                        </div>
                    </div>

                    <Section icon={<UserX className="w-8 h-8" />} title="4. User Responsibilities">
                        <p>You agree NOT to use the Service for:</p>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>Any illegal purpose or in violation of any applicable laws</li>
                            <li>Attempting to disrupt, damage, or gain unauthorized access to servers or networks</li>
                            <li>Uploading malicious code, scripts, or content</li>
                            <li>Automated scraping, bulk data extraction, or bot usage</li>
                            <li>Impersonating others or transmitting harmful content via PrimeLink</li>
                        </ul>
                    </Section>

                    <Section icon={<Copyright className="w-8 h-8" />} title="5. Intellectual Property">
                        <p>
                            All tool interfaces, code, branding, and design on AlphaPrime are the intellectual property of AlphaPrime. You retain full ownership of any content you process through our tools. We do not claim rights to data you input into any tool.
                        </p>
                    </Section>

                    <Section icon={<Scale className="w-8 h-8" />} title="6. Limitation of Liability">
                        <p>
                            AlphaPrime is provided &quot;AS IS&quot; without warranty of any kind. We are not liable for any direct, indirect, incidental, or consequential damages resulting from your use of the Service, including but not limited to data loss, password loss, or loss of access to PrimeLink rooms.
                        </p>
                    </Section>

                    <Section icon={<Clock className="w-8 h-8" />} title="7. Service Availability & Changes">
                        <p>
                            We reserve the right to modify, suspend, or discontinue any tool or the Service at any time without prior notice. We may also update these Terms at any time. Continued use after changes constitutes acceptance of the revised Terms.
                        </p>
                    </Section>

                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <Gavel className="text-black w-8 h-8" />
                            <h2 className="text-2xl font-bold text-black m-0">8. Governing Law & Jurisdiction</h2>
                        </div>
                        <p className="text-gray-800 mb-4">
                            These Terms of Service are governed by and construed in accordance with the laws of India, explicitly conforming to the <strong>Information Technology Act, 2000 (IT Act)</strong>, and its subsequent amendments. Any disputes arising from or relating to the use of AlphaPrime shall be subject to the exclusive jurisdiction of the courts located in India.
                        </p>
                    </div>

                    <div className="border-t border-zinc-200 pt-8 mt-12 text-center">
                        <p className="text-gray-800 mb-2">Questions about these Terms?</p>
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

import React from 'react';

export const metadata = {
    title: 'About AlphaPrime – Privacy-First Free Web Tools',
    description: 'Learn the story, mission, and privacy commitment behind AlphaPrime — the platform of 11 free browser-based tools built for developers, creators, and everyday users.',
    openGraph: {
        title: 'About AlphaPrime – Privacy-First Free Web Tools',
        description: 'The story, mission, and privacy commitment behind AlphaPrime.',
        url: 'https://alphaprime.co.in/about',
    },
    alternates: { canonical: 'https://alphaprime.co.in/about' },
};

export default function About() {
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-16 max-w-4xl">

                {/* Hero */}
                <div className="text-center mb-16">
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">About</p>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-black mb-5 leading-tight tracking-tight">
                        Empowering Your Workflow,<br />One Tool at a Time
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        AlphaPrime is a growing collection of free, privacy-first web tools designed to help developers, students, designers,
                        and everyday internet users get things done—faster, smarter, and without compromising their personal data.
                    </p>
                </div>

                {/* What is AlphaPrime */}
                <section className="mb-12 p-8 bg-white border border-gray-200 rounded-2xl">
                    <h2 className="text-2xl font-bold text-black mb-4">What is AlphaPrime?</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        AlphaPrime is a free, browser-based platform featuring 11 powerful online tools — including an Online Compiler,
                        Password Generator, Image Resizer, Word Counter, Diff Checker, Base64 Converter, Case Converter, Color Tools,
                        PrimeLink Chat and Link Vault.
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        Every tool on AlphaPrime is built with one core principle: your data stays on your device. Unlike most websites
                        that process your inputs on remote servers, our tools execute logic entirely within your browser using modern
                        JavaScript APIs. That means faster performance, zero upload delays, and absolute privacy by design.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        Whether you are a computer science student running Python code from a school Chromebook, a content creator
                        counting words for an SEO blog post, or a developer generating a strong password — AlphaPrime has you covered.
                        No account required. No credit cards. No subscriptions. Just tools that work.
                    </p>
                </section>

                {/* Vision + Mission */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="p-8 bg-white border border-gray-200 rounded-2xl">
                        <div className="text-3xl mb-4">🎯</div>
                        <h2 className="text-xl font-bold text-black mb-3">Our Vision</h2>
                        <p className="text-gray-600 leading-relaxed">
                            To become the world&apos;s most trusted hub of free, privacy-respecting web utilities. A place where you never
                            need to bookmark fifty different sites — everything you need is here, clean, fast, and free from intrusive
                            data collection.
                        </p>
                    </div>
                    <div className="p-8 bg-white border border-gray-200 rounded-2xl">
                        <div className="text-3xl mb-4">🛠️</div>
                        <h2 className="text-xl font-bold text-black mb-3">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed">
                            To eliminate the friction from your daily digital tasks. We provide free, high-performance tools that just
                            work — no logins for basic tasks, no intrusive ads degrading your experience, and no compromise on your
                            data privacy at any stage.
                        </p>
                    </div>
                </div>

                {/* Why We Built This */}
                <section className="mb-12 p-8 bg-gray-50 border border-gray-200 rounded-2xl">
                    <h2 className="text-2xl font-bold text-black mb-4">Why We Built AlphaPrime</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        The idea for AlphaPrime was born out of pure frustration. As a developer and heavy internet user, we found
                        ourselves bouncing between dozens of websites just to complete everyday developer tasks — one site for Base64
                        conversion, another for password generation, a different one for image resizing. Each visit meant navigating past
                        aggressive ads, accepting cookie banners, and uploading private files to unknown servers.
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        The existing tools were also slow. Most competitor sites rely on heavy server-side processing, meaning every
                        action — even converting a simple text string — required a round-trip to a remote server. This was unnecessary,
                        privacy-invasive, and slow.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        AlphaPrime was the answer: a single, fast, clean platform where every tool runs locally in your browser. Built by a
                        solo developer with a passion for performance and privacy, AlphaPrime launched in November 2025 and has
                        continuously grown its toolkit ever since, adding new tools based on community suggestions every few weeks.
                    </p>
                </section>

                {/* Privacy Commitment */}
                <section className="mb-12 p-8 bg-white border border-gray-200 rounded-2xl">
                    <h2 className="text-2xl font-bold text-black mb-4">🛡️ Our Privacy Commitment</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        Privacy is not an afterthought at AlphaPrime — it is our core architecture. Here is exactly how we protect your
                        data:
                    </p>
                    <ul className="list-none space-y-3">
                        {[
                            'We do NOT collect your tool inputs. Text, passwords, images, and code you enter into our tools never leave your device.',
                            'We do NOT run ads that track your cross-site browsing history. We use Google AdSense to keep the platform free, but we respect your opt-out preferences.',
                            'We do NOT sell, rent, or share your personal data with any third party for marketing purposes — ever.',
                            'We do NOT require an account or email to use any of our core tools. Zero sign-up friction.',
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                                <span className="text-green-500 font-bold flex-shrink-0 mt-0.5">✓</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Tools We Offer */}
                <section className="mb-12 p-8 bg-white border border-gray-200 rounded-2xl">
                    <h2 className="text-2xl font-bold text-black mb-4">Tools We Offer</h2>
                    <p className="text-gray-600 mb-5 leading-relaxed">
                        AlphaPrime currently features 11 free tools across five categories:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { cat: '🔒 Privacy', tools: 'PrimeLink Chat, Link Vault, Password Generator' },
                            { cat: '💻 Dev', tools: 'Online Compiler, Base64 Converter, Diff Checker, Case Converter' },
                            { cat: '🎨 Design', tools: 'Color Tools, Image Resizer' },
                            { cat: '📝 Writing', tools: 'Word Counter' },
                        ].map((item) => (
                            <div key={item.cat} className="bg-gray-50 rounded-xl p-4">
                                <p className="font-semibold text-black text-sm mb-1">{item.cat}</p>
                                <p className="text-gray-500 text-xs">{item.tools}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact */}
                <section className="p-8 bg-white border border-gray-200 rounded-2xl text-center">
                    <h2 className="text-2xl font-bold text-black mb-3">Get in Touch</h2>
                    <p className="text-gray-500 mb-5 max-w-md mx-auto">
                        Have a tool suggestion, bug report, or partnership inquiry? We&apos;d love to hear from you.
                        We typically respond within 24–48 hours.
                    </p>
                    <a href="mailto:alphaprime.co.in@gmail.com"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors">
                        ✉️ alphaprime.co.in@gmail.com
                    </a>
                </section>

            </div>
        </div>
    );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Changelog – AlphaPrime',
    description: 'A full version history of AlphaPrime — every tool launch, improvement, and fix.',
    openGraph: {
        title: 'Changelog – AlphaPrime',
        description: 'Full version history of AlphaPrime.',
        url: 'https://alphaprime.co.in/changelog',
    },
};

const VERSIONS = [
    {
        version: 'v3.0',
        label: 'Latest',
        labelStyle: 'bg-black text-white',
        date: 'February 2026',
        title: 'Privacy Tools & Link System',
        entries: [
            { type: '🆕', text: 'PrimeLink Chat – Secure ephemeral chat rooms' },
            { type: '🆕', text: 'Link Vault – Encode secret actions inside any URL' },
            { type: '🆕', text: 'Shareable short-links system with OG preview support' },
            { type: '🐛', text: 'Fixed hydration issues on tool pages' },
            { type: '🎨', text: 'Updated footer with social links (YouTube, Instagram)' },
        ],
    },
    {
        version: 'v2.0',
        label: 'Previous',
        labelStyle: 'bg-gray-100 text-gray-600',
        date: 'January 2026',
        title: 'Developer Tools Expansion',
        entries: [
            { type: '🆕', text: 'Online Compiler – Run Python, C++, JS in browser' },
            { type: '🆕', text: 'Diff Checker – Side-by-side text comparison' },
            { type: '🆕', text: 'Color Tools – HEX/RGB picker + gradient builder' },
            { type: '⚡', text: 'Image Resizer upgraded with compression quality slider' },
            { type: '⚡', text: 'Performance optimisations – PageSpeed score 99+' },
            { type: '🎨', text: 'Homepage redesigned with search + category filters' },
        ],
    },
    {
        version: 'v1.0',
        label: 'Initial',
        labelStyle: 'bg-gray-100 text-gray-600',
        date: 'November 2025',
        title: 'Initial Launch',
        entries: [
            { type: '🚀', text: 'AlphaPrime launched with 5 core tools' },
            { type: '🆕', text: 'Word Counter, Password Generator, Image Resizer' },
            { type: '🆕', text: 'Base64 Converter, Case Converter' },
            { type: '🎨', text: 'Clean minimal white design system' },
        ],
    },
];

export default function ChangelogPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-2xl">
                {/* Header */}
                <div className="text-center mb-14">
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Changelog</p>
                    <h1 className="text-4xl sm:text-5xl font-bold text-black mb-4 leading-tight">
                        AlphaPrime Changelog
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Every launch, improvement, and fix — documented here.
                    </p>
                </div>

                {/* Versions */}
                <div className="flex flex-col gap-10">
                    {VERSIONS.map((v) => (
                        <div key={v.version} className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                            {/* Version header */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-2xl font-bold text-black">{v.version}</span>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${v.labelStyle}`}>{v.label}</span>
                                <span className="ml-auto text-sm text-gray-400">{v.date}</span>
                            </div>
                            <h2 className="text-lg font-bold text-black mb-4 pb-3 border-b border-gray-100">
                                {v.title}
                            </h2>

                            {/* Entries */}
                            <ul className="flex flex-col gap-2.5">
                                {v.entries.map((entry, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                        <span className="flex-shrink-0 text-base">{entry.type}</span>
                                        <span>{entry.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <p className="text-center text-sm text-gray-400 mt-10">
                    See what&apos;s next →{' '}
                    <a href="/roadmap" className="underline hover:text-black transition-colors">
                        Roadmap
                    </a>
                </p>
            </div>
        </div>
    );
}

import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Lock, LockKeyhole, Code2, ImageIcon, KeyRound, ScanText, Palette, ALargeSmall, Type, FileCode2, ChevronRight } from 'lucide-react';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

export const metadata: Metadata = {
    title: 'Privacy-First Web Tools Suite – AlphaPrime',
    description: 'Explore our full suite of free, privacy-first web tools. From code compilers to password generators, everything runs in your browser.',
    alternates: {
        canonical: 'https://alphaprime.co.in/tools/',
    },
};

const TOOLS = [
    { name: 'PrimeLink Chat', description: 'Secure Anonymous Messaging', href: '/tools/primelink/', icon: Lock, color: 'text-blue-500' },
    { name: 'Link Vault', description: 'Encrypted Personal Bookmarks', href: '/tools/link-vault/', icon: LockKeyhole, color: 'text-purple-500' },
    { name: 'Online Compiler', description: 'Multi-language Code Execution', href: '/tools/online-compiler/', icon: Code2, color: 'text-green-500' },
    { name: 'Image Resizer', description: 'Bulk Compression & Resizing', href: '/tools/image-resizer/', icon: ImageIcon, color: 'text-pink-500' },
    { name: 'Password Generator', description: 'Strong & Random Sequences', href: '/tools/password-generator/', icon: KeyRound, color: 'text-orange-500' },
    { name: 'Diff Checker', description: 'Side-by-side Text Comparison', href: '/tools/diff-checker/', icon: ScanText, color: 'text-indigo-500' },
    { name: 'Color Tools', description: 'Hex Picker & Palette Suite', href: '/tools/color-tools/', icon: Palette, color: 'text-cyan-500' },
    { name: 'Case Converter', description: 'Professional Text Formatting', href: '/tools/case-converter/', icon: ALargeSmall, color: 'text-gray-700' },
    { name: 'Word Counter', description: 'Real-time Content Analysis', href: '/tools/word-counter/', icon: Type, color: 'text-blue-700' },
    { name: 'Base64 Converter', description: 'Instant Data Encoding', href: '/tools/base64/', icon: FileCode2, color: 'text-yellow-600' },
];

export default function ToolsIndexPage() {
    return (
        <div className="container mx-auto px-4 py-32 max-w-6xl">
            <BreadcrumbSchema
                items={[
                    { name: 'Home', item: '/' },
                    { name: 'Tools', item: '/tools/' },
                ]}
            />

            <div className="text-center mb-16">
                <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-black">
                    Our <span className="text-gray-500">Tool Suite</span>
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto text-xl">
                    Powerful, privacy-focused utilities for developers, designers, and creators.
                    No registration required.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TOOLS.map((tool) => (
                    <Link
                        key={tool.href}
                        href={tool.href}
                        className="group p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-black/5 transition-all duration-300"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-2xl bg-gray-50 group-hover:scale-110 transition-transform`}>
                                <tool.icon className={`w-8 h-8 ${tool.color}`} />
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
                        </div>
                        <h2 className="text-xl font-bold text-black mb-2">{tool.name}</h2>
                        <p className="text-gray-500 text-sm leading-relaxed">{tool.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

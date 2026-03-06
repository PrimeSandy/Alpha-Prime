"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
    {
        q: 'Are these tools really free?',
        a: 'Yes — 100% free, forever. AlphaPrime is a privacy-first collection built for everyone. No paywalls, no credit cards, no hidden fees. Some tools are marked ⚡ PRIME ONLY which may include premium features in the future, but the core tools will always remain free.',
    },
    {
        q: 'Do you store my data?',
        a: 'No. All our tools run entirely inside your browser. Your text, files, passwords, and actions never leave your device and are never sent to our servers. We have no database storing your inputs.',
    },
    {
        q: 'Which browsers are supported?',
        a: 'AlphaPrime works on all modern browsers — Chrome, Firefox, Edge, Safari and Opera. Both desktop and mobile versions are fully supported. For best performance, we recommend the latest version of Chrome or Firefox.',
    },
    {
        q: 'Can I use these tools offline?',
        a: 'Most tools work offline once the page has loaded, since the processing happens in your browser. However, tools that require external APIs (like the Online Compiler) require an internet connection.',
    },
    {
        q: 'How is my privacy protected?',
        a: 'Privacy is at the core of AlphaPrime. We don\'t use tracking cookies, don\'t sell data, and don\'t log your tool usage. Our tools are designed to be zero-knowledge — we simply cannot see what you\'re doing because nothing is sent to us.',
    },
    {
        q: 'How often are new tools added?',
        a: 'We aim to launch new tools every few weeks. You can follow our progress on the Roadmap page. Subscribe to our newsletter to get notified when new tools go live.',
    },
    {
        q: 'Can I suggest a new tool?',
        a: 'Absolutely! We love community suggestions. Head over to our Contact page and describe the tool you\'d like to see. We review all suggestions and prioritise the most-requested ones.',
    },
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (i: number) => setOpenIndex(prev => prev === i ? null : i);

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-2xl">
                {/* Header */}
                <div className="text-center mb-14">
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">FAQ</p>
                    <h1 className="text-4xl sm:text-5xl font-bold text-black mb-4 leading-tight">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Everything you may want to know about AlphaPrime.
                    </p>
                </div>

                {/* Accordion */}
                <div className="flex flex-col gap-3">
                    {FAQS.map((faq, i) => {
                        const isOpen = openIndex === i;
                        return (
                            <div
                                key={i}
                                className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isOpen ? 'border-black shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <button
                                    onClick={() => toggle(i)}
                                    className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 focus:outline-none"
                                    aria-expanded={isOpen}
                                >
                                    <span className="font-semibold text-black text-sm sm:text-base">{faq.q}</span>
                                    <ChevronDown
                                        className={`flex-shrink-0 w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <p className="px-6 pb-5 text-sm sm:text-base text-gray-600 leading-relaxed">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <p className="text-center text-sm text-gray-400 mt-10">
                    Still have questions?{' '}
                    <a href="/contact" className="underline hover:text-black transition-colors">
                        Contact us →
                    </a>
                </p>
            </div>
        </div>
    );
}

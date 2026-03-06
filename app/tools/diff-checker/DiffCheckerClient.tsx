"use client";

import React, { useState, useEffect } from 'react';
import { GitCompare, RotateCcw } from 'lucide-react';
import * as Diff from 'diff';
import FAQSection from '@/components/FAQSection';

const faqs = [
    {
        question: "Are my compared texts saved or uploaded anywhere?",
        answer: "No. The Diff Checker runs entirely locally within your browser. We do not store, upload, or track the text you compare, ensuring your data remains 100% private."
    },
    {
        question: "What is the difference between line, word, and character modes?",
        answer: "Line mode compares entire lines of text, ideal for code. Word mode highlights specific changed words, great for essays. Character mode detects even the smallest single-letter typo or spacing change."
    },
    {
        question: "Can I use the Diff Checker for programming code?",
        answer: "Yes, our tool highlights additions in green and deletions in red, making it an excellent utility for reviewing code changes before committing them."
    }
];

export default function DiffChecker() {
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const [diffResult, setDiffResult] = useState<Diff.Change[]>([]);
    const [mode, setMode] = useState<'lines' | 'words' | 'chars'>('lines');

    useEffect(() => {
        let result: Diff.Change[] = [];
        if (mode === 'lines') {
            result = Diff.diffLines(text1, text2);
        } else if (mode === 'words') {
            result = Diff.diffWords(text1, text2);
        } else {
            result = Diff.diffChars(text1, text2);
        }
        setTimeout(() => setDiffResult(result), 0);
    }, [text1, text2, mode]);



    return (
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-12">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white text-black border-2 border-black mb-4 shadow-sm">
                    <GitCompare className="w-8 h-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
                    Diff Checker
                </h1>
                <p className="text-slate-600 max-w-2xl mx-auto">
                    Compare text files to find the difference between two text files.
                    Just paste and see the differences instantly.
                </p>
            </div>

            {/* Controls */}
            <div className="flex justify-center flex-wrap gap-4 mb-8">
                {(['lines', 'words', 'chars'] as const).map(m => (
                    <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === m
                            ? 'bg-white text-black border-2 border-black shadow-lg'
                            : 'text-slate-500 bg-white hover:bg-slate-50 border border-slate-200'
                            }`}
                    >
                        Compare {m.charAt(0).toUpperCase() + m.slice(1)}
                    </button>
                ))}
                <button
                    onClick={() => { setText1(''); setText2(''); }}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-red-500 bg-white border border-slate-200 hover:bg-red-50 transition-all flex items-center gap-2"
                >
                    <RotateCcw className="w-4 h-4" /> Reset
                </button>
            </div>

            {/* Input Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex flex-col">
                    <label className="text-sm font-bold text-slate-500 mb-2 uppercase flex justify-between">
                        Original Text
                    </label>
                    <textarea
                        value={text1}
                        onChange={(e) => setText1(e.target.value)}
                        placeholder="Paste original text here..."
                        className="flex-1 min-h-[300px] p-4 rounded-xl bg-white border-2 border-slate-200 focus:border-black focus:ring-0 resize-y font-mono text-sm leading-relaxed"
                        spellCheck="false"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-bold text-slate-500 mb-2 uppercase flex justify-between">
                        Changed Text
                    </label>
                    <textarea
                        value={text2}
                        onChange={(e) => setText2(e.target.value)}
                        placeholder="Paste new text here..."
                        className="flex-1 min-h-[300px] p-4 rounded-xl bg-white border-2 border-slate-200 focus:border-black focus:ring-0 resize-y font-mono text-sm leading-relaxed"
                        spellCheck="false"
                    />
                </div>
            </div>

            {/* Result Area */}
            {(text1 || text2) && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                        <h2 className="text-xl font-bold text-black flex items-center gap-2">
                            <GitCompare className="w-5 h-5 text-black" /> Comparison Result
                        </h2>
                        <div className="flex gap-4 text-sm font-medium">
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></span> Removed</span>
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></span> Added</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                        <div className="p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {diffResult.map((part, index) => {
                                const color = part.added ? 'bg-green-500/20 text-green-700 border-b-2 border-green-500/30' :
                                    part.removed ? 'bg-red-500/20 text-red-700 border-b-2 border-red-500/30 decoration-slice' :
                                        'text-slate-600';
                                return (
                                    <span key={index} className={color}>
                                        {part.value}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* How It Works Section */}
            <div className="mt-16 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <h2 className="text-3xl font-bold text-black mb-6">How the Diff Checker Works</h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
                    <p>
                        A Diff Checker (short for Difference Checker) is an invaluable tool for developers, writers, and anyone who needs to track changes between two versions of a document or codebase. At a glance, it highlights exactly what has been added, removed, or modified, saving you the tedious task of manually reading through lines of text side-by-side.
                    </p>
                    <p>
                        Our Diff Checker leverages the powerful <code>diff</code> algorithmic library to compute the differences between your &quot;Original&quot; and &quot;Changed&quot; text inputs. This comparison is performed entirely in your browser, meaning your sensitive code or proprietary text is never transmitted to an external server. It is fast, private, and highly accurate.
                    </p>
                    <h3 className="text-xl font-semibold text-black mt-6 mb-3">Comparison Modes</h3>
                    <p>
                        To give you granular control over how changes are detected, we offer three distinct comparison modes:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Lines Mode:</strong> This is the most common mode used by programmers. It compares the two texts line by line. If a single character on a line changes, the entire line is marked as modified. It is ideal for reviewing code changes before committing them to a version control system like Git.</li>
                        <li><strong>Words Mode:</strong> If you are editing an essay or an article, comparing by words is much more useful. This mode ignores line breaks and focuses purely on structural word differences. It highlights precisely which words were added or deleted, making proofreading a breeze.</li>
                        <li><strong>Characters (Chars) Mode:</strong> For meticulous, microscopic comparisons, the characters mode comes into play. It analyzes the text letter by letter, highlighting even the addition of a single space or punctuation mark. It is perfect for spotting subtle typos or hidden formatting characters.</li>
                    </ul>
                    <h3 className="text-xl font-semibold text-black mt-6 mb-3">Understanding the Output</h3>
                    <p>
                        Once the text is processed, the results are displayed in a clean, syntax-highlighted view. The color-coding is universally recognized:
                    </p>
                    <p>
                        <strong><span className="text-red-500">Red</span></strong> indicates text that was present in the original version but has been removed in the new version.
                        <br />
                        <strong><span className="text-green-500">Green</span></strong> denotes entirely new text that has been added to the changed version.
                        <br />
                        Standard formatting is applied to text that remains identical in both versions, providing necessary context around the modifications.
                    </p>
                </div>

                <FAQSection faqs={faqs} />

                {false && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-black mb-6">Video Tutorial</h2>
                        <div className="relative w-full overflow-hidden rounded-2xl bg-slate-100" style={{ paddingTop: '56.25%' }}>
                            <iframe
                                className="absolute top-0 left-0 w-full h-full border-0"
                                src="https://www.youtube.com/embed/YOUR_VIDEO_ID_HERE"
                                title="Diff Checker Tutorial Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

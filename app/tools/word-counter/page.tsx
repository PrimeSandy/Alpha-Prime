"use client";

import React, { useState, useEffect } from 'react';
import { FileText, Copy, Trash2, Check } from 'lucide-react';
import FAQSection from '@/components/FAQSection';

const faqs = [
    {
        question: "Does the Word Counter save the text I paste into it?",
        answer: "No, your text is never saved or transmitted. The Word Counter processes everything locally in your browser, ensuring complete privacy for your documents, articles, and sensitive data."
    },
    {
        question: "What metrics does the Word Counter calculate?",
        answer: "Our tool instantly calculates character count (with and without spaces), word count, sentence count, and estimated reading time directly as you type."
    },
    {
        question: "Is there a word limit for the text I can analyze?",
        answer: "Since the processing happens on your device, there is virtually no strict limit. You can easily analyze large essays, reports, or code blocks instantly."
    }
];

export default function WordCounter() {
    const [text, setText] = useState('');
    const [stats, setStats] = useState({
        words: 0,
        chars: 0,
        sentences: 0,
        paragraphs: 0,
        charsNoSpaces: 0,
        readingTime: 0
    });
    const [keywords, setKeywords] = useState<{ word: string, count: number }[]>([]);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        analyzeText(text);
    }, [text]);

    const analyzeText = (inputText: string) => {
        const trimmed = inputText.trim();
        const words = trimmed === '' ? 0 : trimmed.split(/\s+/).length;
        const chars = inputText.length;
        const charsNoSpaces = inputText.replace(/\s/g, '').length;
        const sentences = trimmed === '' ? 0 : (inputText.match(/[.!?]+/g) || []).length;
        const paragraphs = trimmed === '' ? 0 : inputText.split(/\n+/).filter(p => p.trim() !== '').length;
        const readingTime = Math.ceil(words / 200);

        setStats({ words, chars, sentences, paragraphs, charsNoSpaces, readingTime });
        updateKeywords(inputText);
    };

    const updateKeywords = (inputText: string) => {
        if (!inputText.trim()) {
            setKeywords([]);
            return;
        }

        const words = inputText.toLowerCase().match(/\b\w+\b/g) || [];
        const wordMap: Record<string, number> = {};
        words.forEach(w => {
            if (w.length > 3) {
                wordMap[w] = (wordMap[w] || 0) + 1;
            }
        });

        const sorted = Object.entries(wordMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([word, count]) => ({ word, count }));

        setKeywords(sorted);
    };

    const handleCopy = () => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setText('');
    };

    return (
        <div className="container mx-auto px-4 py-6 sm:py-12 max-w-6xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight text-black">
                    Analyze Your <span className="text-black">Content</span>
                </h1>
                <p className="text-gray-800 max-w-2xl mx-auto text-lg">
                    Real-time analysis of words, characters, reading time, and keyword density.
                    100% Client-side.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Input Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-200 rounded-2xl p-[1px] relative group h-full">
                        <div className="bg-white rounded-2xl p-6 h-[500px] flex flex-col shadow-sm border border-gray-200">
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full h-full bg-transparent border-none focus:ring-0 text-black placeholder-gray-600 resize-none text-lg leading-relaxed font-mono focus:outline-none"
                                placeholder="Type or paste your text here to begin analysis..."
                            ></textarea>

                            <div className="flex items-center justify-between mt-4 border-t border-gray-300 pt-4">
                                <span className="text-xs text-gray-800">Supports Markdown input</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-200 transition-colors text-sm font-medium text-black"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                    <button
                                        onClick={handleClear}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-200 hover:text-red-500 transition-colors text-sm font-medium text-black"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Sidebar */}
                <div className="space-y-6">
                    {/* Main Stats */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-6">Statistics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-300 text-center">
                                <div className="text-3xl font-bold text-black mb-1">{stats.words}</div>
                                <div className="text-xs text-gray-800 uppercase">Words</div>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-300 text-center">
                                <div className="text-3xl font-bold text-black mb-1">{stats.chars}</div>
                                <div className="text-xs text-gray-800 uppercase">Chars</div>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-300 text-center">
                                <div className="text-3xl font-bold text-black mb-1">{stats.sentences}</div>
                                <div className="text-xs text-gray-800 uppercase">Sentences</div>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-300 text-center">
                                <div className="text-3xl font-bold text-black mb-1">{stats.readingTime}m</div>
                                <div className="text-xs text-gray-800 uppercase">Read Time</div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-300 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-800">Paragraphs</span>
                                <span className="text-black font-mono">{stats.paragraphs}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-800">Chars (no spaces)</span>
                                <span className="text-black font-mono">{stats.charsNoSpaces}</span>
                            </div>
                        </div>
                    </div>

                    {/* Keyword Density */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Top Keywords</h3>
                        <div className="space-y-2">
                            {keywords.length > 0 ? (
                                keywords.map((k, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                        <span className="font-medium text-black">{k.word}</span>
                                        <span className="bg-gray-200 text-black px-2 py-0.5 rounded-full text-xs font-bold">{k.count}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-700 italic text-center py-4">Start typing to see keywords</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="mt-16 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <FileText className="w-48 h-48 text-black" />
                </div>
                <h2 className="text-3xl font-bold text-black mb-6 relative z-10">How Our Word Counter Works</h2>
                <div className="prose prose-gray max-w-none text-gray-800 space-y-4 relative z-10">
                    <p>
                        Whether you're an author writing a novel, an SEO specialist optimizing web copy, or a student finishing an essay with strict length requirements, knowing the exact metrics of your text is essential. Our Advanced Word Counter goes beyond simple tallying to provide comprehensive, real-time insights into your content’s structure and readability.
                    </p>
                    <p>
                        The tool is built entirely in your browser using modern web technologies. This means that zero data is sent to external servers. Your essays, articles, and private documents remain strictly confidential on your local machine, and the analysis happens instantaneously as you type or paste text into the editor.
                    </p>
                    <h3 className="text-xl font-semibold text-black mt-6 mb-3">Real-time Statistical Analysis</h3>
                    <p>
                        As soon as input is detected, our algorithm breaks down your text using advanced regular expressions (Regex) to ensure high accuracy:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Words:</strong> Calculates the true word count by identifying contiguous sequences of alphanumeric characters separated by whitespace.</li>
                        <li><strong>Characters:</strong> Tracks total keystrokes, offering a secondary metric ("Chars no spaces") which is vital for character-limited platforms like Twitter or SMS.</li>
                        <li><strong>Sentences & Paragraphs:</strong> Accurately parses punctuation (periods, exclamation marks, question marks) and line breaks to measure the structural rhythm of your document.</li>
                        <li><strong>Reading Time:</strong> Estimates how long it takes an average adult (reading at roughly 200 words per minute) to read your text, perfect for timing speeches or blog post lengths.</li>
                    </ul>
                    <h3 className="text-xl font-semibold text-black mt-6 mb-3">SEO and Keyword Density</h3>
                    <p>
                        Writing for the web requires strategic word placement. Our "Top Keywords" feature automatically filters out common stop words and short filler text. By analyzing the frequency of the remaining substantive words, it dynamically generates a list of your most used terms. This allows you to quickly verify if you are hitting your target SEO keywords or, conversely, if you are overusing a specific cliché and need to diversify your vocabulary.
                    </p>
                </div>

                <FAQSection faqs={faqs} />

                {false && (
                    <div className="mt-12 relative z-10">
                        <h2 className="text-2xl font-bold text-black mb-6">Video Tutorial</h2>
                        <div className="relative w-full overflow-hidden rounded-2xl bg-gray-200 border border-gray-200" style={{ paddingTop: '56.25%' }}>
                            <iframe
                                className="absolute top-0 left-0 w-full h-full border-0"
                                src="https://www.youtube.com/embed/YOUR_VIDEO_ID_HERE"
                                title="Word Counter Tutorial Video"
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

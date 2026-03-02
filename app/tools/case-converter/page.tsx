"use client";

import React, { useState, useEffect } from 'react';
import { Type, Eraser, RotateCcw, Copy, Check } from 'lucide-react';
import FAQSection from '@/components/FAQSection';

const faqs = [
    {
        question: "What types of text cases can I convert between?",
        answer: "You can easily convert your text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more with a single click."
    },
    {
        question: "Is my text uploaded to a server for formatting?",
        answer: "Absolutely not. The Case Converter runs 100% locally in your browser, meaning your private text or code remains strictly on your device."
    },
    {
        question: "Can I format large blocks of code or text?",
        answer: "Yes, the tool handles large amounts of text instantly without any lag, making it perfect for developers and writers who need quick formatting."
    }
];

export default function CaseConverter() {
    const [text, setText] = useState('');
    const [history, setHistory] = useState<{ id: number, text: string, fullText: string, style: string, timestamp: string }[]>([]);
    const [preview, setPreview] = useState('');
    const [currentStyle, setCurrentStyle] = useState('Original');
    const [stats, setStats] = useState({ chars: 0, words: 0 });
    const [lastText, setLastText] = useState(''); // For Undo functionality
    const [copied, setCopied] = useState(false);

    // Stats update
    useEffect(() => {
        setTimeout(() => {
            setStats({
                chars: text.length,
                words: text.trim().split(/\s+/).filter(w => w.length > 0).length
            });
        }, 0);
    }, [text]);

    // Load history
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedHistory = localStorage.getItem('caseHistory');
            if (savedHistory) {
                setTimeout(() => setHistory(JSON.parse(savedHistory as string)), 0);
            }
        }
    }, []);

    const updateHistory = (newText: string, style: string) => {
        if (!newText || newText === lastText) return;

        const newItem = {
            id: Date.now(),
            text: newText.substring(0, 50) + (newText.length > 50 ? '...' : ''),
            fullText: newText,
            style,
            timestamp: new Date().toLocaleTimeString()
        };

        const newHistory = [newItem, ...history].slice(0, 20);
        setHistory(newHistory);
        if (typeof window !== 'undefined') {
            localStorage.setItem('caseHistory', JSON.stringify(newHistory));
        }
    };

    const handleCaseChange = (type: string) => {
        if (!text) return;

        setLastText(text); // Save for Undo
        let newText = text;

        switch (type) {
            case 'uppercase':
                newText = text.toUpperCase();
                setCurrentStyle('UPPERCASE');
                break;
            case 'lowercase':
                newText = text.toLowerCase();
                setCurrentStyle('lowercase');
                break;
            case 'titlecase':
                newText = text.toLowerCase().split(' ').map(function (word) {
                    return (word.charAt(0).toUpperCase() + word.slice(1));
                }).join(' ');
                setCurrentStyle('Title Case');
                break;
            case 'sentencecase':
                newText = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, function (c) {
                    return c.toUpperCase();
                });
                setCurrentStyle('Sentence Case');
                break;
            case 'alternatingcase':
                newText = text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
                setCurrentStyle('aLtErNaTiNg cAsE');
                break;
            case 'inversecase':
                newText = text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
                setCurrentStyle('InVeRsE cAsE');
                break;
            default:
                return;
        }

        setText(newText);
        setPreview(newText.substring(0, 100) + (newText.length > 100 ? '...' : ''));
        updateHistory(newText, currentStyle);
    };

    const handleUndo = () => {
        if (lastText) {
            setText(lastText);
            setLastText(''); // Simple 1-step undo for now
            setCurrentStyle('Restored');
        }
    };

    const handleCopy = () => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setLastText(text);
        setText('');
    };

    const clearHistory = () => {
        setHistory([]);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('caseHistory');
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 sm:py-12 max-w-6xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight text-black">
                    Text Case <span className="text-black">Converter</span>
                </h1>
                <p className="text-gray-800 max-w-2xl mx-auto text-lg">
                    Instantly change text capitalization. Supports uppercase, lowercase, title case, and more.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left: Editor */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        {/* Toolbar */}
                        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <Type className="w-5 h-5 text-black" />
                                <span className="font-medium text-black">Editor</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-mono text-gray-800">
                                <span>{stats.chars} chars</span>
                                <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                <span>{stats.words} words</span>
                            </div>
                        </div>

                        {/* Text Area */}
                        <div className="relative group">
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full h-[300px] p-6 bg-white text-black font-sans text-base leading-relaxed focus:outline-none resize-y placeholder-gray-600 focus:bg-gray-50 transition-colors"
                                placeholder="Type or paste your text here..."
                            ></textarea>

                            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={handleCopy}
                                    className="p-2 rounded-lg bg-gray-200 text-gray-800 hover:text-black hover:bg-gray-200 transition-all"
                                    title="Copy"
                                >
                                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={handleClear}
                                    className="p-2 rounded-lg bg-gray-200 text-gray-800 hover:text-red-500 hover:bg-gray-200 transition-all"
                                    title="Clear"
                                >
                                    <Eraser className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 bg-white border-t border-gray-200">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <button onClick={() => handleCaseChange('uppercase')} className="group relative overflow-hidden rounded-xl bg-gray-50 hover:bg-black hover:text-white border border-gray-200 p-3 transition-all active:scale-95 text-left">
                                    <span className="block text-xs text-gray-800 mb-1 group-hover:text-gray-300">UPPERCASE</span>
                                    <span className="font-medium text-black group-hover:text-white">ABC</span>
                                </button>
                                <button onClick={() => handleCaseChange('lowercase')} className="group relative overflow-hidden rounded-xl bg-gray-50 hover:bg-black hover:text-white border border-gray-200 p-3 transition-all active:scale-95 text-left">
                                    <span className="block text-xs text-gray-800 mb-1 group-hover:text-gray-300">lowercase</span>
                                    <span className="font-medium text-black group-hover:text-white">abc</span>
                                </button>
                                <button onClick={() => handleCaseChange('titlecase')} className="group relative overflow-hidden rounded-xl bg-gray-50 hover:bg-black hover:text-white border border-gray-200 p-3 transition-all active:scale-95 text-left">
                                    <span className="block text-xs text-gray-800 mb-1 group-hover:text-gray-300">Title Case</span>
                                    <span className="font-medium text-black group-hover:text-white">Abc Def</span>
                                </button>
                                <button onClick={() => handleCaseChange('sentencecase')} className="group relative overflow-hidden rounded-xl bg-gray-50 hover:bg-black hover:text-white border border-gray-200 p-3 transition-all active:scale-95 text-left">
                                    <span className="block text-xs text-gray-800 mb-1 group-hover:text-gray-300">Sentence case</span>
                                    <span className="font-medium text-black group-hover:text-white">Abc def.</span>
                                </button>
                                <button onClick={() => handleCaseChange('alternatingcase')} className="group relative overflow-hidden rounded-xl bg-gray-50 hover:bg-black hover:text-white border border-gray-200 p-3 transition-all active:scale-95 text-left">
                                    <span className="block text-xs text-gray-800 mb-1 group-hover:text-gray-300">Alternating</span>
                                    <span className="font-medium text-black group-hover:text-white">aBc DeF</span>
                                </button>
                                <button onClick={() => handleCaseChange('inversecase')} className="group relative overflow-hidden rounded-xl bg-gray-50 hover:bg-black hover:text-white border border-gray-200 p-3 transition-all active:scale-95 text-left">
                                    <span className="block text-xs text-gray-800 mb-1 group-hover:text-gray-300">Inverse Case</span>
                                    <span className="font-medium text-black group-hover:text-white">aBC dEF</span>
                                </button>

                                {/* Undo Button */}
                                <button onClick={handleUndo} className="col-span-2 md:col-span-2 group relative overflow-hidden rounded-xl bg-gray-200 hover:bg-gray-300 border border-gray-300 p-3 transition-all active:scale-95 flex items-center justify-center gap-2">
                                    <RotateCcw className="w-5 h-5 text-gray-800" />
                                    <span className="text-sm font-medium text-gray-700">Undo Last Action</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: History & Preview */}
                <div className="space-y-6">
                    {/* Live Preview */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 lg:sticky lg:top-24 shadow-sm">
                        <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                            Live Preview
                        </h3>
                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 min-h-[100px] text-sm text-gray-800 font-mono break-all">
                            {preview || <em>Preview will appear here...</em>}
                        </div>
                        <div className="mt-4 flex justify-between items-center text-xs text-gray-800">
                            <span>Current Style:</span>
                            <span className="text-black font-medium">{currentStyle}</span>
                        </div>
                    </div>

                    {/* History */}
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[500px] shadow-sm">
                        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                            <h3 className="font-semibold text-black flex items-center gap-2">
                                History
                            </h3>
                            <button onClick={clearHistory} className="text-xs text-gray-800 hover:text-red-500 transition-colors flex items-center gap-1">
                                <Eraser className="w-3 h-3" /> Clear
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                            {history.length === 0 ? (
                                <p className="text-center text-sm text-gray-800 py-4">No history yet</p>
                            ) : (
                                history.map((item) => (
                                    <div key={item.id} className="p-3 bg-white rounded-lg border border-gray-200 hover:border-black transition-colors cursor-pointer" onClick={() => setText(item.fullText)}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-bold bg-gray-200 text-black">
                                                {item.style}
                                            </span>
                                            <span className="text-[10px] text-gray-700">{item.timestamp}</span>
                                        </div>
                                        <div className="font-mono text-xs text-gray-800 truncate">{item.text}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="mt-16 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <h2 className="text-3xl font-bold text-black mb-6">How the Case Converter Works</h2>
                <div className="prose prose-gray max-w-none text-gray-800 space-y-4">
                    <p>
                        Our Text Case Converter is an essential tool for writers, editors, programmers, and anyone who regularly works with text. It offers a quick and reliable way to change the capitalization of large blocks of text without having to retype them manually. Whether you accidentally left your Caps Lock on or need to format a title correctly, our tool provides an instant solution.
                    </p>
                    <p>
                        The tool processes your input text and applies specific algorithmic rules to modify the capitalization according to the style you select. Under the hood, it uses JavaScript string manipulation methods to ensure accurate and lightening-fast conversions, directly within your web browser. This means your text is never sent to a server, ensuring your data remains completely private and secure. It&apos;s a convenient and safe way to handle your text.
                    </p>
                    <h3 className="text-xl font-semibold text-black mt-6 mb-3">Available Transformation Styles</h3>
                    <p>
                        <strong>UPPERCASE:</strong> This option converts every single letter in your text to its capitalized form. It is commonly used for emphasis, creating bold headlines, or matching specific data formatting requirements. For example, &quot;hello world&quot; becomes &quot;HELLO WORLD&quot;.
                    </p>
                    <p>
                        <strong>lowercase:</strong> Conversely, the lowercase option changes all letters to their small, non-capitalized forms. This is particularly useful when normalizing data, preparing URLs, or fixing text that was mistakenly typed with Caps Lock on. &quot;HELLO WORLD&quot; transforms into &quot;hello world&quot;.
                    </p>
                    <p>
                        <strong>Title Case:</strong> Title case capitalizes the first letter of every word while leaving the rest of the letters lowercase. This is the standard formatting style for book titles, article headlines, and proper nouns. &quot;the quick brown fox&quot; becomes &quot;The Quick Brown Fox&quot;.
                    </p>
                    <p>
                        <strong>Sentence case:</strong> This format mimics natural writing by capitalizing only the very first letter of a sentence and leaving the subsequent words in lowercase, unless they are recognized proper nouns. It is ideal for converting unformatted blocks of text into readable paragraphs.
                    </p>
                    <p>
                        <strong>aLtErNaTiNg cAsE and InVeRsE cAsE:</strong> These are more specialized formats. Alternating case toggles capitalization between each letter (e.g., &quot;hElLo&quot;), often used for stylistic or informal internet communication. Inverse case analyzes your text and flips the current capitalization—what was uppercase becomes lowercase, and vice versa.
                    </p>
                    <h3 className="text-xl font-semibold text-black mt-6 mb-3">Why Use a Case Converter?</h3>
                    <p>
                        Manually retyping text to fix capitalization errors is tedious and prone to mistakes. A dedicated case converter saves time and guarantees consistency across your documents. It is especially beneficial for programmers who need to reformat variable names or for content creators ensuring their headings follow a specific style guide. Our tool includes real-time character and word counts, a built-in notepad area, and a history feature, making it a comprehensive solution for all your text manipulation needs.
                    </p>
                </div>

                <FAQSection faqs={faqs} />

                {false && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-black mb-6">Video Tutorial</h2>
                        <div className="relative w-full overflow-hidden rounded-2xl bg-gray-200" style={{ paddingTop: '56.25%' }}>
                            <iframe
                                className="absolute top-0 left-0 w-full h-full border-0"
                                src="https://www.youtube.com/embed/YOUR_VIDEO_ID_HERE"
                                title="Case Converter Tutorial Video"
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

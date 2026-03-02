"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Copy, Trash2, ShieldCheck, Lock, Unlock, History, Check } from 'lucide-react';
import FAQSection from '@/components/FAQSection';

const faqs = [
    {
        question: "Is my decoded Base64 data secure?",
        answer: "Yes. Encoding and decoding happen instantly on the client-side. There are no server calls, meaning your sensitive strings remain completely private."
    },
    {
        question: "Do I need an account to use the Base64 converter?",
        answer: "No sign-ups are required. All AlphaPrime developer tools are free, instant, and accessible without an account."
    }
];

export default function Base64Converter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [stats, setStats] = useState({ inputSize: 0, outputSize: 0 });
    const [history, setHistory] = useState<{ id: number, input: string, output: string, type: string, timestamp: string }[]>([]);
    const [copiedInput, setCopiedInput] = useState(false);
    const [copiedOutput, setCopiedOutput] = useState(false);
    const [error, setError] = useState('');

    // Load history
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedHistory = localStorage.getItem('base64History');
            if (savedHistory) {
                setHistory(JSON.parse(savedHistory));
            }
        }
    }, []);

    // Update stats
    useEffect(() => {
        setStats({
            inputSize: new Blob([input]).size,
            outputSize: new Blob([output]).size
        });
    }, [input, output]);

    const handleEncode = () => {
        setError('');
        if (!input) {
            setOutput('');
            return;
        }
        try {
            const encoded = btoa(unescape(encodeURIComponent(input)));
            setOutput(encoded);
            addToHistory(input, encoded, 'encode');
        } catch (e) {
            setError('Unable to encode. Ensure input is valid text.');
        }
    };

    const handleDecode = () => {
        setError('');
        if (!input) {
            setOutput('');
            return;
        }
        try {
            const decoded = decodeURIComponent(escape(atob(input)));
            setOutput(decoded);
            addToHistory(input, decoded, 'decode');
        } catch (e) {
            setError('Invalid Base64 string.');
        }
    };

    const addToHistory = (inp: string, out: string, type: 'encode' | 'decode') => {
        const newEntry = {
            id: Date.now(),
            input: inp.substring(0, 50) + (inp.length > 50 ? '...' : ''),
            output: out.substring(0, 50) + (out.length > 50 ? '...' : ''),
            type,
            timestamp: new Date().toLocaleString()
        };
        const newHistory = [newEntry, ...history].slice(0, 10);
        setHistory(newHistory);
        if (typeof window !== 'undefined') {
            localStorage.setItem('base64History', JSON.stringify(newHistory));
        }
    };

    const clearHistory = () => {
        setHistory([]);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('base64History');
        }
    };

    const handleCopy = (text: string, type: 'input' | 'output') => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        if (type === 'input') {
            setCopiedInput(true);
            setTimeout(() => setCopiedInput(false), 2000);
        } else {
            setCopiedOutput(true);
            setTimeout(() => setCopiedOutput(false), 2000);
        }
    };

    const handleClear = () => {
        setInput('');
        setOutput('');
        setError('');
    };

    return (
        <div className="container mx-auto px-4 py-6 sm:py-12 max-w-6xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight text-black">
                    Base64 <span className="text-black">Converter</span>
                </h1>
                <p className="text-gray-800 max-w-2xl mx-auto text-lg">
                    Securely encode and decode data instantly in your browser. No server storage, completely private.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left: Tool */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        {/* Toolbar */}
                        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <ArrowLeftRight className="w-5 h-5 text-black" />
                                <span className="font-medium text-black">Input / Output</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-200 text-gray-800 border border-gray-300">
                                    {mode === 'encode' ? 'Encoder Ready' : 'Decoder Ready'}
                                </span>
                                <span className="text-xs font-mono text-gray-800">{input.length} chars</span>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="relative group">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full h-[300px] p-6 bg-white text-black font-mono text-sm leading-relaxed focus:outline-none resize-none placeholder-gray-600"
                                placeholder="Paste text or Base64 string here..."
                            ></textarea>

                            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={() => handleCopy(input, 'input')}
                                    className="p-2 rounded-lg bg-gray-200 text-gray-800 hover:text-black hover:bg-gray-200 transition-all"
                                    title="Copy Input"
                                >
                                    {copiedInput ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={handleClear}
                                    className="p-2 rounded-lg bg-gray-200 text-gray-800 hover:text-black hover:bg-gray-200 transition-all"
                                    title="Clear"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 bg-gray-50 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => { setMode('encode'); handleEncode(); }}
                                className={`group relative overflow-hidden rounded-xl border transition-all ${mode === 'encode' ? 'bg-white text-black border-2 border-black border-black shadow-lg' : 'bg-white text-black border-gray-200 hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center justify-center gap-3 px-6 py-3.5 h-full">
                                    <Lock className="w-5 h-5" />
                                    <span className="font-semibold">Encode</span>
                                </div>
                            </button>

                            <button
                                onClick={() => { setMode('decode'); handleDecode(); }}
                                className={`group relative overflow-hidden rounded-xl border transition-all ${mode === 'decode' ? 'bg-white text-black border-2 border-black border-black shadow-lg' : 'bg-white text-black border-gray-200 hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center justify-center gap-3 px-6 py-3.5 h-full">
                                    <Unlock className="w-5 h-5" />
                                    <span className="font-semibold">Decode</span>
                                </div>
                            </button>
                        </div>

                        {/* Output Area */}
                        <div className="relative border-t border-gray-200">
                            <div className="absolute top-0 left-0 px-4 py-2 bg-gray-200 rounded-br-lg text-xs font-bold text-gray-800 border-b border-r border-gray-200">
                                RESULT
                            </div>
                            <textarea
                                readOnly
                                value={error || output}
                                className={`w-full h-[200px] p-6 pt-12 bg-gray-50 text-black font-mono text-sm leading-relaxed focus:outline-none resize-none ${error ? 'border-2 border-red-500' : ''}`}
                                placeholder="Result will appear here..."
                            ></textarea>
                            <div className="absolute bottom-4 right-4 flex gap-2">
                                <button
                                    onClick={() => handleCopy(output, 'output')}
                                    className="p-2 rounded-lg bg-white border border-gray-200 text-gray-800 hover:text-black hover:bg-gray-50 transition-all shadow-sm"
                                    title="Copy Result"
                                >
                                    {copiedOutput ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-black" /> About Base64
                        </h3>
                        <div className="prose prose-gray max-w-none text-gray-800">
                            <p>
                                Base64 is a binary-to-text encoding schemes that represent binary data in an ASCII string format.
                                It is commonly used when there is a need to encode binary data that needs to be stored and transferred
                                over media that is designed to deal with textual data.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Stats & History */}
                <div className="space-y-6">
                    {/* Stats */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-black mb-4">Statistics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-300">
                                <div className="text-xs text-gray-800 mb-1">Input Size</div>
                                <div className="text-xl font-bold text-black font-mono">{stats.inputSize} B</div>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-300">
                                <div className="text-xs text-gray-800 mb-1">Output Size</div>
                                <div className="text-xl font-bold text-black font-mono">{stats.outputSize} B</div>
                            </div>
                        </div>
                    </div>

                    {/* History */}
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[500px] shadow-sm">
                        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                            <h3 className="font-semibold text-black flex items-center gap-2">
                                <History className="w-5 h-5 text-gray-700" /> History
                            </h3>
                            <button onClick={clearHistory} className="text-xs text-gray-800 hover:text-red-500 transition-colors flex items-center gap-1">
                                <Trash2 className="w-3 h-3" /> Clear
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                            {history.length === 0 ? (
                                <p className="text-center text-sm text-gray-800 py-4">No history yet</p>
                            ) : (
                                history.map((item) => (
                                    <div key={item.id} className="p-3 bg-white rounded-lg border border-gray-200 hover:border-black transition-colors cursor-pointer" onClick={() => { setInput(item.input); setOutput(item.output); setMode(item.type as 'encode' | 'decode'); }}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold border ${item.type === 'encode' ? 'bg-white text-black border-2 border-black border-transparent' : 'bg-white text-black border-black'}`}>
                                                {item.type}
                                            </span>
                                            <span className="text-[10px] text-gray-700">{item.timestamp.split(',')[1]}</span>
                                        </div>
                                        <div className="font-mono text-xs text-gray-800 truncate">{item.input}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="mt-16 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <h2 className="text-3xl font-bold text-black mb-6">How Base64 Encoding Works</h2>
                <div className="prose prose-gray max-w-none text-gray-800 space-y-4">
                    <p>
                        Base64 encoding is an ingenious method used to represent binary data in an ASCII string format. The term "Base64" originates from a specific MIME content transfer encoding. It is highly prevalent on the World Wide Web and is the standard for transferring data such as images or files within scripts, HTML, or email protocols.
                    </p>
                    <p>
                        At its core, Base64 takes binary data (which consists of 8-bit bytes) and translates it into a 6-bit representation. Since 2 to the power of 6 equals 64, this 6-bit data can be represented by 64 distinct characters. The standard Base64 alphabet includes uppercase letters (A-Z), lowercase letters (a-z), numbers (0-9), and two additional characters: the plus sign (+) and the forward slash (/). The equals sign (=) is also used for padding at the end of the encoded string.
                    </p>
                    <h3 className="text-xl font-semibold text-black mt-6 mb-3">The Encoding Process</h3>
                    <p>
                        The encoding process begins by dividing the binary input into groups of 24 bits (which equals three 8-bit bytes). These 24 bits are then divided into four 6-bit chunks. Each of these 6-bit chunks corresponds to a numerical value between 0 and 63. This numerical value is then mapped to a specific character in the Base64 alphabet.
                    </p>
                    <p>
                        If the input data is not a multiple of 3 bytes, it requires padding. If there is only one byte of input, two padding characters (==) are appended to the output. If there are two bytes of input, one padding character (=) is appended. This ensures that the encoded output always has a length that is a multiple of 4, which is crucial for proper decoding.
                    </p>
                    <h3 className="text-xl font-semibold text-black mt-6 mb-3">Why Use Base64?</h3>
                    <p>
                        You might wonder why we need to encode data in the first place. The primary reason is that many communication protocols, such as SMTP (for email), were originally designed to handle only text data. When you try to send binary data (like an image or a PDF attachment) over these protocols, some bytes might be interpreted as control characters, leading to data corruption.
                    </p>
                    <p>
                        By encoding the binary data into Base64, you guarantee that the data consists entirely of safe, printable ASCII characters. This ensures that the data reaches its destination intact, without any unintended modifications during transit. It's a fundamental bridge between the binary world of computers and the text-based nature of legacy communication protocols.
                    </p>
                    <h3 className="text-xl font-semibold text-black mt-6 mb-3">Decoding Back to Original Data</h3>
                    <p>
                        Decoding Base64 is simply the reverse of the encoding process. The decoder takes groups of four Base64 characters and maps them back to their corresponding 6-bit values. These 6-bit values are then combined into a 24-bit representation, which is finally split back into three 8-bit bytes. Any padding characters (=) at the end are ignored, indicating the end of the data.
                    </p>
                    <p>
                        Our tool streamlines this entire process, allowing you to instantly convert between raw text and Base64 format locally in your browser. This guarantees your data remains private and secure, without relying on external servers to process your sensitive information.
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
                                title="Base64 Tutorial Video"
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

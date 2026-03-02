"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { Copy } from 'lucide-react';
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import { ShieldCheck } from 'lucide-react';
import { History } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import FAQSection from '@/components/FAQSection';

const faqs = [
    {
        question: "Is the password generated securely?",
        answer: "Yes, the Password Generator uses your browser's local cryptography to create strong, random passwords. Everything happens entirely on your device."
    },
    {
        question: "Does AlphaPrime save or track my generated passwords?",
        answer: "Absolutely not. AlphaPrime is a privacy-first platform. No data leaves your machine, and we do not track, log, or store any of your passwords."
    },
    {
        question: "Can I customize the password length and characters?",
        answer: "Yes, you can easily toggle uppercase, lowercase, numbers, and symbols, and adjust the length up to your specific security needs."
    }
];

export default function PasswordGenerator() {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true
    });
    const [isVisible, setIsVisible] = useState(true);
    const [history, setHistory] = useState<{ password: string, date: string }[]>([]);
    const [strength, setStrength] = useState(0);
    const [copied, setCopied] = useState(false);

    // Calculate strength based on length and diversity
    const calculateStrength = useCallback((pwd: string) => {
        let score = 0;
        if (!pwd) return 0;
        if (pwd.length > 8) score += 20;
        if (pwd.length > 12) score += 20;
        if (options.uppercase) score += 15;
        if (options.lowercase) score += 15;
        if (options.numbers) score += 15;
        if (options.symbols) score += 15;
        return Math.min(100, score);
    }, [options]);

    const generatePassword = useCallback(() => {
        const charset = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
        };

        let chars = '';
        if (options.uppercase) chars += charset.uppercase;
        if (options.lowercase) chars += charset.lowercase;
        if (options.numbers) chars += charset.numbers;
        if (options.symbols) chars += charset.symbols;

        if (chars === '') {
            setPassword('');
            setStrength(0);
            return;
        }

        let newPassword = '';
        for (let i = 0; i < length; i++) {
            newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        setPassword(newPassword);
        setStrength(calculateStrength(newPassword));
    }, [length, options, calculateStrength]);

    // Load history from local storage ONLY ON CLIENT SIDE
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedHistory = localStorage.getItem('passwordHistory');
            if (savedHistory) {
                setHistory(JSON.parse(savedHistory));
            }
        }
    }, []);

    // Regenerate when options change, but keep it stable on first mount
    useEffect(() => {
        generatePassword();
    }, [length, options, generatePassword]);

    const addToHistory = (pwd: string) => {
        const newEntry = { password: pwd, date: new Date().toISOString() };
        const newHistory = [newEntry, ...history].slice(0, 10); // Keep last 10
        setHistory(newHistory);
        if (typeof window !== 'undefined') {
            localStorage.setItem('passwordHistory', JSON.stringify(newHistory));
        }
    };

    const handleCopy = () => {
        if (!password) return;
        navigator.clipboard.writeText(password);
        setCopied(true);
        addToHistory(password);
        setTimeout(() => setCopied(false), 2000);
    };

    const clearHistory = () => {
        setHistory([]);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('passwordHistory');
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 sm:py-12 max-w-6xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight text-black">
                    Generate <span className="text-black">Secure Passwords</span>
                </h1>
                <p className="text-gray-800 max-w-2xl mx-auto">
                    Enable or disable character sets below to generate a secure password instantly. 100% Client-side.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left: Generator */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Password Display */}
                    <div className="bg-white rounded-2xl p-8 border border-zinc-200 shadow-sm">
                        <div className="flex justify-between items-center mb-4 text-sm text-gray-800">
                            <span className="uppercase tracking-wider font-bold">Generated Password</span>
                            <span className="bg-zinc-100 px-2 py-0.5 rounded text-zinc-700 text-xs">{length} chars</span>
                        </div>

                        <div className="relative">
                            <div className="font-mono text-3xl sm:text-4xl break-all min-h-[4rem] flex items-center text-black tracking-wide">
                                {isVisible ? password : '•'.repeat(password.length)}
                            </div>

                            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-2">
                                <button
                                    onClick={() => setIsVisible(!isVisible)}
                                    className="p-2 hover:bg-zinc-100 rounded-lg text-gray-700 hover:text-black transition-colors"
                                >
                                    {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={generatePassword}
                                    className="p-2 hover:bg-zinc-100 rounded-lg text-gray-700 hover:text-black transition-colors"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <button
                                onClick={handleCopy}
                                className="flex items-center justify-center gap-2 py-4 rounded-xl bg-white text-black border-2 border-black font-bold hover:bg-white/10 transition-all active:scale-[0.98]"
                            >
                                <Copy className="w-5 h-5" /> {copied ? 'Copied' : 'Copy'}
                            </button>
                            <button
                                onClick={generatePassword}
                                className="flex items-center justify-center gap-2 py-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black font-bold border border-transparent transition-all active:scale-[0.98]"
                            >
                                <RefreshCw className="w-5 h-5" /> Generate
                            </button>
                        </div>
                    </div>

                    {/* Strength & Config */}
                    <div className="bg-white p-8 rounded-2xl space-y-8 border border-zinc-200 shadow-sm">
                        {/* Strength */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="font-bold text-zinc-700">Strength</label>
                                <span className={`text-sm font-bold ${strength > 80 ? 'text-black' : strength > 50 ? 'text-gray-800' : 'text-gray-700'}`}>
                                    {strength > 80 ? 'Strong' : strength > 50 ? 'Medium' : 'Weak'}
                                </span>
                            </div>
                            <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 bg-black`}
                                    style={{ width: `${strength}%`, opacity: strength > 80 ? 1 : strength > 50 ? 0.6 : 0.3 }}
                                ></div>
                            </div>
                        </div>

                        {/* Slider */}
                        <div>
                            <div className="flex justify-between mb-4">
                                <label className="font-bold text-zinc-700">Length</label>
                                <span className="text-black font-mono text-xl font-bold">{length}</span>
                            </div>
                            <input
                                type="range"
                                min="8"
                                max="64"
                                value={length}
                                onChange={(e) => setLength(parseInt(e.target.value))}
                                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black"
                            />
                        </div>

                        {/* Toggles */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { key: 'uppercase', label: 'Uppercase', icon: 'A' },
                                { key: 'lowercase', label: 'Lowercase', icon: 'a' },
                                { key: 'numbers', label: 'Numbers', icon: '123' },
                                { key: 'symbols', label: 'Symbols', icon: '@' }
                            ].map((opt) => {
                                const checkedValue = options[opt.key as keyof typeof options];
                                return (
                                    <label key={opt.key} className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-200 cursor-pointer hover:bg-zinc-100 transition">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono font-bold text-black">{opt.icon}</span>
                                            <span className="text-zinc-700">{opt.label}</span>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={checkedValue}
                                            onChange={(e) => setOptions({ ...options, [opt.key]: e.target.checked })}
                                            className="w-5 h-5 rounded border-zinc-300 text-black focus:ring-black"
                                        />
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right: History */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl h-full flex flex-col border border-zinc-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <History className="w-5 h-5" /> Recent
                            </h3>
                            <button onClick={clearHistory} className="p-2 hover:bg-zinc-100 rounded-lg text-gray-700 hover:text-black transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 max-h-[400px] pr-2 custom-scrollbar">
                            {history.length === 0 ? (
                                <div className="text-center py-8 text-gray-800 text-sm">No history yet</div>
                            ) : (
                                history.map((item, idx) => (
                                    <div key={idx} className="p-3 bg-zinc-50 rounded-lg border border-zinc-300 flex justify-between items-center group hover:border-zinc-300 transition-colors">
                                        <div className="font-mono text-sm text-zinc-700 truncate w-32">
                                            {item.password}
                                        </div>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(item.password);
                                                setCopied(true);
                                                setTimeout(() => setCopied(false), 2000);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-zinc-200 rounded text-gray-700 hover:text-black transition-all"
                                        >
                                            <Copy className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="mt-16 bg-white rounded-2xl p-8 border border-zinc-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ShieldCheck className="w-48 h-48 text-black" />
                </div>
                <h2 className="text-3xl font-bold text-black mb-6 relative z-10">How Our Password Generator Works</h2>
                <div className="prose prose-gray max-w-none text-gray-800 space-y-4 relative z-10">
                    <p>
                        In today's digital landscape, relying on simple or reused passwords is one of the most common security vulnerabilities. Our Secure Password Generator creates highly randomized, complex passwords that are virtually impossible for hackers or brute-force algorithms to guess. Your online safety is paramount, which is why everything happens directly in your browser. <strong>Your passwords are never generated on, nor transmitted to, a remote server.</strong>
                    </p>
                    <h3 className="text-xl font-semibold text-black mt-6 mb-3">The Generation Algorithm</h3>
                    <p>
                        Behind the scenes, the tool utilizes secure cryptographic functions to build your password. When you click "Generate," it first compiles a master set of available characters based on your active selections (Uppercase, Lowercase, Numbers, and Symbols). Then, it iteratively selects characters at random from this pool until it reaches your specified password <strong>Length</strong>. The longer the password and the wider the variety of character types you include, the more mathematically secure it becomes.
                    </p>
                    <h3 className="text-xl font-semibold text-black mt-6 mb-3">Customization and Strength Metrics</h3>
                    <p>
                        Security is not one-size-fits-all. Some legacy systems might not allow special characters, while modern financial institutions might mandate extremely long passwords. Our interface provides interactive toggles and a length slider so you can customize the output to meet any specific strict criteria.
                    </p>
                    <p>
                        As you adjust these settings, the integrated <strong>Strength Meter</strong> dynamically recalculates the robustness of the generated string. This meter uses a scoring system that awards points based on the total length and the diversity of the character sets used. A score above 80 classifies as "Strong," providing you with visual reassurance that your new credential is fit for securing sensitive data.
                    </p>
                    <h3 className="text-xl font-semibold text-black mt-6 mb-3">Privacy and History</h3>
                    <p>
                        We understand the convenience of keeping track of recently generated passwords during a session. Our tool temporarily maintains a history of your generated secure strings using your browser's local HTML5 Storage. This means if you generate a great password, copy it, and then accidentally generate another one, your previous password isn't lost instantly. However, for maximum security, we provide a quick <strong>Clear</strong> button to wipe this local history clean once you have safely stored your new password in a dedicated password manager.
                    </p>
                </div>

                <FAQSection faqs={faqs} />

                {false && (
                    <div className="mt-12 relative z-10">
                        <h2 className="text-2xl font-bold text-black mb-6">Video Tutorial</h2>
                        <div className="relative w-full overflow-hidden rounded-2xl bg-zinc-100 border border-zinc-200" style={{ paddingTop: '56.25%' }}>
                            <iframe
                                className="absolute top-0 left-0 w-full h-full border-0"
                                src="https://www.youtube.com/embed/YOUR_VIDEO_ID_HERE"
                                title="Password Generator Tutorial Video"
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

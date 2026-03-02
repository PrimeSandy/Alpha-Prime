"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Copy, RefreshCw, Palette, Layers, Contrast, Droplet, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import FAQSection from '@/components/FAQSection';

const faqs = [
    {
        question: "How do I use the color gradient generator?",
        answer: "Select your starting and ending colors, then adjust the angle slider. The tool will automatically generate the corresponding CSS code for you to copy and paste into your project."
    },
    {
        question: "Is the color contrast checker accurate for accessibility testing?",
        answer: "Yes, our contrast checker uses the official WCAG (Web Content Accessibility Guidelines) formula to calculate the exact contrast ratio between your text and background colors."
    },
    {
        question: "Can I generate a full color palette from a single hex code?",
        answer: "Absolutely. Simply enter your base hex color in the Palette tab, and the tool will instantly generate a harmonious range of lighter tints and darker shades."
    }
];

// Utility Functions
const hexToRgb = (hex: string) => {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const num = parseInt(hex, 16);
    return [num >> 16, (num >> 8) & 255, num & 255];
};

const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
};

const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

const hslToRgb = (h: number, s: number, l: number) => {
    s /= 100; l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
};

const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

export default function ColorTools() {
    const [activeTab, setActiveTab] = useState('converter');

    // Converter State
    const [convHex, setConvHex] = useState('#3B82F6');
    const [convRgb, setConvRgb] = useState('59, 130, 246');
    const [convHsl, setConvHsl] = useState('217, 91%, 60%');

    // Picker State
    const [pickerHex, setPickerHex] = useState('#10B981');
    const [pickerValues, setPickerValues] = useState({ rgb: '', hsl: '', cmyk: '' });
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Gradient State
    const [gradC1, setGradC1] = useState('#8B5CF6');
    const [gradC2, setGradC2] = useState('#3B82F6');
    const [gradAngle, setGradAngle] = useState(90);

    // Contrast State
    const [contrastFg, setContrastFg] = useState('#FFFFFF');
    const [contrastBg, setContrastBg] = useState('#3B82F6');
    const [contrastRatio, setContrastRatio] = useState(4.5);

    // Palette State
    const [paletteBase, setPaletteBase] = useState('#6366F1');
    const [shades, setShades] = useState<string[]>([]);
    const [tints, setTints] = useState<string[]>([]);

    // --- Converter Logic ---
    const updateConverter = (val: string, type: 'hex' | 'rgb') => {
        let r, g, b, hexStr = '';
        if (type === 'hex') {
            hexStr = val;
            if (!/^#[0-9A-Fa-f]{6}$/.test(hexStr) && !/^[0-9A-Fa-f]{6}$/.test(hexStr)) return;
            if (!hexStr.startsWith('#')) hexStr = '#' + hexStr;
            [r, g, b] = hexToRgb(hexStr);
        } else if (type === 'rgb') {
            const parts = val.split(',').map(n => parseInt(n.trim()));
            if (parts.length !== 3 || parts.some(isNaN)) return;
            [r, g, b] = parts;
            hexStr = rgbToHex(r, g, b);
        } else {
            return;
        }

        setConvHex(hexStr);
        setConvRgb(`${r}, ${g}, ${b}`);
        const [h, s, l] = rgbToHsl(r, g, b);
        setConvHsl(`${h}, ${s}%, ${l}%`);
    };

    // --- Picker Logic ---
    const drawColorWheel = useCallback((canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = width / 2;

        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const dx = x - centerX;
                const dy = y - centerY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist <= radius) {
                    const angle = Math.atan2(dy, dx);
                    const hue = (angle + Math.PI) / (Math.PI * 2) * 360;
                    const sat = (dist / radius) * 100;
                    const [r, g, b] = hslToRgb(hue, sat, 50);

                    const index = (y * width + x) * 4;
                    data[index] = r;
                    data[index + 1] = g;
                    data[index + 2] = b;
                    data[index + 3] = 255;
                }
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }, []);

    useEffect(() => {
        if (activeTab === 'picker' && canvasRef.current) {
            drawColorWheel(canvasRef.current);
        }
    }, [activeTab, drawColorWheel]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = canvasRef.current.width / 2;
        const centerY = canvasRef.current.height / 2;

        const angle = Math.atan2(y - centerY, x - centerX);
        const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        const maxDist = canvasRef.current.width / 2;

        if (dist > maxDist) return;

        const hue = ((angle + Math.PI) / (Math.PI * 2) * 360);
        const sat = Math.min(100, (dist / maxDist) * 100);

        const [r, g, b] = hslToRgb(hue, sat, 50);
        const hex = rgbToHex(r, g, b);

        setPickerHex(hex.toUpperCase());

        // Update stats
        let c = 1 - (r / 255), m = 1 - (g / 255), kVar = 1 - (b / 255), k = Math.min(c, m, kVar);
        c = Math.round(((c - k) / (1 - k)) * 100) || 0;
        m = Math.round(((m - k) / (1 - k)) * 100) || 0;
        kVar = Math.round(((kVar - k) / (1 - k)) * 100) || 0; // Y
        k = Math.round(k * 100);

        setPickerValues({
            rgb: `${r}, ${g}, ${b}`,
            hsl: `${Math.round(hue)}°, ${Math.round(sat)}%, 50%`,
            cmyk: `${c}%, ${m}%, ${kVar}%, ${k}%`
        });
    };

    // --- Contrast Logic ---
    useEffect(() => {
        const calculateContrast = () => {
            const c1 = contrastFg.startsWith('#') ? contrastFg : '#' + contrastFg;
            const c2 = contrastBg.startsWith('#') ? contrastBg : '#' + contrastBg;

            if (/^#[0-9A-Fa-f]{6}$/.test(c1) && /^#[0-9A-Fa-f]{6}$/.test(c2)) {
                const lum1 = getLuminance(...hexToRgb(c1) as [number, number, number]);
                const lum2 = getLuminance(...hexToRgb(c2) as [number, number, number]);
                const bright = Math.max(lum1, lum2);
                const dark = Math.min(lum1, lum2);
                setContrastRatio((bright + 0.05) / (dark + 0.05));
            }
        };
        calculateContrast();
    }, [contrastFg, contrastBg]);

    // --- Palette Logic ---
    const generatePalette = useCallback((hexStr: string) => {
        if (!hexStr.startsWith('#')) hexStr = '#' + hexStr;
        if (!/^#[0-9A-Fa-f]{6}$/.test(hexStr)) return;

        const [r, g, b] = hexToRgb(hexStr);
        const [h, s, l] = rgbToHsl(r, g, b);

        const newShades = [];
        for (let i = 0; i < 10; i++) {
            const newL = Math.max(0, l - ((i + 1) * (l / 11)));
            const [nR, nG, nB] = hslToRgb(h, s, newL);
            newShades.push(rgbToHex(nR, nG, nB));
        }
        setShades(newShades);

        const newTints = [];
        for (let i = 0; i < 10; i++) {
            const newL = Math.min(100, l + ((i + 1) * ((100 - l) / 11)));
            const [nR, nG, nB] = hslToRgb(h, s, newL);
            newTints.push(rgbToHex(nR, nG, nB));
        }
        setTints(newTints);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => generatePalette(paletteBase), 0);
        return () => clearTimeout(timer);
    }, [paletteBase, generatePalette]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Ideally show toast
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight">
                    Master Colors
                </h1>
                <p className="text-gray-800 max-w-2xl mx-auto">
                    Convert, generate, and analyze colors directly in your browser.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 bg-zinc-100 p-2 rounded-2xl w-fit mx-auto border border-zinc-200">
                {[
                    { id: 'converter', icon: RefreshCw, label: 'Converter' },
                    { id: 'picker', icon: Droplet, label: 'Picker' },
                    { id: 'gradient', icon: Layers, label: 'Gradient' },
                    { id: 'contrast', icon: Contrast, label: 'Contrast' },
                    { id: 'palette', icon: Palette, label: 'Palette' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                            ? 'bg-white text-black shadow-sm ring-1 ring-zinc-200'
                            : 'text-gray-800 hover:text-black hover:bg-zinc-200/50'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Container */}
            <div className="bg-white rounded-3xl p-6 md:p-10 border border-zinc-200 shadow-sm min-h-[500px]">

                {/* Converter */}
                {activeTab === 'converter' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        <div className="flex flex-col items-center justify-center">
                            <div
                                className="w-full h-48 rounded-2xl shadow-inner mb-4 border border-zinc-200 transition-colors duration-300"
                                style={{ backgroundColor: convHex }}
                            />
                            <div className="relative w-full">
                                <input
                                    type="color"
                                    value={convHex}
                                    onChange={(e) => updateConverter(e.target.value, 'hex')}
                                    className="w-full h-12 rounded-xl cursor-pointer opacity-0 absolute inset-0 z-10"
                                />
                                <button className="w-full py-2 text-xs text-gray-800 hover:text-black underline">
                                    Click preview to pick color
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {[
                                { label: 'HEX', value: convHex, onChange: (e: React.ChangeEvent<HTMLInputElement>) => updateConverter(e.target.value, 'hex') },
                                { label: 'RGB', value: convRgb, onChange: (e: React.ChangeEvent<HTMLInputElement>) => updateConverter(e.target.value, 'rgb') },
                                { label: 'HSL', value: convHsl, readOnly: true }
                            ].map((field) => (
                                <div key={field.label}>
                                    <label className="text-xs font-bold text-gray-800 uppercase mb-2 block">{field.label}</label>
                                    <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-xl px-4 transition-all focus-within:ring-2 focus-within:ring-zinc-500/20 focus-within:border-zinc-500">
                                        <input
                                            type="text"
                                            value={field.value}
                                            onChange={field.onChange}
                                            readOnly={field.readOnly}
                                            className="flex-1 bg-transparent py-4 text-black font-mono focus:outline-none w-full min-w-0 text-lg"
                                        />
                                        <button
                                            onClick={() => copyToClipboard(field.value)}
                                            className="p-2 ml-2 hover:bg-zinc-200 rounded-lg text-gray-700 transition-colors"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Picker */}
                {activeTab === 'picker' && (
                    <div className="flex flex-col md:flex-row gap-12 items-center justify-center animate-in fade-in duration-300">
                        <canvas
                            ref={canvasRef}
                            width={300}
                            height={300}
                            onClick={handleCanvasClick}
                            className="cursor-crosshair rounded-full shadow-lg border-4 border-white"
                        />
                        <div className="flex-1 w-full max-w-sm space-y-6">
                            <div className="flex items-center gap-6 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
                                <div
                                    className="w-20 h-20 rounded-xl shadow-inner border border-zinc-200"
                                    style={{ backgroundColor: pickerHex }}
                                />
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-gray-800 uppercase mb-1">Selected Color</label>
                                    <div className="text-3xl font-mono text-black font-bold tracking-wider">
                                        {pickerHex}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {Object.entries(pickerValues).map(([label, value]) => value && (
                                    <div
                                        key={label}
                                        onClick={() => copyToClipboard(value)}
                                        className="flex justify-between items-center bg-black p-3 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors group"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-800 uppercase">{label}</span>
                                            <span className="font-mono text-zinc-100 text-sm break-all">{value}</span>
                                        </div>
                                        <Copy className="w-4 h-4 text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Gradient */}
                {activeTab === 'gradient' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
                        <div
                            className="w-full h-64 lg:h-auto rounded-2xl border border-zinc-200 shadow-sm flex items-center justify-center transition-all duration-300"
                            style={{ background: `linear-gradient(${gradAngle}deg, ${gradC1}, ${gradC2})` }}
                        >
                            <p className="font-bold text-white/50 text-2xl uppercase tracking-widest mix-blend-overlay">Preview</p>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Start Color', val: gradC1, set: setGradC1 },
                                    { label: 'End Color', val: gradC2, set: setGradC2 }
                                ].map((c, i) => (
                                    <div key={i} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                                        <label className="text-xs font-bold text-gray-800 uppercase mb-2 block">{c.label}</label>
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-zinc-200">
                                                <input
                                                    type="color"
                                                    value={c.val}
                                                    onChange={(e) => c.set(e.target.value)}
                                                    className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                value={c.val}
                                                onChange={(e) => c.set(e.target.value)}
                                                className="flex-1 bg-transparent border-none text-sm font-mono text-black focus:outline-none uppercase"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <label className="font-bold text-gray-800 text-sm flex justify-between">
                                    <span>Direction</span>
                                    <span className="font-mono text-black">{gradAngle}deg</span>
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="360"
                                    value={gradAngle}
                                    onChange={(e) => setGradAngle(Number(e.target.value))}
                                    className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                                />
                            </div>

                            <div className="pt-4">
                                <label className="font-bold text-gray-800 text-sm mb-2 block">CSS Code</label>
                                <div className="relative group">
                                    <code className="block w-full bg-white/10 p-4 rounded-xl text-xs sm:text-sm font-mono text-zinc-700 break-all border border-zinc-200">
                                        background: linear-gradient({gradAngle}deg, {gradC1}, {gradC2});
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(`background: linear-gradient(${gradAngle}deg, ${gradC1}, ${gradC2});`)}
                                        className="absolute top-2 right-2 p-2 hover:bg-zinc-200 rounded-lg text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contrast */}
                {activeTab === 'contrast' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start animate-in fade-in duration-300">
                        <div className="space-y-6">
                            {[
                                { label: 'Text Color', val: contrastFg, set: setContrastFg },
                                { label: 'Background', val: contrastBg, set: setContrastBg }
                            ].map((c, i) => (
                                <div key={i}>
                                    <label className="text-sm font-bold text-gray-800 mb-2 block">{c.label}</label>
                                    <div className="flex gap-2">
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-zinc-200">
                                            <input
                                                type="color"
                                                value={c.val}
                                                onChange={(e) => c.set(e.target.value)}
                                                className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0"
                                            />
                                        </div>
                                        <div className="flex-1 flex items-center bg-zinc-50 border border-zinc-200 rounded-xl px-4">
                                            <input
                                                type="text"
                                                value={c.val}
                                                onChange={(e) => c.set(e.target.value)}
                                                className="flex-1 bg-transparent border-none py-2 font-mono uppercase text-black focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-gray-800">Contrast Ratio</span>
                                    <span className={`text-4xl font-bold ${contrastRatio >= 4.5 ? 'text-black' : 'text-gray-800'}`}>
                                        {contrastRatio.toFixed(2)}:1
                                    </span>
                                </div>
                                <div className={`text-sm font-bold ${contrastRatio >= 4.5 ? 'text-black' : 'text-gray-800'}`}>
                                    {contrastRatio >= 7 ? 'Excellent (AAA)' : contrastRatio >= 4.5 ? 'Good (AA)' : 'Poor'}
                                </div>
                            </div>
                        </div>

                        <div
                            className="h-full min-h-[300px] rounded-2xl border border-zinc-200 flex flex-col justify-center items-center p-8 text-center transition-all duration-300"
                            style={{ backgroundColor: contrastBg, color: contrastFg }}
                        >
                            <h2 className="text-3xl font-bold mb-4">Sample Headline</h2>
                            <p className="text-lg max-w-sm mb-8 opacity-90">
                                This is how your text looks against the background. Ensure it&apos;s readable for everyone.
                            </p>

                            <div className="flex gap-8 text-xs font-bold opacity-80">
                                <div className="flex flex-col items-center gap-1">
                                    {contrastRatio >= 4.5
                                        ? <CheckCircle className="w-6 h-6" />
                                        : <AlertCircle className="w-6 h-6" />
                                    }
                                    <span>AA Normal</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    {contrastRatio >= 7
                                        ? <CheckCircle className="w-6 h-6" />
                                        : <AlertCircle className="w-6 h-6" />
                                    }
                                    <span>AAA Normal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Palette */}
                {activeTab === 'palette' && (
                    <div className="animate-in fade-in duration-300 max-w-4xl mx-auto">
                        <div className="mb-12">
                            <label className="text-sm font-bold text-gray-800 mb-2 block">Base Color</label>
                            <div className="flex gap-2">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-zinc-200">
                                    <input
                                        type="color"
                                        value={paletteBase}
                                        onChange={(e) => setPaletteBase(e.target.value)}
                                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0"
                                    />
                                </div>
                                <div className="flex-1 flex items-center bg-zinc-50 border border-zinc-200 rounded-xl px-4">
                                    <input
                                        type="text"
                                        value={paletteBase}
                                        onChange={(e) => setPaletteBase(e.target.value)}
                                        className="flex-1 bg-transparent border-none py-2 font-mono uppercase text-black focus:outline-none text-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div>
                                <h4 className="text-xs font-bold text-gray-800 uppercase mb-3 flex items-center gap-2">
                                    <ArrowRight className="w-3 h-3" /> Shades (Darker)
                                </h4>
                                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                                    {shades.map((color, i) => (
                                        <div
                                            key={i}
                                            onClick={() => copyToClipboard(color)}
                                            className="group relative aspect-square rounded-xl cursor-pointer shadow-sm hover:scale-105 transition-transform"
                                            style={{ backgroundColor: color }}
                                        >
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Copy className="w-4 h-4 text-white drop-shadow-md" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-gray-800 uppercase mb-3 flex items-center gap-2">
                                    <ArrowRight className="w-3 h-3" /> Tints (Lighter)
                                </h4>
                                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                                    {tints.map((color, i) => (
                                        <div
                                            key={i}
                                            onClick={() => copyToClipboard(color)}
                                            className="group relative aspect-square rounded-xl cursor-pointer shadow-sm hover:scale-105 transition-transform"
                                            style={{ backgroundColor: color }}
                                        >
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Copy className="w-4 h-4 text-black drop-shadow-md" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* How It Works Section */}
            <div className="mt-16 bg-white rounded-2xl p-8 border border-zinc-200 shadow-sm">
                <h2 className="text-3xl font-bold text-black mb-6">How Your Color Tools Work</h2>
                <div className="prose prose-gray max-w-none text-gray-800 space-y-4">
                    <p>
                        Our comprehensive Color Tools suite provides everything a designer or developer needs to manage, convert, and analyze colors efficiently. Rather than using multiple separate applications, we&apos;ve bundled a Converter, Picker, Gradient Generator, Contrast Checker, and Palette Generator into one seamless interface. Best of all, all calculations are performed locally in your browser, ensuring instantaneous results.
                    </p>
                    <p>
                        Let&apos;s explore how each of these powerful features works to enhance your design workflow:
                    </p>
                    <h3 className="text-xl font-semibold text-black mt-6 mb-3">Color Converter</h3>
                    <p>
                        The Color Converter allows you to seamlessly translate colors between HEX, RGB, and HSL formats. When you enter a color in one format, our algorithm instantly calculates its equivalent in the other formats. This is achieved through complex mathematical conversions. For instance, converting RGB to HSL involves finding the maximum and minimum values among the red, green, and blue channels to determine the color&apos;s lightness and saturation, while the hue is calculated based on which channel is dominant.
                    </p>
                    <h3 className="text-xl font-semibold text-black mt-6 mb-3">Interactive Picker</h3>
                    <p>
                        Our visual Color Picker uses an HTML5 Canvas to render a full color wheel. When you click anywhere on the canvas, the tool calculates the exact position of your cursor relative to the center of the wheel. The angle determines the hue (from 0 to 360 degrees), while the distance from the center dictates the saturation. This interactive approach provides a highly intuitive way to discover and fine-tune exactly the shade you&apos;re looking for.
                    </p>
                    <h3 className="text-xl font-semibold text-black mt-6 mb-3">Gradient & Contrast Checkers</h3>
                    <p>
                        The Gradient Generator lets you blend two colors fluidly and adjust their angle, automatically generating the CSS code required to implement it on your website. Meanwhile, the Contrast Checker is an essential accessibility tool. It uses the WCAG (Web Content Accessibility Guidelines) relative luminance formula to determine if there is sufficient contrast between your text and background colors. It ensures your designs are readable by everyone, calculating a ratio from 1:1 (no contrast) up to 21:1 (maximum contrast). A ratio of 4.5:1 or higher is generally recommended for normal text.
                    </p>
                    <h3 className="text-xl font-semibold text-black mt-6 mb-3">Palette Generator</h3>
                    <p>
                        Finally, our Palette Generator takes a single base color and automatically creates a harmonious set of shades (darker variants) and tints (lighter variants). It does this by fixing the hue and saturation while incrementally adjusting the lightness value in the HSL color space. This makes building a cohesive, aesthetically pleasing design system effortless.
                    </p>
                </div>

                <FAQSection faqs={faqs} />

                {false && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-black mb-6">Video Tutorial</h2>
                        <div className="relative w-full overflow-hidden rounded-2xl bg-zinc-100" style={{ paddingTop: '56.25%' }}>
                            <iframe
                                className="absolute top-0 left-0 w-full h-full border-0"
                                src="https://www.youtube.com/embed/YOUR_VIDEO_ID_HERE"
                                title="Color Tools Tutorial Video"
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

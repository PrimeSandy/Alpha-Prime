"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { X } from 'lucide-react';
import { Download } from 'lucide-react';
import { Image as ImageIcon } from 'lucide-react';
import { Settings } from 'lucide-react';
import { Check } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { Info } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import FAQSection from '@/components/FAQSection';

const PRESETS = [
    { label: 'Instagram Square (1080x1080)', width: 1080, height: 1080 },
    { label: 'Instagram Portrait (1080x1350)', width: 1080, height: 1350 },
    { label: 'Facebook / Twitter Post (1200x630)', width: 1200, height: 630 },
    { label: 'YouTube Thumbnail (1280x720)', width: 1280, height: 720 },
    { label: 'Standard HD 720p (1280x720)', width: 1280, height: 720 },
    { label: 'Full HD 1080p (1920x1080)', width: 1920, height: 1080 },
    { label: '4K UHD (3840x2160)', width: 3840, height: 2160 },
];

const faqs = [
    {
        question: "Are my images uploaded to a server for resizing?",
        answer: "No. AlphaPrime processes all image resizing and compression locally within your browser. Your files never leave your device, ensuring 100% privacy."
    },
    {
        question: "Will resizing reduce the quality of my image?",
        answer: "Our tool uses smart algorithms that significantly reduce file size (up to 80%) while maintaining excellent visual quality."
    },
    {
        question: "What image formats are supported?",
        answer: "You can effortlessly resize and compress popular formats including JPG, PNG, and WEBP (max 10MB)."
    }
];

export default function ImageResizer() {
    const [images, setImages] = useState<any[]>([]);
    const [mode, setMode] = useState<'compress' | 'resize'>('compress');
    const [quality, setQuality] = useState(80);
    const [outputFormat, setOutputFormat] = useState('original');
    const [maxWidth, setMaxWidth] = useState(1920);

    // Resize specific
    const [resizeMode, setResizeMode] = useState('custom'); // 'custom', 'preset', 'percentage'
    const [resizeWidth, setResizeWidth] = useState(800);
    const [resizeHeight, setResizeHeight] = useState(600);
    const [maintainAspect, setMaintainAspect] = useState(true);
    const [resizePercentage, setResizePercentage] = useState(50);
    const [presetSize, setPresetSize] = useState(PRESETS[0]);

    // Toast state
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const [processing, setProcessing] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [progress, setProgress] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [processedCount, setProcessedCount] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            addImages(files);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        addImages(files);
    };

    const addImages = (files: File[]) => {
        const newImages = files.map(file => ({
            id: Date.now() + Math.random(),
            file,
            preview: URL.createObjectURL(file), // Create object URL
            name: file.name,
            size: file.size,
            status: 'pending', // pending, processing, done, error
            resultBlob: null,
            resultUrl: null,
            resultSize: 0
        }));
        setImages(prev => [...prev, ...newImages]);
        showToast(`${newImages.length} image(s) added successfully`, 'success');
    };

    const removeImage = (id: number) => {
        setImages(prev => {
            const newImages = prev.filter(img => img.id !== id);
            // Revoke object URLs to avoid memory leaks
            const removed = prev.find(img => img.id === id);
            if (removed) {
                URL.revokeObjectURL(removed.preview);
                if (removed.resultUrl) URL.revokeObjectURL(removed.resultUrl);
            }
            return newImages;
        });
        showToast('Image removed', 'info');
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const clearAll = () => {
        images.forEach(img => {
            URL.revokeObjectURL(img.preview);
            if (img.resultUrl) URL.revokeObjectURL(img.resultUrl);
        });
        setImages([]);
        setProcessedCount(0);
        setProgress(0);
    };

    // Cleanup object URLs when component unmounts
    useEffect(() => {
        return () => {
            images.forEach(img => {
                URL.revokeObjectURL(img.preview);
                if (img.resultUrl) URL.revokeObjectURL(img.resultUrl);
            });
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const getOutputFormat = (originalType: string) => {
        if (outputFormat === 'original') return originalType;
        if (outputFormat === 'jpeg') return 'image/jpeg';
        if (outputFormat === 'png') return 'image/png';
        if (outputFormat === 'webp') return 'image/webp';
        return originalType;
    };

    const processImage = async (img: { preview: string, file: { type: string, name: string } }): Promise<{ blob: Blob, url: string, size: number }> => {
        return new Promise((resolve, reject) => {
            const imgElement = new Image();
            imgElement.src = img.preview;
            imgElement.onload = () => {
                const canvas = document.createElement('canvas');
                let width = imgElement.width;
                let height = imgElement.height;

                if (mode === 'compress') {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else if (mode === 'resize') {
                    if (resizeMode === 'custom') {
                        if (maintainAspect) {
                            const ratio = width / height;
                            width = Number(resizeWidth);
                            height = Math.round(width / ratio);
                        } else {
                            width = Number(resizeWidth);
                            height = Number(resizeHeight);
                        }
                    } else if (resizeMode === 'preset') {
                        if (maintainAspect) {
                            const targetRatio = presetSize.width / presetSize.height;
                            const imgRatio = width / height;
                            if (imgRatio > targetRatio) {
                                // Image is wider than preset box
                                width = presetSize.width;
                                height = Math.round(width / imgRatio);
                            } else {
                                // Image is taller
                                height = presetSize.height;
                                width = Math.round(height * imgRatio);
                            }
                        } else {
                            width = presetSize.width;
                            height = presetSize.height;
                        }
                    } else if (resizeMode === 'percentage') {
                        width = Math.round(width * (resizePercentage / 100));
                        height = Math.round(height * (resizePercentage / 100));
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(imgElement, 0, 0, width, height);
                }

                const type = getOutputFormat(img.file.type);
                const q = mode === 'compress' ? quality / 100 : 0.92;

                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Canvas to Blob failed'));
                        return;
                    }
                    resolve({
                        blob,
                        url: URL.createObjectURL(blob), // Create new object URL for result
                        size: blob.size
                    });
                }, type, q);
            };
            imgElement.onerror = (e) => reject(e);
        });
    };

    const processAll = async () => {
        setProcessing(true);
        setProcessedCount(0);
        setProgress(0);

        const total = images.filter(img => img.status !== 'done').length;
        if (total === 0) {
            setProcessing(false);
            showToast('No pending images to process', 'info');
            return;
        }

        showToast(`Started processing ${total} image(s)...`, 'info');
        let current = 0;
        let errors = 0;

        const updatedImages = [...images];

        for (let i = 0; i < updatedImages.length; i++) {
            if (updatedImages[i].status === 'done') continue;

            try {
                updatedImages[i].status = 'processing';
                setImages([...updatedImages]);

                const result = await processImage(updatedImages[i]);

                updatedImages[i].resultBlob = result.blob;
                updatedImages[i].resultUrl = result.url;
                updatedImages[i].resultSize = result.size;
                updatedImages[i].status = 'done';

                current++;
                setProcessedCount(current);
                setProgress((current / total) * 100);
                setImages([...updatedImages]);
            } catch (error) {
                console.error("Processing failed", error);
                updatedImages[i].status = 'error';
                errors++;
                setImages([...updatedImages]);
            }
        }

        setProcessing(false);
        if (errors > 0) {
            showToast(`Completed with ${errors} error(s)`, 'error');
        } else {
            showToast(`Processing complete for ${current} image(s)`, 'success');
        }
    };

    const downloadImage = (img: { resultUrl: string, file: { name: string } }) => {
        if (!img.resultUrl) return;
        const link = document.createElement('a');
        link.href = img.resultUrl;

        const ext = outputFormat === 'original'
            ? img.file.name.split('.').pop()
            : outputFormat;

        const namePart = img.file.name.substring(0, img.file.name.lastIndexOf('.')) || img.file.name;
        link.download = `${namePart}_${mode === 'compress' ? 'compressed' : 'resized'}.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast(`Downloaded ${link.download}`, 'success');
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="container mx-auto px-4 py-6 sm:py-12 max-w-5xl relative">
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in duration-300 ${toast.type === 'success' ? 'bg-green-100 text-green-800 border-2 border-green-200' : toast.type === 'error' ? 'bg-red-100 text-red-800 border-2 border-red-200' : 'bg-slate-800 text-white border-2 border-slate-700'}`}>
                    {toast.type === 'success' ? <Check className="w-5 h-5 text-green-600" /> : toast.type === 'error' ? <AlertCircle className="w-5 h-5 text-red-600" /> : <Info className="w-5 h-5 text-slate-300" />}
                    <span className="font-bold text-sm tracking-wide">{toast.message}</span>
                </div>
            )}
            <div className="text-center mb-10">
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight text-black">
                    Smart Image <span className="text-black">Compression</span>
                </h1>
                <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                    Reduce file size by up to 80% while maintaining perfect quality. Fast, secure, and processing happens entirely on your device.
                </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex justify-center mb-10">
                <div className="bg-white p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200 shadow-sm">
                    <button
                        onClick={() => setMode('compress')}
                        className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${mode === 'compress' ? 'bg-white text-black border-2 border-black shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <Settings className="w-4 h-4" /> Compress
                    </button>
                    <button
                        onClick={() => setMode('resize')}
                        className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${mode === 'resize' ? 'bg-white text-black border-2 border-black shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <ImageIcon className="w-4 h-4" /> Resize
                    </button>
                </div>
            </div>

            {/* Drop Zone */}
            {images.length === 0 ? (
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white rounded-3xl border-2 border-dashed border-slate-300 p-10 md:p-16 text-center cursor-pointer transition-all duration-300 hover:border-black hover:bg-slate-50/50 mb-8 shadow-sm group"
                >
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <Upload className="w-10 h-10 text-black" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-black mb-2">Drag & Drop Images Here</h3>
                            <p className="text-slate-500">or click to browse from your device</p>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">Supports JPG, PNG, WEBP • Max 10MB</p>
                        <button className="mt-4 px-6 py-2.5 rounded-xl bg-white text-black border-2 border-black hover:opacity-80 transition-all font-medium">
                            Select Images
                        </button>
                    </div>
                </div>
            ) : null}

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
            />

            {images.length > 0 && (
                <div className="bg-white shadow-sm rounded-2xl p-6 md:p-8 mb-8 border border-slate-200">
                    {/* Settings */}
                    <div className="mb-8 border-b border-slate-200 pb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-black flex items-center gap-2">
                                <Settings className="w-5 h-5 text-black" />
                                {mode === 'compress' ? 'Compression Settings' : 'Resize Settings'}
                            </h3>
                            <button
                                onClick={processAll}
                                disabled={processing}
                                className="px-4 py-2 rounded-lg bg-white text-black border-2 border-black hover:opacity-80 text-sm font-bold shadow-lg shadow-slate-200/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Processing...' : (mode === 'compress' ? 'Compress All' : 'Resize All')}
                            </button>
                        </div>

                        {mode === 'compress' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-4 flex justify-between">
                                        <span>Image Quality</span>
                                        <span className="text-black font-bold">{quality}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="95"
                                        value={quality}
                                        onChange={(e) => setQuality(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-black"
                                    />
                                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                                        <span>Smaller Size</span>
                                        <span>Better Quality</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Output Format</label>
                                        <select
                                            value={outputFormat}
                                            onChange={(e) => setOutputFormat(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-black"
                                        >
                                            <option value="original">Keep Original</option>
                                            <option value="jpeg">JPEG</option>
                                            <option value="png">PNG</option>
                                            <option value="webp">WebP</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Max Width (px)</label>
                                        <input
                                            type="number"
                                            value={maxWidth}
                                            onChange={(e) => setMaxWidth(Number(e.target.value))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-black"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {mode === 'resize' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={() => setResizeMode('custom')}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${resizeMode === 'custom' ? 'bg-slate-100 border-black text-black' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                                    >
                                        <Settings className="w-5 h-5" />
                                        <span className="text-xs font-medium">Custom</span>
                                    </button>
                                    <button
                                        onClick={() => setResizeMode('preset')}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${resizeMode === 'preset' ? 'bg-slate-100 border-black text-black' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                                    >
                                        <ImageIcon className="w-5 h-5" />
                                        <span className="text-xs font-medium">Presets</span>
                                    </button>
                                    <button
                                        onClick={() => setResizeMode('percentage')}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${resizeMode === 'percentage' ? 'bg-slate-100 border-black text-black' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                                    >
                                        <span className="text-lg font-bold">%</span>
                                        <span className="text-xs font-medium">Percent</span>
                                    </button>
                                </div>

                                {resizeMode === 'custom' && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Width</label>
                                                <input type="number" value={resizeWidth} onChange={(e) => setResizeWidth(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:outline-none focus:border-black" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Height</label>
                                                <input type="number" value={resizeHeight} onChange={(e) => setResizeHeight(Number(e.target.value))} disabled={maintainAspect} className={`w-full border border-slate-200 rounded-xl px-4 py-2 flex text-slate-800 focus:outline-none focus:border-black ${maintainAspect ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-50'}`} />
                                            </div>
                                        </div>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={maintainAspect} onChange={(e) => setMaintainAspect(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-black focus:ring-black accent-black" />
                                            <span className="text-sm text-slate-700 font-medium">Maintain Aspect Ratio (Auto-calculate Height)</span>
                                        </label>
                                    </div>
                                )}

                                {resizeMode === 'preset' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Quick Presets</label>
                                            <select
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-black"
                                                value={JSON.stringify(presetSize)}
                                                onChange={(e) => setPresetSize(JSON.parse(e.target.value))}
                                            >
                                                {PRESETS.map((preset, i) => (
                                                    <option key={i} value={JSON.stringify(preset)}>{preset.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={maintainAspect} onChange={(e) => setMaintainAspect(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-black focus:ring-black accent-black" />
                                            <span className="text-sm text-slate-700 font-medium">Fit image inside preset dimensions (Maintain aspect ratio)</span>
                                        </label>
                                    </div>
                                )}

                                {resizeMode === 'percentage' && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-4 flex justify-between">
                                            <span>Resize Percentage</span>
                                            <span className="text-black font-bold">{resizePercentage}%</span>
                                        </label>
                                        <input type="range" min="10" max="200" value={resizePercentage} onChange={(e) => setResizePercentage(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-black" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Image List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {images.map(img => (
                            <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                                <div className="aspect-video relative overflow-hidden bg-slate-100">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={img.preview} alt={img.name} className="w-full h-full object-contain" />
                                    <button onClick={() => removeImage(img.id)} className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="p-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-xs font-medium text-slate-700 truncate max-w-[150px]">{img.name}</p>
                                        <span className="text-[10px] text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">{formatBytes(img.size)}</span>
                                    </div>
                                    {img.status === 'done' ? (
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                                                <Check className="w-3 h-3" /> Done ({formatBytes(img.resultSize)})
                                            </span>
                                            <button onClick={() => downloadImage(img)} className="p-1.5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : img.status === 'processing' ? (
                                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-3">
                                            <div className="h-full bg-black animate-pulse w-full"></div>
                                        </div>
                                    ) : (
                                        <div className="text-xs text-slate-400 mt-1 italic">Ready to process</div>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div
                            className="rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-4 hover:border-black hover:bg-slate-50/50 cursor-pointer transition-all h-[200px]"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="w-8 h-8 text-slate-400 mb-2" />
                            <span className="text-xs text-slate-500">Add more</span>
                        </div>
                    </div>
                </div>
            )}

            {/* How It Works Section */}
            <div className="mt-16 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ImageIcon className="w-48 h-48 text-black" />
                </div>
                <h2 className="text-3xl font-bold text-black mb-6 relative z-10">How Our Image Resizer Works</h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-4 relative z-10">
                    <p>
                        High-quality images are crucial for modern websites and presentations, but heavy file sizes can significantly slow down loading times and eat up bandwidth. Our Smart Image Compression and Resizing tool solves this problem by allowing you to shrink file sizes and alter dimensions without sacrificing visual fidelity. Most importantly, everything happens directly within your browser. Your images are never uploaded to our servers, ensuring absolute privacy and lightning-fast processing speeds.
                    </p>
                    <p>
                        We utilize the native power of the HTML5 <code>&lt;canvas&gt;</code> API to manipulate your images. Whether you are compressing a massive photograph or resizing a batch of icons, the process is streamlined into two distinct modes: Compress and Resize.
                    </p>
                    <h3 className="text-xl font-semibold text-black mt-6 mb-3">Compression Mode</h3>
                    <p>
                        In Compression Mode, the goal is to reduce the file size (bytes) while maintaining the original dimensions as much as possible. You have granular control over the &quot;Image Quality&quot; slider. Lowering the quality slightly can drastically reduce the file size&mdash;often by up to 80%&mdash;with changes that are nearly imperceptible to the human eye.
                    </p>
                    <p>
                        Additionally, you can choose an &quot;Output Format.&quot; If you upload a heavy PNG but don&apos;t need transparency, converting it to JPEG or the modern WebP format will yield massive savings in file size. You can also set a &quot;Max Width&quot; to ensure no image exceeds a certain size, preventing unnecessary pixel bloat for web use.
                    </p>
                    <h3 className="text-xl font-semibold text-black mt-6 mb-3">Resize Mode</h3>
                    <p>
                        Resize Mode is designed for when you need exact dimensions for a specific platform, like an Instagram post or a website header. We offer three flexible options:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Custom:</strong> Enter exact width and height values in pixels.</li>
                        <li><strong>Presets:</strong> Quickly select common resolutions using our built-in aspect ratios (coming soon).</li>
                        <li><strong>Percentage:</strong> Scale the image down by a specific ratio, such as 50% of its original size, which perfectly maintains the aspect ratio.</li>
                    </ul>
                    <h3 className="text-xl font-semibold text-black mt-6 mb-3">Batch Processing</h3>
                    <p>
                        Our tool is built for efficiency. You can drag and drop dozens of images at once and configure your settings. With a single click of &quot;Compress All&quot; or &quot;Resize All&quot;, the script loops through your images asynchronously, processing them one by one. You get real-time visual feedback via progress bars, and can download the optimized images individually as soon as they are ready.
                    </p>
                </div>

                <FAQSection faqs={faqs} />

                {false && (
                    <div className="mt-12 relative z-10">
                        <h2 className="text-2xl font-bold text-black mb-6">Video Tutorial</h2>
                        <div className="relative w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200" style={{ paddingTop: '56.25%' }}>
                            <iframe
                                className="absolute top-0 left-0 w-full h-full border-0"
                                src="https://www.youtube.com/embed/YOUR_VIDEO_ID_HERE"
                                title="Image Resizer Tutorial Video"
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

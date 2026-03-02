"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
    Search, FileText, Lock, Image as ImageIcon,
    Database, CaseUpper, FileJson, Palette, GitCompare,
    MessageSquare, Heart, ArrowUp, LockKeyhole
} from 'lucide-react';

// ─── Tool definitions ──────────────────────────────────────────────────
const tools = [
    {
        id: 'primelink', name: 'PrimeLink Chat',
        description: 'Secure 2-participant room-based private chat.',
        icon: MessageSquare, path: '/tools/primelink',
        category: 'Privacy', prime: true, uses: '3.1k uses',
    },
    {
        id: 'link-vault', name: 'Link Vault',
        description: 'Hide secret actions inside any HTTPS link with password protection.',
        icon: LockKeyhole, path: '/tools/link-vault',
        category: 'Privacy', prime: true, uses: '2.4k uses',
    },
    {
        id: 'online-compiler', name: 'Online Compiler',
        description: 'Compile and run Python, C++, JS, and more directly.',
        icon: FileJson, path: '/tools/online-compiler',
        category: 'Dev', prime: false, uses: '5.7k uses',
    },
    {
        id: 'image-resizer', name: 'Image Resizer',
        description: 'Resize and compress images without quality loss.',
        icon: ImageIcon, path: '/tools/image-resizer',
        category: 'Design', prime: false, uses: '4.2k uses',
    },
    {
        id: 'password-generator', name: 'Password Generator',
        description: 'Create ultra-secure random passwords locally.',
        icon: Lock, path: '/tools/password-generator',
        category: 'Privacy', prime: false, uses: '6.9k uses',
    },
    {
        id: 'diff-checker', name: 'Diff Checker',
        description: 'Compare text and code files side-by-side.',
        icon: GitCompare, path: '/tools/diff-checker',
        category: 'Dev', prime: false, uses: '891 uses',
    },
    {
        id: 'color-tools', name: 'Color Tools',
        description: 'Pickers, gradients, and palettes for designers.',
        icon: Palette, path: '/tools/color-tools',
        category: 'Design', prime: false, uses: '2.1k uses',
    },
    {
        id: 'case-converter', name: 'Case Converter',
        description: 'Convert text to uppercase, lowercase, title case and more.',
        icon: CaseUpper, path: '/tools/case-converter',
        category: 'Dev', prime: false, uses: '3.4k uses',
    },
    {
        id: 'word-counter', name: 'Word Counter',
        description: 'Analyze text length, density, and reading time instantly.',
        icon: FileText, path: '/tools/word-counter',
        category: 'Dev', prime: false, uses: '7.3k uses',
    },
    {
        id: 'base64', name: 'Base64 Converter',
        description: 'Encode and decode Base64 strings immediately.',
        icon: Database, path: '/tools/base64',
        category: 'Dev', prime: false, uses: '1.2k uses',
    },
];

const CATEGORIES = ['All', 'Dev', 'Privacy', 'Design'] as const;
type Category = typeof CATEGORIES[number];

// ─── Main Component ─────────────────────────────────────────────────────
export default function ToolSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<Category>('All');
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [showBackToTop, setShowBackToTop] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);

    // Load favorites from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('ap_favorites');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setTimeout(() => setFavorites(new Set(parsed)), 0);
            } catch {
                // ignore
            }
        }
    }, []);

    // Scroll watcher for Back-to-Top
    useEffect(() => {
        const handleScroll = () => setShowBackToTop(window.scrollY > 300);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Ctrl+K / Escape keyboard shortcut
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchRef.current?.focus();
                searchRef.current?.select();
            }
            if (e.key === 'Escape') {
                searchRef.current?.blur();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const toggleFavorite = useCallback((e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        setFavorites(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            try { localStorage.setItem('ap_favorites', JSON.stringify([...next])); } catch { /* ignore */ }
            return next;
        });
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const filteredTools = tools.filter(tool => {
        const matchesSearch =
            tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <>
            {/* ── Search bar ─────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        ref={searchRef}
                        type="text"
                        placeholder="Search tools..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-16 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black text-black placeholder-gray-400 transition-all shadow-sm"
                    />
                    <kbd className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 font-mono bg-gray-50 select-none hidden sm:block">
                        ⌘K
                    </kbd>
                </div>
            </div>

            {/* ── Category Filter Bar ────────────────────────────────── */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${activeCategory === cat
                            ? 'bg-black text-white border-black shadow-sm'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* ── Tools Grid ─────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-left">
                {filteredTools.map((tool) => {
                    const Icon = tool.icon;
                    const isFav = favorites.has(tool.id);
                    return (
                        <Link
                            key={tool.id}
                            href={tool.path}
                            className="group relative p-4 sm:p-6 bg-white border border-gray-200 hover:border-black rounded-2xl block transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)]"
                        >
                            {/* ⚡ PRIME ONLY Badge */}
                            {tool.prime && (
                                <span className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm leading-tight animate-pulse">
                                    ⚡ PRIME ONLY
                                </span>
                            )}

                            {/* ♥ Favorite Button */}
                            <button
                                onClick={(e) => toggleFavorite(e, tool.id)}
                                aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                                className="absolute top-2 left-2 z-10 p-1 rounded-full text-gray-300 hover:text-red-500 transition-colors duration-150"
                            >
                                <Heart
                                    className={`w-4 h-4 transition-all duration-200 ${isFav ? 'fill-red-500 text-red-500 scale-110' : ''}`}
                                />
                            </button>

                            {/* Icon */}
                            <div className="mt-5 mb-3 sm:mt-4 sm:mb-4 inline-flex p-2 sm:p-3 rounded-xl bg-gray-50 text-black group-hover:scale-110 transition-transform duration-300">
                                <Icon className="w-5 h-5 sm:w-7 sm:h-7" />
                            </div>

                            {/* Name */}
                            <h3 className="text-sm sm:text-base font-bold mb-1 sm:mb-2 text-black leading-tight group-hover:underline decoration-2 underline-offset-2">
                                {tool.name}
                            </h3>

                            {/* Description */}
                            <p
                                className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-2 overflow-hidden"
                                style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as React.CSSProperties}
                            >
                                {tool.description}
                            </p>

                            {/* Usage Count */}
                            <p className="text-[10px] sm:text-xs text-gray-400 font-medium mt-auto">
                                {tool.uses}
                            </p>
                        </Link>
                    );
                })}
            </div>

            {/* ── No Results ─────────────────────────────────────────── */}
            {filteredTools.length === 0 && (
                <div className="text-center py-20">
                    <div className="inline-flex p-4 rounded-full bg-gray-50 mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-black mb-2">No tools found</h3>
                    <p className="text-gray-500">Try a different search or category</p>
                </div>
            )}

            {/* ── Back to Top ────────────────────────────────────────── */}
            <button
                onClick={scrollToTop}
                aria-label="Back to top"
                className={`fixed bottom-6 right-6 z-50 w-10 h-10 flex items-center justify-center bg-black text-white rounded-full shadow-lg transition-all duration-300 hover:bg-gray-800 hover:-translate-y-0.5 ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
            >
                <ArrowUp className="w-5 h-5" />
            </button>
        </>
    );
}

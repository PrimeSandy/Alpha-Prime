"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Menu } from 'lucide-react';
import { X } from 'lucide-react';
import { Home } from 'lucide-react';
import { Info } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { Type } from 'lucide-react';
import { KeyRound } from 'lucide-react';
import { Image as ImageIcon } from 'lucide-react';
import { FileCode2 } from 'lucide-react';
import { ALargeSmall } from 'lucide-react';
import { Code2 } from 'lucide-react';
import { Palette } from 'lucide-react';
import { ScanText } from 'lucide-react';
import { Lock, LockKeyhole } from 'lucide-react';

const TOOLS = [
    { name: 'PrimeLink Chat', href: '/tools/primelink', icon: Lock },
    { name: 'Link Vault', href: '/tools/link-vault', icon: LockKeyhole },
    { name: 'Online Compiler', href: '/tools/online-compiler', icon: Code2 },
    { name: 'Image Resizer', href: '/tools/image-resizer', icon: ImageIcon },
    { name: 'Password Generator', href: '/tools/password-generator', icon: KeyRound },
    { name: 'Diff Checker', href: '/tools/diff-checker', icon: ScanText },
    { name: 'Color Tools', href: '/tools/color-tools', icon: Palette },
    { name: 'Case Converter', href: '/tools/case-converter', icon: ALargeSmall },
    { name: 'Word Counter', href: '/tools/word-counter', icon: Type },
    { name: 'Base64 Converter', href: '/tools/base64', icon: FileCode2 },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [toolsOpen, setToolsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setToolsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 no-underline group">
                        <div className="relative w-10 h-10 overflow-hidden rounded-lg">
                            <Image src="/logo.png" alt="AlphaPrime Logo" fill priority={true} className="object-contain" sizes="40px" />
                        </div>
                        <div className="flex flex-col">
                            <div className="text-xl font-bold font-display text-foreground">AlphaPrime</div>
                            <p className="text-xs text-muted-foreground">Privacy Tools</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Home
                        </Link>

                        {/* Tools Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setToolsOpen(v => !v)}
                                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                            >
                                Tools
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {toolsOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-background border border-border rounded-2xl shadow-xl overflow-hidden z-50">
                                    <div className="p-2 grid grid-cols-1 gap-0.5">
                                        {TOOLS.map(({ name, href, icon: Icon }) => (
                                            <Link
                                                key={href}
                                                href={href}
                                                onClick={() => setToolsOpen(false)}
                                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-accent transition-colors"
                                            >
                                                <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                {name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            About
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center justify-center w-10 h-10 rounded-lg bg-card border border-border text-foreground"
                            aria-label="Open menu"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {isOpen && (
                <div className="md:hidden absolute top-16 inset-x-0 bg-background/95 backdrop-blur-xl border-b border-border max-h-[80vh] overflow-y-auto">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-col gap-1">
                            <Link href="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors text-foreground" onClick={() => setIsOpen(false)}>
                                <Home className="w-5 h-5" /> Home
                            </Link>

                            {/* Tools section in mobile */}
                            <div className="mt-2 mb-1 px-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Tools</div>
                            {TOOLS.map(({ name, href, icon: Icon }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors text-foreground"
                                >
                                    <Icon className="w-5 h-5 text-muted-foreground" />
                                    {name}
                                </Link>
                            ))}

                            <div className="border-t border-border my-2" />
                            <Link href="/about" className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors text-foreground" onClick={() => setIsOpen(false)}>
                                <Info className="w-5 h-5" /> About
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

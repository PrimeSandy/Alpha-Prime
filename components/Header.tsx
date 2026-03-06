"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from "next-auth/react";
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
    { name: 'PrimeLink Chat', href: '/tools/primelink/', icon: Lock },
    { name: 'Link Vault', href: '/tools/link-vault/', icon: LockKeyhole },
    { name: 'Online Compiler', href: '/tools/online-compiler/', icon: Code2 },
    { name: 'Image Resizer', href: '/tools/image-resizer/', icon: ImageIcon },
    { name: 'Password Generator', href: '/tools/password-generator/', icon: KeyRound },
    { name: 'Diff Checker', href: '/tools/diff-checker/', icon: ScanText },
    { name: 'Color Tools', href: '/tools/color-tools/', icon: Palette },
    { name: 'Case Converter', href: '/tools/case-converter/', icon: ALargeSmall },
    { name: 'Word Counter', href: '/tools/word-counter/', icon: Type },
    { name: 'Base64 Converter', href: '/tools/base64/', icon: FileCode2 },
];

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [toolsOpen, setToolsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('#tools-dropdown')) setToolsOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setIsMobileMenuOpen(false);
            setToolsOpen(false);
        }, 0);
    }, [pathname]);

    const routeTitles: Record<string, string> = {
        '/': 'AlphaPrime',
        '/tools/word-counter/': 'Word Counter',
        '/tools/password-generator/': 'Password Generator',
        '/tools/base64/': 'Base64 Converter',
        '/tools/case-converter/': 'Case Converter',
        '/tools/image-resizer/': 'Image Resizer',
        '/tools/online-compiler/': 'Online Compiler',
        '/tools/color-tools/': 'Color Tools',
        '/tools/diff-checker/': 'Diff Checker',
        '/tools/primelink/': 'PrimeLink Chat',
        '/tools/link-vault/': 'Link Vault',
        '/about/': 'About',
        '/contact/': 'Contact',
        '/privacy/': 'Privacy Policy',
        '/terms/': 'Terms of Service',
        '/roadmap/': 'Roadmap',
    };

    const currentTitle = routeTitles[pathname] || 'AlphaPrime';

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-white/95 backdrop-blur-md border-black/10 shadow-sm' : 'bg-white border-gray-200'
            }`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
                        <Image src="/logo.png" alt="AlphaPrime Logo" width={40} height={40} priority={true} className="h-10 w-10 transition-transform group-hover:scale-110" />
                        <span className="font-bold text-xl tracking-tight text-black">{currentTitle}</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/" className={`text-sm font-medium transition-colors relative group ${pathname === '/' ? 'text-black font-bold' : 'text-gray-500 hover:text-black'}`}>
                            Home
                            <span className={`absolute -bottom-0.5 left-0 h-[1.5px] bg-black transition-all duration-200 ${pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                        </Link>

                        {/* Tools Dropdown */}
                        <div className="relative" id="tools-dropdown">
                            <button
                                onClick={() => setToolsOpen(v => !v)}
                                className={`flex items-center gap-1 text-sm font-medium transition-colors ${toolsOpen ? 'text-black' : 'text-gray-500 hover:text-black'}`}
                            >
                                Tools
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {toolsOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50">
                                    <div className="p-2 grid grid-cols-1 gap-0.5">
                                        {TOOLS.map(({ name, href, icon: Icon }) => (
                                            <Link
                                                key={href}
                                                href={href}
                                                onClick={() => setToolsOpen(false)}
                                                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${pathname === href ? 'bg-black/5 text-black font-medium' : 'text-gray-700 hover:bg-gray-50 hover:text-black'
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4 flex-shrink-0 text-gray-500" />
                                                {name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link href="/roadmap/" className={`text-sm font-medium transition-colors relative group ${pathname === '/roadmap/' ? 'text-black font-bold' : 'text-gray-500 hover:text-black'}`}>
                            Roadmap
                            <span className={`absolute -bottom-0.5 left-0 h-[1.5px] bg-black transition-all duration-200 ${pathname === '/roadmap/' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                        </Link>

                        <Link href="/about/" className={`text-sm font-medium transition-colors relative group ${pathname === '/about/' ? 'text-black font-bold' : 'text-gray-500 hover:text-black'}`}>
                            About
                            <span className={`absolute -bottom-0.5 left-0 h-[1.5px] bg-black transition-all duration-200 ${pathname === '/about/' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        {!session ? (
                            <button
                                onClick={() => signIn("google")}
                                className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 hover:shadow-sm transition-all text-black"
                            >
                                Sign In
                            </button>
                        ) : (
                            <div className="relative group flex items-center gap-2 cursor-pointer">
                                <Image
                                    src={session.user?.image || "/placeholder-avatar.png"}
                                    alt={session.user?.name || "User profile"}
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 rounded-full"
                                />
                                <span className="hidden md:block text-sm font-medium text-black">
                                    {session.user?.name}
                                </span>
                                <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-xl p-3 shadow-lg w-48 hidden group-hover:block z-50">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {session.user?.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate mb-3">
                                        {session.user?.email}
                                    </p>
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full text-sm text-red-500 hover:text-red-600 text-left font-medium"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* Mobile Menu Button */}
                        <button className="md:hidden p-2 text-black" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 inset-x-0 bg-white border-b border-gray-200 shadow-md z-40 max-h-[80vh] overflow-y-auto">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-col gap-1">
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-xl text-black hover:bg-gray-50 transition-colors">
                                <Home className="w-5 h-5 text-gray-700" /> Home
                            </Link>

                            <div className="mt-3 mb-1 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">Tools</div>
                            {TOOLS.map(({ name, href, icon: Icon }) => (
                                <Link key={href} href={href} onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${pathname === href ? 'bg-black/5 text-black font-medium' : 'text-gray-800 hover:bg-gray-50 hover:text-black'
                                        }`}>
                                    <Icon className="w-5 h-5 text-gray-700" /> {name}
                                </Link>
                            ))}

                            <div className="border-t border-gray-300 my-2" />
                            <Link href="/roadmap/" onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-xl text-black hover:bg-gray-50 transition-colors">
                                <Info className="w-5 h-5 text-gray-700" /> Roadmap
                            </Link>
                            <Link href="/about/" onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-xl text-black hover:bg-gray-50 transition-colors">
                                <Info className="w-5 h-5 text-gray-700" /> About
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;

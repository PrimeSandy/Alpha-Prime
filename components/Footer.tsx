import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Youtube, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="container mx-auto px-4 py-10">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
                    {/* Brand */}
                    <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
                        <Link href="/" className="flex items-center gap-2 group">
                            <Image
                                src="/logo.png"
                                alt="AlphaPrime Logo"
                                width={36}
                                height={36}
                                className="h-9 w-9 transition-transform group-hover:scale-110"
                            />
                            <span className="font-bold text-lg tracking-tight text-black">AlphaPrime</span>
                        </Link>
                        <p className="text-base text-gray-500 mb-4">Free privacy-first web tools.</p>
                        {/* Social */}
                        <div className="flex items-center gap-4">
                            <a href="https://www.instagram.com/alphaprime_0fficial?igsh=MTM5cDE4YW96Nzd1aQ==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors" aria-label="Instagram">
                                <Instagram className="w-6 h-6" />
                            </a>
                            <a href="https://youtube.com/@alphaprimecoin?si=isXJ2PieuKxHcYX4" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors" aria-label="YouTube">
                                <Youtube className="w-6 h-6" />
                            </a>
                        </div>
                    </div>

                    {/* Link columns */}
                    <div className="flex flex-col md:flex-row md:grid md:grid-cols-3 gap-8 md:gap-6 w-full md:w-auto text-sm items-center md:items-start text-center md:text-left">
                        <div className="col-span-1">
                            <p className="font-bold text-sm text-black mb-2">Product</p>
                            <div className="flex flex-col text-gray-600">
                                {['Home', 'Blog', 'Roadmap', 'Changelog'].map((item) => (
                                    <Link key={item} href={item === 'Home' ? '/' : `/${item.toLowerCase()}/`} className="hover:text-black transition-colors py-1 leading-loose text-sm">
                                        {item}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="col-span-1">
                            <p className="font-bold text-sm text-black mb-2">Support</p>
                            <div className="flex flex-col text-gray-600">
                                {['FAQ', 'About', 'Contact'].map((item) => (
                                    <Link key={item} href={`/${item.toLowerCase()}/`} className="hover:text-black transition-colors py-1 leading-loose text-sm">
                                        {item}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="col-span-1">
                            <p className="font-bold text-sm text-black mb-2">Legal</p>
                            <div className="flex flex-col text-gray-600">
                                {[
                                    { label: 'Privacy', href: '/privacy/' },
                                    { label: 'Terms', href: '/terms/' },
                                    { label: 'Cookies', href: '/cookies/' },
                                    { label: 'Disclaimer', href: '/disclaimer/' },
                                ].map((item) => (
                                    <Link key={item.label} href={item.href} className="hover:text-black transition-colors py-1 leading-loose text-sm">
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100 text-xs text-center text-gray-400">
                    © 2026 AlphaPrime — Privacy-first tools. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;

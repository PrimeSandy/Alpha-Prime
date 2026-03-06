import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Strong Password Generator - Create Secure Passwords',
    description: 'Generate unbreakable, random passwords instantly. Customize length and symbols for maximum security. Privacy-first, runs entirely in your browser.',
    alternates: {
        canonical: 'https://alphaprime.co.in/tools/password-generator/',
    },
    openGraph: {
        title: 'Strong Password Generator - Create Secure Passwords',
        description: 'Generate unbreakable, random passwords instantly. Customize length and symbols for maximum security.',
        url: 'https://alphaprime.co.in/tools/password-generator/',
        siteName: 'AlphaPrime',
        type: 'website',
    },
};

export default function PasswordGeneratorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'AlphaPrime Password Generator',
        description: 'A secure, random password generator that runs entirely in the browser.',
        applicationCategory: 'SecurityApplication',
        operatingSystem: 'All',
        url: 'https://alphaprime.co.in/tools/password-generator/',
        author: {
            '@type': 'Organization',
            name: 'AlphaPrime',
        },
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    );
}

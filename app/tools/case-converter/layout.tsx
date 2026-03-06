import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Text Case Converter - Format Your Text Instantly',
    description: 'Quickly convert text to UPPERCASE, lowercase, Title Case, Sentence case, and more. Clean, fast, and works entirely in your browser.',
    alternates: {
        canonical: 'https://alphaprime.co.in/tools/case-converter/',
    },
    openGraph: {
        title: 'Text Case Converter - Format Your Text Instantly',
        description: 'Quickly convert text to UPPERCASE, lowercase, Title Case, Sentence case, and more.',
        url: 'https://alphaprime.co.in/tools/case-converter/',
        siteName: 'AlphaPrime',
        type: 'website',
    },
};

export default function CaseConverterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'AlphaPrime Case Converter',
        description: 'A simple and fast text case conversion tool that runs entirely in the browser.',
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        url: 'https://alphaprime.co.in/tools/case-converter/',
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

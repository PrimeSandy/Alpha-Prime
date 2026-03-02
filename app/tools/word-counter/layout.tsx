import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Advanced Word Counter - Real-time Text Analysis',
    description: 'Free online word counter and text analysis tool. Calculate word count, character count, reading time, and keyword density instantly and privately in your browser.',
    alternates: {
        canonical: 'https://alphaprime.co.in/tools/word-counter/',
    },
    openGraph: {
        title: 'Advanced Word Counter - Real-time Text Analysis',
        description: 'Free online word counter and text analysis tool. Calculate word count, character count, reading time, and keyword density instantly.',
        url: 'https://alphaprime.co.in/tools/word-counter/',
        siteName: 'AlphaPrime',
        type: 'website',
    },
};

export default function WordCounterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'AlphaPrime Word Counter',
        description: 'A privacy-first word counter and text analysis tool that runs entirely in the browser.',
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        url: 'https://alphaprime.co.in/tools/word-counter/',
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

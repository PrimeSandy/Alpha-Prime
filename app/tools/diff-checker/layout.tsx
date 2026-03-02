import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Diff Checker - Compare Text Side-by-Side',
    description: 'Instantly find differences between two pieces of text or code. Real-time, side-by-side comparison. Secure, privacy-first, and local processing.',
    alternates: {
        canonical: 'https://alphaprime.co.in/tools/diff-checker/',
    },
    openGraph: {
        title: 'Diff Checker - Compare Text Side-by-Side',
        description: 'Instantly find differences between two pieces of text or code. Secure and local processing.',
        url: 'https://alphaprime.co.in/tools/diff-checker/',
        siteName: 'AlphaPrime',
        type: 'website',
    },
};

export default function DiffCheckerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'AlphaPrime Diff Checker',
        description: 'A powerful text and code comparison tool that runs entirely in the browser.',
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        url: 'https://alphaprime.co.in/tools/diff-checker/',
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

import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Image Resizer - Resize & Compress Fast and Privately',
    description: 'Free online image resizer. Resize image without quality loss, compress images for web optimization instantly and privately in your browser.',
    alternates: {
        canonical: 'https://alphaprime.co.in/tools/image-resizer/',
    },
    openGraph: {
        title: 'Image Resizer - Resize & Compress Fast and Privately',
        description: 'Free online image resizer. Resize image without quality loss, compress images for web optimization instantly.',
        url: 'https://alphaprime.co.in/tools/image-resizer/',
        siteName: 'AlphaPrime',
        type: 'website',
    },
};

export default function ImageResizerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'AlphaPrime Image Resizer',
        description: 'A fast, private image resizing and compression tool that runs entirely in the browser.',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        url: 'https://alphaprime.co.in/tools/image-resizer/',
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

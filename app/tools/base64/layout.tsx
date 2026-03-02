import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Base64 Encode & Decode - Fast Data Conversion',
    description: 'Instantly encode and decode Base64 strings. Secure, client-side conversion for text and data. Perfect for developers and security analysts.',
    alternates: {
        canonical: 'https://alphaprime.co.in/tools/base64/',
    },
    openGraph: {
        title: 'Base64 Encode & Decode - Fast Data Conversion',
        description: 'Instantly encode and decode Base64 strings. Secure, client-side conversion for text and data.',
        url: 'https://alphaprime.co.in/tools/base64/',
        siteName: 'AlphaPrime',
        type: 'website',
    },
};

export default function Base64Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'AlphaPrime Base64 Converter',
        description: 'A secure, client-side Base64 encoding and decoding tool.',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'All',
        url: 'https://alphaprime.co.in/tools/base64/',
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

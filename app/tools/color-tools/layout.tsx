import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Color Tools - Hex, RGB, HSL Picker & Palette Generator',
    description: 'The ultimate tool for designers and developers. Pick colors, generate palettes, and convert between HEX, RGB, and HSL formats instantly.',
    alternates: {
        canonical: 'https://alphaprime.co.in/tools/color-tools/',
    },
    openGraph: {
        title: 'Color Tools - Hex, RGB, HSL Picker & Palette Generator',
        description: 'The ultimate tool for designers and developers. Pick colors, generate palettes, and convert between formats.',
        url: 'https://alphaprime.co.in/tools/color-tools/',
        siteName: 'AlphaPrime',
        type: 'website',
    },
};

export default function ColorToolsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'AlphaPrime Color Tools',
        description: 'A comprehensive color picker and palette generator for web professionals.',
        applicationCategory: 'DesignApplication',
        operatingSystem: 'All',
        url: 'https://alphaprime.co.in/tools/color-tools/',
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

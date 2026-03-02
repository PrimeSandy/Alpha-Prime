import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Online Compiler - Run Code in Your Browser',
    description: 'Compile and run code for Python, JavaScript, C++, and more instantly. No setup required, privacy-first, and lightning fast.',
    alternates: {
        canonical: 'https://alphaprime.co.in/tools/online-compiler/',
    },
    openGraph: {
        title: 'Online Compiler - Run Code in Your Browser',
        description: 'Compile and run code for Python, JavaScript, C++, and more instantly.',
        url: 'https://alphaprime.co.in/tools/online-compiler/',
        siteName: 'AlphaPrime',
        type: 'website',
    },
};

export default function OnlineCompilerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'AlphaPrime Online Compiler',
        description: 'A multi-language code compiler and executor that runs directly in the browser.',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'All',
        url: 'https://alphaprime.co.in/tools/online-compiler/',
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

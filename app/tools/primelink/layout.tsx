import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'PrimeLink Chat - Private & Anonymous Conversations',
    description: 'Start a secure, anonymous chat room instantly. No signup, no storage, no tracking. Secure your conversations with PrimeLink.',
    alternates: {
        canonical: 'https://alphaprime.co.in/tools/primelink/',
    },
    openGraph: {
        title: 'PrimeLink Chat - Private & Anonymous Conversations',
        description: 'Start a secure, anonymous chat room instantly. No signup, no storage, no tracking.',
        url: 'https://alphaprime.co.in/tools/primelink/',
        siteName: 'AlphaPrime',
        type: 'website',
    },
};

export default function PrimeLinkLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'AlphaPrime PrimeLink Chat',
        description: 'A private, anonymous chat tool with no tracking or message storage.',
        applicationCategory: 'CommunicationApplication',
        operatingSystem: 'All',
        url: 'https://alphaprime.co.in/tools/primelink/',
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

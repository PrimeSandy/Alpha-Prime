import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Link Vault - Secure, Password-Protected HTTPS Links',
    description: 'Protect your secret links and messages behind a password. Encrypt URLs and hidden redirects with AlphaPrime Link Vault.',
    alternates: {
        canonical: 'https://alphaprime.co.in/tools/link-vault/',
    },
    openGraph: {
        title: 'Link Vault - Secure, Password-Protected HTTPS Links',
        description: 'Protect your secret links and messages behind a password. Encrypt URLs and hidden redirects.',
        url: 'https://alphaprime.co.in/tools/link-vault/',
        siteName: 'AlphaPrime',
        type: 'website',
    },
};

export default function LinkVaultLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'AlphaPrime Link Vault',
        description: 'A tool to secure and password-protect your URLs and messages.',
        applicationCategory: 'SecurityApplication',
        operatingSystem: 'All',
        url: 'https://alphaprime.co.in/tools/link-vault/',
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

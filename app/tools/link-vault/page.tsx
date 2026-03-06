import React from 'react';
import { Metadata } from 'next';
import LinkVaultClient from './LinkVaultClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import WebApplicationSchema from '@/components/WebApplicationSchema';

export const metadata: Metadata = {
    title: 'Link Vault – Secure & Hidden Personal Bookmarks',
    description: 'Protect your sensitive URLs and bookmarks with our encrypted link vault. Password-protect links locally in your browser.',
    keywords: ['link vault', 'private bookmarks', 'secure links', 'password protect url', 'privacy tools'],
    alternates: {
        canonical: 'https://alphaprime.co.in/tools/link-vault/',
    },
    openGraph: {
        title: 'Link Vault – Encrypted Link Management',
        description: 'Keep your secrets safe with our local-only encryption. No cloud storage, no risk.',
        url: 'https://alphaprime.co.in/tools/link-vault/',
        type: 'website',
    },
};

export default function LinkVaultPage() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', item: '/' },
                    { name: 'Tools', item: '/tools/' },
                    { name: 'Link Vault', item: '/tools/link-vault/' },
                ]}
            />
            <WebApplicationSchema
                name="AlphaPrime Link Vault"
                description="Securely manage and protect your links with client-side encryption and robust privacy controls."
                url="https://alphaprime.co.in/tools/link-vault/"
                applicationCategory="SecurityApplication"
                operatingSystem="Any"
            />
            <LinkVaultClient />
        </>
    );
}

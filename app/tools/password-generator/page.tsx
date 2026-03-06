import React from 'react';
import { Metadata } from 'next';
import PasswordGeneratorClient from './PasswordGeneratorClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import WebApplicationSchema from '@/components/WebApplicationSchema';

export const metadata: Metadata = {
    title: 'Strong Password Generator Online Free – Secure & Infinite',
    description: 'Create unbreakable, secure passwords instantly with our online generator. Customizable length, characters, and entirely browser-based.',
    keywords: ['strong password generator', 'secure password generator', 'random password creator', 'privacy tools', 'online password tool'],
    alternates: {
        canonical: 'https://alphaprime.co.in/tools/password-generator/',
    },
    openGraph: {
        title: 'Strong Password Generator Online Free – Secure & Private',
        description: 'Instant random password generation. No server-side storage. 100% secure.',
        url: 'https://alphaprime.co.in/tools/password-generator/',
        type: 'website',
    },
};

export default function PasswordGeneratorPage() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', item: '/' },
                    { name: 'Tools', item: '/tools/' },
                    { name: 'Password Generator', item: '/tools/password-generator/' },
                ]}
            />
            <WebApplicationSchema
                name="AlphaPrime Password Generator"
                description="Our secure, client-side password generator tool creates high-entropy passwords that are never stored on any server."
                url="https://alphaprime.co.in/tools/password-generator/"
                applicationCategory="SecurityApplication"
                operatingSystem="Any"
            />
            <PasswordGeneratorClient />
        </>
    );
}

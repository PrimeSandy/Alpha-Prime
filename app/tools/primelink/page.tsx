import React from 'react';
import { Metadata } from 'next';
import PrimeLinkClient from './PrimeLinkClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import WebApplicationSchema from '@/components/WebApplicationSchema';

export const metadata: Metadata = {
    title: 'AlphaPrime PrimeLink Chat – Secure Anomymous Messaging',
    description: 'Create a private, end-to-end encrypted chat room instantly. No signup, no tracking, total data privacy.',
    keywords: ['private chat', 'anonymous chat', 'secure messaging', 'encryped chat', 'no signup chat'],
    alternates: {
        canonical: 'https://alphaprime.co.in/tools/primelink/',
    },
    openGraph: {
        title: 'AlphaPrime PrimeLink Chat – Private & Secure Messaging',
        description: 'Chat with confidence. Your data never leaves the room.',
        url: 'https://alphaprime.co.in/tools/primelink/',
        type: 'website',
    },
};

export default function PrimeLinkPage() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', item: '/' },
                    { name: 'Tools', item: '/tools/' },
                    { name: 'PrimeLink Chat', item: '/tools/primelink/' },
                ]}
            />
            <WebApplicationSchema
                name="AlphaPrime PrimeLink"
                description="Secure, ephemeral chat rooms that offer encryption and zero logs for private communication."
                url="https://alphaprime.co.in/tools/primelink/"
                applicationCategory="CommunicationApplication"
                operatingSystem="Any"
            />
            <PrimeLinkClient />
        </>
    );
}

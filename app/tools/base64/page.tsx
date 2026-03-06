import React from 'react';
import { Metadata } from 'next';
import Base64Client from './Base64Client';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import WebApplicationSchema from '@/components/WebApplicationSchema';

export const metadata: Metadata = {
    title: 'Base64 Encoder & Decoder Online Free – Fast & Private Tool',
    description: 'Instantly encode or decode text and binary data into Base64 format. 100% data privacy and works directly in your browser.',
    keywords: ['base64 encoder', 'base64 decoder', 'encode text base64', 'online base64 tool', 'developer tools'],
    alternates: {
        canonical: 'https://alphaprime.co.in/tools/base64/',
    },
    openGraph: {
        title: 'Base64 Encoder & Decoder – Instant Base64 Analysis',
        description: 'Encode and decode Base64 data with zero tracking. Security-first tool.',
        url: 'https://alphaprime.co.in/tools/base64/',
        type: 'website',
    },
};

export default function Base64Page() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', item: '/' },
                    { name: 'Tools', item: '/tools/' },
                    { name: 'Base64 Converter', item: '/tools/base64/' },
                ]}
            />
            <WebApplicationSchema
                name="AlphaPrime Base64 Converter"
                description="Easily encode and decode Base64 formats with total privacy and no server-side data logs."
                url="https://alphaprime.co.in/tools/base64/"
                applicationCategory="DeveloperApplication"
                operatingSystem="Any"
            />
            <Base64Client />
        </>
    );
}

import React from 'react';
import { Metadata } from 'next';
import CaseConverterClient from './CaseConverterClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import WebApplicationSchema from '@/components/WebApplicationSchema';

export const metadata: Metadata = {
    title: 'Text Case Converter Online Free – Uppercase, Title Case & More',
    description: 'Transform your text with ease using our online case converter. Switch between uppercase, lowercase, title case, and sentence case instantly.',
    keywords: ['text case converter', 'uppercase converter', 'title case converter', 'online formatting tool', 'sentence case'],
    alternates: {
        canonical: 'https://alphaprime.co.in/tools/case-converter/',
    },
    openGraph: {
        title: 'Text Case Converter Online Free – Instant Text Transformation',
        description: 'Format your text for free. Title, upper, and lower case conversion with zero tracking.',
        url: 'https://alphaprime.co.in/tools/case-converter/',
        type: 'website',
    },
};

export default function CaseConverterPage() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', item: '/' },
                    { name: 'Tools', item: '/tools/' },
                    { name: 'Case Converter', item: '/tools/case-converter/' },
                ]}
            />
            <WebApplicationSchema
                name="AlphaPrime Case Converter"
                description="Easily toggle between uppercase, lowercase, title case, and more for your documentation or content."
                url="https://alphaprime.co.in/tools/case-converter/"
                applicationCategory="DeveloperApplication"
                operatingSystem="Any"
            />
            <CaseConverterClient />
        </>
    );
}

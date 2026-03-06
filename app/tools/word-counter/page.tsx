import React from 'react';
import { Metadata } from 'next';
import WordCounterClient from './WordCounterClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import WebApplicationSchema from '@/components/WebApplicationSchema';

export const metadata: Metadata = {
    title: 'Word Counter Online Free – Real-time Character & Read Time Tool',
    description: 'Use our free online word counter to instantly calculate word count, character count, and reading time. 100% private and runs entirely in your browser.',
    keywords: ['word counter online', 'character counter', 'reading time calculator', 'free seo tools', 'word count tool'],
    alternates: {
        canonical: 'https://alphaprime.co.in/tools/word-counter/',
    },
    openGraph: {
        title: 'Word Counter Online Free – Real-time Analysis Tool',
        description: 'Instant word and character count. No tracking, no data collection. 100% client-side.',
        url: 'https://alphaprime.co.in/tools/word-counter/',
        type: 'website',
    },
};

export default function WordCounterPage() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', item: '/' },
                    { name: 'Tools', item: '/tools/' },
                    { name: 'Word Counter', item: '/tools/word-counter/' },
                ]}
            />
            <WebApplicationSchema
                name="AlphaPrime Word Counter"
                description="A free, privacy-first online word counter to analyze character count, word count, and reading time instantly."
                url="https://alphaprime.co.in/tools/word-counter/"
                applicationCategory="DeveloperApplication"
                operatingSystem="Any"
            />
            <WordCounterClient />
        </>
    );
}

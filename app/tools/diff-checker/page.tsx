import React from 'react';
import { Metadata } from 'next';
import DiffCheckerClient from './DiffCheckerClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import WebApplicationSchema from '@/components/WebApplicationSchema';

export const metadata: Metadata = {
    title: 'Text Diff Checker Online Free – Compare Files Instantly',
    description: 'Quickly find differences between two text files with our online diff checker. Highlighting code differences with zero privacy risk.',
    keywords: ['diff checker online', 'compare text', 'file difference', 'code comparison tool', 'online text tool'],
    alternates: {
        canonical: 'https://alphaprime.co.in/tools/diff-checker/',
    },
    openGraph: {
        title: 'Text Diff Checker – Professional Comparison Engine',
        description: 'See every change clearly with our local-only diff checker. Faster than manual comparison.',
        url: 'https://alphaprime.co.in/tools/diff-checker/',
        type: 'website',
    },
};

export default function DiffCheckerPage() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', item: '/' },
                    { name: 'Tools', item: '/tools/' },
                    { name: 'Diff Checker', item: '/tools/diff-checker/' },
                ]}
            />
            <WebApplicationSchema
                name="AlphaPrime Diff Checker"
                description="Our text-comparison tool contrasts two inputs side-by-side or line-by-line using high-performance diffing algorithms."
                url="https://alphaprime.co.in/tools/diff-checker/"
                applicationCategory="DeveloperApplication"
                operatingSystem="Any"
            />
            <DiffCheckerClient />
        </>
    );
}

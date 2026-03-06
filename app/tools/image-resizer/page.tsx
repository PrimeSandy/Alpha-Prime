import React from 'react';
import { Metadata } from 'next';
import ImageResizerClient from './ImageResizerClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import WebApplicationSchema from '@/components/WebApplicationSchema';

export const metadata: Metadata = {
    title: 'Image Resizer Online Free – Compress & Resize Without Quality Loss',
    description: 'Resize and compress your images online for free. Support for multiple formats, entirely in your browser. Privacy-first image tools.',
    keywords: ['image resizer online', 'compress image free', 'resize photo', 'privacy image tools', 'bulk image resizer'],
    alternates: {
        canonical: 'https://alphaprime.co.in/tools/image-resizer/',
    },
    openGraph: {
        title: 'Image Resizer Online Free – Fast & Private Image Compression',
        description: 'Instant resizing and compression. No server-side uploads. Entirely in-browser.',
        url: 'https://alphaprime.co.in/tools/image-resizer/',
        type: 'website',
    },
};

export default function ImageResizerPage() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', item: '/' },
                    { name: 'Tools', item: '/tools/' },
                    { name: 'Image Resizer', item: '/tools/image-resizer/' },
                ]}
            />
            <WebApplicationSchema
                name="AlphaPrime Image Resizer"
                description="Easily resize and compress images for free without any server uploads. Supports PNG, JPG, and WEBP locally."
                url="https://alphaprime.co.in/tools/image-resizer/"
                applicationCategory="MultimediaApplication"
                operatingSystem="Any"
            />
            <ImageResizerClient />
        </>
    );
}

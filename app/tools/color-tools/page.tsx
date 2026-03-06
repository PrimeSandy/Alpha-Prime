import React from 'react';
import { Metadata } from 'next';
import ColorToolsClient from './ColorToolsClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import WebApplicationSchema from '@/components/WebApplicationSchema';

export const metadata: Metadata = {
    title: 'Color Tools Online Free – Hex Picker & Palette Generator',
    description: 'Explore color tools including an online hex picker, RGB converter, and professional palette generator for designers.',
    keywords: ['hex color picker', 'rgb to hex', 'palette generator', 'color tools', 'web design tools'],
    alternates: {
        canonical: 'https://alphaprime.co.in/tools/color-tools/',
    },
    openGraph: {
        title: 'Color Tools Online Free – Pro Color Analysis',
        description: 'Instant color picking and palette generation. High-quality for designers and developers.',
        url: 'https://alphaprime.co.in/tools/color-tools/',
        type: 'website',
    },
};

export default function ColorToolsPage() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', item: '/' },
                    { name: 'Tools', item: '/tools/' },
                    { name: 'Color Tools', item: '/tools/color-tools/' },
                ]}
            />
            <WebApplicationSchema
                name="AlphaPrime Color Tools"
                description="Our color suite allows you to pick, convert, and generate high-contrast palettes for any web project."
                url="https://alphaprime.co.in/tools/color-tools/"
                applicationCategory="DesignApplication"
                operatingSystem="Any"
            />
            <ColorToolsClient />
        </>
    );
}

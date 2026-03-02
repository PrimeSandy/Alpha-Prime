import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'AlphaPrime Pro - Elevate Your Productivity',
    description: 'Coming soon: Cloud sync, advanced analytics, and priority support for AlphaPrime users. Join the waitlist for early access to premium features.',
    alternates: {
        canonical: 'https://alphaprime.co.in/pro',
    },
    openGraph: {
        title: 'AlphaPrime Pro - Elevate Your Productivity',
        description: 'Coming soon: Cloud sync, advanced analytics, and priority support for AlphaPrime users.',
        url: 'https://alphaprime.co.in/pro',
        siteName: 'AlphaPrime',
        type: 'website',
    },
};

export default function ProLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

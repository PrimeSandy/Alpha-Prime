import React from 'react';
import { Metadata } from 'next';
import OnlineCompilerClient from './OnlineCompilerClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import WebApplicationSchema from '@/components/WebApplicationSchema';

export const metadata: Metadata = {
    title: 'Online Compiler Free – Run Python, JS, C++ in Browser',
    description: 'Compile and run your code instantly with our free online compiler. Support for Python, JavaScript, and more with zero local setup.',
    keywords: ['online compiler', 'run python online', 'javascript live editor', 'free code compiler', 'browser compiler'],
    alternates: {
        canonical: 'https://alphaprime.co.in/tools/online-compiler/',
    },
    openGraph: {
        title: 'Online Compiler Free – Instant Code Execution',
        description: 'Test small snippets and learn coding online. Faster than local IDEs.',
        url: 'https://alphaprime.co.in/tools/online-compiler/',
        type: 'website',
    },
};

export default function OnlineCompilerPage() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', item: '/' },
                    { name: 'Tools', item: '/tools/' },
                    { name: 'Online Compiler', item: '/tools/online-compiler/' },
                ]}
            />
            <WebApplicationSchema
                name="AlphaPrime Online Compiler"
                description="Our lightweight compiler handles basic code execution and syntax highlighting for testing logic in your browser."
                url="https://alphaprime.co.in/tools/online-compiler/"
                applicationCategory="DeveloperApplication"
                operatingSystem="Any"
            />
            <OnlineCompilerClient />
        </>
    );
}

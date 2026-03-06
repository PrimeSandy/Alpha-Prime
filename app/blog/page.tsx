import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { blogPosts } from '@/lib/blog-data';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

export const metadata: Metadata = {
    title: 'AlphaPrime Blog - Web Tools & Tech Tutorials',
    description: 'Explore our latest articles, guides, and tutorials on web development, security, and using our free online tools.',
    alternates: {
        canonical: 'https://alphaprime.co.in/blog/',
    },
    openGraph: {
        title: 'AlphaPrime Blog - Web Tools & Tech Tutorials',
        description: 'Explore our latest articles, guides, and tutorials on web development, security, and using our free online tools.',
        url: 'https://alphaprime.co.in/blog/',
        siteName: 'AlphaPrime',
        type: 'website',
    },
};

export default function BlogIndex() {
    return (
        <div className="min-h-0 sm:min-h-screen bg-white">
            <BreadcrumbSchema
                items={[
                    { name: 'Home', item: '/' },
                    { name: 'Blog', item: '/blog/' },
                ]}
            />
            <section className="pt-8 pb-6 sm:pt-32 sm:pb-16 px-4 bg-gray-50 border-b border-gray-200">
                <div className="container mx-auto max-w-4xl text-center">
                    {/* Breadcrumbs UI */}
                    <nav className="mb-6 text-sm text-gray-500 font-medium">
                        <ol className="flex items-center justify-center gap-2">
                            <li>
                                <Link href="/" className="hover:text-black transition-colors">Home</Link>
                            </li>
                            <li>/</li>
                            <li className="text-black" aria-current="page">Blog</li>
                        </ol>
                    </nav>

                    <h1 className="font-bold mb-6 tracking-tight leading-tight text-black text-4xl sm:text-5xl">
                        AlphaPrime <span className="text-gray-500">Blog</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
                        Guides, insights, and tutorials to help you master modern web development and secure your digital life.
                    </p>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="py-6 sm:py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}/`}
                                className="group flex flex-col p-8 bg-white border border-gray-200 hover:border-black rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-bold uppercase tracking-wider rounded-md">
                                        Tutorial
                                    </span>
                                    <span className="text-gray-500 text-sm font-medium">
                                        {post.readTime}
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold mb-3 text-black group-hover:underline decoration-2 underline-offset-4 line-clamp-2">
                                    {post.title}
                                </h2>
                                <p className="text-gray-600 leading-relaxed line-clamp-3 mb-6 flex-grow">
                                    {post.metaDescription}
                                </p>
                                <div className="mt-auto text-black font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    Read Article &rarr;
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

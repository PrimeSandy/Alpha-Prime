import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/lib/blog-data';

// 1. Generate Static Params for all 10 blog posts
export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

// 2. Generate Dynamic Metadata (SEO)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const post = blogPosts.find((p) => p.slug === resolvedParams.slug);

    if (!post) {
        return { title: 'Post Not Found' };
    }

    return {
        title: post.title,
        description: post.metaDescription,
        keywords: [post.primaryKeyword, ...post.secondaryKeywords].join(', '),
        openGraph: {
            title: post.title,
            description: post.metaDescription,
            type: 'article',
            url: `https://alphaprime.co.in/blog/${post.slug}/`,
            siteName: 'AlphaPrime',
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.metaDescription,
        },
        alternates: {
            canonical: `https://alphaprime.co.in/blog/${post.slug}/`,
        },
    };
}

// 3. Server Component Page Render
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const post = blogPosts.find((p) => p.slug === resolvedParams.slug);

    if (!post) {
        notFound();
    }

    // Generate JSON-LD Schemas
    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.metaDescription,
        author: {
            '@type': 'Organization',
            name: 'AlphaPrime',
            url: 'https://alphaprime.co.in',
        },
        publisher: {
            '@type': 'Organization',
            name: 'AlphaPrime',
            logo: {
                '@type': 'ImageObject',
                url: 'https://alphaprime.co.in/logo.png',
            },
        },
        datePublished: new Date().toISOString().split('T')[0],
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };

    return (
        <>
            {/* Inject JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <article className="min-h-0 sm:min-h-screen bg-white pb-8 sm:pb-20">
                {/* Header Section */}
                <header className="bg-gray-50 pt-24 sm:pt-32 pb-8 sm:pb-16 px-4 border-b border-gray-200">
                    {/* Breadcrumbs */}
                    <nav className="mb-8 text-sm text-gray-500 font-medium">
                        <ol className="flex items-center justify-center gap-2">
                            <li>
                                <Link href="/" className="hover:text-black transition-colors">Home</Link>
                            </li>
                            <li>/</li>
                            <li>
                                <Link href="/blog" className="hover:text-black transition-colors">Blog</Link>
                            </li>
                            <li>/</li>
                            <li className="text-black line-clamp-1" aria-current="page">
                                {post.title}
                            </li>
                        </ol>
                    </nav>

                    <h1 className="text-4xl sm:text-5xl font-extrabold text-black tracking-tight mb-6 leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-gray-600 font-medium">
                        <span className="uppercase tracking-wider text-sm px-3 py-1 bg-white border border-gray-200 rounded-lg shadow-sm">
                            Tutorial
                        </span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                    </div>
                    <div className="mt-8">
                        <Link
                            href={post.toolPath}
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-black rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-xl hover:-translate-y-1"
                        >
                            Launch Tool Now &rarr;
                        </Link>
                    </div>
                </header>

                {/* Article Body */}
                <div className="container mx-auto max-w-3xl px-4 mt-8 sm:mt-12 text-lg leading-relaxed text-gray-800 space-y-8 sm:space-y-12">

                    <section>
                        <p className="text-xl leading-relaxed text-gray-900 font-medium">{post.content.intro}</p>
                    </section>

                    {post.content.whatIs && (
                        <section>
                            <h2 className="text-3xl font-bold text-black mb-6 border-b border-gray-200 pb-2">What is this Tool?</h2>
                            <p className="leading-relaxed">{post.content.whatIs}</p>
                        </section>
                    )}

                    <section>
                        <h2 className="text-3xl font-bold text-black mb-6 border-b border-gray-200 pb-2">Why You Should Use It</h2>
                        <p className="leading-relaxed">{post.content.whyUse}</p>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-black mb-6 border-b border-gray-200 pb-2">How to Use the Tool</h2>
                        <ol className="list-decimal pl-6 space-y-4 marker:text-black marker:font-bold">
                            {post.content.howToUse.map((step, idx) => (
                                <li key={idx} className="pl-2">{step}</li>
                            ))}
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-black mb-6 border-b border-gray-200 pb-2">Common Use Cases</h2>
                        <ul className="list-disc pl-6 space-y-4 marker:text-black">
                            {post.content.useCases.map((useCase, idx) => (
                                <li key={idx} className="pl-2">{useCase}</li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-black mb-6 border-b border-gray-200 pb-2">Pro Tips & Tricks</h2>
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8">
                            <ul className="space-y-4">
                                {post.content.tips.map((tip, idx) => (
                                    <li key={idx} className="flex gap-4">
                                        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs font-bold">✓</span>
                                        <span className="text-gray-900">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="mt-16 pt-12 border-t border-gray-200">
                        <h2 className="text-3xl font-bold text-black mb-8 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            {post.faqs.map((faq, idx) => (
                                <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-black transition-colors">
                                    <h3 className="text-xl font-bold text-black mb-3">{faq.question}</h3>
                                    <p className="text-gray-700">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Conclusion & CTA */}
                    <section className="bg-black text-white rounded-3xl p-8 sm:p-12 text-center mt-16 shadow-2xl">
                        <h2 className="text-3xl font-bold mb-4 text-white">Ready to get started?</h2>
                        <p className="text-gray-300 mb-8 max-w-xl mx-auto">{post.content.conclusion}</p>
                        <Link
                            href={post.toolPath}
                            className="inline-block px-10 py-5 text-lg font-bold text-black bg-white rounded-xl hover:bg-gray-100 transition-transform hover:scale-105"
                        >
                            Start Using the Tool Free
                        </Link>
                    </section>

                    {/* Internal Linking / Related Tools */}
                    <section className="mt-16 pt-12 border-t border-gray-200 text-center">
                        <h3 className="text-xl font-bold text-black mb-6">Explore Other AlphaPrime Tools</h3>
                        <div className="flex flex-wrap justify-center gap-4">
                            {post.relatedTools.map((tool) => (
                                <Link
                                    key={tool.slug}
                                    href={`/blog/${tool.slug}`}
                                    className="px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black font-medium hover:border-black hover:bg-white transition-all shadow-sm hover:shadow-md"
                                >
                                    Read about {tool.title}
                                </Link>
                            ))}
                        </div>
                    </section>

                </div>
            </article>
        </>
    );
}

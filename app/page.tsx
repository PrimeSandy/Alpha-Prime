import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import ToolSearch from '@/components/ToolSearch';
import DynamicSections from '@/components/DynamicSections';
import { blogPosts } from '@/lib/blog-data';
import Testimonials from '@/components/Testimonials';
import Newsletter from '@/components/Newsletter';

export const metadata: Metadata = {
  title: 'AlphaPrime - Free Privacy-First Web Tools',
  description: 'Free privacy-first web tools. Fast, simple, and runs entirely in your browser. No tracking or data collection.',
  alternates: {
    canonical: 'https://alphaprime.co.in/',
  },
  openGraph: {
    title: 'AlphaPrime - Free Privacy-First Web Tools',
    description: 'Free privacy-first web tools. Fast, simple, and runs entirely in your browser.',
    url: 'https://alphaprime.co.in',
    siteName: 'AlphaPrime',
    images: [{ url: 'https://alphaprime.co.in/logo.png', width: 512, height: 512, alt: 'AlphaPrime Logo' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AlphaPrime - Free Privacy-First Web Tools',
    description: 'Free privacy-first web tools. Fast, simple, and runs entirely in your browser.',
    images: ['https://alphaprime.co.in/logo.png'],
  },
};

// Server Component — SSR'd directly, hero paints on first byte
export default function Home() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AlphaPrime',
    url: 'https://alphaprime.co.in',
    logo: 'https://alphaprime.co.in/logo.png',
    sameAs: [
      'https://www.instagram.com/alphaprime_official',
      'https://youtube.com/@alphaprimecoin',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AlphaPrime',
    url: 'https://alphaprime.co.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://alphaprime.co.in/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <div className="min-h-0 sm:min-h-screen w-full">
        {/* Hero Section — Server Component, SSR'd immediately → true LCP element */}
        <section className="pt-4 pb-6 sm:pt-32 sm:pb-16 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-sm font-medium text-black mb-8 border border-black/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
              </span>
              v3.0 Now Live
            </div>
            {/* h1 is SSR'd — this becomes the true LCP element painted at first byte */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight text-black">
              Tools for the <br />
              <span className="text-black">Modern Web</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              A collection of powerful, free online tools that run entirely in your browser.
              Privacy-first, open-source, and lightning fast.
            </p>

            {/* Client island: only search input + tool grid need client state */}
            <ToolSearch />

            {/* Latest from the Blog - SSR Component */}
            <div className="mt-10 sm:mt-20 pt-8 sm:pt-16 border-t border-gray-200">
              <div className="flex justify-between items-end mb-8 sm:mb-10 text-left">
                <div>
                  <h2 className="text-2xl font-bold text-black tracking-tight mb-2">Latest Tutorials &amp; Guides</h2>
                  <p className="text-gray-500">Learn how to maximize your productivity with our tools.</p>
                </div>
                <Link href="/blog/" className="hidden sm:inline-flex text-sm font-semibold text-black hover:text-gray-600 transition-colors">
                  View all articles &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                {blogPosts.slice(0, 3).map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}/`} className="group block h-full flex flex-col p-6 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-black/30 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                    <div className="flex-grow">
                      <h3 className="font-bold text-black mb-3 text-lg group-hover:underline underline-offset-4 decoration-black/30 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {post.metaDescription}
                      </p>
                    </div>
                    <div className="text-xs font-semibold text-black/50 pt-4 border-t border-black/5 mt-auto">
                      {post.readTime}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-8 sm:hidden">
                <Link href="/blog/" className="inline-block w-full text-center py-3 rounded-xl bg-zinc-100 text-black font-semibold hover:bg-zinc-200 transition-colors">
                  View all articles
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <Testimonials />

        {/* Newsletter */}
        <Newsletter />

        {/* Dynamic sections in a client boundary (required for ssr:false) */}
        <DynamicSections />
      </div>
    </>
  );
}

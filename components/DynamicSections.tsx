"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';

// ssr:false must live inside a Client Component boundary
const CommentSection = dynamic(() => import('@/components/CommentSection'), {
    ssr: false,
});

const MotiveSection = dynamic(() => import('@/components/MotiveSection'), {
    loading: () => <div className="py-20 bg-gray-50 border-t border-gray-200" />,
    ssr: false,
});

export default function DynamicSections() {
    const [showComments, setShowComments] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fallback: Show comments after 3 seconds even if not intersected
        // This helps with Long Task metrics by delaying the heavy component load
        const fallbackTimer = setTimeout(() => {
            setShowComments(true);
        }, 3000);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShowComments(true);
                    clearTimeout(fallbackTimer); // Clear fallback if intersected
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            clearTimeout(fallbackTimer);
            observer.disconnect();
        };
    }, []);

    return (
        <>
            <MotiveSection />
            <section className="py-6 sm:py-16 px-4">
                <div ref={containerRef} className="min-h-0 sm:min-h-[450px]">
                    {showComments && (
                        <Suspense fallback={
                            <div className="w-full max-w-4xl mx-auto min-h-0 sm:min-h-[450px] bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 animate-pulse">
                                <div className="h-8 w-32 bg-gray-100 rounded-lg mb-4" />
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full shrink-0" />
                                    <div className="flex-grow h-24 bg-gray-50 rounded-xl" />
                                </div>
                                <div className="space-y-4">
                                    {[1, 2].map(i => (
                                        <div key={i} className="flex gap-4 p-4 border border-gray-50 rounded-xl">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full shrink-0" />
                                            <div className="space-y-2 flex-grow">
                                                <div className="h-4 w-32 bg-gray-100 rounded" />
                                                <div className="h-4 w-full bg-gray-50 rounded" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }>
                            <CommentSection />
                        </Suspense>
                    )}
                </div>
            </section>
        </>
    );
}

import React from 'react';

export interface FAQ {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    faqs: FAQ[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
    if (!faqs || faqs.length === 0) return null;

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <section className="mt-16 sm:mt-24 w-full max-w-4xl mx-auto mb-16 px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-8 text-center tracking-tight">
                Frequently Asked Questions
            </h2>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow duration-300"
                    >
                        <h3 className="text-lg font-bold text-black mb-3">
                            {faq.question}
                        </h3>
                        <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
                            {faq.answer}
                        </p>
                    </div>
                ))}
            </div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />
        </section>
    );
}

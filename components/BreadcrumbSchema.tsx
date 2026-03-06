"use client";

import React from 'react';

interface BreadcrumbItem {
    name: string;
    item: string;
}

interface BreadcrumbSchemaProps {
    items: BreadcrumbItem[];
}

const BreadcrumbSchema = ({ items }: BreadcrumbSchemaProps) => {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.item.startsWith('http') ? item.item : `https://alphaprime.co.in${item.item}`,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

export default BreadcrumbSchema;

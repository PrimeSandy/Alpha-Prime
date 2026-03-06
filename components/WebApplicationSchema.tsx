"use client";

import React from 'react';

interface WebAppSchemaProps {
    name: string;
    description: string;
    url: string;
    applicationCategory: string;
    operatingSystem: string;
}

const WebApplicationSchema = ({ name, description, url, applicationCategory, operatingSystem }: WebAppSchemaProps) => {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name,
        description,
        url,
        applicationCategory,
        operatingSystem,
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

export default WebApplicationSchema;

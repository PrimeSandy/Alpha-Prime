import { NextResponse } from 'next/server';

export async function GET() {
    // These should be set in .env.local
    const config = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
    };

    // Optional: Add basic security/validation here if needed
    // In a real app, you might want to consider if this endpoint needs auth,
    // though Firebase client config is generally safe to expose as it relies
    // on Firebase Security Rules for actual data protection.

    return NextResponse.json(config);
}

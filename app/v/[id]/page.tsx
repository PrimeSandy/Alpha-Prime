import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import mongoose from 'mongoose';
import { LinkVault } from '@/lib/models/linkVault';

const BASE_URL = 'https://www.alphaprime.co.in';

async function connectDB() {
    if (mongoose.connection.readyState >= 1) return;
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/PTS_PRO';
    return mongoose.connect(uri);
}

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    return {
        title: 'Link Vault — AlphaPrime',
        description: 'A secured link shared via AlphaPrime Link Vault.',
        openGraph: {
            title: 'Link Vault — AlphaPrime',
            description: 'Click to open this secured link.',
            url: `${BASE_URL}/v/${id}`,
            siteName: 'AlphaPrime',
            images: [
                {
                    url: `${BASE_URL}/logo.png`,
                    width: 512,
                    height: 512,
                    alt: 'AlphaPrime Logo',
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary',
            title: 'Link Vault — AlphaPrime',
            description: 'A secured link shared via AlphaPrime.',
            images: [`${BASE_URL}/logo.png`],
        },
    };
}

export default async function VaultRedirectPage({ params }: Props) {
    const { id } = await params;

    try {
        await connectDB();
        const record = await LinkVault.findOne({ shortId: id });

        if (record && record.status === 'active') {
            redirect(record.originalUrl);
        }
    } catch {
        // Fall through to the fallback UI if redirect or DB fails
    }

    // Fallback rendered page if shortId not found or paused
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-6 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                </div>
                <h1 className="text-2xl font-extrabold text-black mb-2">Link Not Found</h1>
                <p className="text-gray-600 mb-6">
                    This vault link is either invalid, expired, or has been paused by the owner.
                </p>
                <a href="/tools/link-vault"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors">
                    Open Link Vault
                </a>
            </div>
        </div>
    );
}

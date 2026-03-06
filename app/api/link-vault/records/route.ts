import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { LinkVault } from '@/lib/models/linkVault';
import { normalizeUrl } from '@/lib/utils/normalizeUrl';

const schema = z.object({
    url: z.string().url().startsWith('https', { message: 'Must be an HTTPS URL' }),
});

async function connectDB() {
    if (mongoose.connection.readyState >= 1) return;
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/PTS_PRO';
    return mongoose.connect(uri);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url } = schema.parse(body);

        await connectDB();

        const nUrl = normalizeUrl(url);
        const records = await LinkVault.find({ normalizedUrl: nUrl })
            .select('_id actionType createdAt status shortId')   // never expose passwordHash or actionData
            .lean();

        return NextResponse.json({ records }, { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
        }
        console.error('Records error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

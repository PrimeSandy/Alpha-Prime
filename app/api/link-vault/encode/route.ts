import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { LinkVault } from '@/lib/models/linkVault';
import { normalizeUrl } from '@/lib/utils/normalizeUrl';

const BASE_URL = 'https://alphaprime.co.in';

const encodeSchema = z.object({
    url: z.string().url().startsWith('https', { message: 'Must be an HTTPS URL' }),
    actionType: z.enum(['message', 'redirect', 'image', 'note']),
    actionData: z.string().min(1).max(2000),
    password: z.string().min(4).max(50)
});

async function connectDB() {
    if (mongoose.connection.readyState >= 1) return;
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/PTS_PRO';
    return mongoose.connect(uri);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = encodeSchema.parse(body);

        await connectDB();

        const nUrl = normalizeUrl(validatedData.url);
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(validatedData.password, salt);
        const shortId = nanoid(8);

        const newRecord = new LinkVault({
            shortId,
            normalizedUrl: nUrl,
            originalUrl: validatedData.url,
            actionType: validatedData.actionType,
            actionData: validatedData.actionData,
            passwordHash
        });

        await newRecord.save();

        return NextResponse.json({
            success: true,
            shareLink: `${BASE_URL}/v/${shortId}`
        }, { status: 201 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
        }
        console.error('Encode error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

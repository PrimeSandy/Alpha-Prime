import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { LinkVault } from '@/lib/models/linkVault';
import { normalizeUrl } from '@/lib/utils/normalizeUrl';

const decodeSchema = z.object({
    url: z.string().min(1),
    password: z.string().min(1)
});

const SHORT_LINK_PATTERN = /alphaprime\.co\.in\/v\/([a-zA-Z0-9_-]{1,32})/;

async function connectDB() {
    if (mongoose.connection.readyState >= 1) return;
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/PTS_PRO';
    return mongoose.connect(uri);
}

// In-memory rate limiting
const rateLimit = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_ATTEMPTS = 5;

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = rateLimit.get(ip);
    if (!record) { rateLimit.set(ip, { count: 1, windowStart: now }); return true; }
    if (now - record.windowStart > RATE_LIMIT_WINDOW) { rateLimit.set(ip, { count: 1, windowStart: now }); return true; }
    if (record.count >= MAX_ATTEMPTS) return false;
    record.count += 1;
    return true;
}

export async function POST(request: Request) {
    try {
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        if (!checkRateLimit(ip)) {
            return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });
        }

        const body = await request.json();
        const { url, password } = decodeSchema.parse(body);

        await connectDB();

        // Detect short link format  e.g. alphaprime.co.in/v/xK9mZ2
        const shortMatch = url.match(SHORT_LINK_PATTERN);

        let records = [];
        if (shortMatch) {
            const shortId = shortMatch[1];
            records = await LinkVault.find({ shortId });
        } else {
            // Validate it's a proper HTTPS URL in the old format
            if (!url.toLowerCase().startsWith('https')) {
                return NextResponse.json({ error: 'URL must start with https://' }, { status: 400 });
            }
            const nUrl = normalizeUrl(url);
            records = await LinkVault.find({ normalizedUrl: nUrl });
        }

        if (!records || records.length === 0) {
            return NextResponse.json({ error: 'Invalid password or no record found' }, { status: 404 });
        }

        let matchedRecord = null;
        for (const rec of records) {
            const isMatch = await bcrypt.compare(password, rec.passwordHash);
            if (isMatch) { matchedRecord = rec; break; }
        }

        if (!matchedRecord) {
            return NextResponse.json({ error: 'Invalid password or no record found' }, { status: 404 });
        }

        if (matchedRecord.status === 'paused') {
            return NextResponse.json({ error: 'This link has been paused by the owner.' }, { status: 403 });
        }

        return NextResponse.json({
            actionType: matchedRecord.actionType,
            actionData: matchedRecord.actionData
        }, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
        }
        console.error('Decode error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

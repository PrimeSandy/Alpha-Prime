import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { LinkVault } from '@/lib/models/linkVault';
import { normalizeUrl } from '@/lib/utils/normalizeUrl';

const schema = z.object({
    id: z.string(),
});

async function connectDB() {
    if (mongoose.connection.readyState >= 1) return;
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/PTS_PRO';
    return mongoose.connect(uri);
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id } = schema.parse(body);

        await connectDB();

        const matched = await LinkVault.findById(id);

        if (!matched) {
            return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }

        matched.status = matched.status === 'active' ? 'paused' : 'active';
        await matched.save();

        return NextResponse.json({ message: `Record ${matched.status}`, status: matched.status }, { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
        }
        console.error('Status toggle error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

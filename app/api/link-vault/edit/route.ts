import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { LinkVault } from '@/lib/models/linkVault';
import { normalizeUrl } from '@/lib/utils/normalizeUrl';

const editSchema = z.object({
    id: z.string(),
    newActionType: z.enum(['message', 'redirect', 'image', 'note']),
    newActionData: z.string().min(1).max(2000),
});

async function connectDB() {
    if (mongoose.connection.readyState >= 1) return;
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/PTS_PRO';
    return mongoose.connect(uri);
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, newActionType, newActionData } = editSchema.parse(body);

        await connectDB();

        const matchedRecord = await LinkVault.findById(id);

        if (!matchedRecord) {
            return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }

        matchedRecord.actionType = newActionType;
        matchedRecord.actionData = newActionData;
        await matchedRecord.save();

        return NextResponse.json({ message: 'Record updated successfully' }, { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
        }
        console.error('Edit error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

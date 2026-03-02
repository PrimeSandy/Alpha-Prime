import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { LinkVault } from '@/lib/models/linkVault';

const schema = z.object({
    id: z.string(),
});

async function connectDB() {
    if (mongoose.connection.readyState >= 1) return;
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/PTS_PRO';
    return mongoose.connect(uri);
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const { id } = schema.parse(body);

        await connectDB();

        const deleted = await LinkVault.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Record deleted successfully' }, { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
        }
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { getAnnouncement, updateAnnouncement, Announcement } from '@/lib/announcement';

export async function GET() {
    return NextResponse.json(getAnnouncement());
}

export async function POST(request: Request) {
    try {
        const data: Announcement = await request.json();
        const success = updateAnnouncement(data);
        if (success) {
            return NextResponse.json({ message: 'Announcement updated successfully' });
        }
        return NextResponse.json({ message: 'Failed to update announcement' }, { status: 500 });
    } catch (error) {
        return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }
}

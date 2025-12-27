import { NextResponse } from 'next/server';
import { readJson, writeJson, checkAuth } from '@/lib/db';
import { saveFile } from '@/lib/upload';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const timeSlot = formData.get('timeSlot') as string;
        const file = formData.get('image') as File | null;

        console.log('Background update request for:', timeSlot);
        if (file) console.log('File received:', file.name, file.size);

        if (!['sabah', 'oglen', 'aksam'].includes(timeSlot)) {
            return NextResponse.json({ error: 'Invalid time slot' }, { status: 400 });
        }
        if (!file) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        const savedPath = await saveFile(file);

        let existingData = await readJson('backgrounds.json') || {};
        const updatedData = {
            ...existingData,
            [timeSlot]: savedPath
        };

        const success = await writeJson('backgrounds.json', updatedData);
        if (!success) throw new Error('Failed to save to database');

        console.log('Successfully updated background for:', timeSlot);
        return NextResponse.json({ success: true, backgrounds: updatedData });
    } catch (error: any) {
        console.error('Update Error:', error);
        return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 });
    }
}

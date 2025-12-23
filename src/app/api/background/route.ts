import { NextResponse } from 'next/server';
import { readJson, writeJson, checkAuth } from '@/lib/db';
import { saveFile } from '@/lib/upload';

export async function POST(request: Request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const timeSlot = formData.get('timeSlot') as string;
        const file = formData.get('image') as File | null;

        if (!['sabah', 'oglen', 'aksam'].includes(timeSlot)) {
            return NextResponse.json({ error: 'Invalid time slot' }, { status: 400 });
        }
        if (!file) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        const savedPath = await saveFile(file);
        let data = await readJson('backgrounds.json') || {};

        data[timeSlot] = savedPath;
        await writeJson('backgrounds.json', data);

        return NextResponse.json({ success: true, backgrounds: data });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update background' }, { status: 500 });
    }
}

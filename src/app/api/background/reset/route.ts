import { NextResponse } from 'next/server';
import { readJson, writeJson, checkAuth } from '@/lib/db';

export async function POST(request: Request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { timeSlot } = body;
        let data = await readJson('backgrounds.json') || {};

        const defaults: any = { sabah: 'sabah.png', oglen: 'oglen.jpg', aksam: 'aksam.jpg' };
        data[timeSlot] = defaults[timeSlot];

        await writeJson('backgrounds.json', data);
        return NextResponse.json({ success: true, backgrounds: data });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

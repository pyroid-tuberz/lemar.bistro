import { NextResponse } from 'next/server';
import { readJson, writeJson, checkAuth } from '@/lib/db';

export async function POST(request: Request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { times } = body;

        let data = await readJson('backgrounds.json') || {};
        data.times = {
            sabah: parseInt(times.sabah) || 6,
            oglen: parseInt(times.oglen) || 12,
            aksam: parseInt(times.aksam) || 18
        };

        await writeJson('backgrounds.json', data);
        return NextResponse.json({ success: true, times: data.times });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update times' }, { status: 500 });
    }
}

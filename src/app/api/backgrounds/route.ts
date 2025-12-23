import { NextResponse } from 'next/server';
import { readJson } from '@/lib/db';

export async function GET() {
    const data = await readJson('backgrounds.json') || {
        sabah: 'sabah.png', oglen: 'oglen.jpg', aksam: 'aksam.jpg',
        times: { sabah: 6, oglen: 12, aksam: 18 }
    };
    if (!data.times) {
        data.times = { sabah: 6, oglen: 12, aksam: 18 };
    }
    return NextResponse.json(data);
}

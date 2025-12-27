import { NextResponse } from 'next/server';
import { readJson } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    const defaults = {
        sabah: 'sabah.png',
        oglen: 'oglen.jpg',
        aksam: 'aksam.jpg',
        times: { sabah: 6, oglen: 12, aksam: 18 }
    };

    let dbData = await readJson('backgrounds.json');
    if (!dbData || typeof dbData !== 'object') {
        dbData = {};
    }

    // Strictly sanitize: sabah, oglen, and aksam must be strings
    const getUrl = (key: string) => {
        const val = dbData[key];
        return (typeof val === 'string' && val.length > 5) ? val : (defaults as any)[key];
    };

    const result = {
        sabah: getUrl('sabah'),
        oglen: getUrl('oglen'),
        aksam: getUrl('aksam'),
        times: {
            sabah: Number(dbData.times?.sabah ?? defaults.times.sabah),
            oglen: Number(dbData.times?.oglen ?? defaults.times.oglen),
            aksam: Number(dbData.times?.aksam ?? defaults.times.aksam)
        }
    };

    console.log('Final API data for backgrounds:', JSON.stringify(result));
    return NextResponse.json(result);
}

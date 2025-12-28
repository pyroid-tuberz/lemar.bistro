import { NextResponse } from 'next/server';
import { readJson, writeJson, checkAuth } from '@/lib/db';
import { supabase } from '@/lib/supabase'; // Import supabase

export async function POST(request: Request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { timeSlot } = body;
        let data = await readJson('backgrounds.json') || {};

        // Delete old image from Supabase if it exists
        const oldImageUrl = data[timeSlot];
        if (oldImageUrl && typeof oldImageUrl === 'string' && oldImageUrl.includes('supabase.co')) {
            const oldFilename = oldImageUrl.substring(oldImageUrl.lastIndexOf('/') + 1);
            if (oldFilename) {
                const { error: deleteError } = await supabase.storage
                    .from('lemar-uploads')
                    .remove([oldFilename]);
                if (deleteError) {
                    console.warn(`Supabase delete warning for old background image ${oldFilename}: ${deleteError.message}`);
                }
            }
        }

        const defaults: any = { sabah: 'sabah.png', oglen: 'oglen.jpg', aksam: 'aksam.jpg' };
        data[timeSlot] = defaults[timeSlot];

        await writeJson('backgrounds.json', data);
        return NextResponse.json({ success: true, backgrounds: data });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}


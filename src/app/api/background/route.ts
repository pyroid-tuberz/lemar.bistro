import { NextResponse } from 'next/server';
import { readJson, writeJson, checkAuth } from '@/lib/db';
import { saveFile } from '@/lib/upload';
import { supabase } from '@/lib/supabase'; // Import supabase

export const dynamic = 'force-dynamic';

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

        let existingData = await readJson('backgrounds.json') || {};

        // Delete old image from Supabase if it exists
        const oldImageUrl = existingData[timeSlot];
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

        const savedPath = await saveFile(file);
        
        const updatedData = {
            ...existingData,
            [timeSlot]: savedPath
        };

        const success = await writeJson('backgrounds.json', updatedData);
        if (!success) throw new Error('Failed to save to database');

        return NextResponse.json({ success: true, backgrounds: updatedData });
    } catch (error: any) {
        console.error('Update Error:', error);
        return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 });
    }
}


import { NextResponse } from 'next/server';
import { readJson, writeJson, checkAuth } from '@/lib/db';
import { saveFile } from '@/lib/upload';

export async function GET() {
    const data = await readJson('artists.json');
    if (!data) {
        // Fallback default structure
        const emptyWeek = Array(7).fill(null).map((_, i) => ({
            dayName: ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"][i],
            artist1: { name: 'Sanatçı Bekleniyor', image: 'uploads/default_artist.png' },
            artist2: { name: 'Sanatçı Bekleniyor', image: 'uploads/default_artist.png' }
        }));
        return NextResponse.json(emptyWeek);
    }
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const dayIndexStr = formData.get('dayIndex') as string;
        const artistSlotStr = formData.get('artistSlot') as string; // '1' or '2'
        const name = formData.get('name') as string;
        const file = formData.get('image') as File | null;

        const dIdx = parseInt(dayIndexStr);
        const slot = parseInt(artistSlotStr);

        if (isNaN(dIdx) || dIdx < 0 || dIdx > 6 || (slot !== 1 && slot !== 2)) {
            return NextResponse.json({ error: 'Invalid day index or artist slot' }, { status: 400 });
        }

        let data = await readJson('artists.json');
        if (!data) {
            data = Array(7).fill(null).map((_, i) => ({
                dayName: ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"][i],
                artist1: { name: 'Sanatçı Bekleniyor', image: 'uploads/default_artist.png' },
                artist2: { name: 'Sanatçı Bekleniyor', image: 'uploads/default_artist.png' }
            }));
        }

        const artistKey = `artist${slot}` as 'artist1' | 'artist2';
        if (name) data[dIdx][artistKey].name = name;

        // Only save file if it has content
        if (file && file.size > 0) {
            try {
                const savedPath = await saveFile(file);
                data[dIdx][artistKey].image = savedPath;
            } catch (fileErr) {
                console.error('File save error:', fileErr);
                // Continue saving name even if image fails? 
                // Better to throw so user knows something went wrong, or just log it.
            }
        }

        const success = await writeJson('artists.json', data);
        if (!success) {
            throw new Error('Write to file system failed');
        }
        return NextResponse.json({ success: true, artist: data[dIdx][artistKey] });
    } catch (error) {
        console.error('Artist POST error:', error);
        return NextResponse.json({ error: 'Failed to update artist (File System Read-Only?)' }, { status: 500 });
    }
}

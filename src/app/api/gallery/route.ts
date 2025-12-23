import { NextResponse } from 'next/server';
import { readJson, writeJson, checkAuth } from '@/lib/db';
import { saveFile } from '@/lib/upload';

export async function GET() {
    const data = await readJson('gallery.json') || { images: [] };
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('image') as File | null;
        const timesStr = formData.get('times') as string || '[]';

        if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

        const savedPath = await saveFile(file);
        const times = JSON.parse(timesStr);

        const newImage = {
            src: savedPath, // saveFile returns 'uploads/filename.jpg'
            times: times
        };

        const data = await readJson('gallery.json') || { images: [] };
        data.images.push(newImage);

        await writeJson('gallery.json', data);
        return NextResponse.json({ success: true, image: newImage });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to save gallery data' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { src } = body;
        const data = await readJson('gallery.json') || { images: [] };

        data.images = data.images.filter((img: any) => img.src !== src);

        await writeJson('gallery.json', data);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
    }
}

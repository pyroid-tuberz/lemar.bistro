import { NextResponse } from 'next/server';
import { readJson, writeJson, checkAuth } from '@/lib/db';

export async function GET() {
    const data = await readJson('testimonials.json') || [];
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, name, text } = body;
        if (!name || !text) return NextResponse.json({ error: 'Name and text required' }, { status: 400 });

        let data = await readJson('testimonials.json') || [];

        if (id) {
            // Update
            const idx = data.findIndex((t: any) => t.id === id);
            if (idx > -1) data[idx] = { id, name, text };
        } else {
            // Add
            data.push({ id: Date.now().toString(36), name, text });
        }

        await writeJson('testimonials.json', data);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save testimonial' }, { status: 500 });
    }
}

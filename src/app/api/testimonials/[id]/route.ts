import { NextResponse } from 'next/server';
import { readJson, writeJson, checkAuth } from '@/lib/db';

export async function DELETE(request: Request, { params }: { params: { id:string } }) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = params;

    try {
        let data = await readJson('testimonials.json') || [];
        const initialCount = data.length;
        data = data.filter((t: any) => t.id !== id);

        if (data.length === initialCount) {
            return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
        }

        await writeJson('testimonials.json', data);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
    }
}

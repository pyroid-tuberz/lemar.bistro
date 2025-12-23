import { NextResponse } from 'next/server';
import { readJson, writeJson, checkAuth } from '@/lib/db';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;

    try {
        const data = await readJson('menu.json') || { items: [], categories: {} };

        if (!data.categories[id]) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

        delete data.categories[id];

        await writeJson('menu.json', data);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}

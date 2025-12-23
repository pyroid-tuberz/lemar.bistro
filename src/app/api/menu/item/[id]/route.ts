import { NextResponse } from 'next/server';
import { readJson, writeJson, checkAuth } from '@/lib/db';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;

    try {
        const data = await readJson('menu.json') || { items: [], categories: {} };
        const initialLength = data.items.length;
        data.items = data.items.filter((i: any) => i.id !== id);

        if (data.items.length === initialLength) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        await writeJson('menu.json', data);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
    }
}

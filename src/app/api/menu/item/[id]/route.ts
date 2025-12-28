import { NextResponse } from 'next/server';
import { readJson, writeJson, checkAuth } from '@/lib/db';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
        }

        const data = await readJson('menu.json') || { items: [], categories: {} };
        const initialCount = data.items.length;
        
        data.items = data.items.filter((i: any) => i.id !== id);

        if (data.items.length === initialCount) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        const success = await writeJson('menu.json', data);
        if (success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Failed to save menu data' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error deleting menu item:', error);
        return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
    }
}
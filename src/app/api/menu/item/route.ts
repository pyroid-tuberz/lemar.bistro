import { NextResponse } from 'next/server';
import { readJson, writeJson, checkAuth } from '@/lib/db';

export async function POST(request: Request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { item } = body;
        if (!item) return NextResponse.json({ error: 'Item data required' }, { status: 400 });

        const data = await readJson('menu.json') || { items: [], categories: {} };

        // Check if updating
        const existingIndex = data.items.findIndex((i: any) => i.id === item.id);

        if (existingIndex > -1) {
            data.items[existingIndex] = item;
        } else {
            // New item
            if (!item.id) item.id = Date.now().toString(36);
            data.items.push(item);
        }

        await writeJson('menu.json', data);
        return NextResponse.json({ success: true, item });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save menu data' }, { status: 500 });
    }
}

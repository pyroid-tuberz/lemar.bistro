import { NextResponse } from 'next/server';
import { readJson, writeJson, checkAuth } from '@/lib/db';

export async function POST(request: Request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, name, parent, color, size } = body;
        if (!id || !name) return NextResponse.json({ error: 'ID and Name required' }, { status: 400 });

        const data = await readJson('menu.json') || { items: [], categories: {} };

        data.categories[id] = {
            name: name,
            parent: parent || 'root',
            color: color || '#FFC700',
            size: size || 'normal'
        };

        await writeJson('menu.json', data);
        return NextResponse.json({ success: true, category: data.categories[id] });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save category' }, { status: 500 });
    }
}

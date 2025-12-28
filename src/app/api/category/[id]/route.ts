import { NextResponse } from 'next/server';
import { readJson, writeJson, checkAuth } from '@/lib/db';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = params;

    try {
        const data = await readJson('menu.json') || { items: [], categories: {} };

        if (!data.categories[id]) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        // Check if any item is using this category
        const isCategoryInUse = data.items.some((item: any) => item.category === id);
        if (isCategoryInUse) {
            return NextResponse.json({ error: 'Category is in use and cannot be deleted.' }, { status: 400 });
        }

        delete data.categories[id];

        await writeJson('menu.json', data);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { readJson } from '@/lib/db';

export async function GET() {
    const menu = await readJson('menu.json') || { items: [], categories: {} };
    return NextResponse.json(menu);
}

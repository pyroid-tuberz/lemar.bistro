import { NextResponse } from 'next/server';
import { readJson } from '@/lib/db';
export const dynamic = 'force-dynamic';

export async function GET() {
    const menu = await readJson('menu.json') || { items: [], categories: {} };
    return NextResponse.json(menu);
}

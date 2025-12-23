import { supabase } from './supabase';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'public');

export async function readJson(filename: string) {
    try {
        // 1. Try fetching from Supabase
        const { data, error } = await supabase
            .from('app_data')
            .select('value')
            .eq('key', filename)
            .single();

        if (data) {
            return data.value;
        }

        // 2. If not found in Supabase (first load), fallback to local JSON
        // & optional: Migrate it to Supabase immediately? 
        // Let's just return it. Writing will happen on next 'writeJson'.
        const filePath = path.join(DATA_DIR, filename);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const json = JSON.parse(fileContent);

        // Optional: Auto-migrate on read if missing?
        // This ensures the DB gets populated on first read of any page.
        // But writeJson might be safer to be explicit. 
        // Let's stick to simple fallback for now.
        return json;

    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return null;
    }
}

export async function writeJson(filename: string, data: any) {
    try {
        // Upsert data to Supabase
        const { error } = await supabase
            .from('app_data')
            .upsert({ key: filename, value: data });

        if (error) {
            console.error('Supabase Write Error:', error);
            return false;
        }
        return true;
    } catch (error) {
        console.error(`Error writing to ${filename}:`, error);
        return false;
    }
}

// Simple auth check helper (mirroring legacy logic)
export function checkAuth(request: Request) {
    const authHeader = request.headers.get('authorization');
    return authHeader === 'Bearer lemara-secret-admin-token';
}

import { supabase } from './supabase';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'public');

export async function readJson(filename: string) {
    try {
        console.log(`Reading ${filename} from Supabase...`);
        // 1. Try fetching from Supabase (Primary Source)
        const { data, error } = await supabase
            .from('app_data')
            .select('value')
            .eq('key', filename)
            .single();

        if (data) {
            return data.value;
        }

        // 2. If not found in Supabase (First deployment), read from local file as Initial State
        console.log(`${filename} not found in Supabase. Loading initial data from file...`);
        const filePath = path.join(DATA_DIR, filename);

        try {
            const fileContent = await fs.readFile(filePath, 'utf8');
            const json = JSON.parse(fileContent);

            // Auto-migrate to Supabase so it exists next time
            // This is crucial for Vercel cold starts
            await writeJson(filename, json);

            return json;
        } catch (filesErr) {
            console.warn(`Could not read initial local file ${filename}:`, filesErr);
            return filename.includes('gallery') ? { images: [] } :
                filename.includes('menu') ? { items: [], categories: {} } : {};
        }

    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return null;
    }
}

export async function writeJson(filename: string, data: any) {
    try {
        console.log(`Writing ${filename} to Supabase...`);
        // Upsert data to Supabase (Production Source)
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

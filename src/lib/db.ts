import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'public');

export async function readJson(filename: string) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return null; // Return null if file doesn't exist or error
    }
}

export async function writeJson(filename: string, data: any) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
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

import { writeFile } from 'fs/promises';
import path from 'path';

export async function saveFile(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename or use random
    // Using random name to avoid conflicts and encoding issues
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // basic extension extraction
    const ext = path.extname(file.name) || '.jpg';
    const filename = uniqueSuffix + ext;

    // Ensure directory exists? public/uploads should exist from backup copy.
    const savePath = path.join(process.cwd(), 'public/uploads', filename);

    await writeFile(savePath, buffer);
    return 'uploads/' + filename;
}

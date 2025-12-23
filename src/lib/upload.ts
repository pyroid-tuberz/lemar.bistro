import { supabase } from './supabase';
import path from 'path';

export async function saveFile(file: File): Promise<string> {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.name) || '.jpg';
    const filename = uniqueSuffix + ext;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
        .from('lemar-uploads')
        .upload(filename, file, {
            upsert: false
        });

    if (error) {
        throw new Error('Supabase Upload Failed: ' + error.message);
    }

    // Get Public URL
    const { data: urlData } = supabase.storage
        .from('lemar-uploads')
        .getPublicUrl(filename);

    return urlData.publicUrl;
}

import { supabase } from './supabase';
import path from 'path';

export async function saveFile(file: File): Promise<string> {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.name) || '.jpg';
    const filename = uniqueSuffix + ext;

    /* 
       Production / Vercel Mode:
       We CANNOT save to local 'public/uploads' because the filesystem is read-only or ephemeral.
       We MUST upload to Supabase Storage.
    */

    try {
        console.log(`Uploading ${filename} to Supabase...`);
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

        console.log('Upload success, URL:', urlData.publicUrl);
        return urlData.publicUrl;
    } catch (error: any) {
        console.error('Upload Error:', error);
        throw error;
    }
}

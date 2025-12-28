import { NextResponse } from 'next/server';
import { readJson, writeJson, checkAuth } from '@/lib/db';
import { supabase } from '@/lib/supabase'; // Import supabase client

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = params;
        if (!id) {
            return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
        }

        const data = await readJson('gallery.json') || { images: [] };
        
        const imageToDelete = data.images.find((img: any) => img.id === id);
        if (!imageToDelete) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }

        // Delete from Supabase Storage
        try {
            const imageUrl = imageToDelete.src;
            const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
            
            if (filename) {
                const { error: deleteError } = await supabase.storage
                    .from('lemar-uploads')
                    .remove([filename]);
                
                if (deleteError) {
                    console.warn(`Supabase delete warning for ${filename}: ${deleteError.message}`);
                }
            }
        } catch (storageError: any) {
            console.warn(`Could not delete file from Supabase storage ${imageToDelete.src}: ${storageError.message}`);
        }

        // Remove from JSON data
        data.images = data.images.filter((img: any) => img.id !== id);

        const success = await writeJson('gallery.json', data);
        if (success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Failed to save gallery data' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error deleting gallery image:', error);
        return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 });
    }
}


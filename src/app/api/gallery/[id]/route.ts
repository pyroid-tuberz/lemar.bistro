import { NextResponse } from 'next/server';
import { readJson, writeJson, checkAuth } from '@/lib/db';
import { supabase } from '@/lib/supabase'; // Import supabase client

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
        }

        const data = await readJson('gallery.json') || { images: [] };

        const imageToDelete = data.images.find((img: any) => img.id === id);
        if (!imageToDelete) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }

        // Delete from Local Filesystem (if path starts with /uploads/)
        try {
            const imageUrl = imageToDelete.src;
            if (imageUrl.startsWith('/uploads/')) {
                const fs = require('fs/promises');
                const path = require('path');
                const filePath = path.join(process.cwd(), 'public', imageUrl); // /uploads/... includes slash
                await fs.unlink(filePath).catch((e: any) => console.warn('Local file delete failed:', e.message));
            }
        } catch (localErr) {
            console.error('Error deleting local file:', localErr);
        }

        // Delete from Supabase Storage (Optional)
        try {
            const imageUrl = imageToDelete.src;
            const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);

            if (filename && !imageUrl.startsWith('/uploads/')) { // Only if not local
                const { error: deleteError } = await supabase.storage
                    .from('lemar-uploads')
                    .remove([filename]);

                if (deleteError) {
                    console.warn(`Supabase delete warning by filename ${filename}: ${deleteError.message}`);
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


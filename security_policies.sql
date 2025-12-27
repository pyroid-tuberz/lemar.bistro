-- SUPABASE SECURITY START
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- 1. Enable RLS on app_data table
ALTER TABLE app_data ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policy if it exists (for clean execution)
DROP POLICY IF EXISTS "Public read access" ON app_data;

-- 3. Create Policy: Allow public (anon) to read all metadata
CREATE POLICY "Public read access"
ON app_data
FOR SELECT
TO anon
USING (true);

-- 4. Enable RLS on storage buckets (optional but recommended)
-- Note: Already handled via dashboard usually, but for completeness:
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'uploads' );

-- SECURITY SETUP COMPLETE

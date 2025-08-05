/*
  # Create pengumuman table for live announcements

  1. New Tables
    - `pengumuman`
      - `id` (int, primary key, auto-increment)
      - `title` (text, not null)
      - `content` (text, not null)
      - `priority` (enum: low/medium/high, default medium)
      - `active` (boolean, default true)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

  2. Security
    - Enable RLS on `pengumuman` table
    - Add policies for public read and authenticated write
*/

CREATE TABLE IF NOT EXISTS pengumuman (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pengumuman ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read pengumuman data"
  ON pengumuman
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert pengumuman data"
  ON pengumuman
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update pengumuman data"
  ON pengumuman
  FOR UPDATE
  TO authenticated
  USING (true);

-- Insert sample pengumuman data
INSERT INTO pengumuman (title, content, priority, active) VALUES
(
  'Pembayaran Iuran Januari 2025',
  'Batas waktu pembayaran iuran bulan Januari 2025 hingga tanggal 20 Januari. Mohon segera lakukan pembayaran.',
  'high',
  true
),
(
  'Gotong Royong Minggu Depan',
  'Kegiatan gotong royong bersih-bersih lingkungan akan dilaksanakan hari Minggu, 19 Januari 2025 pukul 07.00 WIB.',
  'medium',
  true
);
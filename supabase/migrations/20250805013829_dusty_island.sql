/*
  # Create iuran (dues) table

  1. New Tables
    - `iuran`
      - `id` (int, primary key, auto-increment)
      - `warga_id` (int, foreign key to warga)
      - `bulan` (text, month name)
      - `tahun` (int, year)
      - `jenis` (enum: bulanan/sampah)
      - `jumlah` (int, amount in rupiah)
      - `status` (enum: lunas/belum, default belum)
      - `tanggal_bayar` (date, nullable)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

  2. Security
    - Enable RLS on `iuran` table
    - Add policies for public read and authenticated write
*/

CREATE TABLE IF NOT EXISTS iuran (
  id SERIAL PRIMARY KEY,
  warga_id INTEGER REFERENCES warga(id) ON DELETE CASCADE,
  bulan TEXT NOT NULL,
  tahun INTEGER NOT NULL,
  jenis TEXT NOT NULL CHECK (jenis IN ('bulanan', 'sampah')),
  jumlah INTEGER NOT NULL,
  status TEXT DEFAULT 'belum' CHECK (status IN ('lunas', 'belum')),
  tanggal_bayar DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE iuran ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read iuran data"
  ON iuran
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert iuran data"
  ON iuran
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update iuran data"
  ON iuran
  FOR UPDATE
  TO authenticated
  USING (true);

-- Insert sample iuran data for January 2025
INSERT INTO iuran (warga_id, bulan, tahun, jenis, jumlah, status, tanggal_bayar) VALUES
-- Iuran Bulanan Januari 2025
(1, 'Januari', 2025, 'bulanan', 150000, 'lunas', '2025-01-05'),
(2, 'Januari', 2025, 'bulanan', 150000, 'lunas', '2025-01-07'),
(3, 'Januari', 2025, 'bulanan', 150000, 'belum', NULL),
(4, 'Januari', 2025, 'bulanan', 150000, 'lunas', '2025-01-10'),
(5, 'Januari', 2025, 'bulanan', 150000, 'belum', NULL),
(6, 'Januari', 2025, 'bulanan', 150000, 'lunas', '2025-01-12'),
(7, 'Januari', 2025, 'bulanan', 150000, 'belum', NULL),
(8, 'Januari', 2025, 'bulanan', 150000, 'lunas', '2025-01-08'),
(9, 'Januari', 2025, 'bulanan', 150000, 'lunas', '2025-01-15'),
(10, 'Januari', 2025, 'bulanan', 150000, 'belum', NULL),

-- Iuran Sampah Januari 2025
(1, 'Januari', 2025, 'sampah', 25000, 'lunas', '2025-01-05'),
(2, 'Januari', 2025, 'sampah', 25000, 'lunas', '2025-01-07'),
(3, 'Januari', 2025, 'sampah', 25000, 'belum', NULL),
(4, 'Januari', 2025, 'sampah', 25000, 'lunas', '2025-01-10'),
(5, 'Januari', 2025, 'sampah', 25000, 'belum', NULL),
(6, 'Januari', 2025, 'sampah', 25000, 'lunas', '2025-01-12'),
(7, 'Januari', 2025, 'sampah', 25000, 'belum', NULL),
(8, 'Januari', 2025, 'sampah', 25000, 'lunas', '2025-01-08'),
(9, 'Januari', 2025, 'sampah', 25000, 'lunas', '2025-01-15'),
(10, 'Januari', 2025, 'sampah', 25000, 'belum', NULL);
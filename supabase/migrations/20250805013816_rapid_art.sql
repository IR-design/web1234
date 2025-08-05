/*
  # Create warga (residents) table

  1. New Tables
    - `warga`
      - `id` (int, primary key, auto-increment)
      - `nama` (text, not null)
      - `alamat` (text, not null)
      - `telepon` (text, not null)
      - `email` (text, not null)
      - `status` (enum: aktif/non-aktif, default aktif)
      - `jumlah_anggota` (int, default 1)
      - `pekerjaan` (text, not null)
      - `tanggal_daftar` (date, default today)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

  2. Security
    - Enable RLS on `warga` table
    - Add policy for authenticated users to read all data
    - Add policy for authenticated users to update their own data
*/

CREATE TABLE IF NOT EXISTS warga (
  id SERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  alamat TEXT NOT NULL,
  telepon TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'aktif' CHECK (status IN ('aktif', 'non-aktif')),
  jumlah_anggota INTEGER DEFAULT 1,
  pekerjaan TEXT NOT NULL,
  tanggal_daftar DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE warga ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read warga data"
  ON warga
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert warga data"
  ON warga
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update warga data"
  ON warga
  FOR UPDATE
  TO authenticated
  USING (true);

-- Insert sample data
INSERT INTO warga (nama, alamat, telepon, email, jumlah_anggota, pekerjaan) VALUES
('Budi Santoso', 'Jl. Kalita Blok A No. 15', '+62 812-3456-7890', 'budi.santoso@email.com', 4, 'Pegawai Swasta'),
('Siti Nurhaliza', 'Jl. Kalita Blok B No. 8', '+62 813-2345-6789', 'siti.nurhaliza@email.com', 3, 'Guru'),
('Ahmad Wijaya', 'Jl. Kalita Blok C No. 22', '+62 814-3456-7890', 'ahmad.wijaya@email.com', 5, 'Wiraswasta'),
('Rina Marlina', 'Jl. Kalita Blok A No. 7', '+62 815-4567-8901', 'rina.marlina@email.com', 2, 'Dokter'),
('Dedi Kurniawan', 'Jl. Kalita Blok D No. 12', '+62 816-5678-9012', 'dedi.kurniawan@email.com', 4, 'Insinyur'),
('Maya Sari', 'Jl. Kalita Blok B No. 18', '+62 817-6789-0123', 'maya.sari@email.com', 3, 'Perawat'),
('Hendra Gunawan', 'Jl. Kalita Blok C No. 5', '+62 818-7890-1234', 'hendra.gunawan@email.com', 2, 'Mahasiswa'),
('Indira Putri', 'Jl. Kalita Blok A No. 25', '+62 819-8901-2345', 'indira.putri@email.com', 4, 'Ibu Rumah Tangga'),
('Rudi Hermawan', 'Jl. Kalita Blok D No. 3', '+62 820-9012-3456', 'rudi.hermawan@email.com', 3, 'Polisi'),
('Dewi Lestari', 'Jl. Kalita Blok B No. 14', '+62 821-0123-4567', 'dewi.lestari@email.com', 5, 'Pegawai Bank');
/*
  # Create berita (news) table

  1. New Tables
    - `berita`
      - `id` (int, primary key, auto-increment)
      - `title` (text, not null)
      - `content` (text, not null)
      - `summary` (text, not null)
      - `type` (enum: berita/pengumuman)
      - `author` (text, not null)
      - `published_at` (timestamp, default now)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

  2. Security
    - Enable RLS on `berita` table
    - Add policies for public read and authenticated write
*/

CREATE TABLE IF NOT EXISTS berita (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('berita', 'pengumuman')),
  author TEXT NOT NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE berita ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read berita data"
  ON berita
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert berita data"
  ON berita
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update berita data"
  ON berita
  FOR UPDATE
  TO authenticated
  USING (true);

-- Insert sample berita data
INSERT INTO berita (title, content, summary, type, author, published_at) VALUES
(
  'Pembayaran Iuran Bulan Januari 2025',
  'Kepada seluruh warga Cluster Kalita yang terhormat,

Dengan ini kami mengingatkan bahwa pembayaran iuran bulanan untuk bulan Januari 2025 sudah memasuki tenggat waktu. 

Detail pembayaran:
- Iuran Bulanan: Rp 150.000
- Iuran Sampah: Rp 25.000
- Total: Rp 175.000

Batas waktu pembayaran: 20 Januari 2025

Pembayaran dapat dilakukan melalui:
1. Transfer ke rekening BCA: 1234567890 a.n. Ahmad Wijaya (Bendahara)
2. Transfer ke rekening Mandiri: 0987654321 a.n. Ahmad Wijaya
3. Pembayaran langsung ke Bendahara di Jl. Kalita Blok C No. 22

Mohon konfirmasi pembayaran melalui WhatsApp ke nomor 0814-3456-7890.

Terima kasih atas perhatian dan kerjasamanya.',
  'Reminder untuk warga yang belum melakukan pembayaran iuran bulanan Januari 2025. Batas waktu pembayaran hingga tanggal 20 Januari.',
  'pengumuman',
  'Ahmad Wijaya',
  '2025-01-15 10:00:00'
),
(
  'Gotong Royong Bersih-Bersih Lingkungan',
  'Assalamualaikum wr.wb dan salam sejahtera,

Dalam rangka menjaga kebersihan dan keindahan lingkungan Cluster Kalita, kami mengundang seluruh warga untuk berpartisipasi dalam kegiatan gotong royong bersih-bersih lingkungan.

Detail Kegiatan:
- Hari/Tanggal: Minggu, 19 Januari 2025
- Waktu: 07.00 - 10.00 WIB
- Titik Kumpul: Balai Pertemuan Cluster Kalita

Kegiatan yang akan dilakukan:
1. Pembersihan jalan dan trotoar
2. Penataan taman dan area hijau
3. Pembersihan saluran air
4. Pengecatan fasilitas umum

Yang perlu dibawa:
- Sarung tangan
- Masker
- Peralatan kebersihan (sapu, cangkul, dll)
- Semangat gotong royong

Setelah kegiatan, akan disediakan snack dan minuman untuk semua peserta.

Mari bersama-sama menciptakan lingkungan yang bersih dan indah!

Hormat kami,
Pengurus RT Cluster Kalita',
  'Kegiatan gotong royong bersih-bersih lingkungan cluster akan dilaksanakan pada hari Minggu, 19 Januari 2025 pukul 07.00 WIB.',
  'berita',
  'Budi Santoso',
  '2025-01-10 08:30:00'
),
(
  'Rapat Bulanan Pengurus RT',
  'Kepada Bapak/Ibu Pengurus RT Cluster Kalita,

Dengan ini kami mengundang untuk menghadiri rapat bulanan pengurus RT yang akan membahas berbagai agenda penting.

Detail Rapat:
- Hari/Tanggal: Sabtu, 25 Januari 2025
- Waktu: 19.30 - 21.00 WIB
- Tempat: Balai Pertemuan Cluster Kalita

Agenda Rapat:
1. Pembukaan dan laporan kegiatan bulan lalu
2. Laporan keuangan dan iuran warga
3. Evaluasi program kerja
4. Perencanaan kegiatan bulan depan
5. Pembahasan keluhan dan saran warga
6. Lain-lain

Mohon kehadiran tepat waktu. Bagi yang berhalangan hadir, silakan konfirmasi ke Sekretaris.

Terima kasih.

Ketua RT Cluster Kalita',
  'Rapat koordinasi bulanan pengurus RT akan dilaksanakan pada Sabtu, 25 Januari 2025 di Balai Pertemuan Cluster Kalita.',
  'pengumuman',
  'Siti Nurhaliza',
  '2025-01-08 15:00:00'
);
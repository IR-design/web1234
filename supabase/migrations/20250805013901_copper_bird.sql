/*
  # Create chat_messages table for live chat

  1. New Tables
    - `chat_messages`
      - `id` (int, primary key, auto-increment)
      - `user_name` (text, not null)
      - `message` (text, not null)
      - `created_at` (timestamp, default now)

  2. Security
    - Enable RLS on `chat_messages` table
    - Add policies for public read and authenticated write
*/

CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read chat messages"
  ON chat_messages
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert chat messages"
  ON chat_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Insert sample chat messages
INSERT INTO chat_messages (user_name, message, created_at) VALUES
('Budi Santoso', 'Selamat pagi warga Cluster Kalita! Jangan lupa gotong royong hari Minggu ya.', NOW() - INTERVAL '2 hours'),
('Siti Nurhaliza', 'Siap Pak RT! Sudah siapkan peralatan kebersihan.', NOW() - INTERVAL '1 hour 45 minutes'),
('Ahmad Wijaya', 'Untuk yang belum bayar iuran Januari, mohon segera ya. Terima kasih.', NOW() - INTERVAL '1 hour 30 minutes'),
('Maya Sari', 'Pak Ahmad, sudah transfer tadi pagi. Mohon dicek ya.', NOW() - INTERVAL '1 hour 15 minutes'),
('Dedi Kurniawan', 'Ada yang punya kontak tukang listrik? Lampu taman depan rumah mati.', NOW() - INTERVAL '1 hour'),
('Rina Marlina', 'Pak Dedi, saya ada kontak tukang listrik yang bagus. Nanti saya share ya.', NOW() - INTERVAL '45 minutes'),
('Hendra Gunawan', 'Kapan ada kegiatan olahraga bersama lagi?', NOW() - INTERVAL '30 minutes'),
('Indira Putri', 'Setuju! Mungkin bisa badminton atau senam pagi.', NOW() - INTERVAL '15 minutes');
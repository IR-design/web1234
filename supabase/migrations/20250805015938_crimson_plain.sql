/*
  # Insert Sample Data for RT/RW Cluster Kalita

  1. Sample Data
    - Insert sample warga (residents) data
    - Insert sample iuran (dues) data  
    - Insert sample berita (news) data
    - Insert sample pengumuman (announcements) data
    - Insert sample chat messages

  2. Data Coverage
    - 20 sample residents with realistic information
    - Monthly dues records for each resident
    - News articles and announcements
    - Sample chat messages for community interaction
*/

-- Insert sample warga data
INSERT INTO warga (nama, alamat, telepon, email, pekerjaan, jumlah_anggota, status, tanggal_daftar) VALUES
('Budi Santoso', 'Jl. Kalita Blok A No. 15', '081234567890', 'budi.santoso@email.com', 'Pegawai Swasta', 4, 'aktif', '2020-01-15'),
('Siti Nurhaliza', 'Jl. Kalita Blok B No. 8', '081323456789', 'siti.nurhaliza@email.com', 'Guru', 3, 'aktif', '2020-02-20'),
('Ahmad Wijaya', 'Jl. Kalita Blok C No. 22', '081434567890', 'ahmad.wijaya@email.com', 'Wiraswasta', 5, 'aktif', '2020-03-10'),
('Rina Marlina', 'Jl. Kalita Blok A No. 7', '081545678901', 'rina.marlina@email.com', 'Dokter', 2, 'aktif', '2020-04-05'),
('Dedi Kurniawan', 'Jl. Kalita Blok D No. 12', '081656789012', 'dedi.kurniawan@email.com', 'Insinyur', 4, 'aktif', '2020-05-18'),
('Maya Sari', 'Jl. Kalita Blok B No. 18', '081767890123', 'maya.sari@email.com', 'Perawat', 3, 'aktif', '2020-06-25'),
('Hendra Gunawan', 'Jl. Kalita Blok C No. 5', '081878901234', 'hendra.gunawan@email.com', 'Programmer', 2, 'aktif', '2020-07-12'),
('Indira Putri', 'Jl. Kalita Blok A No. 25', '081989012345', 'indira.putri@email.com', 'Desainer', 3, 'aktif', '2020-08-30'),
('Rudi Hermawan', 'Jl. Kalita Blok D No. 3', '082090123456', 'rudi.hermawan@email.com', 'Manager', 4, 'aktif', '2020-09-14'),
('Lina Sari', 'Jl. Kalita Blok B No. 11', '082101234567', 'lina.sari@email.com', 'Akuntan', 2, 'aktif', '2020-10-22'),
('Bambang Sutrisno', 'Jl. Kalita Blok C No. 17', '082212345678', 'bambang.sutrisno@email.com', 'Pensiunan', 2, 'aktif', '2021-01-08'),
('Dewi Lestari', 'Jl. Kalita Blok A No. 9', '082323456789', 'dewi.lestari@email.com', 'Ibu Rumah Tangga', 5, 'aktif', '2021-02-15'),
('Agus Setiawan', 'Jl. Kalita Blok D No. 20', '082434567890', 'agus.setiawan@email.com', 'Polisi', 3, 'aktif', '2021-03-20'),
('Ratna Sari', 'Jl. Kalita Blok B No. 6', '082545678901', 'ratna.sari@email.com', 'Bidan', 4, 'aktif', '2021-04-10'),
('Joko Widodo', 'Jl. Kalita Blok C No. 14', '082656789012', 'joko.widodo@email.com', 'Pedagang', 6, 'aktif', '2021-05-25'),
('Sri Mulyani', 'Jl. Kalita Blok A No. 12', '082767890123', 'sri.mulyani@email.com', 'Pegawai Bank', 3, 'aktif', '2021-06-18'),
('Andi Wijaya', 'Jl. Kalita Blok D No. 8', '082878901234', 'andi.wijaya@email.com', 'Arsitek', 2, 'aktif', '2021-07-30'),
('Sari Indah', 'Jl. Kalita Blok B No. 21', '082989012345', 'sari.indah@email.com', 'Farmasis', 4, 'aktif', '2021-08-12'),
('Doni Pratama', 'Jl. Kalita Blok C No. 9', '083090123456', 'doni.pratama@email.com', 'Teknisi', 3, 'aktif', '2021-09-05'),
('Eka Putri', 'Jl. Kalita Blok A No. 18', '083101234567', 'eka.putri@email.com', 'Marketing', 2, 'aktif', '2021-10-20');

-- Insert sample iuran data for each warga (January 2025)
INSERT INTO iuran (warga_id, bulan, tahun, jenis, jumlah, status, tanggal_bayar) 
SELECT 
    w.id,
    'Januari',
    2025,
    'bulanan',
    150000,
    CASE WHEN w.id % 3 = 0 THEN 'belum' ELSE 'lunas' END,
    CASE WHEN w.id % 3 = 0 THEN NULL ELSE CURRENT_DATE - INTERVAL '5 days' END
FROM warga w;

-- Insert sample iuran sampah data
INSERT INTO iuran (warga_id, bulan, tahun, jenis, jumlah, status, tanggal_bayar)
SELECT 
    w.id,
    'Januari',
    2025,
    'sampah',
    25000,
    CASE WHEN w.id % 4 = 0 THEN 'belum' ELSE 'lunas' END,
    CASE WHEN w.id % 4 = 0 THEN NULL ELSE CURRENT_DATE - INTERVAL '3 days' END
FROM warga w;

-- Insert sample berita data
INSERT INTO berita (title, content, summary, type, author, published_at) VALUES
('Pembayaran Iuran Bulan Januari 2025', 
'Kepada seluruh warga Cluster Kalita yang terhormat,

Dengan ini kami mengingatkan bahwa pembayaran iuran bulanan untuk bulan Januari 2025 sudah dapat dilakukan. Berikut adalah rincian iuran:

1. Iuran Bulanan: Rp 150.000
2. Iuran Sampah: Rp 25.000
3. Total: Rp 175.000

Pembayaran dapat dilakukan melalui:
- Transfer ke rekening BCA: 1234567890 a.n. Ahmad Wijaya
- Transfer ke rekening Mandiri: 0987654321 a.n. Ahmad Wijaya
- Bayar langsung ke bendahara

Batas waktu pembayaran adalah tanggal 20 Januari 2025. Mohon untuk segera melakukan pembayaran agar kegiatan operasional RT dapat berjalan dengan lancar.

Terima kasih atas perhatian dan kerjasamanya.',
'Reminder untuk warga yang belum melakukan pembayaran iuran bulanan Januari 2025. Batas waktu pembayaran hingga tanggal 20 Januari.',
'pengumuman',
'Ahmad Wijaya',
'2025-01-15 08:00:00+07'),

('Gotong Royong Bersih-Bersih Lingkungan',
'Assalamualaikum warahmatullahi wabarakatuh,

Dalam rangka menjaga kebersihan dan keindahan lingkungan Cluster Kalita, kami mengundang seluruh warga untuk berpartisipasi dalam kegiatan gotong royong bersih-bersih lingkungan.

Detail Kegiatan:
📅 Hari/Tanggal: Minggu, 19 Januari 2025
⏰ Waktu: 07.00 - 10.00 WIB
📍 Lokasi: Area taman dan jalan lingkungan cluster
🎯 Target: Pembersihan saluran air, penyapuan jalan, penataan taman

Yang perlu dibawa:
- Sapu dan alat kebersihan
- Sarung tangan
- Kantong sampah
- Semangat gotong royong

Setelah kegiatan, akan disediakan makan bersama untuk seluruh peserta. Mari bersama-sama menjaga lingkungan kita agar tetap bersih dan nyaman untuk keluarga.

Wassalamualaikum warahmatullahi wabarakatuh.',
'Kegiatan gotong royong bersih-bersih lingkungan cluster akan dilaksanakan pada hari Minggu, 19 Januari 2025 pukul 07.00 WIB.',
'berita',
'Dedi Kurniawan',
'2025-01-10 10:30:00+07'),

('Rapat Bulanan Pengurus RT',
'Kepada seluruh pengurus RT Cluster Kalita,

Dengan hormat, kami mengundang Bapak/Ibu pengurus untuk menghadiri rapat koordinasi bulanan yang akan dilaksanakan pada:

📅 Hari/Tanggal: Sabtu, 25 Januari 2025
⏰ Waktu: 19.30 - 21.00 WIB
📍 Tempat: Balai Pertemuan Cluster Kalita

Agenda Rapat:
1. Laporan kegiatan bulan Desember 2024
2. Evaluasi program kerja
3. Rencana kegiatan Februari 2025
4. Pembahasan anggaran dan keuangan
5. Usulan dan saran dari warga
6. Lain-lain

Mohon kehadiran tepat waktu. Bagi yang berhalangan hadir, diharapkan memberikan konfirmasi kepada sekretaris.

Terima kasih atas perhatian dan kerjasamanya.',
'Rapat koordinasi bulanan pengurus RT akan dilaksanakan pada Sabtu, 25 Januari 2025 di Balai Pertemuan Cluster Kalita.',
'pengumuman',
'Siti Nurhaliza',
'2025-01-08 15:45:00+07'),

('Program Vaksinasi COVID-19 Dosis Booster',
'Alhamdulillah, berkat kerjasama dengan Puskesmas Kalita, kami dapat menyelenggarakan program vaksinasi COVID-19 dosis booster untuk warga Cluster Kalita.

Program ini telah terlaksana dengan sukses pada tanggal 27 Juli 2024 dengan partisipasi yang sangat baik dari warga. Total 85 warga telah menerima vaksin booster dengan lancar dan aman.

Fasilitas yang disediakan:
✅ Vaksin Pfizer dan Moderna
✅ Tenaga medis profesional
✅ Monitoring kesehatan pasca vaksin
✅ Sertifikat vaksinasi digital
✅ Konsultasi kesehatan gratis

Terima kasih kepada:
- Tim medis Puskesmas Kalita
- Relawan warga yang membantu
- Seluruh peserta yang tertib mengikuti protokol

Semoga dengan vaksinasi ini, kita semua dapat terlindungi dari COVID-19 dan dapat beraktivitas dengan lebih aman.',
'Program vaksinasi dosis booster yang diselenggarakan bekerja sama dengan Puskesmas setempat.',
'berita',
'Rina Marlina',
'2024-07-27 14:20:00+07'),

('Kegiatan Sosial Berbagi Sembako',
'Bismillahirrahmanirrahim,

Alhamdulillah, pada tanggal 15 Ramadan 1445H, Paguyuban RT Cluster Kalita telah berhasil menyelenggarakan kegiatan sosial berbagi sembako kepada warga yang membutuhkan.

Kegiatan ini merupakan wujud kepedulian dan solidaritas antar warga dalam menyambut bulan suci Ramadan. Total 25 paket sembako telah dibagikan kepada keluarga yang membutuhkan di lingkungan cluster.

Isi paket sembako:
🍚 Beras 5 kg
🥫 Minyak goreng 2 liter
🍝 Mie instan 1 dus
🧂 Gula pasir 1 kg
☕ Kopi dan teh
🥫 Susu kental manis
🍪 Biskuit dan makanan ringan

Terima kasih kepada seluruh warga yang telah berpartisipasi dalam kegiatan ini, baik melalui donasi maupun tenaga. Semoga kegiatan ini dapat memberikan manfaat dan berkah bagi kita semua.

Barakallahu fiikum.',
'Kegiatan berbagi sembako kepada warga yang membutuhkan di bulan suci Ramadan.',
'berita',
'Maya Sari',
'2024-03-25 16:00:00+07');

-- Insert sample pengumuman data
INSERT INTO pengumuman (title, content, priority, active) VALUES
('Pemadaman Listrik Terjadwal', 'Akan ada pemadaman listrik terjadwal pada hari Minggu, 26 Januari 2025 pukul 08.00-12.00 WIB untuk maintenance jaringan. Mohon persiapkan diri dengan baik.', 'high', true),
('Perbaikan Jalan Cluster', 'Perbaikan jalan di area Blok C akan dilaksanakan mulai Senin, 27 Januari 2025. Mohon berhati-hati saat melewati area tersebut.', 'medium', true),
('Jadwal Pengambilan Sampah', 'Pengambilan sampah akan dilakukan setiap hari Selasa, Kamis, dan Sabtu pukul 06.00 WIB. Mohon sampah dikeluarkan sebelum jam tersebut.', 'low', true);

-- Insert sample chat messages
INSERT INTO chat_messages (user_name, message) VALUES
('Budi Santoso', 'Selamat pagi warga Cluster Kalita! Semoga hari ini menyenangkan untuk semua 😊'),
('Siti Nurhaliza', 'Pagi Pak RT! Terima kasih sudah mengaktifkan chat ini'),
('Ahmad Wijaya', 'Info pembayaran iuran sudah saya update di website ya'),
('Rina Marlina', 'Untuk yang mau konsultasi kesehatan, bisa hubungi saya kapan saja'),
('Maya Sari', 'Jangan lupa besok ada gotong royong jam 7 pagi!'),
('Dedi Kurniawan', 'Alat kebersihan sudah saya siapkan di pos satpam'),
('Hendra Gunawan', 'Ada yang butuh bantuan IT? Siap membantu 👨‍💻'),
('Indira Putri', 'Desain banner kegiatan sudah selesai, nanti saya share'),
('Lina Sari', 'Laporan keuangan bulan ini sudah rapi, alhamdulillah'),
('Bambang Sutrisno', 'Terima kasih anak-anak muda yang selalu membantu 🙏');
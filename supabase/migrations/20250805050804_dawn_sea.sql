/*
  # Sistem Iuran Bulanan dan Sampah Komprehensif

  1. New Tables
    - `iuran_settings` - Pengaturan tarif iuran
    - `iuran_summary` - Ringkasan iuran per warga
    - `payment_history` - Riwayat pembayaran detail
    
  2. Enhanced Tables
    - Update `iuran` table dengan kolom tambahan
    - Tambah trigger untuk auto-calculation
    
  3. Functions
    - `calculate_iuran_summary()` - Hitung total iuran per warga
    - `update_payment_status()` - Update status pembayaran
    - `generate_monthly_iuran()` - Generate iuran bulanan otomatis
    
  4. Security
    - Enable RLS pada semua tabel
    - Add policies untuk akses data
*/

-- Create iuran_settings table for tariff management
CREATE TABLE IF NOT EXISTS iuran_settings (
  id SERIAL PRIMARY KEY,
  jenis TEXT NOT NULL CHECK (jenis IN ('bulanan', 'sampah')),
  tarif INTEGER NOT NULL DEFAULT 0,
  deskripsi TEXT,
  aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create iuran_summary table for aggregated data
CREATE TABLE IF NOT EXISTS iuran_summary (
  id SERIAL PRIMARY KEY,
  warga_id INTEGER REFERENCES warga(id) ON DELETE CASCADE,
  tahun INTEGER NOT NULL,
  total_iuran_bulanan INTEGER DEFAULT 0,
  total_iuran_sampah INTEGER DEFAULT 0,
  total_lunas_bulanan INTEGER DEFAULT 0,
  total_lunas_sampah INTEGER DEFAULT 0,
  total_belum_bulanan INTEGER DEFAULT 0,
  total_belum_sampah INTEGER DEFAULT 0,
  persentase_lunas DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(warga_id, tahun)
);

-- Create payment_history table for detailed payment tracking
CREATE TABLE IF NOT EXISTS payment_history (
  id SERIAL PRIMARY KEY,
  iuran_id INTEGER REFERENCES iuran(id) ON DELETE CASCADE,
  warga_id INTEGER REFERENCES warga(id) ON DELETE CASCADE,
  jenis TEXT NOT NULL CHECK (jenis IN ('bulanan', 'sampah')),
  jumlah INTEGER NOT NULL,
  status_sebelum TEXT CHECK (status_sebelum IN ('lunas', 'belum')),
  status_sesudah TEXT CHECK (status_sesudah IN ('lunas', 'belum')),
  tanggal_bayar TIMESTAMPTZ,
  metode_bayar TEXT DEFAULT 'tunai',
  keterangan TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_iuran_summary_warga_tahun ON iuran_summary(warga_id, tahun);
CREATE INDEX IF NOT EXISTS idx_payment_history_iuran_id ON payment_history(iuran_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_warga_id ON payment_history(warga_id);
CREATE INDEX IF NOT EXISTS idx_iuran_bulan_tahun ON iuran(bulan, tahun);

-- Insert default tariff settings
INSERT INTO iuran_settings (jenis, tarif, deskripsi) VALUES
('bulanan', 150000, 'Iuran bulanan untuk operasional RT/RW'),
('sampah', 25000, 'Iuran sampah bulanan')
ON CONFLICT DO NOTHING;

-- Function to calculate iuran summary
CREATE OR REPLACE FUNCTION calculate_iuran_summary(p_warga_id INTEGER, p_tahun INTEGER)
RETURNS VOID AS $$
DECLARE
  v_total_bulanan INTEGER := 0;
  v_total_sampah INTEGER := 0;
  v_lunas_bulanan INTEGER := 0;
  v_lunas_sampah INTEGER := 0;
  v_belum_bulanan INTEGER := 0;
  v_belum_sampah INTEGER := 0;
  v_persentase DECIMAL(5,2) := 0;
BEGIN
  -- Calculate totals for bulanan
  SELECT 
    COUNT(*) * COALESCE((SELECT tarif FROM iuran_settings WHERE jenis = 'bulanan' AND aktif = true LIMIT 1), 150000),
    COUNT(*) FILTER (WHERE status = 'lunas') * COALESCE((SELECT tarif FROM iuran_settings WHERE jenis = 'bulanan' AND aktif = true LIMIT 1), 150000),
    COUNT(*) FILTER (WHERE status = 'belum') * COALESCE((SELECT tarif FROM iuran_settings WHERE jenis = 'bulanan' AND aktif = true LIMIT 1), 150000)
  INTO v_total_bulanan, v_lunas_bulanan, v_belum_bulanan
  FROM iuran 
  WHERE warga_id = p_warga_id AND tahun = p_tahun AND jenis = 'bulanan';

  -- Calculate totals for sampah
  SELECT 
    COUNT(*) * COALESCE((SELECT tarif FROM iuran_settings WHERE jenis = 'sampah' AND aktif = true LIMIT 1), 25000),
    COUNT(*) FILTER (WHERE status = 'lunas') * COALESCE((SELECT tarif FROM iuran_settings WHERE jenis = 'sampah' AND aktif = true LIMIT 1), 25000),
    COUNT(*) FILTER (WHERE status = 'belum') * COALESCE((SELECT tarif FROM iuran_settings WHERE jenis = 'sampah' AND aktif = true LIMIT 1), 25000)
  INTO v_total_sampah, v_lunas_sampah, v_belum_sampah
  FROM iuran 
  WHERE warga_id = p_warga_id AND tahun = p_tahun AND jenis = 'sampah';

  -- Calculate percentage
  IF (v_total_bulanan + v_total_sampah) > 0 THEN
    v_persentase := (v_lunas_bulanan + v_lunas_sampah) * 100.0 / (v_total_bulanan + v_total_sampah);
  END IF;

  -- Insert or update summary
  INSERT INTO iuran_summary (
    warga_id, tahun, total_iuran_bulanan, total_iuran_sampah,
    total_lunas_bulanan, total_lunas_sampah, total_belum_bulanan, total_belum_sampah,
    persentase_lunas, updated_at
  ) VALUES (
    p_warga_id, p_tahun, v_total_bulanan, v_total_sampah,
    v_lunas_bulanan, v_lunas_sampah, v_belum_bulanan, v_belum_sampah,
    v_persentase, now()
  )
  ON CONFLICT (warga_id, tahun) 
  DO UPDATE SET
    total_iuran_bulanan = v_total_bulanan,
    total_iuran_sampah = v_total_sampah,
    total_lunas_bulanan = v_lunas_bulanan,
    total_lunas_sampah = v_lunas_sampah,
    total_belum_bulanan = v_belum_bulanan,
    total_belum_sampah = v_belum_sampah,
    persentase_lunas = v_persentase,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- Function to generate monthly iuran for all active warga
CREATE OR REPLACE FUNCTION generate_monthly_iuran(p_bulan TEXT, p_tahun INTEGER)
RETURNS INTEGER AS $$
DECLARE
  v_warga RECORD;
  v_count INTEGER := 0;
  v_tarif_bulanan INTEGER;
  v_tarif_sampah INTEGER;
BEGIN
  -- Get current tariffs
  SELECT tarif INTO v_tarif_bulanan FROM iuran_settings WHERE jenis = 'bulanan' AND aktif = true LIMIT 1;
  SELECT tarif INTO v_tarif_sampah FROM iuran_settings WHERE jenis = 'sampah' AND aktif = true LIMIT 1;
  
  -- Set defaults if not found
  v_tarif_bulanan := COALESCE(v_tarif_bulanan, 150000);
  v_tarif_sampah := COALESCE(v_tarif_sampah, 25000);

  -- Loop through all active warga
  FOR v_warga IN SELECT id FROM warga WHERE status = 'aktif' LOOP
    -- Insert iuran bulanan
    INSERT INTO iuran (warga_id, bulan, tahun, jenis, jumlah, status)
    VALUES (v_warga.id, p_bulan, p_tahun, 'bulanan', v_tarif_bulanan, 'belum')
    ON CONFLICT (warga_id, bulan, tahun, jenis) DO NOTHING;
    
    -- Insert iuran sampah
    INSERT INTO iuran (warga_id, bulan, tahun, jenis, jumlah, status)
    VALUES (v_warga.id, p_bulan, p_tahun, 'sampah', v_tarif_sampah, 'belum')
    ON CONFLICT (warga_id, bulan, tahun, jenis) DO NOTHING;
    
    v_count := v_count + 1;
  END LOOP;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to update summary when iuran changes
CREATE OR REPLACE FUNCTION trigger_update_iuran_summary()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle INSERT and UPDATE
  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    PERFORM calculate_iuran_summary(NEW.warga_id, NEW.tahun);
    
    -- Log payment history for status changes
    IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
      INSERT INTO payment_history (
        iuran_id, warga_id, jenis, jumlah, 
        status_sebelum, status_sesudah, tanggal_bayar
      ) VALUES (
        NEW.id, NEW.warga_id, NEW.jenis, NEW.jumlah,
        OLD.status, NEW.status, 
        CASE WHEN NEW.status = 'lunas' THEN NEW.tanggal_bayar ELSE NULL END
      );
    END IF;
    
    RETURN NEW;
  END IF;
  
  -- Handle DELETE
  IF TG_OP = 'DELETE' THEN
    PERFORM calculate_iuran_summary(OLD.warga_id, OLD.tahun);
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic summary updates
DROP TRIGGER IF EXISTS trigger_iuran_summary_update ON iuran;
CREATE TRIGGER trigger_iuran_summary_update
  AFTER INSERT OR UPDATE OR DELETE ON iuran
  FOR EACH ROW EXECUTE FUNCTION trigger_update_iuran_summary();

-- Add unique constraint to prevent duplicate iuran entries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'unique_iuran_entry' AND table_name = 'iuran'
  ) THEN
    ALTER TABLE iuran ADD CONSTRAINT unique_iuran_entry 
    UNIQUE (warga_id, bulan, tahun, jenis);
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE iuran_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE iuran_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Create policies for iuran_settings
CREATE POLICY "Anyone can read iuran settings"
  ON iuran_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage iuran settings"
  ON iuran_settings
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for iuran_summary
CREATE POLICY "Anyone can read iuran summary"
  ON iuran_summary
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage iuran summary"
  ON iuran_summary
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for payment_history
CREATE POLICY "Anyone can read payment history"
  ON payment_history
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage payment history"
  ON payment_history
  FOR ALL
  TO authenticated
  USING (true);

-- Generate initial summaries for existing data
DO $$
DECLARE
  v_warga RECORD;
  v_tahun INTEGER;
BEGIN
  FOR v_warga IN SELECT DISTINCT warga_id FROM iuran LOOP
    FOR v_tahun IN SELECT DISTINCT tahun FROM iuran WHERE warga_id = v_warga.warga_id LOOP
      PERFORM calculate_iuran_summary(v_warga.warga_id, v_tahun);
    END LOOP;
  END LOOP;
END $$;
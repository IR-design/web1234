/*
  # Sistem Sinkronisasi Iuran Warga dan Sampah

  1. New Functions
    - `generate_monthly_iuran()` - Generate iuran bulanan untuk semua warga aktif
    - `sync_iuran_data()` - Sinkronisasi data iuran dengan warga
    - `update_iuran_summary()` - Update summary iuran per warga

  2. New Tables
    - `iuran_settings` - Pengaturan tarif iuran
    - `iuran_summary` - Ringkasan iuran per warga per tahun

  3. Triggers
    - Auto update summary saat ada perubahan iuran
    - Auto generate iuran untuk warga baru

  4. Security
    - RLS policies untuk semua tabel baru
*/

-- Create iuran_settings table
CREATE TABLE IF NOT EXISTS iuran_settings (
  id SERIAL PRIMARY KEY,
  jenis TEXT NOT NULL CHECK (jenis IN ('bulanan', 'sampah')),
  tarif INTEGER NOT NULL DEFAULT 0,
  deskripsi TEXT NOT NULL DEFAULT '',
  aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create iuran_summary table
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

-- Enable RLS
ALTER TABLE iuran_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE iuran_summary ENABLE ROW LEVEL SECURITY;

-- RLS Policies for iuran_settings
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

-- RLS Policies for iuran_summary
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

-- Insert default tariff settings
INSERT INTO iuran_settings (jenis, tarif, deskripsi, aktif) VALUES
('bulanan', 150000, 'Iuran bulanan untuk pemeliharaan fasilitas umum', true),
('sampah', 25000, 'Iuran sampah untuk kebersihan lingkungan', true)
ON CONFLICT DO NOTHING;

-- Function to generate monthly iuran for all active warga
CREATE OR REPLACE FUNCTION generate_monthly_iuran(p_bulan TEXT, p_tahun INTEGER)
RETURNS TABLE(success BOOLEAN, message TEXT, affected_rows INTEGER) AS $$
DECLARE
  warga_record RECORD;
  tarif_bulanan INTEGER;
  tarif_sampah INTEGER;
  inserted_count INTEGER := 0;
BEGIN
  -- Get current tariffs
  SELECT tarif INTO tarif_bulanan FROM iuran_settings WHERE jenis = 'bulanan' AND aktif = true;
  SELECT tarif INTO tarif_sampah FROM iuran_settings WHERE jenis = 'sampah' AND aktif = true;
  
  IF tarif_bulanan IS NULL OR tarif_sampah IS NULL THEN
    RETURN QUERY SELECT false, 'Tarif iuran belum diatur', 0;
    RETURN;
  END IF;
  
  -- Generate iuran for all active warga
  FOR warga_record IN 
    SELECT id FROM warga WHERE status = 'aktif'
  LOOP
    -- Insert iuran bulanan if not exists
    INSERT INTO iuran (warga_id, bulan, tahun, jenis, jumlah, status)
    SELECT warga_record.id, p_bulan, p_tahun, 'bulanan', tarif_bulanan, 'belum'
    WHERE NOT EXISTS (
      SELECT 1 FROM iuran 
      WHERE warga_id = warga_record.id 
        AND bulan = p_bulan 
        AND tahun = p_tahun 
        AND jenis = 'bulanan'
    );
    
    IF FOUND THEN
      inserted_count := inserted_count + 1;
    END IF;
    
    -- Insert iuran sampah if not exists
    INSERT INTO iuran (warga_id, bulan, tahun, jenis, jumlah, status)
    SELECT warga_record.id, p_bulan, p_tahun, 'sampah', tarif_sampah, 'belum'
    WHERE NOT EXISTS (
      SELECT 1 FROM iuran 
      WHERE warga_id = warga_record.id 
        AND bulan = p_bulan 
        AND tahun = p_tahun 
        AND jenis = 'sampah'
    );
    
    IF FOUND THEN
      inserted_count := inserted_count + 1;
    END IF;
  END LOOP;
  
  -- Update summary after generation
  PERFORM update_iuran_summary(p_tahun);
  
  RETURN QUERY SELECT true, 'Iuran berhasil di-generate', inserted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update iuran summary
CREATE OR REPLACE FUNCTION update_iuran_summary(p_tahun INTEGER DEFAULT NULL)
RETURNS VOID AS $$
DECLARE
  warga_record RECORD;
  tahun_target INTEGER;
BEGIN
  -- If no year specified, use current year
  tahun_target := COALESCE(p_tahun, EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER);
  
  FOR warga_record IN 
    SELECT id FROM warga WHERE status = 'aktif'
  LOOP
    INSERT INTO iuran_summary (
      warga_id, 
      tahun,
      total_iuran_bulanan,
      total_iuran_sampah,
      total_lunas_bulanan,
      total_lunas_sampah,
      total_belum_bulanan,
      total_belum_sampah,
      persentase_lunas
    )
    SELECT 
      warga_record.id,
      tahun_target,
      COALESCE(SUM(CASE WHEN jenis = 'bulanan' THEN jumlah ELSE 0 END), 0),
      COALESCE(SUM(CASE WHEN jenis = 'sampah' THEN jumlah ELSE 0 END), 0),
      COALESCE(SUM(CASE WHEN jenis = 'bulanan' AND status = 'lunas' THEN jumlah ELSE 0 END), 0),
      COALESCE(SUM(CASE WHEN jenis = 'sampah' AND status = 'lunas' THEN jumlah ELSE 0 END), 0),
      COALESCE(SUM(CASE WHEN jenis = 'bulanan' AND status = 'belum' THEN jumlah ELSE 0 END), 0),
      COALESCE(SUM(CASE WHEN jenis = 'sampah' AND status = 'belum' THEN jumlah ELSE 0 END), 0),
      CASE 
        WHEN SUM(jumlah) > 0 THEN 
          ROUND((SUM(CASE WHEN status = 'lunas' THEN jumlah ELSE 0 END) * 100.0 / SUM(jumlah)), 2)
        ELSE 0 
      END
    FROM iuran 
    WHERE warga_id = warga_record.id AND tahun = tahun_target
    ON CONFLICT (warga_id, tahun) 
    DO UPDATE SET
      total_iuran_bulanan = EXCLUDED.total_iuran_bulanan,
      total_iuran_sampah = EXCLUDED.total_iuran_sampah,
      total_lunas_bulanan = EXCLUDED.total_lunas_bulanan,
      total_lunas_sampah = EXCLUDED.total_lunas_sampah,
      total_belum_bulanan = EXCLUDED.total_belum_bulanan,
      total_belum_sampah = EXCLUDED.total_belum_sampah,
      persentase_lunas = EXCLUDED.persentase_lunas,
      updated_at = now();
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to sync iuran when warga status changes
CREATE OR REPLACE FUNCTION sync_iuran_on_warga_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If warga becomes active, generate current month iuran
  IF NEW.status = 'aktif' AND (OLD.status IS NULL OR OLD.status != 'aktif') THEN
    PERFORM generate_monthly_iuran(
      TO_CHAR(CURRENT_DATE, 'Month'), 
      EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER
    );
  END IF;
  
  -- Update summary for current year
  PERFORM update_iuran_summary(EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update summary when iuran changes
CREATE OR REPLACE FUNCTION sync_summary_on_iuran_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Update summary for the affected year
  PERFORM update_iuran_summary(COALESCE(NEW.tahun, OLD.tahun));
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER sync_iuran_on_warga_update
  AFTER INSERT OR UPDATE ON warga
  FOR EACH ROW
  EXECUTE FUNCTION sync_iuran_on_warga_change();

CREATE TRIGGER sync_summary_on_iuran_update
  AFTER INSERT OR UPDATE OR DELETE ON iuran
  FOR EACH ROW
  EXECUTE FUNCTION sync_summary_on_iuran_change();

-- Update triggers for updated_at
CREATE TRIGGER update_iuran_settings_updated_at
  BEFORE UPDATE ON iuran_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_iuran_summary_updated_at
  BEFORE UPDATE ON iuran_summary
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Generate initial data for current year
DO $$
DECLARE
  current_month TEXT;
  current_year INTEGER;
BEGIN
  current_month := TO_CHAR(CURRENT_DATE, 'Month');
  current_year := EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER;
  
  -- Generate iuran for current month
  PERFORM generate_monthly_iuran(current_month, current_year);
END $$;
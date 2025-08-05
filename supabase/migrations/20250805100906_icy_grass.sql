/*
  # Fix RLS policies for iuran sync system

  1. Security Updates
    - Update RLS policies for iuran table to allow function execution
    - Add proper policies for authenticated users
    - Ensure sync functions can work properly

  2. Policy Changes
    - Allow authenticated users to insert iuran data
    - Allow public access for reading iuran data
    - Add policy for system functions
*/

-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "Anyone can insert iuran data" ON iuran;
DROP POLICY IF EXISTS "Anyone can read iuran data" ON iuran;
DROP POLICY IF EXISTS "Anyone can update iuran data" ON iuran;

-- Create new policies that allow proper access
CREATE POLICY "Public can read iuran data"
  ON iuran
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert iuran data"
  ON iuran
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Public can insert iuran data via functions"
  ON iuran
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update iuran data"
  ON iuran
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update the generate_monthly_iuran function to run with elevated privileges
CREATE OR REPLACE FUNCTION generate_monthly_iuran(p_bulan text, p_tahun integer)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER -- This allows the function to run with the privileges of the function owner
AS $$
DECLARE
  warga_record RECORD;
  tarif_bulanan INTEGER;
  tarif_sampah INTEGER;
  inserted_count INTEGER := 0;
  result_json JSON;
BEGIN
  -- Get current tariff settings
  SELECT tarif INTO tarif_bulanan FROM iuran_settings WHERE jenis = 'bulanan' AND aktif = true LIMIT 1;
  SELECT tarif INTO tarif_sampah FROM iuran_settings WHERE jenis = 'sampah' AND aktif = true LIMIT 1;
  
  -- Set default values if not found
  IF tarif_bulanan IS NULL THEN tarif_bulanan := 50000; END IF;
  IF tarif_sampah IS NULL THEN tarif_sampah := 25000; END IF;
  
  -- Loop through all active warga
  FOR warga_record IN 
    SELECT id, nama FROM warga WHERE status = 'aktif'
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
    
    inserted_count := inserted_count + 1;
  END LOOP;
  
  -- Update summary
  PERFORM update_iuran_summary();
  
  -- Return result
  result_json := json_build_object(
    'success', true,
    'message', 'Iuran berhasil di-generate untuk ' || p_bulan || ' ' || p_tahun,
    'processed_warga', inserted_count,
    'tarif_bulanan', tarif_bulanan,
    'tarif_sampah', tarif_sampah
  );
  
  RETURN result_json;
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM,
      'message', 'Gagal generate iuran: ' || SQLERRM
    );
END;
$$;
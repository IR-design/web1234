/*
  # Create functions and triggers for automatic updates

  1. Functions
    - `update_updated_at_column()` - Function to update updated_at timestamp
    
  2. Triggers
    - Triggers for all tables to automatically update updated_at column
*/

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_warga_updated_at 
    BEFORE UPDATE ON warga 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_iuran_updated_at 
    BEFORE UPDATE ON iuran 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_berita_updated_at 
    BEFORE UPDATE ON berita 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pengumuman_updated_at 
    BEFORE UPDATE ON pengumuman 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
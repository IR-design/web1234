import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Database types
export interface Warga {
  id: number
  nama: string
  alamat: string
  telepon: string
  email: string
  status: 'aktif' | 'non-aktif'
  jumlah_anggota: number
  pekerjaan: string
  tanggal_daftar: string
  created_at: string
  updated_at: string
}

export interface Iuran {
  id: number
  warga_id: number
  bulan: string
  tahun: number
  jenis: 'bulanan' | 'sampah'
  jumlah: number
  status: 'lunas' | 'belum'
  tanggal_bayar?: string
  created_at: string
  updated_at: string
}

export interface Berita {
  id: number
  title: string
  content: string
  summary: string
  type: 'berita' | 'pengumuman'
  author: string
  published_at: string
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: number
  user_name: string
  message: string
  created_at: string
}

export interface Pengumuman {
  id: number
  title: string
  content: string
  priority: 'low' | 'medium' | 'high'
  active: boolean
  created_at: string
  updated_at: string
}

export interface IuranSettings {
  id: number
  jenis: 'bulanan' | 'sampah'
  tarif: number
  deskripsi: string
  aktif: boolean
  created_at: string
  updated_at: string
}

export interface IuranSummary {
  id: number
  warga_id: number
  tahun: number
  total_iuran_bulanan: number
  total_iuran_sampah: number
  total_lunas_bulanan: number
  total_lunas_sampah: number
  total_belum_bulanan: number
  total_belum_sampah: number
  persentase_lunas: number
  created_at: string
  updated_at: string
  warga?: Warga
}

export interface PaymentHistory {
  id: number
  iuran_id: number
  warga_id: number
  jenis: 'bulanan' | 'sampah'
  jumlah: number
  status_sebelum: 'lunas' | 'belum'
  status_sesudah: 'lunas' | 'belum'
  tanggal_bayar: string
  metode_bayar: string
  keterangan: string
  created_at: string
}

// Utility functions for iuran management
export const iuranUtils = {
  // Generate monthly iuran for all active warga
  async generateMonthlyIuran(bulan: string, tahun: number) {
    const { data, error } = await supabase.rpc('generate_monthly_iuran', {
      p_bulan: bulan,
      p_tahun: tahun
    });
    return { data, error };
  },

  // Update payment status
  async updatePaymentStatus(iuranId: number, status: 'lunas' | 'belum') {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'lunas') {
      updateData.tanggal_bayar = new Date().toISOString();
    } else {
      updateData.tanggal_bayar = null;
    }

    const { data, error } = await supabase
      .from('iuran')
      .update(updateData)
      .eq('id', iuranId)
      .select();

    return { data, error };
  },

  // Get iuran summary for a specific year
  async getIuranSummary(tahun: number) {
    const { data, error } = await supabase
      .from('iuran_summary')
      .select(`
        *,
        warga:warga_id (
          id,
          nama,
          alamat,
          status
        )
      `)
      .eq('tahun', tahun)
      .order('persentase_lunas', { ascending: false });

    return { data, error };
  },

  // Get payment history
  async getPaymentHistory(wargaId?: number, limit: number = 50) {
    let query = supabase
      .from('payment_history')
      .select(`
        *,
        warga:warga_id (nama, alamat)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (wargaId) {
      query = query.eq('warga_id', wargaId);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Get current tariff settings
  async getTariffSettings() {
    const { data, error } = await supabase
      .from('iuran_settings')
      .select('*')
      .eq('aktif', true)
      .order('jenis');

    return { data, error };
  },

  // Update tariff settings
  async updateTariff(jenis: 'bulanan' | 'sampah', tarif: number) {
    const { data, error } = await supabase
      .from('iuran_settings')
      .update({ tarif, updated_at: new Date().toISOString() })
      .eq('jenis', jenis)
      .eq('aktif', true);

    return { data, error };
  },

  // Get detailed iuran report
  async getDetailedReport(tahun: number, bulan?: string) {
    let query = supabase
      .from('iuran')
      .select(`
        *,
        warga:warga_id (
          id,
          nama,
          alamat,
          status,
          jumlah_anggota
        )
      `)
      .eq('tahun', tahun);

    if (bulan) {
      query = query.eq('bulan', bulan);
    }

    query = query.order('warga_id').order('jenis');

    const { data, error } = await query;
    return { data, error };
  }
};
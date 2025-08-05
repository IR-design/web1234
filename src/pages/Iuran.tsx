import React, { useState } from 'react';
import { DollarSign, Calendar, CheckCircle, XCircle, Search, Download } from 'lucide-react';
import { useRealtimeIuran, useRealtimeWarga } from '../hooks/useRealtime';
import { supabase } from '../lib/supabase';
import type { Iuran, Warga } from '../lib/supabase';

const Iuran: React.FC = () => {
  const [activeTab, setActiveTab] = useState('bulanan');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use realtime data
  const { data: iuranData, loading: iuranLoading } = useRealtimeIuran();
  const { data: wargaData, loading: wargaLoading } = useRealtimeWarga();

  // Update payment status
  const updatePaymentStatus = async (iuranId: number, status: 'lunas' | 'belum') => {
    try {
      const { error } = await supabase
        .from('iuran')
        .update({ 
          status,
          tanggal_bayar: status === 'lunas' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', iuranId);

      if (error) {
        console.error('Error updating payment status:', error);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Process realtime data for display
  const processIuranData = (jenis: 'bulanan' | 'sampah') => {
    if (!wargaData.length || !iuranData.length) return [];
    
    return wargaData.map((warga: Warga) => {
      const wargaIuran = iuranData.filter((iuran: Iuran) => 
        iuran.warga_id === warga.id && iuran.jenis === jenis
      );
      
      const months = ['jan', 'feb', 'mar', 'apr'];
      const monthlyStatus: any = {};
      let total = 0;
      
      months.forEach((month, index) => {
        const monthIuran = wargaIuran.find((iuran: Iuran) => 
          new Date(iuran.created_at).getMonth() === index
        );
        monthlyStatus[month] = monthIuran?.status || 'belum';
        if (monthIuran?.status === 'lunas') {
          total += monthIuran.jumlah;
        }
      });
      
      return {
        ...warga,
        ...monthlyStatus,
        total,
        iuranData: wargaIuran
      };
    });
  };

  const iuranBulanan = processIuranData('bulanan');
  const iuranSampah = processIuranData('sampah');

  if (iuranLoading || wargaLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data iuran...</p>
        </div>
      </div>
    );
  }

  const rekapKeuangan = {
    saldoAwal: 15000000,
    totalPemasukan: 8500000,
    totalPengeluaran: 6200000,
    saldoAkhir: 17300000,
    rincianPemasukan: [
      { kategori: 'Iuran Bulanan', jumlah: 7200000 },
      { kategori: 'Iuran Sampah', jumlah: 1200000 },
      { kategori: 'Denda', jumlah: 100000 }
    ],
    rincianPengeluaran: [
      { kategori: 'Kebersihan', jumlah: 2400000 },
      { kategori: 'Keamanan', jumlah: 1800000 },
      { kategori: 'Pemeliharaan', jumlah: 1500000 },
      { kategori: 'Kegiatan Sosial', jumlah: 500000 }
    ]
  };

  const getStatusIcon = (status: string) => {
    return status === 'lunas' ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  const getStatusText = (status: string) => {
    return status === 'lunas' ? 'Lunas' : 'Belum Bayar';
  };

  const filteredData = (activeTab === 'bulanan' ? iuranBulanan : iuranSampah).filter(item =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.alamat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Iuran & Keuangan</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Informasi lengkap mengenai iuran bulanan, pembayaran sampah, dan laporan keuangan 
          Paguyuban RT/RW Cluster Kalita.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saldo Kas</p>
              <p className="text-2xl font-bold text-emerald-600">
                Rp {rekapKeuangan.saldoAkhir.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pemasukan</p>
              <p className="text-2xl font-bold text-blue-600">
                Rp {rekapKeuangan.totalPemasukan.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pengeluaran</p>
              <p className="text-2xl font-bold text-orange-600">
                Rp {rekapKeuangan.totalPengeluaran.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Iuran/Bulan</p>
              <p className="text-2xl font-bold text-purple-600">Rp 175.000</p>
              <p className="text-xs text-gray-500">Rp 150K + Rp 25K</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md mb-8">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('bulanan')}
            className={`px-6 py-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'bulanan'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-600 hover:text-emerald-600'
            }`}
          >
            Iuran Bulanan
          </button>
          <button
            onClick={() => setActiveTab('sampah')}
            className={`px-6 py-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'sampah'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-600 hover:text-emerald-600'
            }`}
          >
            Iuran Sampah
          </button>
          <button
            onClick={() => setActiveTab('rekap')}
            className={`px-6 py-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'rekap'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-600 hover:text-emerald-600'
            }`}
          >
            Rekap Keuangan
          </button>
        </div>

        {(activeTab === 'bulanan' || activeTab === 'sampah') && (
          <div className="p-6">
            {/* Search and Export */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari nama atau alamat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <button className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export Excel</span>
              </button>
            </div>

            {/* Iuran Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama & Alamat</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Jan 2025</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Feb 2025</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Mar 2025</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Apr 2025</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Bayar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.nama}</div>
                          <div className="text-sm text-gray-500">{item.alamat}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {getStatusIcon(item.jan)}
                          <button
                            onClick={() => {
                              const iuran = item.iuranData?.find((i: Iuran) => 
                                new Date(i.created_at).getMonth() === 0
                              );
                              if (iuran) {
                                updatePaymentStatus(iuran.id, item.jan === 'lunas' ? 'belum' : 'lunas');
                              }
                            }}
                            className={`text-xs hover:underline ${item.jan === 'lunas' ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {getStatusText(item.jan)}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {getStatusIcon(item.feb)}
                          <button
                            onClick={() => {
                              const iuran = item.iuranData?.find((i: Iuran) => 
                                new Date(i.created_at).getMonth() === 1
                              );
                              if (iuran) {
                                updatePaymentStatus(iuran.id, item.feb === 'lunas' ? 'belum' : 'lunas');
                              }
                            }}
                            className={`text-xs hover:underline ${item.feb === 'lunas' ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {getStatusText(item.feb)}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {getStatusIcon(item.mar)}
                          <button
                            onClick={() => {
                              const iuran = item.iuranData?.find((i: Iuran) => 
                                new Date(i.created_at).getMonth() === 2
                              );
                              if (iuran) {
                                updatePaymentStatus(iuran.id, item.mar === 'lunas' ? 'belum' : 'lunas');
                              }
                            }}
                            className={`text-xs hover:underline ${item.mar === 'lunas' ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {getStatusText(item.mar)}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {getStatusIcon(item.apr)}
                          <button
                            onClick={() => {
                              const iuran = item.iuranData?.find((i: Iuran) => 
                                new Date(i.created_at).getMonth() === 3
                              );
                              if (iuran) {
                                updatePaymentStatus(iuran.id, item.apr === 'lunas' ? 'belum' : 'lunas');
                              }
                            }}
                            className={`text-xs hover:underline ${item.apr === 'lunas' ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {getStatusText(item.apr)}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-medium text-gray-900">
                          Rp {item.total.toLocaleString('id-ID')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'rekap' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pemasukan */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Rincian Pemasukan</h3>
                <div className="space-y-4">
                  {rekapKeuangan.rincianPemasukan.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                      <span className="font-medium text-gray-900">{item.kategori}</span>
                      <span className="font-bold text-green-600">
                        Rp {item.jumlah.toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-4 bg-green-100 rounded-lg border-2 border-green-200">
                    <span className="text-lg font-bold text-gray-900">Total Pemasukan</span>
                    <span className="text-lg font-bold text-green-600">
                      Rp {rekapKeuangan.totalPemasukan.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pengeluaran */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Rincian Pengeluaran</h3>
                <div className="space-y-4">
                  {rekapKeuangan.rincianPengeluaran.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                      <span className="font-medium text-gray-900">{item.kategori}</span>
                      <span className="font-bold text-red-600">
                        Rp {item.jumlah.toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-4 bg-red-100 rounded-lg border-2 border-red-200">
                    <span className="text-lg font-bold text-gray-900">Total Pengeluaran</span>
                    <span className="text-lg font-bold text-red-600">
                      Rp {rekapKeuangan.totalPengeluaran.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-8 p-6 bg-emerald-50 rounded-xl border border-emerald-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ringkasan Keuangan</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Saldo Awal</p>
                  <p className="text-xl font-bold text-gray-900">
                    Rp {rekapKeuangan.saldoAwal.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Pemasukan</p>
                  <p className="text-xl font-bold text-green-600">
                    + Rp {rekapKeuangan.totalPemasukan.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Pengeluaran</p>
                  <p className="text-xl font-bold text-red-600">
                    - Rp {rekapKeuangan.totalPengeluaran.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Saldo Akhir</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    Rp {rekapKeuangan.saldoAkhir.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Info */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Informasi Pembayaran</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Rekening Pembayaran</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Bank BCA:</span>
                <span className="font-medium">1234567890 a.n. Ahmad Wijaya</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bank Mandiri:</span>
                <span className="font-medium">0987654321 a.n. Ahmad Wijaya</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Kontak Bendahara</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">WhatsApp:</span>
                <span className="font-medium">0814-3456-7890</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Alamat:</span>
                <span className="font-medium">Jl. Kalita Blok C No. 22</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Iuran;
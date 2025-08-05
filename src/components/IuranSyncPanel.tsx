import React, { useState } from 'react';
import { RefreshCw, Calendar, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import { iuranUtils } from '../lib/supabase';

const IuranSyncPanel: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleDateString('id-ID', { month: 'long' }));

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const handleSyncCurrentMonth = async () => {
    setIsLoading(true);
    setSyncResult(null);
    
    try {
      const result = await iuranUtils.syncIuranData();
      setSyncResult(result);
    } catch (error) {
      setSyncResult({ error: 'Gagal melakukan sinkronisasi' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSpecificMonth = async () => {
    setIsLoading(true);
    setSyncResult(null);
    
    try {
      const result = await iuranUtils.generateMonthlyIuran(selectedMonth, selectedYear);
      setSyncResult(result);
    } catch (error) {
      setSyncResult({ error: 'Gagal generate iuran' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFullYear = async () => {
    setIsLoading(true);
    setSyncResult(null);
    
    try {
      const results = await iuranUtils.generateIuranForYear(selectedYear);
      setSyncResult({ data: results, message: `Generate iuran untuk tahun ${selectedYear} selesai` });
    } catch (error) {
      setSyncResult({ error: 'Gagal generate iuran tahunan' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
          <Settings className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Panel Sinkronisasi Iuran</h3>
          <p className="text-sm text-gray-600">Kelola dan sinkronisasi data iuran warga</p>
        </div>
      </div>

      {/* Quick Sync */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Sinkronisasi Cepat</h4>
        <button
          onClick={handleSyncCurrentMonth}
          disabled={isLoading}
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Sedang Sinkronisasi...' : 'Sinkronisasi Bulan Ini'}</span>
        </button>
        <p className="text-xs text-gray-500 mt-2">
          Generate iuran untuk bulan {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Manual Generation */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Generate Manual</h4>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {[2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleGenerateSpecificMonth}
            disabled={isLoading}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Generate Bulan</span>
          </button>
          
          <button
            onClick={handleGenerateFullYear}
            disabled={isLoading}
            className="bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Generate Tahun</span>
          </button>
        </div>
      </div>

      {/* Result Display */}
      {syncResult && (
        <div className={`p-4 rounded-lg ${
          syncResult.error 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-green-50 border border-green-200'
        }`}>
          <div className="flex items-start space-x-3">
            {syncResult.error ? (
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            )}
            <div className="flex-1">
              <h5 className={`font-semibold ${
                syncResult.error ? 'text-red-800' : 'text-green-800'
              }`}>
                {syncResult.error ? 'Error' : 'Berhasil'}
              </h5>
              <p className={`text-sm ${
                syncResult.error ? 'text-red-700' : 'text-green-700'
              }`}>
                {syncResult.error || syncResult.message || 'Sinkronisasi berhasil dilakukan'}
              </p>
              {syncResult.data && Array.isArray(syncResult.data) && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600">
                    Data yang diproses: {syncResult.data.length} bulan
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h5 className="font-semibold text-blue-800 mb-2">Informasi Penting</h5>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Sinkronisasi akan membuat iuran untuk semua warga aktif</li>
          <li>• Data yang sudah ada tidak akan ditimpa</li>
          <li>• Tarif iuran diambil dari pengaturan sistem</li>
          <li>• Summary akan diperbarui otomatis setelah sinkronisasi</li>
        </ul>
      </div>
    </div>
  );
};

export default IuranSyncPanel;
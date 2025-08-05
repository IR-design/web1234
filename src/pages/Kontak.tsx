import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';

const Kontak: React.FC = () => {
  const kontakPengurus = [
    {
      nama: 'Budi Santoso',
      jabatan: 'Ketua RT',
      telepon: '+62 812-3456-7890',
      email: 'budi.santoso@email.com',
      alamat: 'Jl. Kalita Blok A No. 15',
      jamKerja: 'Senin-Jumat: 19.00-21.00'
    },
    {
      nama: 'Siti Nurhaliza',
      jabatan: 'Sekretaris',
      telepon: '+62 813-2345-6789',
      email: 'siti.nurhaliza@email.com',
      alamat: 'Jl. Kalita Blok B No. 8',
      jamKerja: 'Senin-Jumat: 18.00-20.00'
    },
    {
      nama: 'Ahmad Wijaya',
      jabatan: 'Bendahara',
      telepon: '+62 814-3456-7890',
      email: 'ahmad.wijaya@email.com',
      alamat: 'Jl. Kalita Blok C No. 22',
      jamKerja: 'Senin-Sabtu: 19.00-21.00'
    }
  ];

  const fasilitasUmum = [
    {
      nama: 'Balai Pertemuan Cluster Kalita',
      alamat: 'Jl. Kalita Tengah (Area Komersial)',
      deskripsi: 'Untuk rapat, acara, dan kegiatan warga',
      kontak: 'Hubungi Ketua RT untuk peminjaman'
    },
    {
      nama: 'Pos Keamanan',
      alamat: 'Pintu Gerbang Utama Cluster Kalita',
      deskripsi: 'Layanan keamanan 24 jam',
      kontak: '+62 815-1111-2222'
    },
    {
      nama: 'Taman Bermain Anak',
      alamat: 'Area Tengah Cluster Kalita',
      deskripsi: 'Fasilitas bermain untuk anak-anak',
      kontak: 'Pengawasan orang tua diperlukan'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Kontak Kami</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Silakan hubungi pengurus RT/RW Cluster Kalita untuk berbagai keperluan 
          dan informasi yang Anda butuhkan.
        </p>
      </div>

      {/* Quick Contact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-emerald-600 text-white rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Hubungi Langsung</h3>
          <p className="text-emerald-100 mb-4">Untuk urusan mendesak dan darurat</p>
          <a
            href="tel:+6281234567890"
            className="bg-white text-emerald-600 px-6 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition-colors inline-block"
          >
            0812-3456-7890
          </a>
        </div>

        <div className="bg-blue-600 text-white rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">WhatsApp Group</h3>
          <p className="text-blue-100 mb-4">Bergabung dengan grup warga</p>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
          >
            Join Group
          </a>
        </div>

        <div className="bg-orange-600 text-white rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Email Resmi</h3>
          <p className="text-orange-100 mb-4">Untuk surat dan dokumen resmi</p>
          <a
            href="mailto:info@clusterkalita.com"
            className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors inline-block"
          >
            info@clusterkalita.com
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Kontak Pengurus */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Kontak Pengurus</h2>
          <div className="space-y-6">
            {kontakPengurus.map((pengurus, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {pengurus.nama.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{pengurus.nama}</h3>
                    <p className="text-emerald-600 font-medium mb-3">{pengurus.jabatan}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <a 
                          href={`tel:${pengurus.telepon}`}
                          className="text-gray-600 hover:text-emerald-600 transition-colors"
                        >
                          {pengurus.telepon}
                        </a>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <a 
                          href={`mailto:${pengurus.email}`}
                          className="text-gray-600 hover:text-emerald-600 transition-colors"
                        >
                          {pengurus.email}
                        </a>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-gray-600">{pengurus.alamat}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 text-sm">{pengurus.jamKerja}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <a
                        href={`https://wa.me/${pengurus.telepon.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href={`tel:${pengurus.telepon}`}
                        className="border border-emerald-600 text-emerald-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-50 transition-colors flex items-center space-x-2"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Telepon</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fasilitas dan Lokasi */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Fasilitas Umum</h2>
          <div className="space-y-6 mb-8">
            {fasilitasUmum.map((fasilitas, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{fasilitas.nama}</h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{fasilitas.alamat}</span>
                  </div>
                  <p className="text-gray-600 ml-7">{fasilitas.deskripsi}</p>
                  <p className="text-sm text-emerald-600 font-medium ml-7">{fasilitas.kontak}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Google Maps */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Lokasi Cluster Kalita</h3>
              <p className="text-gray-600">Jl. Kalita Raya, Kecamatan Kalita, Kota Jakarta</p>
            </div>
            <div className="h-64 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 mb-4">Peta Google Maps akan ditampilkan di sini</p>
                <a
                  href="https://maps.google.com/?q=Cluster+Kalita"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Buka di Google Maps</span>
                </a>
              </div>
            </div>
          </div>

          {/* Jam Operasional */}
          <div className="mt-6 bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Jam Pelayanan</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Senin - Jumat</span>
                <span className="font-medium text-gray-900">18.00 - 21.00 WIB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sabtu</span>
                <span className="font-medium text-gray-900">19.00 - 21.00 WIB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Minggu</span>
                <span className="font-medium text-gray-900">Berdasarkan Kesepakatan</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-3">
                <span className="text-gray-600">Darurat 24 Jam</span>
                <span className="font-medium text-emerald-600">0812-3456-7890</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-12 bg-emerald-50 rounded-xl p-8 border border-emerald-200">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Informasi Penting</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Untuk Keperluan Mendesak:</h4>
              <ul className="text-gray-700 space-y-1">
                <li>• Kebocoran air atau listrik: Hubungi Ketua RT</li>
                <li>• Keamanan: Hubungi Pos Satpam</li>
                <li>• Kesehatan: Hubungi klinik terdekat</li>
                <li>• Kerusakan fasilitas umum: Laporkan ke pengurus</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Cara Menyampaikan Keluhan:</h4>
              <ul className="text-gray-700 space-y-1">
                <li>• WhatsApp ke nomor pengurus terkait</li>
                <li>• Email resmi ke info@clusterkalita.com</li>
                <li>• Datang langsung saat jam pelayanan</li>
                <li>• Melalui grup WhatsApp warga</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kontak;
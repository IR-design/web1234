import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Struktur: React.FC = () => {
  const pengurus = [
    {
      nama: 'Budi Santoso',
      jabatan: 'Ketua RT',
      alamat: 'Jl. Kalita Blok A No. 15',
      telepon: '+62 812-3456-7890',
      email: 'budi.santoso@email.com'
    },
    {
      nama: 'Siti Nurhaliza',
      jabatan: 'Sekretaris',
      alamat: 'Jl. Kalita Blok B No. 8',
      telepon: '+62 813-2345-6789',
      email: 'siti.nurhaliza@email.com'
    },
    {
      nama: 'Ahmad Wijaya',
      jabatan: 'Bendahara',
      alamat: 'Jl. Kalita Blok C No. 22',
      telepon: '+62 814-3456-7890',
      email: 'ahmad.wijaya@email.com'
    },
    {
      nama: 'Rina Marlina',
      jabatan: 'Koordinator Keamanan',
      alamat: 'Jl. Kalita Blok A No. 7',
      telepon: '+62 815-4567-8901',
      email: 'rina.marlina@email.com'
    },
    {
      nama: 'Dedi Kurniawan',
      jabatan: 'Koordinator Kebersihan',
      alamat: 'Jl. Kalita Blok D No. 12',
      telepon: '+62 816-5678-9012',
      email: 'dedi.kurniawan@email.com'
    },
    {
      nama: 'Maya Sari',
      jabatan: 'Koordinator Sosial',
      alamat: 'Jl. Kalita Blok B No. 18',
      telepon: '+62 817-6789-0123',
      email: 'maya.sari@email.com'
    },
    {
      nama: 'Hendra Gunawan',
      jabatan: 'Koordinator Pemuda',
      alamat: 'Jl. Kalita Blok C No. 5',
      telepon: '+62 818-7890-1234',
      email: 'hendra.gunawan@email.com'
    },
    {
      nama: 'Indira Putri',
      jabatan: 'Koordinator PKK',
      alamat: 'Jl. Kalita Blok A No. 25',
      telepon: '+62 819-8901-2345',
      email: 'indira.putri@email.com'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Struktur Organisasi</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Pengurus Paguyuban RT/RW Cluster Kalita periode 2024-2026 yang siap melayani 
          dan mengkoordinasikan berbagai kegiatan untuk kemajuan lingkungan kita.
        </p>
      </div>

      {/* Organizational Chart */}
      <div className="mb-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Bagan Organisasi</h2>
          
          {/* Ketua */}
          <div className="text-center mb-8">
            <div className="inline-block bg-emerald-600 text-white px-6 py-4 rounded-lg">
              <h3 className="font-semibold">Ketua RT</h3>
              <p className="text-emerald-100">Budi Santoso</p>
            </div>
          </div>

          {/* Second Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white px-6 py-4 rounded-lg">
                <h3 className="font-semibold">Sekretaris</h3>
                <p className="text-blue-100">Siti Nurhaliza</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white px-6 py-4 rounded-lg">
                <h3 className="font-semibold">Bendahara</h3>
                <p className="text-blue-100">Ahmad Wijaya</p>
              </div>
            </div>
          </div>

          {/* Third Level - Coordinators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pengurus.slice(3).map((person, index) => (
              <div key={index} className="text-center">
                <div className="bg-orange-500 text-white px-4 py-3 rounded-lg">
                  <h3 className="font-semibold text-sm">{person.jabatan}</h3>
                  <p className="text-orange-100 text-sm">{person.nama}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pengurus.map((person, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-xl">
                  {person.nama.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{person.nama}</h3>
              <p className="text-emerald-600 font-semibold">{person.jabatan}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600 text-sm">{person.alamat}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <a 
                  href={`tel:${person.telepon}`}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  {person.telepon}
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <a 
                  href={`mailto:${person.email}`}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  {person.email}
                </a>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <a
                href={`https://wa.me/${person.telepon.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Struktur;
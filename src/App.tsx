import React, { useState } from 'react';
import { Home, Users, Newspaper, DollarSign, ImageIcon, Phone, Menu, X } from 'lucide-react';
import Header from './components/Header';
import RealtimeStatus from './components/RealtimeStatus';
import LiveChat from './components/LiveChat';
import NotificationPanel from './components/NotificationPanel';
import Beranda from './pages/Beranda';
import Struktur from './pages/Struktur';
import Berita from './pages/Berita';
import DataWarga from './pages/DataWarga';
import Iuran from './pages/Iuran';
import Galeri from './pages/Galeri';
import Kontak from './pages/Kontak';

function App() {
  const [currentPage, setCurrentPage] = useState('beranda');

  const renderPage = () => {
    switch (currentPage) {
      case 'beranda':
        return <Beranda onNavigate={setCurrentPage} />;
      case 'struktur':
        return <Struktur />;
      case 'berita':
        return <Berita />;
      case 'data-warga':
        return <DataWarga />;
      case 'iuran':
        return <Iuran />;
      case 'galeri':
        return <Galeri />;
      case 'kontak':
        return <Kontak />;
      default:
        return <Beranda onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="pb-8">
        {renderPage()}
      </main>
      
      {/* Footer */}
      <footer className="bg-emerald-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Paguyuban Cluster Kalita</h3>
            <p className="text-emerald-100 mb-4">
              Membangun kebersamaan dan harmoni dalam lingkungan RT/RW
            </p>
            <p className="text-sm text-emerald-200">
              © 2025 Paguyuban Cluster Kalita. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Realtime Components */}
      <RealtimeStatus />
      <NotificationPanel />
      <LiveChat />
    </div>
  );
}

export default App;
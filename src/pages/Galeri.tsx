import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Play, Calendar, Users } from 'lucide-react';

const Galeri: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const galeriItems = [
    {
      id: 1,
      title: 'Gotong Royong Bersih-Bersih Lingkungan',
      date: '19 Januari 2025',
      type: 'kegiatan',
      images: [
        'https://gjmcksfjrsszlfcprqfx.supabase.co/storage/v1/object/public/mandiri//WhatsApp%20Image%202025-07-26%20at%2023.34.16.jpeg',
        'https://images.pexels.com/photos/6647919/pexels-photo-6647919.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6647879/pexels-photo-6647879.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Kegiatan gotong royong rutin membersihkan lingkungan cluster dengan partisipasi seluruh warga.'
    },
    {
      id: 2,
      title: 'Perayaan HUT RI Ke-80',
      date: '17 Agustus 2024',
      type: 'perayaan',
      images: [
        'https://images.pexels.com/photos/8199166/pexels-photo-8199166.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/8199150/pexels-photo-8199150.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/8199147/pexels-photo-8199147.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Perayaan kemerdekaan yang meriah dengan berbagai lomba dan kegiatan untuk seluruh keluarga.'
    },
    {
      id: 3,
      title: 'Rapat Koordinasi Pengurus',
      date: '25 Januari 2025',
      type: 'rapat',
      images: [
        'https://images.pexels.com/photos/7688367/pexels-photo-7688367.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/7688374/pexels-photo-7688374.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Rapat bulanan pengurus untuk evaluasi dan perencanaan kegiatan selanjutnya.'
    },
    {
      id: 4,
      title: 'Program Vaksinasi COVID-19',
      date: '27 Juli 2024',
      type: 'kesehatan',
      images: [
        'https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/8460207/pexels-photo-8460207.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Program vaksinasi dosis booster yang diselenggarakan bekerja sama dengan Puskesmas setempat.'
    },
    {
      id: 5,
      title: 'Kegiatan Sosial Berbagi Sembako',
      date: '15 Ramadan 1445H',
      type: 'sosial',
      images: [
        'https://images.pexels.com/photos/6995247/pexels-photo-6995247.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6995185/pexels-photo-6995185.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6995170/pexels-photo-6995170.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Kegiatan berbagi sembako kepada warga yang membutuhkan di bulan suci Ramadan.'
    },
    {
      id: 6,
      title: 'Penanaman Pohon Bersama',
      date: '22 April 2024',
      type: 'lingkungan',
      images: [
        'https://images.pexels.com/photos/9324598/pexels-photo-9324598.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/9324531/pexels-photo-9324531.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Program penghijauan dengan menanam pohon di area taman cluster untuk memperbaiki kualitas udara.'
    }
  ];

  const allImages = galeriItems.flatMap(item => 
    item.images.map(image => ({ ...item, image }))
  );

  const getTypeColor = (type: string) => {
    const colors = {
      kegiatan: 'bg-blue-100 text-blue-600',
      perayaan: 'bg-red-100 text-red-600',
      rapat: 'bg-purple-100 text-purple-600',
      kesehatan: 'bg-green-100 text-green-600',
      sosial: 'bg-orange-100 text-orange-600',
      lingkungan: 'bg-emerald-100 text-emerald-600'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'kegiatan': return <Users className="w-4 h-4" />;
      case 'rapat': return <Calendar className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galeriItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galeriItems.length) % galeriItems.length);
  };

  const openLightbox = (item: any, imageIndex: number = 0) => {
    setSelectedImage({ ...item, selectedImageIndex: imageIndex });
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage && selectedImage.selectedImageIndex < selectedImage.images.length - 1) {
      setSelectedImage({
        ...selectedImage,
        selectedImageIndex: selectedImage.selectedImageIndex + 1
      });
    }
  };

  const prevImage = () => {
    if (selectedImage && selectedImage.selectedImageIndex > 0) {
      setSelectedImage({
        ...selectedImage,
        selectedImageIndex: selectedImage.selectedImageIndex - 1
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Galeri Kegiatan</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Dokumentasi berbagai kegiatan dan momen berharga yang telah dilaksanakan 
          bersama warga Cluster Kalita.
        </p>
      </div>

      {/* Featured Slideshow */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sorotan Kegiatan</h2>
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-96 md:h-[500px]">
            <img
              src={galeriItems[currentSlide].images[0]}
              alt={galeriItems[currentSlide].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center space-x-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getTypeColor(galeriItems[currentSlide].type)} bg-white/20 backdrop-blur-sm text-white`}>
                  {galeriItems[currentSlide].type}
                </span>
                <span className="text-sm opacity-90">{galeriItems[currentSlide].date}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                {galeriItems[currentSlide].title}
              </h3>
              <p className="text-lg opacity-90 max-w-2xl">
                {galeriItems[currentSlide].description}
              </p>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {galeriItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Semua Dokumentasi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galeriItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => openLightbox(item)}
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(item.type)}`}>
                    {item.type}
                  </span>
                </div>
                {item.images.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs">
                    +{item.images.length - 1} foto
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{item.date}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {item.description}
                </p>
                
                <button
                  onClick={() => openLightbox(item)}
                  className="mt-3 text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center space-x-1"
                >
                  <Play className="w-4 h-4" />
                  <span>Lihat Galeri</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="max-w-6xl max-h-full bg-white rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedImage.title}</h3>
                <p className="text-sm text-gray-600">{selectedImage.date}</p>
              </div>
              <button
                onClick={closeLightbox}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Image */}
            <div className="relative">
              <img
                src={selectedImage.images[selectedImage.selectedImageIndex]}
                alt={selectedImage.title}
                className="w-full max-h-96 md:max-h-[500px] object-contain bg-gray-100"
              />
              
              {selectedImage.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    disabled={selectedImage.selectedImageIndex === 0}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors disabled:opacity-50"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    disabled={selectedImage.selectedImageIndex === selectedImage.images.length - 1}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors disabled:opacity-50"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {selectedImage.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded text-sm">
                  {selectedImage.selectedImageIndex + 1} / {selectedImage.images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {selectedImage.images.length > 1 && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2 overflow-x-auto">
                  {selectedImage.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage({ ...selectedImage, selectedImageIndex: index })}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        index === selectedImage.selectedImageIndex
                          ? 'border-emerald-600'
                          : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${selectedImage.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="p-4 border-t border-gray-200">
              <p className="text-gray-700">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Galeri;
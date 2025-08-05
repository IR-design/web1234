import React, { useState } from 'react'
import { Bell, X, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react'
import { useRealtimePengumuman } from '../hooks/useRealtime'
import type { Pengumuman } from '../lib/supabase'

const NotificationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { data: pengumumanList } = useRealtimePengumuman()
  
  const activePengumuman = pengumumanList.filter((p: Pengumuman) => p.active)
  const unreadCount = activePengumuman.length

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'medium':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      default:
        return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50'
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50'
      default:
        return 'border-l-blue-500 bg-blue-50'
    }
  }

  return (
    <>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-24 right-4 z-50 bg-white shadow-lg border border-gray-200 p-3 rounded-full hover:bg-gray-50 transition-colors"
      >
        <div className="relative">
          <Bell className="w-6 h-6 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="fixed top-20 right-4 z-50 w-80 max-h-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-emerald-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <h3 className="font-semibold">Notifikasi</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-emerald-100 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {unreadCount > 0 && (
              <p className="text-emerald-100 text-sm mt-1">
                {unreadCount} pengumuman aktif
              </p>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {activePengumuman.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>Tidak ada pengumuman aktif</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {activePengumuman.map((pengumuman: Pengumuman) => (
                  <div
                    key={pengumuman.id}
                    className={`p-4 border-l-4 ${getPriorityColor(pengumuman.priority)} hover:bg-gray-50 transition-colors`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getPriorityIcon(pengumuman.priority)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">
                          {pengumuman.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {pengumuman.content}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(pengumuman.created_at).toLocaleString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {activePengumuman.length > 0 && (
            <div className="p-3 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Tutup Notifikasi
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default NotificationPanel
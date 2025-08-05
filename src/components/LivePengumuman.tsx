import React from 'react'
import { AlertCircle, X } from 'lucide-react'
import { useRealtimePengumuman } from '../hooks/useRealtime'
import type { Pengumuman } from '../lib/supabase'

const LivePengumuman: React.FC = () => {
  const { data: pengumumanList } = useRealtimePengumuman()
  
  const activePengumuman = pengumumanList.filter((p: Pengumuman) => p.active)

  if (activePengumuman.length === 0) return null

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 border-red-500 text-red-800'
      case 'medium':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800'
      default:
        return 'bg-blue-100 border-blue-500 text-blue-800'
    }
  }

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-2xl px-4">
      {activePengumuman.map((pengumuman: Pengumuman) => (
        <div
          key={pengumuman.id}
          className={`mb-2 p-4 rounded-lg border-l-4 shadow-lg ${getPriorityColor(pengumuman.priority)}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">{pengumuman.title}</h4>
                <p className="text-sm opacity-90">{pengumuman.content}</p>
                <p className="text-xs opacity-75 mt-2">
                  {new Date(pengumuman.created_at).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default LivePengumuman
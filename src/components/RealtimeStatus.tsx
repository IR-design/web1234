import React, { useEffect, useState } from 'react'
import { Wifi, WifiOff } from 'lucide-react'
import { supabase } from '../lib/supabase'

const RealtimeStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    const channel = supabase.channel('connection-status')
    
    channel
      .on('presence', { event: 'sync' }, () => {
        setIsConnected(true)
        setLastUpdate(new Date())
      })
      .on('presence', { event: 'join' }, () => {
        setIsConnected(true)
        setLastUpdate(new Date())
      })
      .on('presence', { event: 'leave' }, () => {
        setIsConnected(false)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
          setLastUpdate(new Date())
        } else if (status === 'CLOSED') {
          setIsConnected(false)
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg ${
        isConnected 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}>
        {isConnected ? (
          <Wifi className="w-4 h-4" />
        ) : (
          <WifiOff className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {isConnected ? 'Terhubung' : 'Terputus'}
        </span>
        {lastUpdate && isConnected && (
          <span className="text-xs opacity-75">
            {lastUpdate.toLocaleTimeString('id-ID')}
          </span>
        )}
      </div>
    </div>
  )
}

export default RealtimeStatus
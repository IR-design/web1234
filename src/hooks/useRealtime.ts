import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useRealtimeSubscription<T>(
  table: string,
  initialData: T[] = [],
  filter?: { column: string; value: any }
) {
  const [data, setData] = useState<T[]>(initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let channel: RealtimeChannel

    const setupSubscription = async () => {
      try {
        // Fetch initial data
        let query = supabase.from(table).select('*')
        
        if (filter) {
          query = query.eq(filter.column, filter.value)
        }
        
        const { data: initialData, error: fetchError } = await query.order('created_at', { ascending: false })
        
        if (fetchError) {
          setError(fetchError.message)
          return
        }

        setData(initialData || [])
        setLoading(false)

        // Setup realtime subscription
        channel = supabase
          .channel(`realtime-${table}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: table,
              ...(filter && { filter: `${filter.column}=eq.${filter.value}` })
            },
            (payload) => {
              console.log('Realtime update:', payload)
              
              switch (payload.eventType) {
                case 'INSERT':
                  setData(prev => [payload.new as T, ...prev])
                  break
                case 'UPDATE':
                  setData(prev => prev.map(item => 
                    (item as any).id === payload.new.id ? payload.new as T : item
                  ))
                  break
                case 'DELETE':
                  setData(prev => prev.filter(item => (item as any).id !== payload.old.id))
                  break
              }
            }
          )
          .subscribe((status) => {
            console.log('Subscription status:', status)
          })

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    setupSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [table, filter?.column, filter?.value])

  return { data, loading, error, setData }
}

export function useRealtimeIuran(wargaId?: number) {
  return useRealtimeSubscription(
    'iuran',
    [],
    wargaId ? { column: 'warga_id', value: wargaId } : undefined
  )
}

export function useRealtimeBerita() {
  return useRealtimeSubscription('berita', [])
}

export function useRealtimeWarga() {
  return useRealtimeSubscription('warga', [])
}

export function useRealtimeChat() {
  return useRealtimeSubscription('chat_messages', [])
}

export function useRealtimePengumuman() {
  return useRealtimeSubscription('pengumuman', [])
}

export function useRealtimeIuranSummary(tahun?: number) {
  return useRealtimeSubscription(
    'iuran_summary',
    [],
    tahun ? { column: 'tahun', value: tahun } : undefined
  )
}

export function useRealtimeIuranSettings() {
  return useRealtimeSubscription('iuran_settings', [])
}
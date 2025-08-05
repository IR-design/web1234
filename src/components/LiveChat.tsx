import React, { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle, X, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useRealtimeChat } from '../hooks/useRealtime'
import type { ChatMessage } from '../lib/supabase'

const LiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [userName, setUserName] = useState('')
  const [isNameSet, setIsNameSet] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { data: messages, loading } = useRealtimeChat()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!message.trim() || !userName.trim()) return

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([
          {
            user_name: userName,
            message: message.trim()
          }
        ])

      if (error) {
        console.error('Error sending message:', error)
        return
      }

      setMessage('')
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (isNameSet) {
        sendMessage()
      } else {
        setIsNameSet(true)
      }
    }
  }

  const setName = () => {
    if (userName.trim()) {
      setIsNameSet(true)
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 z-50 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-emerald-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <h3 className="font-semibold">Chat Warga</h3>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs">Live</span>
              </div>
            </div>
          </div>

          {!isNameSet ? (
            /* Name Input */
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Masukkan Nama Anda</h4>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nama lengkap..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 mb-4"
                />
                <button
                  onClick={setName}
                  disabled={!userName.trim()}
                  className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mulai Chat
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading ? (
                  <div className="text-center text-gray-500">Memuat pesan...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500">Belum ada pesan</div>
                ) : (
                  messages.map((msg: ChatMessage) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.user_name === userName ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg ${
                          msg.user_name === userName
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {msg.user_name !== userName && (
                          <div className="text-xs font-semibold mb-1 opacity-75">
                            {msg.user_name}
                          </div>
                        )}
                        <div className="text-sm">{msg.message}</div>
                        <div className="text-xs opacity-75 mt-1">
                          {new Date(msg.created_at).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ketik pesan..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default LiveChat
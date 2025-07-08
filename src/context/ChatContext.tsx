import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAppDispatch } from '@/stores/hooks'
import { baseCentrifugoUrlURLApi } from '@/config'
import { getChatToken } from '@/stores/thunks/chats'
import { useAuth } from '@/hooks/useAuth'
import { useCentrifugo } from '@/hooks/useCentrifuge'

interface ChatContextType {
  sendMessage: (content: string) => Promise<void>
  refreshConversations: () => Promise<void>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const [chatToken, setChatToken] = useState<string>('')

  // Setup Centrifugo client for the user's channel
  const centrifugoUrl =
    baseCentrifugoUrlURLApi || `ws://${window.location.hostname}:8000/connection/websocket`

  useEffect(() => {
    if (!user) return

    const fetchToken = async () => {
      try {
        const data = await dispatch(getChatToken()).unwrap()
        // const data = await api.get('chat-requests/token');
        console.log(121222456776, data)
        setChatToken(data.token)
      } catch (error) {
        console.error('Failed to fetch Centrifugo token:', error)
      }
    }

    fetchToken()
  }, [user])

  const { sendMessage, refreshConversations } = useCentrifugo({
    user,
    token: chatToken,
    url: centrifugoUrl,
    isModerator: true,
  })

  return (
    <ChatContext.Provider
      value={{
        sendMessage,
        refreshConversations,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}

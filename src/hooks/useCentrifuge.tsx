import { Centrifuge, Subscription } from 'centrifuge'
import { useState, useEffect, useCallback } from 'react'
import { IMessage } from '@/interfaces/IMessage'
import { IUser } from '@/interfaces'
import {
  getFilteredConversationsAPI,
  markMessagesAsReadAPI,
  sendMessageAPI,
} from '@/stores/thunks/chats'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import { IsDevelopmentNodeEnv } from '@/config'
import {
  addMessage,
  removeTempMessage,
  setNewMessageOnSubscription,
  updateTempMessage,
} from '@/stores/slices/chatsSlice'
import { ChatNotification } from '@/components/Chat/ChatNotification'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { ChatStatus } from '@/interfaces/IChat'

interface UseCentrifugoProps {
  user: IUser | null
  url: string
  token: string
  isModerator: boolean
}

export const useCentrifugo = ({ user, url, token, isModerator }: UseCentrifugoProps) => {
  const { selectedConversation } = useAppSelector((state) => state.chats)

  const [client, setClient] = useState<Centrifuge | null>(null)
  const [connected, setConnected] = useState(false)
  const dispatch = useAppDispatch()

  // Initialize client
  useEffect(() => {
    if (!url || !token) return

    const centrifuge = new Centrifuge(url, {
      token,
      debug: IsDevelopmentNodeEnv,
    })

    centrifuge.on('connected', () => {
      console.log('Connected to Centrifugo')
      setConnected(true)
    })

    centrifuge.on('disconnected', (ctx) => {
      console.log('Disconnected from Centrifugo:', ctx)
      setConnected(false)
    })

    centrifuge.on('message', (ctx) => {
      console.debug('get message from Centrifugo:', ctx)
    })

    centrifuge.on('error', (ctx) => {
      console.error('get error from Centrifugo:', ctx)
    })

    centrifuge.on('publication', (ctx) => {
      console.log(6666666, 'get publication message from Centrifugo:', ctx)
    })

    centrifuge.connect()
    setClient(centrifuge)

    return () => {
      centrifuge.disconnect()
    }
  }, [url, token])

  // Subscribe to channels
  useEffect(() => {
    if (!client || !user || !selectedConversation) return

    const newSubscriptions: Subscription[] = []

    // // For user, subscribe to their private channel
    // const userChannel = `user:${user._id}`;
    // let userSubscription: Subscription | null = client.getSubscription(userChannel)
    // if (!userSubscription) {
    //     userSubscription = client.newSubscription(userChannel);
    // }
    // userSubscription.on('publication', handleUserNotification);
    // userSubscription.subscribe();
    // newSubscriptions.push(userSubscription);

    // Subscribe to selected conversation channel
    if (selectedConversation) {
      const conversationChannel = `support:${selectedConversation._id}`
      let conversationSubscription: Subscription | null =
        client.getSubscription(conversationChannel)
      if (!conversationSubscription) {
        conversationSubscription = client.newSubscription(conversationChannel)
      }
      conversationSubscription.off('publication', handleMessageUpdate)
      conversationSubscription.on('publication', handleMessageUpdate)
      conversationSubscription.subscribe()
      newSubscriptions.push(conversationSubscription)
    }

    return () => {
      // Unsubscribe from all channels when component unmounts
      // @ts-ignore
      newSubscriptions.forEach((sub) => sub.unsubscribe())
    }
  }, [client, user, selectedConversation])

  useEffect(() => {
    if (!client || !user || !isModerator) return

    const newSubscriptions: Subscription[] = []

    if (isModerator) {
      const moderatorChannel = 'admin:support'
      let moderatorSubscription: Subscription | null = client.getSubscription(moderatorChannel)

      if (!moderatorSubscription) {
        moderatorSubscription = client.newSubscription(moderatorChannel)
      }

      moderatorSubscription.on('publication', handleModeratorNotification)
      moderatorSubscription.subscribe()
      newSubscriptions.push(moderatorSubscription)
    }

    return () => {
      // Unsubscribe from all channels when component unmounts
      // @ts-ignore
      newSubscriptions.forEach((sub) => sub.unsubscribe())
    }
  }, [client, user, isModerator])

  const refreshConversations = useCallback(async () => {
    dispatch(getFilteredConversationsAPI({ query: '', data: { status: ChatStatus.OPEN } }))
  }, [isModerator])

  const sendMessage = async (content: string) => {
    if (!selectedConversation) return
    if (!user) return

    // Создаем временное сообщение для мгновенного отображения
    const tempId = `temp-${Date.now()}`
    const tempMessage: IMessage = {
      _id: tempId,
      content,
      senderId: {
        _id: user._id,
        name: user.name,
        role: user.role,
      } as IUser,
      conversationId: selectedConversation,
      isRead: false,
      createdAt: new Date().toISOString(),
    }

    addMessage(tempMessage)

    try {
      let realMessage
      dispatch(
        sendMessageAPI({
          conversationId: selectedConversation._id,
          content,
        })
      )
        .unwrap()
        .then((res) => {
          console.log('dispatch/sendMessageAPI response:', res)
          realMessage = res
        })
      updateTempMessage({ tempId, realMessage })
    } catch (error) {
      removeTempMessage(tempId)
      console.error('Failed to send message:', error)
      throw error
    }
  }

  // Handle message updates from Centrifugo
  const handleMessageUpdate = async (ctx: any) => {
    const { data } = ctx

    console.log('handleMessageUpdate data: ', data, ctx)

    if (data.type === 'new_message') {
      const newMessage = data.message
      console.log({ newMessage })

      dispatch(setNewMessageOnSubscription(newMessage))

      // Отмечаем как прочитанное, если активный чат
      if (selectedConversation && selectedConversation._id === newMessage.conversationId._id) {
        dispatch(markMessagesAsReadAPI(selectedConversation._id))
      }
    }
  }

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        console.log('Notification permission:', permission)
      })
    }
  }, [])

  const router = useRouter()

  function showChatToast(data: IMessage) {
    toast(<ChatNotification avatarUrl={''} name={data.senderId.name} message={data.content} />, {
      onClick: async () => {
        await router.push(`/chats/${data.conversationId._id}`)
      },
    })
  }

  // Handle moderator notifications from Centrifugo
  const handleModeratorNotification = async (ctx: any) => {
    const { data } = ctx

    if (data.type === 'new_conversation' || data.type === 'new_support_message') {
      // Update conversations to reflect new conversation or message
      await refreshConversations()

      // Display a browser notification if needed
      showChatToast(ctx.data.message)
    }
  }

  const publish = useCallback(async (channel: string, data: any) => {
    console.debug(`publish/ channel: ${channel}, data: ${data}`)
    // In real implementation, you'd call your backend API to publish
    // as direct publishing from client is usually not recommended for security
    const response = await fetch('/api/chat/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    return response.json()
  }, [])

  return {
    connected,
    publish,
    sendMessage,
    refreshConversations,
  }
}

import { useRouter } from 'next/router'
import React, { ReactElement, useEffect } from 'react'
import LayoutAuthenticated from '@/layouts/Authenticated'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import ChatsLayout from '@/pages/chats/layout'
import ChatWindow from '@/components/Chat/ChatWindow'
import { getConversationById, getMessagesAPI, markMessagesAsReadAPI } from '@/stores/thunks/chats'

const ChatDetailPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { id } = router.query

  const { selectedConversation } = useAppSelector((state) => state.chats)

  useEffect(() => {
    if (id) {
      dispatch(markMessagesAsReadAPI(id as string))
      dispatch(getConversationById(id as string))
      dispatch(getMessagesAPI(id as string))
    }
  }, [id, dispatch])

  if (!selectedConversation) {
    return null
  }

  return (
    <>
      <ChatWindow />
    </>
  )
}

ChatDetailPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated>
      <ChatsLayout>{page}</ChatsLayout>
    </LayoutAuthenticated>
  )
}

export default ChatDetailPage

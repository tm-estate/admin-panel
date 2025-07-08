import React, { ReactElement, useEffect } from 'react'
import LayoutAuthenticated from '@/layouts/Authenticated'
import { getPageTitle } from '@/config'
import Head from 'next/head'
import SectionMain from '@/components/Section/SectionMain'
import { mdiChartTimelineVariant } from '@mdi/js'
import BreadcrumbsBar from '@/components/BreadcrumbsBar'
import SectionTitleLineWithButton from '@/components/Section/SectionTitleLineWithButton'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import { getConversationById, getMessagesAPI } from '@/stores/thunks/chats'
import ChatWindow from '@/components/Chat/ChatWindow'
import ChatAside from '@/components/Chat/ChatAside'

const ChatPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { chatId } = router.query
  const { selectedConversation } = useAppSelector((state) => state.chats)

  useEffect(() => {
    if (chatId) {
      dispatch(getConversationById(chatId as string))
      dispatch(getMessagesAPI(chatId as string))
    }
  }, [chatId, dispatch])

  if (!selectedConversation) {
    return null
  }

  const userName = selectedConversation.userId?.name || 'User'

  return (
    <>
      <Head>
        <title>{getPageTitle(`Chat with user: ${userName}`)}</title>
      </Head>

      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={`Chat with user name: ${userName}`}
          main
        >
          <BreadcrumbsBar
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Support Chat', href: '/chat-requests/chat-requests-list' },
              { label: `Chat with user: ${userName}`, href: `/chat/${chatId}` },
            ]}
          />
        </SectionTitleLineWithButton>

        <div className={'h-full flex'}>
          <ChatAside />

          <ChatWindow />
        </div>
      </SectionMain>
    </>
  )
}

ChatPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default ChatPage

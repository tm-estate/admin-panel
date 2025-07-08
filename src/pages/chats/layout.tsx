import React, { useEffect } from 'react'
import { useAppSelector } from '@/stores/hooks'
import ChatAsideTab from '@/components/Chat/ChatAsideTab'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import Head from 'next/head'
import { getPageTitle } from '@/config'
import SectionTitleLineWithButton from '@/components/Section/SectionTitleLineWithButton'
import { mdiChartTimelineVariant } from '@mdi/js'
import BreadcrumbsBar from '@/components/BreadcrumbsBar'

interface IProps {
  children: React.ReactNode
}

const ChatsLayout = ({ children }: IProps) => {
  const { notify: chatsNotify } = useAppSelector((state) => state.chats)

  const showNotification = (type, message) => {
    toast(message, {
      type,
      position: 'bottom-center',
      autoClose: 3000,
    })
  }

  useEffect(() => {
    if (chatsNotify?.showNotification) {
      showNotification(chatsNotify.typeNotification, chatsNotify.textNotification)
    }
  }, [chatsNotify?.showNotification])

  return (
    <div className="flex-1 h-full p-6">
      <Head>
        <title>{getPageTitle(`Chat page`)}</title>
      </Head>

      <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={`Chat Page`} main>
        <BreadcrumbsBar
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Chat Requests', href: '/chat-requests' },
            { label: `Chat Page`, href: `/chat/test` },
          ]}
        />
      </SectionTitleLineWithButton>

      <div className={'h-full flex'}>
        <ChatAsideTab />

        <main className="flex-1">{children}</main>
      </div>

      <ToastContainer />
    </div>
  )
}

export default ChatsLayout

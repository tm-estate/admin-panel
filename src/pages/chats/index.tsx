import ChatsLayout from '@/pages/chats/layout'
import React, { ReactElement } from 'react'
import LayoutAuthenticated from '@/layouts/Authenticated'

const ChatHomePage = () => {
  return (
    <ChatsLayout>
      <div>
        <h2 className="mx-auto text-center p-6 text-lg text-gray-500">
          Select a chat to start messaging.
        </h2>
      </div>
    </ChatsLayout>
  )
}

ChatHomePage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default ChatHomePage

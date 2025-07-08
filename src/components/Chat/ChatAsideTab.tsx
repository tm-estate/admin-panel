import React, { useEffect } from 'react'
import BaseIcon from '@/components/Base/BaseIcon'
import { mdiChevronDown } from '@mdi/js'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import { getFilteredConversationsAPI } from '@/stores/thunks/chats'
import { useAuth } from '@/hooks/useAuth'
import { formatMessageTime } from '@/helpers/chatMessageDate'
import { ChatStatus, IChatTab } from '@/interfaces/IChat'
import { selectChatTab } from '@/stores/slices/chatsSlice'

const tabs: IChatTab[] = [
  { name: 'Active', link: ChatStatus.OPEN },
  { name: 'Closed', link: ChatStatus.CLOSED },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const ChatAsideTab = () => {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const { selectedChatTab, selectedConversation, filteredConversations } = useAppSelector(
    (state) => state.chats
  )

  useEffect(() => {
    dispatch(
      getFilteredConversationsAPI({
        query: '',
        data: {
          status: selectedChatTab,
          adminId: user?._id,
        },
      })
    )
  }, [selectedChatTab])

  const handleSelectChatTab = (chatStatus: ChatStatus) => {
    dispatch(selectChatTab(chatStatus))
  }

  return (
    <div className={'w-80 border-r'}>
      <div className="grid grid-cols-1 sm:hidden">
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          defaultValue={tabs.find((tab) => tab.link === selectedChatTab)?.name}
          aria-label="Select a tab"
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
        <BaseIcon
          path={mdiChevronDown}
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
        />
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav aria-label="Tabs" className="-mb-px flex space-x-8  px-2">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                aria-current={tab.link === selectedChatTab ? 'page' : undefined}
                onClick={() => handleSelectChatTab(tab.link)}
                className={classNames(
                  tab.link === selectedChatTab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium'
                )}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="">
        {filteredConversations.length === 0 ? (
          <p className="text-gray-400 text-center">No {selectedChatTab} chats</p>
        ) : (
          <ul className="">
            {filteredConversations.map((conversation) => (
              <Link
                href={`/chats/${conversation._id}`}
                key={conversation._id}
                className={`block border-b p-4 cursor-pointer ${
                  selectedConversation?._id === conversation._id ? 'bg-blue-500' : ''
                }`}
              >
                <div className="flex justify-between items-center gap-x-2.5">
                  <div className="shrink-0">
                    <img
                      alt="user avatar"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                      className="size-8 rounded-full"
                    />
                  </div>
                  <div className={'flex-1 min-w-0'}>
                    <h4 className="text-sm font-semibold text-black">
                      {conversation.userId?.name || 'User'}
                    </h4>
                    {/*<p className="text-xs text-black">{conversation.departmentId?.name}</p>*/}
                    <p className="text-xs text-[#757285] truncate overflow-hidden">
                      {conversation.lastMessage?.senderId._id === user._id ? (
                        <span className={'font-semibold text-blue-900'}>You: </span>
                      ) : null}
                      {conversation.lastMessage?.content}
                    </p>
                  </div>
                  <div className={'shrink-0 flex items-center flex-col gap-y-0.5'}>
                    {conversation.lastMessage ? (
                      <span className={'text-xs text-[#757285]'}>
                        {formatMessageTime(conversation.lastMessage.createdAt)}
                      </span>
                    ) : null}
                    {conversation.unreadCount! > 0 && (
                      <span className="w-5 h-5 flex justify-center items-center rounded-full text-xs font-medium bg-blue-900 text-white">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ChatAsideTab

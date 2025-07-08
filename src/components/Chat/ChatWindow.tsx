import React, { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import ChatInput from '@/components/Chat/ChatInput'
import MessageList from '@/components/Chat/MessageList'
import { useAuth } from '@/hooks/useAuth'
import { useChat } from '@/context/ChatContext'
import BaseButton from '@/components/Base/BaseButton'
import {
  assignConversationToModerator,
  closeConversationAPI,
  getFilteredConversationsAPI,
} from '@/stores/thunks/chats'
import { ChatStatus } from '@/interfaces/IChat'
import { setSelectedConversation } from '@/stores/slices/chatsSlice'

type IProps = {}

const ChatWindow: React.FC<IProps> = ({}) => {
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const { sendMessage } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { selectedConversation, conversationMessages: messages } = useAppSelector(
    (state) => state.chats
  )

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!selectedConversation) {
    return null
  }

  const handleAssignToMe = async (conversationId: string) => {
    if (!user) return

    try {
      dispatch(assignConversationToModerator(conversationId as string))
        .unwrap()
        .then(() => {
          dispatch(getFilteredConversationsAPI({}))
          dispatch(
            setSelectedConversation({
              ...selectedConversation,
              adminId: user,
            })
          )
        })
    } catch (e) {
      console.error('Failed to handle to me conversation:', e)
    }
  }

  const handleCloseConversation = async (conversationId: string) => {
    if (!user) return

    try {
      dispatch(closeConversationAPI(conversationId as string))
      dispatch(getFilteredConversationsAPI({ query: '', data: { status: ChatStatus.CLOSED } }))
    } catch (e) {
      console.error('Failed to handle close conversation:', e)
    }
  }

  const handleSendMessage = async (content: string) => {
    if (content.trim()) {
      try {
        await sendMessage(content)
      } catch (error) {
        console.error('Failed to send message:', error)
      }
    }
  }

  const department = selectedConversation.departmentId?.name || 'Support'
  const userName = selectedConversation.userId?.name || 'User'
  const isClosed = selectedConversation.status === ChatStatus.CLOSED
  const isAssignedToCurrentModerator =
    selectedConversation?.moderatorId?._id === user._id ||
    selectedConversation?.adminId?._id === user._id
  const isConversationAssigned = selectedConversation?.moderatorId || selectedConversation?.adminId

  return (
    <div className={'flex flex-col w-full h-full'}>
      <div className="bg-white p-1 border-b h-[54px] px-6">
        <div className="flex justify-between items-center">
          <div className={'flex items-center gap-x-2.5'}>
            <div className="shrink-0">
              <img
                alt="user avatar"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                className="size-8 rounded-full"
              />
            </div>
            <div className={'flex-1 min-w-0'}>
              <h4 className="text-base font-semibold">{userName}</h4>
              <p className="text-base text-gray-500">{department}</p>
            </div>
          </div>
          <div className={'flex items-center gap-x-3'}>
            {!isClosed && isConversationAssigned && (
              <BaseButton
                color="info"
                label="Close conversation"
                onClick={() => handleCloseConversation(selectedConversation._id)}
                small
              />
            )}
            {!isClosed && !isConversationAssigned && (
              <BaseButton
                color="info"
                label="Assign to me"
                onClick={() => handleAssignToMe(selectedConversation._id)}
                small
              />
            )}

            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                isClosed ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
              }`}
            >
              {isClosed ? 'Closed' : isConversationAssigned ? 'Active' : 'Waiting for assign'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg
              className="w-16 h-16 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              ></path>
            </svg>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <MessageList messages={messages} />
        )}
        <div ref={messagesEndRef} />
      </div>

      {!isClosed && isAssignedToCurrentModerator ? (
        <ChatInput onSendMessage={handleSendMessage} />
      ) : (
        <div className="bg-red-500 p-4 border-t border-yellow-100 text-center">
          <p className="text-sm text-white font-bold">
            {isClosed
              ? 'This conversation is closed.'
              : !isConversationAssigned
              ? 'Assign conversation to answer.'
              : !isAssignedToCurrentModerator
              ? 'This conversation is assigned to another moderator.'
              : 'You dont have access to answer'}
            {' You cannot send new messages.'}
          </p>
        </div>
      )}
    </div>
  )
}

export default ChatWindow

import React from 'react'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import { setSelectedConversation } from '@/stores/slices/chatsSlice'
import { IConversation } from '@/interfaces/IConversation'
import { ChatStatus } from '@/interfaces/IChat'

const ChatAside = () => {
  const dispatch = useAppDispatch()
  const { selectedConversation, filteredConversations } = useAppSelector((state) => state.chats)

  const handleSelectConversation = (conversation: IConversation) => {
    dispatch(setSelectedConversation(conversation))
  }

  return (
    <div className="w-1/4 bg-white border-r overflow-y-auto">
      <div className="px-4 py-5 border-b">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Support Requests</h3>
      </div>

      <div className="divide-y divide-gray-200 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <p className="p-4 text-center text-gray-500">No support requests</p>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation._id}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                selectedConversation?._id === conversation._id ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleSelectConversation(conversation)}
            >
              <div className="flex justify-between">
                <div>
                  <h4 className="text-sm font-medium text-black">
                    {conversation.userId?.name || 'User'}
                  </h4>
                  <p className="text-xs text-black">{conversation.departmentId?.name}</p>
                </div>
                <div>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      conversation.status === 'open'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {conversation.status}
                  </span>

                  {conversation.unreadCount! > 0 && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-2 flex space-x-2">
                {!conversation.moderatorId && conversation.status === ChatStatus.OPEN && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Assign to me
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ChatAside

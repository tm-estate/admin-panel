import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { IMessage } from '@/interfaces/IMessage'
import { Role } from '@/constants/roles'

interface MessageListProps {
  messages: IMessage[]
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="space-y-4">
      {messages.map((message) => {
        // const isOwnMessage = message.sender._id === user?._id;
        const rolesArr = Object.keys(Role) as string[]
        const isModeratorMessage = rolesArr.some((i) => Role[i] === message.senderId.role)
        const timeAgo = formatDistanceToNow(new Date(message.createdAt), {
          addSuffix: true,
        })

        return (
          <div
            key={message._id}
            className={`flex ${isModeratorMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                isModeratorMessage
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
              }`}
            >
              {!isModeratorMessage && (
                <p className="text-xs font-medium text-gray-500 mb-1">{message.senderId.name}</p>
              )}
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <div
                className={`text-xs mt-1 flex items-center justify-end ${
                  isModeratorMessage ? 'text-blue-200' : 'text-gray-500'
                }`}
              >
                <span>{timeAgo}</span>
                {isModeratorMessage && (
                  <span className="ml-2">
                    {message.isRead ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MessageList

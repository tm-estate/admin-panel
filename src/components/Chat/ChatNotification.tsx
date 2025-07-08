import React from 'react'

type ChatNotificationProps = {
  avatarUrl: string
  name: string
  message: string
}

export const ChatNotification = ({ avatarUrl, name, message }: ChatNotificationProps) => (
  <div className={''} style={{ display: 'flex', alignItems: 'center' }}>
    <div className="shrink-0 pt-0.5">
      <img
        alt=""
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
        className="size-10 rounded-full"
      />
    </div>
    <div className="ml-3 w-0 flex-1">
      <p className="text-sm font-medium text-gray-900">{name}</p>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  </div>
)

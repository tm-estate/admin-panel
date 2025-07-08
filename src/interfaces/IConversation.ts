import { IUser } from './index'
import { IDepartment } from '@/interfaces/IDepartment'
import { IMessage } from '@/interfaces/IMessage'
import { ChatStatus } from '@/interfaces/IChat'

export interface IConversation {
  _id?: string
  userId: IUser
  moderatorId?: IUser
  adminId?: IUser
  departmentId: IDepartment
  status: ChatStatus
  lastMessageAt: string
  lastMessage?: IMessage
  unreadCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface IConversationUnreadCount {
  conversationId: string
  count: number
}

export interface IConversations {
  count: number
  rows: IConversation[]
}

import { IUser } from '@/interfaces/IUsers'
import { IConversation } from '@/interfaces/IConversation'

export interface IMessage {
  _id?: string
  content: string
  senderId: IUser
  conversationId: IConversation
  isRead: boolean
  createdAt?: string
  updatedAt?: string
}

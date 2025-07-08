import axios from 'axios'
import { IServerResponse } from '@/interfaces'
import { IConversation, IConversations, IConversationUnreadCount } from '@/interfaces/IConversation'
import { IMessage } from '@/interfaces/IMessage'
import { IDepartment } from '@/interfaces/IDepartment'

const API_BASE_URL = 'chat'

const chatsApi = {
  async getDepartments() {
    const result = await axios.get<IServerResponse<IDepartment[]>>(`departments`)
    return result.data
  },
  async getFilteredConversationsAPI(query: string, data) {
    // const result = await axios.post<IServerResponse<IConversations>>(`${API_BASE_URL}/conversations/moderator${query}`, data);
    const result = await axios.post<IServerResponse<IConversations>>(
      `${API_BASE_URL}/conversations/admin${query}`,
      data
    )
    return result.data
  },
  async getNotAssignedConversationsAPI(query: string, data) {
    const result = await axios.post<IServerResponse<IConversations>>(
      `${API_BASE_URL}/conversations/admin/requests${query}`,
      data
    )
    return result.data
  },
  async getOpenConversationsAPI() {
    // const result = await axios.get<IServerResponse<IConversation[]>>(`${API_BASE_URL}/conversations/moderator`);
    const result = await axios.get<IServerResponse<IConversation[]>>(
      `${API_BASE_URL}/conversations/admin`
    )
    return result.data
  },
  async getConversationById(conversationId: string) {
    const result = await axios.get<IServerResponse<IConversation>>(
      `${API_BASE_URL}/conversation/${conversationId}`
    )
    return result.data
  },
  async getConversationsUnreadCount() {
    const result = await axios.get<IServerResponse<IConversationUnreadCount[]>>(
      `${API_BASE_URL}/unread`
    )
    return result.data
  },
  async getMessages(conversationId: string) {
    const result = await axios.get<IServerResponse<IMessage[]>>(
      `${API_BASE_URL}/messages/${conversationId}`
    )
    return result.data
  },
  async sendMessageAPI(data: { content: string; conversationId: string }) {
    const result = await axios.post<IServerResponse<IMessage>>(`${API_BASE_URL}/messages`, data)
    return result.data
  },
  async getChatToken() {
    const result = await axios.get<IServerResponse<{ token: string }>>(`${API_BASE_URL}/token`)
    return result.data
  },
  async assignConversationToModerator(conversationId: string) {
    const result = await axios.put<IServerResponse<IConversation>>(
      `${API_BASE_URL}/conversations/${conversationId}/assign`
    )
    return result.data
  },
  async closeConversation(conversationId: string) {
    const result = await axios.put<IServerResponse<IConversation>>(
      `${API_BASE_URL}/conversations/${conversationId}/close`
    )
    return result.data
  },
  async markMessagesAsReadAPI(conversationId: string) {
    const result = await axios.put<IServerResponse<IConversation>>(
      `${API_BASE_URL}/messages/${conversationId}/read`
    )
    return result.data
  },
}

export default chatsApi

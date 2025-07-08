import { createAsyncThunk } from '@reduxjs/toolkit'
import chatsApi from '@/api/chats'
import Cookies from 'js-cookie'
import { CHAT_TOKEN_COOKIE_NAME, COOKIE_OPTIONS } from '@/constants/cookies'
import { selectChatTab, updateConversationsUnreadCount } from '@/stores/slices/chatsSlice'
import { ChatStatus } from '@/interfaces/IChat'

export const getDepartments = createAsyncThunk(
  'departments/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await chatsApi.getDepartments()
      return res.data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)
export const getFilteredConversationsAPI = createAsyncThunk(
  'conversations/fetchFiltered',
  async (payload: { query?: string; data?: any }, { rejectWithValue }) => {
    try {
      const { query = '', data = { status: ChatStatus.OPEN } } = payload
      const res = await chatsApi.getFilteredConversationsAPI(query, data)
      return res.data
    } catch (error) {
      console.error('Error fetching getConversations:', error)
      return rejectWithValue(error.response?.data || 'Unknown error occurred')
    }
  }
)
export const getNotAssignedConversationsAPI = createAsyncThunk(
  'conversations/fetchNotAssigned',
  async (payload: { query: string; data: any }, { rejectWithValue }) => {
    try {
      const { query, data } = payload
      const res = await chatsApi.getNotAssignedConversationsAPI(query, data)
      return res.data
    } catch (error) {
      console.error('Error fetching getNotAssignedConversationsAPI:', error)
      return rejectWithValue(error.response?.data || 'Unknown error occurred')
    }
  }
)
export const getOpenConversationsAPI = createAsyncThunk(
  'conversations/fetchOpen',
  async (_, { rejectWithValue }) => {
    try {
      const res = await chatsApi.getOpenConversationsAPI()
      return res.data
    } catch (error) {
      console.error('Error fetching getConversations:', error)
      return rejectWithValue(error.response?.data || 'Unknown error occurred')
    }
  }
)
export const getConversationById = createAsyncThunk(
  'conversation/fetchOne',
  async (payload: string, { rejectWithValue }) => {
    try {
      const res = await chatsApi.getConversationById(payload)
      return res.data
    } catch (error) {
      console.error('Error fetching getConversationById:', error)
      return rejectWithValue(error.response?.data || 'Unknown error occurred')
    }
  }
)
export const getMessagesAPI = createAsyncThunk(
  'messages/fetch',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const res = await chatsApi.getMessages(conversationId)
      return res.data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)
export const getConversationsUnreadCount = createAsyncThunk(
  'conversationUnreadCount/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await chatsApi.getConversationsUnreadCount()
      return res.data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)
export const assignConversationToModerator = createAsyncThunk(
  'conversation/assign',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const res = await chatsApi.assignConversationToModerator(conversationId)
      return res.data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)
export const closeConversationAPI = createAsyncThunk(
  'conversation/close',
  async (conversationId: string, { dispatch, rejectWithValue }) => {
    try {
      const res = await chatsApi.closeConversation(conversationId)
      if (res.data) {
        dispatch(selectChatTab(ChatStatus.CLOSED))
      }
      return res.data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)
export const markMessagesAsReadAPI = createAsyncThunk(
  'messages/read',
  async (conversationId: string, { dispatch, rejectWithValue }) => {
    try {
      const res = await chatsApi.markMessagesAsReadAPI(conversationId)

      if (res.data) {
        dispatch(updateConversationsUnreadCount(conversationId))
      }
      return res.data
    } catch (error) {
      console.log({ error })
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)
export const sendMessageAPI = createAsyncThunk(
  'message/send',
  async (data: { content: string; conversationId: string }, { rejectWithValue }) => {
    try {
      const res = await chatsApi.sendMessageAPI(data)
      return res.data
    } catch (error) {
      if (!error.response) {
        throw error
      }
      return rejectWithValue(error.response.data)
    }
  }
)
export const getChatToken = createAsyncThunk('chatToken/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await chatsApi.getChatToken()

    console.log('get chatToken/fetch response on asyncThunk: ', res)

    Cookies.set(CHAT_TOKEN_COOKIE_NAME, res.data.token, COOKIE_OPTIONS)

    return res.data
  } catch (error) {
    if (!error.response) {
      throw error
    }
    return rejectWithValue(error.response.data)
  }
})

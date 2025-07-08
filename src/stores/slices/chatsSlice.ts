import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fulfilledNotify, rejectNotify, resetNotify } from '@/helpers/notifyStateHandler'
import { INotify } from '@/interfaces'
import { IConversation, IConversationUnreadCount } from '@/interfaces/IConversation'
import {
  assignConversationToModerator,
  getConversationsUnreadCount,
  getDepartments,
  getConversationById,
  closeConversationAPI,
  markMessagesAsReadAPI,
  sendMessageAPI,
  getMessagesAPI,
  getFilteredConversationsAPI,
  getOpenConversationsAPI,
  getNotAssignedConversationsAPI,
} from '@/stores/thunks/chats'
import { IMessage } from '@/interfaces/IMessage'
import { IDepartment } from '@/interfaces/IDepartment'
import { ChatStatus } from '@/interfaces/IChat'

interface ChatState {
  selectedChatTab: ChatStatus
  openConversations: IConversation[]
  notAssignedConversations: IConversation[]
  filteredConversations: IConversation[]
  selectedConversation: IConversation | null
  conversationMessages: IMessage[]
  conversationUnreadCount: IConversationUnreadCount[]
  departments: IDepartment[]
  loading: boolean
  notAssignedConversationsCount: number
  count: number
  notify: INotify
}

const initialState: ChatState = {
  selectedChatTab: ChatStatus.OPEN,
  openConversations: [],
  filteredConversations: [],
  notAssignedConversations: [],
  conversationMessages: [],
  conversationUnreadCount: [],
  selectedConversation: null,
  departments: [],
  loading: false,
  count: 0,
  notAssignedConversationsCount: 0,
  notify: {
    showNotification: false,
    textNotification: '',
    typeNotification: 'warning',
  },
}

export const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    selectChatTab: (state, action: PayloadAction<ChatStatus>) => {
      state.selectedChatTab = action.payload
    },
    updateConversationsUnreadCount: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload
      console.log(555, { conversationId })
      state.filteredConversations = state.filteredConversations.map((conv: IConversation) => {
        if (conv._id === conversationId) {
          return { ...conv, unreadCount: 0 }
        }
        return conv
      })
    },
    setSelectedConversation: (state, action: PayloadAction<IConversation | null>) => {
      state.selectedConversation = action.payload
    },

    addMessage: (state, action: PayloadAction<IMessage>) => {
      state.conversationMessages = [...state.conversationMessages, action.payload]
    },
    removeTempMessage: (state, action: PayloadAction<string>) => {
      state.conversationMessages = state.conversationMessages.filter(
        (msg) => msg._id !== action.payload
      )
    },
    updateTempMessage: (
      state,
      action: PayloadAction<{ tempId: string; realMessage: IMessage }>
    ) => {
      const { tempId, realMessage } = action.payload
      state.conversationMessages = state.conversationMessages.map((msg) =>
        msg._id === tempId ? realMessage : msg
      )
    },
    setNewMessageOnSubscription: (state, action: PayloadAction<IMessage>) => {
      const newMessage = action.payload

      const existingIndex = state.conversationMessages.findIndex(
        (msg) =>
          msg._id === newMessage._id ||
          (msg._id.startsWith('temp-') && msg.content === newMessage.content)
      )

      // Если сообщение или его временная версия уже есть - заменяем
      if (existingIndex !== -1) {
        const updated = [...state.conversationMessages]
        updated[existingIndex] = newMessage
        state.conversationMessages = updated
        return
      }

      // Иначе добавляем новое сообщение и сортируем
      state.conversationMessages = [...state.conversationMessages, newMessage].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFilteredConversationsAPI.rejected, (state, action) => {
        state.loading = false
        rejectNotify(state, action)
      })
      .addCase(getFilteredConversationsAPI.pending, (state) => {
        state.loading = true
        resetNotify(state)
      })
      .addCase(getFilteredConversationsAPI.fulfilled, (state, action) => {
        if (action.payload) {
          state.filteredConversations = action.payload.rows
          state.count = action.payload.count
        }
        state.loading = false
      })
      .addCase(getNotAssignedConversationsAPI.rejected, (state, action) => {
        state.loading = false
        rejectNotify(state, action)
      })
      .addCase(getNotAssignedConversationsAPI.pending, (state) => {
        state.loading = true
        resetNotify(state)
      })
      .addCase(getNotAssignedConversationsAPI.fulfilled, (state, action) => {
        if (action.payload) {
          state.notAssignedConversations = action.payload.rows
          state.notAssignedConversationsCount = action.payload.count
        }
        state.loading = false
      })
      .addCase(getOpenConversationsAPI.rejected, (state, action) => {
        state.loading = false
        rejectNotify(state, action)
      })
      .addCase(getOpenConversationsAPI.pending, (state) => {
        state.loading = true
        resetNotify(state)
      })
      .addCase(getOpenConversationsAPI.fulfilled, (state, action) => {
        if (action.payload) {
          state.openConversations = action.payload
        }
        state.loading = false
      })
      .addCase(getConversationById.rejected, (state, action) => {
        state.loading = false
        rejectNotify(state, action)
      })
      .addCase(getConversationById.pending, (state) => {
        state.loading = true
        resetNotify(state)
      })
      .addCase(getConversationById.fulfilled, (state, action) => {
        if (action.payload) {
          state.selectedConversation = action.payload
        }
        state.loading = false
      })
      .addCase(getMessagesAPI.rejected, (state, action) => {
        state.loading = false
        rejectNotify(state, action)
      })
      .addCase(getMessagesAPI.pending, (state) => {
        state.loading = true
        resetNotify(state)
      })
      .addCase(getMessagesAPI.fulfilled, (state, action) => {
        if (action.payload) {
          state.conversationMessages = action.payload
        }
        state.loading = false
      })
      .addCase(getDepartments.rejected, (state, action) => {
        state.loading = false
        rejectNotify(state, action)
      })
      .addCase(getDepartments.pending, (state) => {
        state.loading = true
        resetNotify(state)
      })
      .addCase(getDepartments.fulfilled, (state, action) => {
        if (action.payload) {
          state.departments = action.payload
        }
        state.loading = false
      })
      .addCase(getConversationsUnreadCount.rejected, (state, action) => {
        state.loading = false
        rejectNotify(state, action)
      })
      .addCase(getConversationsUnreadCount.pending, (state) => {
        state.loading = true
        resetNotify(state)
      })
      .addCase(getConversationsUnreadCount.fulfilled, (state, action) => {
        if (action.payload) {
          state.conversationUnreadCount = action.payload
        }
        state.loading = false
      })

      .addCase(assignConversationToModerator.rejected, (state, action) => {
        state.loading = false
        rejectNotify(state, action)
      })
      .addCase(assignConversationToModerator.pending, (state) => {
        state.loading = true
        resetNotify(state)
      })
      .addCase(assignConversationToModerator.fulfilled, (state) => {
        state.loading = false
        fulfilledNotify(state, 'Conversation has been assigned')
      })

      .addCase(closeConversationAPI.rejected, (state, action) => {
        state.loading = false
        rejectNotify(state, action)
      })
      .addCase(closeConversationAPI.pending, (state) => {
        state.loading = true
        resetNotify(state)
      })
      .addCase(closeConversationAPI.fulfilled, (state) => {
        state.loading = false
        fulfilledNotify(state, 'Conversation has been closed')
      })

      .addCase(markMessagesAsReadAPI.rejected, (state, action) => {
        state.loading = false
        rejectNotify(state, action)
      })
      .addCase(markMessagesAsReadAPI.pending, (state) => {
        state.loading = true
        resetNotify(state)
      })
      .addCase(markMessagesAsReadAPI.fulfilled, (state) => {
        state.loading = false
        fulfilledNotify(state, 'Conversation messages has been read')
      })

      .addCase(sendMessageAPI.rejected, (state, action) => {
        state.loading = false
        rejectNotify(state, action)
      })
      .addCase(sendMessageAPI.pending, (state) => {
        state.loading = true
        resetNotify(state)
      })
      .addCase(sendMessageAPI.fulfilled, (state) => {
        state.loading = false
        fulfilledNotify(state, 'Messages has been send')
      })
  },
})

export const {
  addMessage,
  updateTempMessage,
  removeTempMessage,
  setNewMessageOnSubscription,
  setSelectedConversation,
  updateConversationsUnreadCount,
  selectChatTab,
} = chatsSlice.actions

export default chatsSlice.reducer

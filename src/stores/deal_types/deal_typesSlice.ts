import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { fulfilledNotify, rejectNotify, resetNotify } from '../../helpers/notifyStateHandler'

interface MainState {
  deal_types: any
  loading: boolean
  count: number
  notify: {
    showNotification: boolean
    textNotification: string
    typeNotification: string
  }
}

const initialState: MainState = {
  deal_types: [],
  loading: false,
  count: 0,
  notify: {
    showNotification: false,
    textNotification: '',
    typeNotification: 'warn',
  },
}

export const fetch = createAsyncThunk('deal_types/fetch', async (data: any) => {
  const { id, query } = data
  const result = await axios.get(`dealTypes/admin${query || (id ? `/${id}` : '')}`)
  return id ? result.data.data : { rows: result.data.data.rows, count: result.data.data.count }
})

export const deleteItem = createAsyncThunk(
  'deal_types/deleteDeal_types',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`dealTypes/${id}`)
    } catch (error) {
      if (!error.response) {
        throw error
      }

      return rejectWithValue(error.response.data)
    }
  }
)

export const create = createAsyncThunk(
  'deal_types/createDeal_types',
  async (data: any, { rejectWithValue }) => {
    try {
      const result = await axios.post('dealTypes', data)
      return result.data.data
    } catch (error) {
      if (!error.response) {
        throw error
      }

      return rejectWithValue(error.response.data)
    }
  }
)

export const update = createAsyncThunk(
  'deal_types/updateDeal_types',
  async (payload: any, { rejectWithValue }) => {
    try {
      const result = await axios.put(`dealTypes/${payload.id}`, payload.data)
      return result.data.data
    } catch (error) {
      if (!error.response) {
        throw error
      }

      return rejectWithValue(error.response.data)
    }
  }
)

export const deal_typesSlice = createSlice({
  name: 'deal_types',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetch.pending, (state) => {
      state.loading = true
      resetNotify(state)
    })
    builder.addCase(fetch.rejected, (state, action) => {
      state.loading = false
      rejectNotify(state, action)
    })

    builder.addCase(fetch.fulfilled, (state, action) => {
      if (action.payload.count >= 0) {
        state.deal_types = action.payload.rows
        state.count = action.payload.count
      } else {
        state.deal_types = action.payload
      }
      state.loading = false
    })

    builder.addCase(deleteItem.pending, (state) => {
      state.loading = true
      resetNotify(state)
    })

    builder.addCase(deleteItem.fulfilled, (state) => {
      state.loading = false
      fulfilledNotify(state, `${'Deal_types'.slice(0, -1)} has been deleted`)
    })

    builder.addCase(deleteItem.rejected, (state, action) => {
      state.loading = false
      rejectNotify(state, action)
    })

    builder.addCase(create.pending, (state) => {
      state.loading = true
      resetNotify(state)
    })
    builder.addCase(create.rejected, (state, action) => {
      state.loading = false
      rejectNotify(state, action)
    })

    builder.addCase(create.fulfilled, (state) => {
      state.loading = false
      fulfilledNotify(state, `${'Deal_types'.slice(0, -1)} has been created`)
    })

    builder.addCase(update.pending, (state) => {
      state.loading = true
      resetNotify(state)
    })
    builder.addCase(update.fulfilled, (state) => {
      state.loading = false
      fulfilledNotify(state, `${'Deal_types'.slice(0, -1)} has been updated`)
    })
    builder.addCase(update.rejected, (state, action) => {
      state.loading = false
      rejectNotify(state, action)
    })
  },
})

// Action creators are generated for each case reducer function
// export const {  } = usersSlice.actions

export default deal_typesSlice.reducer

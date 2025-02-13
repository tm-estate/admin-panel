import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { fulfilledNotify, rejectNotify, resetNotify } from '../../helpers/notifyStateHandler'

interface MainState {
  cities: any
  loading: boolean
  count: number
  notify: {
    showNotification: boolean
    textNotification: string
    typeNotification: string
  }
}

const initialState: MainState = {
  cities: [],
  loading: false,
  count: 0,
  notify: {
    showNotification: false,
    textNotification: '',
    typeNotification: 'warn',
  },
}

export const fetch = createAsyncThunk('cities/fetch', async (data: any) => {
  const { id, query } = data
  const result = await axios.get(`cities${query || (id ? `/${id}` : '')}`)
  return id ? result.data.data : { rows: result.data.data.rows, count: result.data.data.count }
})

export const deleteItem = createAsyncThunk(
  'cities/deleteCities',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`cities/${id}`)
    } catch (error) {
      if (!error.response) {
        throw error
      }

      return rejectWithValue(error.response.data)
    }
  }
)

export const create = createAsyncThunk(
  'cities/createCities',
  async (data: any, { rejectWithValue }) => {
    try {
      const result = await axios.post('cities', data)
      console.log({ result })
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
  'cities/updateCities',
  async (payload: any, { rejectWithValue }) => {
    try {
      const result = await axios.put(`cities/${payload.id}`, payload.data)
      console.log({ result })
      return result.data
    } catch (error) {
      if (!error.response) {
        throw error
      }

      return rejectWithValue(error.response.data)
    }
  }
)

export const citiesSlice = createSlice({
  name: 'cities',
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
        state.cities = action.payload.rows
        state.count = action.payload.count
      } else {
        state.cities = action.payload
      }
      state.loading = false
    })

    builder.addCase(deleteItem.pending, (state) => {
      state.loading = true
      resetNotify(state)
    })

    builder.addCase(deleteItem.fulfilled, (state) => {
      state.loading = false
      fulfilledNotify(state, `${'Cities'.slice(0, -1)} has been deleted`)
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
      fulfilledNotify(state, `${'Cities'.slice(0, -1)} has been created`)
    })

    builder.addCase(update.pending, (state) => {
      state.loading = true
      resetNotify(state)
    })
    builder.addCase(update.fulfilled, (state) => {
      state.loading = false
      fulfilledNotify(state, `${'Cities'.slice(0, -1)} has been updated`)
    })
    builder.addCase(update.rejected, (state, action) => {
      state.loading = false
      rejectNotify(state, action)
    })
  },
})

// Action creators are generated for each case reducer function
// export const {  } = usersSlice.actions

export default citiesSlice.reducer

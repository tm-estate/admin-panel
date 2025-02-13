import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { fulfilledNotify, rejectNotify, resetNotify } from '../../helpers/notifyStateHandler'

interface MainState {
  city_areas: any
  loading: boolean
  count: number
  notify: {
    showNotification: boolean
    textNotification: string
    typeNotification: string
  }
}

const initialState: MainState = {
  city_areas: [],
  loading: false,
  count: 0,
  notify: {
    showNotification: false,
    textNotification: '',
    typeNotification: 'warn',
  },
}

export const fetch = createAsyncThunk('city_areas/fetch', async (data: any) => {
  const { id, query } = data
  const result = await axios.get(`cityAreas${query || (id ? `/${id}` : '')}`)
  return id ? result.data.data : { rows: result.data.data.rows, count: result.data.data.count }
})

export const deleteItem = createAsyncThunk(
  'city_areas/deleteCity_areas',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`cityAreas/${id}`)
    } catch (error) {
      if (!error.response) {
        throw error
      }

      return rejectWithValue(error.response.data)
    }
  }
)

export const create = createAsyncThunk(
  'city_areas/createCity_areas',
  async (data: any, { rejectWithValue }) => {
    try {
      const result = await axios.post('cityAreas', data)
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
  'city_areas/updateCity_areas',
  async (payload: any, { rejectWithValue }) => {
    try {
      console.log({ payload })
      const result = await axios.put(`cityAreas/${payload.id}`, payload.data)
      return result.data.data
    } catch (error) {
      if (!error.response) {
        throw error
      }

      return rejectWithValue(error.response.data)
    }
  }
)

export const city_areasSlice = createSlice({
  name: 'city_areas',
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
        state.city_areas = action.payload.rows
        state.count = action.payload.count
      } else {
        state.city_areas = action.payload
      }
      state.loading = false
    })

    builder.addCase(deleteItem.pending, (state) => {
      state.loading = true
      resetNotify(state)
    })

    builder.addCase(deleteItem.fulfilled, (state) => {
      state.loading = false
      fulfilledNotify(state, `${'City_areas'.slice(0, -1)} has been deleted`)
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
      fulfilledNotify(state, `${'City_areas'.slice(0, -1)} has been created`)
    })

    builder.addCase(update.pending, (state) => {
      state.loading = true
      resetNotify(state)
    })
    builder.addCase(update.fulfilled, (state) => {
      state.loading = false
      fulfilledNotify(state, `${'City_areas'.slice(0, -1)} has been updated`)
    })
    builder.addCase(update.rejected, (state, action) => {
      state.loading = false
      rejectNotify(state, action)
    })
  },
})

// Action creators are generated for each case reducer function
// export const {  } = usersSlice.actions

export default city_areasSlice.reducer

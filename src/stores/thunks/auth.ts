import { createAsyncThunk } from '@reduxjs/toolkit'
import authApi from '@/api/auth'
import { ISignInPayload, ISignUpPayload } from '@/interfaces'

export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
  try {
    return await authApi.getMe()
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || error.toString()

    return thunkAPI.rejectWithValue(message)
  }
})

export const login = createAsyncThunk('auth/login', async (data: ISignInPayload, thunkAPI) => {
  try {
    const res = await authApi.login(data)

    localStorage.setItem('token', res.token)
    thunkAPI.dispatch(getMe())

    return {}
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || error.toString()

    return thunkAPI.rejectWithValue(message)
  }
})

export const register = createAsyncThunk(
  'auth/register',
  async (data: ISignUpPayload, thunkAPI) => {
    try {
      const res = await authApi.register(data)

      console.log('REGISTER TOKEN =======>', res.token)
      // thunkAPI.dispatch(setMessage(response.data.message));
      localStorage.setItem('token', res.token)

      return res.data
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message || error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const logout = createAsyncThunk('auth/logout', () => authApi.logout())

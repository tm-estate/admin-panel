// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import jwt from 'jsonwebtoken';
//
// interface MainState {
//   isFetching: boolean;
//   errorMessage: string;
//   currentUser: any;
//   notify: any;
//   token: string;
// }
//
// const initialState: MainState = {
//   /* User */
//   isFetching: false,
//   errorMessage: '',
//   currentUser: null,
//   token: '',
//   notify: {
//     showNotification: false,
//     textNotification: '',
//     typeNotification: 'warning',
//   },
// };
//
// export const loginUser = createAsyncThunk(
//   'auth/loginUser',
//   async (creds: Record<string, string>, {dispatch}) => {
//     const response = await axios.post('auth/login', creds);
//     const token = response.headers.authorization
//
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(response.data.data));
//
//     axios.defaults.headers.common['Authorization'] = token;
//
//     dispatch(findMe())
//     return {
//       user: response.data.data,
//       token
//     };
//   },
// );
// export const findMe = createAsyncThunk('auth/findMe', async () => {
//   const response = await axios.get('auth/me');
//   console.log(222, {response})
//   return response.data;
// });
//
// export const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     logoutUser: (state) => {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       axios.defaults.headers.common['Authorization'] = '';
//       state.currentUser = null;
//       state.token = '';
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(loginUser.pending, (state) => {
//       state.isFetching = true;
//     });
//     builder.addCase(loginUser.fulfilled, (state, action) => {
//       const {user, token} = action.payload;
//
//       state.errorMessage = '';
//       state.token = token;
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(user));
//
//       console.log({token, user})
//       axios.defaults.headers.common['Authorization'] = token;
//     });
//
//     builder.addCase(loginUser.rejected, (state) => {
//       state.errorMessage = 'Something was wrong. Try again';
//       state.isFetching = false;
//     });
//     builder.addCase(findMe.pending, () => {
//       console.log('Pending findMe');
//     });
//     builder.addCase(findMe.fulfilled, (state, action) => {
//       state.currentUser = action.payload;
//       state.isFetching = false;
//     });
//   },
// });
//
// // Action creators are generated for each case reducer function
// export const { logoutUser } = authSlice.actions;
//
// export default authSlice.reducer;

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IUser } from '@/interfaces'
import { getMe, login, logout, register } from '@/stores/thunks/auth'

interface AuthState {
  user: null | IUser
  loading: boolean
  errorMessage: string
}

const initialState: AuthState = {
  user: null,
  loading: false,
  errorMessage: '',
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload
    },
  },
  extraReducers: (builder) => {
  builder
    .addCase(register.rejected, (state, action) => {
      state.errorMessage = action.payload as string;
    })
    .addCase(register.pending, (state) => {
      state.loading = true;
    })
    .addCase(register.fulfilled, (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    })
    .addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.errorMessage = action.payload as string
    })
    .addCase(login.pending, (state) => {
      state.loading = true;
    })
    .addCase(login.fulfilled, (state) => {
      state.loading = false;
    })
    .addCase(getMe.rejected, (state, action) => {
      state.loading = false;
      state.errorMessage = action.payload as string;
    })
    .addCase(getMe.pending, (state) => {
      state.loading = true;
    })
    .addCase(getMe.fulfilled, (state, action: PayloadAction<IUser>) => {
      state.user = action.payload
      state.loading = false;
    })
    .addCase(logout.fulfilled, (state) => {
      state.user = null;
    })
  },
});

// export const { setUser } = authSlice.actions;

export default authSlice.reducer

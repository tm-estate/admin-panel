import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IUser } from '@/interfaces'
import { getMe, login, logout, register } from '@/stores/thunks/auth'
import { Permission } from '@/constants/permissions'
import { Role } from '@/constants/roles'

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

    // Add new reducers for role management
    setUserRole: (state, action: PayloadAction<Role>) => {
      if (state.user) {
        state.user.role = action.payload;
      }
    },

    // Add permissions to user
    addPermission: (state, action: PayloadAction<Permission>) => {
      if (state.user) {
        if (!state.user.permissions) {
          state.user.permissions = [];
        }
        if (!state.user.permissions.includes(action.payload)) {
          state.user.permissions.push(action.payload);
        }
      }
    },

    // Remove permission from user
    removePermission: (state, action: PayloadAction<Permission>) => {
      if (state.user && state.user.permissions) {
        state.user.permissions = state.user.permissions.filter(
            p => p !== action.payload
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(register.rejected, (state, action) => {
          state.errorMessage = action.payload as string;
          state.loading = false;
        })
        .addCase(register.pending, (state) => {
          state.loading = true;
        })
        .addCase(register.fulfilled, (state, action: PayloadAction<IUser>) => {
          state.user = action.payload;
          state.loading = false;
        })
        .addCase(login.rejected, (state, action) => {
          state.loading = false;
          state.errorMessage = action.payload as string;
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
          state.user = action.payload;
          state.loading = false;
        })
        .addCase(logout.fulfilled, (state) => {
          state.user = null;
        })
  },
});

export const { setUser, setUserRole, addPermission, removePermission } = authSlice.actions;

export default authSlice.reducer

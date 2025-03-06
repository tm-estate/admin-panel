import { createSlice } from '@reduxjs/toolkit';
import {
  fulfilledNotify,
  rejectNotify,
  resetNotify,
} from '@/helpers/notifyStateHandler';
import { INotify, IUser } from "@/interfaces";
import {create, deleteUser, getUser, getUsers, update} from "@/stores/thunks/users";

interface MainState {
  user: IUser;
  users: IUser[];
  loading: boolean;
  count: number;
  notify: INotify
}

const initialState: MainState = {
  user: null,
  users: [],
  loading: false,
  count: 0,
  notify: {
    showNotification: false,
    textNotification: '',
    typeNotification: 'warn',
  },
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(getUsers.rejected, (state, action) => {
          state.loading = false;
          rejectNotify(state, action);
        })
        .addCase(getUsers.pending, (state) => {
          state.loading = true;
          resetNotify(state);
        })
        .addCase(getUsers.fulfilled, (state, action) => {
          if (action.payload) {
            state.users = action.payload.rows;
            state.count = action.payload.count;
          }
          state.loading = false;
        })

        .addCase(getUser.rejected, (state, action) => {
          state.loading = false;
          rejectNotify(state, action);
        })
        .addCase(getUser.pending, (state) => {
          state.loading = true;
          resetNotify(state);
        })
        .addCase(getUser.fulfilled, (state, action) => {
          if (action.payload) {
            state.user = action.payload;
          }
          state.loading = false;
        })

        .addCase(deleteUser.rejected, (state, action) => {
          state.loading = false;
          rejectNotify(state, action);
        })
        .addCase(deleteUser.pending, (state) => {
          state.loading = true;
          resetNotify(state);
        })
        .addCase(deleteUser.fulfilled, (state) => {
          state.loading = false;
          fulfilledNotify(state, 'Deal Type has been deleted');
        })

        .addCase(create.rejected, (state, action) => {
          state.loading = false;
          rejectNotify(state, action);
        })
        .addCase(create.pending, (state) => {
          state.loading = true;
          resetNotify(state);
        })
        .addCase(create.fulfilled, (state) => {
          state.loading = false;
          fulfilledNotify(state, 'Deal Type has been created');
        })

        .addCase(update.rejected, (state, action) => {
          state.loading = false
          rejectNotify(state, action)
        })
        .addCase(update.pending, (state) => {
          state.loading = true
          resetNotify(state)
        })
        .addCase(update.fulfilled, (state) => {
          state.loading = false;
          fulfilledNotify(state, 'Deal Type has been updated');
        })
  },
})

// Action creators are generated for each case reducer function
// export const {  } = usersSlice.actions

export default usersSlice.reducer;

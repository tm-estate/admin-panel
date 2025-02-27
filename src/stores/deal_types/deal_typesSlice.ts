import { createSlice } from '@reduxjs/toolkit'
import { fulfilledNotify, rejectNotify, resetNotify } from '../../helpers/notifyStateHandler'
import { IDealType } from "../../interfaces";
import { create, deleteDealType, getDealType, getDealTypes, update } from "../thunks/deal-types";

interface MainState {
  deal_type: IDealType;
  deal_types: IDealType[];
  loading: boolean;
  count: number;
  notify: {
    showNotification: boolean
    textNotification: string
    typeNotification: string
  }
}

const initialState: MainState = {
  deal_type: null,
  deal_types: [],
  loading: false,
  count: 0,
  notify: {
    showNotification: false,
    textNotification: '',
    typeNotification: 'warn',
  },
}

export const deal_typesSlice = createSlice({
  name: 'deal_types',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(getDealTypes.rejected, (state, action) => {
          state.loading = false;
          rejectNotify(state, action);
        })
        .addCase(getDealTypes.pending, (state) => {
          state.loading = true;
          resetNotify(state);
        })
        .addCase(getDealTypes.fulfilled, (state, action) => {
          if (action.payload) {
            state.deal_types = action.payload.rows;
            state.count = action.payload.count;
          }
          state.loading = false;
        })

        .addCase(getDealType.rejected, (state, action) => {
          state.loading = false;
          rejectNotify(state, action);
        })
        .addCase(getDealType.pending, (state) => {
          state.loading = true;
          resetNotify(state);
        })
        .addCase(getDealType.fulfilled, (state, action) => {
          if (action.payload) {
            state.deal_type = action.payload;
          }
          state.loading = false;
        })

        .addCase(deleteDealType.rejected, (state, action) => {
          state.loading = false;
          rejectNotify(state, action);
        })
        .addCase(deleteDealType.pending, (state) => {
          state.loading = true;
          resetNotify(state);
        })
        .addCase(deleteDealType.fulfilled, (state) => {
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

export default deal_typesSlice.reducer

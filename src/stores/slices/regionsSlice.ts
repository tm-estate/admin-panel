import { createSlice } from '@reduxjs/toolkit'
import { fulfilledNotify, rejectNotify, resetNotify } from '@/helpers/notifyStateHandler'
import { IRegion, INotify } from "@/interfaces";
import {create, deleteRegion, getRegion, getRegions, update} from "@/stores/thunks/regions";

interface MainState {
  region: IRegion;
  regions: IRegion[];
  loading: boolean;
  count: number;
  notify: INotify
}

const initialState: MainState = {
  region: null,
  regions: [],
  loading: false,
  count: 0,
  notify: {
    showNotification: false,
    textNotification: '',
    typeNotification: 'warning',
  },
}

export const regionsSlice = createSlice({
  name: 'regions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(getRegions.rejected, (state, action) => {
          state.loading = false;
          rejectNotify(state, action);
        })
        .addCase(getRegions.pending, (state) => {
          state.loading = true;
          resetNotify(state);
        })
        .addCase(getRegions.fulfilled, (state, action) => {
          if (action.payload) {
            state.regions = action.payload.rows;
            state.count = action.payload.count;
          }
          state.loading = false;
        })

        .addCase(getRegion.rejected, (state, action) => {
          state.loading = false;
          rejectNotify(state, action);
        })
        .addCase(getRegion.pending, (state) => {
          state.loading = true;
          resetNotify(state);
        })
        .addCase(getRegion.fulfilled, (state, action) => {
          if (action.payload) {
            state.region = action.payload;
          }
          state.loading = false;
        })

        .addCase(deleteRegion.rejected, (state, action) => {
          state.loading = false;
          rejectNotify(state, action);
        })
        .addCase(deleteRegion.pending, (state) => {
          state.loading = true;
          resetNotify(state);
        })
        .addCase(deleteRegion.fulfilled, (state) => {
          state.loading = false;
          fulfilledNotify(state, 'Region has been deleted');
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
          fulfilledNotify(state, 'Region has been created');
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
          fulfilledNotify(state, 'Region has been updated');
        })
  },
})

// Action creators are generated for each case reducer function
// export const {  } = usersSlice.actions

export default regionsSlice.reducer

import { createSlice } from '@reduxjs/toolkit'
import { fulfilledNotify, rejectNotify, resetNotify } from '@/helpers/notifyStateHandler'
import { create, deleteAgencyType, getAgencyType, getAgencyTypes, update } from "@/stores/thunks/agency-types";
import { IAgencyType, INotify } from "@/interfaces";

interface MainState {
  agency_type: IAgencyType
  agency_types: IAgencyType[]
  loading: boolean
  count: number
  notify: INotify
}

const initialState: MainState = {
  agency_type: null,
  agency_types: [],
  loading: false,
  count: 0,
  notify: {
    showNotification: false,
    textNotification: '',
    typeNotification: 'warn',
  },
}

export const agency_typesSlice = createSlice({
  name: 'agency_types',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(getAgencyTypes.rejected, (state, action) => {
          state.loading = false;
          rejectNotify(state, action);
        })
        .addCase(getAgencyTypes.pending, (state) => {
          state.loading = true;
          resetNotify(state);
        })
        .addCase(getAgencyTypes.fulfilled, (state, action) => {
          if (action.payload) {
            state.agency_types = action.payload.rows;
            state.count = action.payload.count;
          }
          state.loading = false;
        })

        .addCase(getAgencyType.rejected, (state, action) => {
          state.loading = false;
          rejectNotify(state, action);
        })
        .addCase(getAgencyType.pending, (state) => {
          state.loading = true;
          resetNotify(state);
        })
        .addCase(getAgencyType.fulfilled, (state, action) => {
          if (action.payload) {
            state.agency_type = action.payload;
          }
          state.loading = false;
        })

        .addCase(deleteAgencyType.rejected, (state, action) => {
          state.loading = false;
          rejectNotify(state, action);
        })
        .addCase(deleteAgencyType.pending, (state) => {
          state.loading = true;
          resetNotify(state);
        })
        .addCase(deleteAgencyType.fulfilled, (state) => {
          state.loading = false;
          fulfilledNotify(state, 'Agency Type has been deleted');
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
          fulfilledNotify(state, 'Agency Type has been created');
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
          fulfilledNotify(state, 'Agency Type has been updated');
        })
  },
})

// Action creators are generated for each case reducer function
// export const {  } = usersSlice.actions

export default agency_typesSlice.reducer

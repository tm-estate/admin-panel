import { createSlice } from '@reduxjs/toolkit'
import { fulfilledNotify, rejectNotify, resetNotify } from '../../helpers/notifyStateHandler'
import { IPropertyType, INotify } from "../../interfaces";
import { create, deletePropertyType, getPropertyType, getPropertyTypes, update } from "../thunks/property-types";

interface MainState {
  property_type: IPropertyType
  property_types: IPropertyType[]
  loading: boolean
  count: number
  notify: INotify
}

const initialState: MainState = {
  property_type: null,
  property_types: [],
  loading: false,
  count: 0,
  notify: {
    showNotification: false,
    textNotification: '',
    typeNotification: 'warn',
  },
}

export const property_typesSlice = createSlice({
  name: 'property_types',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(getPropertyTypes.rejected, (state, action) => {
          state.loading = false;
          rejectNotify(state, action);
        })
        .addCase(getPropertyTypes.pending, (state) => {
          state.loading = true;
          resetNotify(state);
        })
        .addCase(getPropertyTypes.fulfilled, (state, action) => {
          if (action.payload) {
            state.property_types = action.payload.rows;
            state.count = action.payload.count;
          }
          state.loading = false;
        })

        .addCase(getPropertyType.rejected, (state, action) => {
          state.loading = false;
          rejectNotify(state, action);
        })
        .addCase(getPropertyType.pending, (state) => {
          state.loading = true;
          resetNotify(state);
        })
        .addCase(getPropertyType.fulfilled, (state, action) => {
          if (action.payload) {
            state.property_type = action.payload;
          }
          state.loading = false;
        })

        .addCase(deletePropertyType.rejected, (state, action) => {
          state.loading = false;
          rejectNotify(state, action);
        })
        .addCase(deletePropertyType.pending, (state) => {
          state.loading = true;
          resetNotify(state);
        })
        .addCase(deletePropertyType.fulfilled, (state) => {
          state.loading = false;
          fulfilledNotify(state, 'Property Type has been deleted');
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
          fulfilledNotify(state, 'Property Type has been created');
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
          fulfilledNotify(state, 'Property Type has been updated');
        })
  },
})

export default property_typesSlice.reducer

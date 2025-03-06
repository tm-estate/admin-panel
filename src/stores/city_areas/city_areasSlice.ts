import { createSlice } from '@reduxjs/toolkit'
import { fulfilledNotify, rejectNotify, resetNotify } from '@/helpers/notifyStateHandler'
import { ICityArea, INotify } from "@/interfaces";
import { getCityArea, getCityAreas, deleteCityArea, create, update } from "@/stores/thunks/city-areas";

interface MainState {
  city_area: ICityArea;
  city_areas: ICityArea[];
  loading: boolean
  count: number
  notify: INotify
}

const initialState: MainState = {
  city_area: null,
  city_areas: [],
  loading: false,
  count: 0,
  notify: {
    showNotification: false,
    textNotification: '',
    typeNotification: 'warn',
  },
}

export const city_areasSlice = createSlice({
  name: 'city_areas',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(getCityAreas.rejected, (state, action) => {
          state.loading = false;
          rejectNotify(state, action);
        })
        .addCase(getCityAreas.pending, (state) => {
          state.loading = true;
          resetNotify(state);
        })
        .addCase(getCityAreas.fulfilled, (state, action) => {
          if (action.payload) {
            state.city_areas = action.payload.rows;
            state.count = action.payload.count;
          }
          state.loading = false;
        })

        .addCase(getCityArea.rejected, (state, action) => {
          state.loading = false;
          rejectNotify(state, action);
        })
        .addCase(getCityArea.pending, (state) => {
          state.loading = true;
          resetNotify(state);
        })
        .addCase(getCityArea.fulfilled, (state, action) => {
          if (action.payload) {
            state.city_area = action.payload;
          }
          state.loading = false;
        })

        .addCase(deleteCityArea.rejected, (state, action) => {
          state.loading = false;
          rejectNotify(state, action);
        })
        .addCase(deleteCityArea.pending, (state) => {
          state.loading = true;
          resetNotify(state);
        })
        .addCase(deleteCityArea.fulfilled, (state) => {
          state.loading = false;
          fulfilledNotify(state, 'City Area has been deleted');
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
          fulfilledNotify(state, 'City Area has been created');
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
          fulfilledNotify(state, 'City Area has been updated');
        })
  },
})

// Action creators are generated for each case reducer function
// export const {  } = usersSlice.actions

export default city_areasSlice.reducer

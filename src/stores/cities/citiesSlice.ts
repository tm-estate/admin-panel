import { createSlice } from '@reduxjs/toolkit';
import { fulfilledNotify, rejectNotify, resetNotify } from '@/helpers/notifyStateHandler';
import { create, deleteCity, update, getCities, getCity } from '@/stores/thunks/cities';
import { ICity, INotify } from "@/interfaces";

interface MainState {
  city: ICity;
  cities: ICity[];
  loading: boolean;
  count: number;
  notify: INotify
}

const initialState: MainState = {
  city: null,
  cities: [],
  loading: false,
  count: 0,
  notify: {
    showNotification: false,
    textNotification: '',
    typeNotification: 'warn',
  },
}

export const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCities.rejected, (state, action) => {
    state.loading = false;
    rejectNotify(state, action);
  })
      .addCase(getCities.pending, (state) => {
    state.loading = true;
    resetNotify(state);
  })
      .addCase(getCities.fulfilled, (state, action) => {
    if (action.payload) {
      state.cities = action.payload.rows;
      state.count = action.payload.count;
    }
    state.loading = false;
  })

      .addCase(getCity.rejected, (state, action) => {
    state.loading = false;
    rejectNotify(state, action);
  })
      .addCase(getCity.pending, (state) => {
        state.loading = true;
        resetNotify(state);
      })
      .addCase(getCity.fulfilled, (state, action) => {
        if (action.payload) {
          state.city = action.payload;
        }
        state.loading = false;
      })

      .addCase(deleteCity.rejected, (state, action) => {
        state.loading = false;
        rejectNotify(state, action);
      })
      .addCase(deleteCity.pending, (state) => {
        state.loading = true;
        resetNotify(state);
      })
      .addCase(deleteCity.fulfilled, (state) => {
        state.loading = false;
        fulfilledNotify(state, 'City has been deleted');
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
        fulfilledNotify(state, 'City has been created');
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
      fulfilledNotify(state, 'City has been updated');
    })
  },
})

export default citiesSlice.reducer

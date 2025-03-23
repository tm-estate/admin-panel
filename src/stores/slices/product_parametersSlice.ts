import { createSlice } from '@reduxjs/toolkit'
import { fulfilledNotify, rejectNotify, resetNotify } from '@/helpers/notifyStateHandler'
import { INotify, IProductParameter } from "@/interfaces";
import { create, deleteProductParameter, getProductParameter, getProductParameters, update } from "@/stores/thunks/product-parameters";

interface MainState {
  product_parameter: IProductParameter;
  product_parameters: IProductParameter[];
  loading: boolean;
  count: number;
  notify: INotify
}

const initialState: MainState = {
  product_parameter: null,
  product_parameters: [],
  loading: false,
  count: 0,
  notify: {
    showNotification: false,
    textNotification: '',
    typeNotification: 'warning',
  },
}

export const product_parametersSlice = createSlice({
  name: 'product_parameters',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(getProductParameters.rejected, (state, action) => {
          state.loading = false;
          rejectNotify(state, action);
        })
        .addCase(getProductParameters.pending, (state) => {
          state.loading = true;
          resetNotify(state);
        })
        .addCase(getProductParameters.fulfilled, (state, action) => {
          if (action.payload) {
              console.log({ action: action.payload })
            state.product_parameters = action.payload.rows;
              console.log(state.product_parameters)
            state.count = action.payload.count;
          }
          state.loading = false;
        })

        .addCase(getProductParameter.rejected, (state, action) => {
          state.loading = false;
          rejectNotify(state, action);
        })
        .addCase(getProductParameter.pending, (state) => {
          state.loading = true;
          resetNotify(state);
        })
        .addCase(getProductParameter.fulfilled, (state, action) => {
          if (action.payload) {
            state.product_parameter = action.payload;
          }
          state.loading = false;
        })

        .addCase(deleteProductParameter.rejected, (state, action) => {
          state.loading = false;
          rejectNotify(state, action);
        })
        .addCase(deleteProductParameter.pending, (state) => {
          state.loading = true;
          resetNotify(state);
        })
        .addCase(deleteProductParameter.fulfilled, (state) => {
          state.loading = false;
          fulfilledNotify(state, 'Product Parameter has been deleted');
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
          fulfilledNotify(state, 'Product Parameter has been created');
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
          fulfilledNotify(state, 'Product Parameter has been updated');
        })
  },
})

// Action creators are generated for each case reducer function
// export const {  } = usersSlice.actions

export default product_parametersSlice.reducer

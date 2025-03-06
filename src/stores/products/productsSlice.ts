import { createSlice } from '@reduxjs/toolkit'
import { fulfilledNotify, rejectNotify, resetNotify } from '@/helpers/notifyStateHandler'
import { create, deleteProduct, getProduct, getProducts, update } from "@/stores/thunks/products";
import { INotify, IProduct } from "@/interfaces";

interface MainState {
  product: IProduct;
  products: IProduct[];
  loading: boolean;
  count: number;
  notify: INotify
}

const initialState: MainState = {
  product: null,
  products: [],
  loading: false,
  count: 0,
  notify: {
    showNotification: false,
    textNotification: '',
    typeNotification: 'warn',
  },
}

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(getProducts.rejected, (state, action) => {
          state.loading = false;
          rejectNotify(state, action);
        })
        .addCase(getProducts.pending, (state) => {
          state.loading = true;
          resetNotify(state);
        })
        .addCase(getProducts.fulfilled, (state, action) => {
          if (action.payload) {
            state.products = action.payload.rows;
            state.count = action.payload.count;
          }
          state.loading = false;
        })

        .addCase(getProduct.rejected, (state, action) => {
          state.loading = false;
          rejectNotify(state, action);
        })
        .addCase(getProduct.pending, (state) => {
          state.loading = true;
          resetNotify(state);
        })
        .addCase(getProduct.fulfilled, (state, action) => {
          if (action.payload) {
            state.product = action.payload;
          }
          state.loading = false;
        })

        .addCase(deleteProduct.rejected, (state, action) => {
          state.loading = false;
          rejectNotify(state, action);
        })
        .addCase(deleteProduct.pending, (state) => {
          state.loading = true;
          resetNotify(state);
        })
        .addCase(deleteProduct.fulfilled, (state) => {
          state.loading = false;
          fulfilledNotify(state, 'Product has been deleted');
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
          fulfilledNotify(state, 'Product has been created');
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
          fulfilledNotify(state, 'Product has been updated');
        })
  },
})

// Action creators are generated for each case reducer function
// export const {  } = usersSlice.actions

export default productsSlice.reducer

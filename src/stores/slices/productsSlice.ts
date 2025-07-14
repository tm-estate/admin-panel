import { createSlice } from '@reduxjs/toolkit'
import { fulfilledNotify, rejectNotify, resetNotify } from '@/helpers/notifyStateHandler'
import {
    approve,
    create,
    deleteProduct,
    getProduct,
    getProducts, reject, rejectAndBlock,
    update
} from "@/stores/thunks/products";
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
    typeNotification: 'warning',
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

        // Add these cases to your existing productsSlice.ts extraReducers

        .addCase(approve.rejected, (state, action) => {
            state.loading = false;
            rejectNotify(state, action);
        })
        .addCase(approve.pending, (state) => {
            state.loading = true;
            resetNotify(state);
        })
        .addCase(approve.fulfilled, (state, action) => {
            state.loading = false;
            fulfilledNotify(state, 'Product approved successfully');
            state.products = state.products.filter(product => product._id !== action.meta.arg);
            state.count = Math.max(0, state.count - 1);
        })

        .addCase(reject.rejected, (state, action) => {
            state.loading = false;
            rejectNotify(state, action);
        })
        .addCase(reject.pending, (state) => {
            state.loading = true;
            resetNotify(state);
        })
        .addCase(reject.fulfilled, (state, action) => {
            state.loading = false;
            fulfilledNotify(state, 'Product rejected successfully');
            state.products = state.products.filter(product => product._id !== action.meta.arg.id);
            state.count = Math.max(0, state.count - 1);
        })

        .addCase(rejectAndBlock.rejected, (state, action) => {
            state.loading = false;
            rejectNotify(state, action);
        })
        .addCase(rejectAndBlock.pending, (state) => {
            state.loading = true;
            resetNotify(state);
        })
        .addCase(rejectAndBlock.fulfilled, (state, action) => {
            state.loading = false;
            fulfilledNotify(state, 'Product rejected and user blocked successfully');
            console.log(action)
            state.products = state.products.filter(product => product._id !== action.meta.arg.id);
            state.count = Math.max(0, state.count - 1);
        })

        // .addCase(getProductHistory.rejected, (state, action) => {
        //     state.loading = false;
        //     rejectNotify(state, action);
        // })
        // .addCase(getProductHistory.pending, (state) => {
        //     state.loading = true;
        //     resetNotify(state);
        // })
        // .addCase(getProductHistory.fulfilled, (state, action) => {
        //     state.loading = false;
        //     // You might want to add a history field to your state if needed
        // })

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

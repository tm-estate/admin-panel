import { createAsyncThunk } from "@reduxjs/toolkit";
import {IProduct, IProductRejectPayload, IProductUpdatePayload} from "@/interfaces";
import productsApi from "@/api/products";
import moderatorApi from "@/api/moderator";

export const getProducts = createAsyncThunk(
    'products/fetch',
    async (payload: { query: string, data: any }, { rejectWithValue }) => {
        try {
            const { query, data } = payload;

            const res = await productsApi.getProducts(query, data);
            return res.data;
        } catch (e: any) {
            console.error('Error fetching products:', e);
            return rejectWithValue(e.response?.data || 'Unknown error occurred');
        }
    }
);

export const getProduct = createAsyncThunk('product/fetch',
    async (payload: string | string[]) => {
        try {
            const res = await productsApi.getProduct(payload);
            return res.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
);

// Add these to your existing products.ts thunks file

export const approve = createAsyncThunk(
    'products/approve',
    async (payload: string, { rejectWithValue }) => {
        try {
            const res = await moderatorApi.approve(payload);
            return res.data;
        } catch (error) {
            if (!error.response) {
                throw error;
            }
            return rejectWithValue(error.response.data);
        }
    }
);

export const reject = createAsyncThunk(
    'products/reject',
    async (payload: IProductRejectPayload, { rejectWithValue }) => {
        try {
            const res = await moderatorApi.reject(payload);
            return res.data;
        } catch (error) {
            if (!error.response) {
                throw error;
            }
            return rejectWithValue(error.response.data);
        }
    }
);

export const rejectAndBlock = createAsyncThunk(
    'products/rejectAndBlock',
    async (payload: IProductRejectPayload, { rejectWithValue }) => {
        try {
            const res = await moderatorApi.rejectAndBlockUser(payload);
            return res.data;
        } catch (error) {
            if (!error.response) {
                throw error;
            }
            console.log(111, error.response.data.message[0])
            return rejectWithValue(error.response.data.message || error.response.data.message[0]);
        }
    }
);

// export const getProductHistory = createAsyncThunk(
//     'products/getHistory',
//     async (productId: string, { rejectWithValue }) => {
//         try {
//             const result = await productsApi.getProductHistory(productId);
//             return result.data;
//         } catch (error) {
//             if (!error.response) {
//                 throw error;
//             }
//             return rejectWithValue(error.response.data);
//         }
//     }
// );

export const deleteProduct = createAsyncThunk('products/delete',
    async (payload: string, { rejectWithValue }) => {
        try {
            await productsApi.delete(payload);
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data)
        }
    }
);

export const create = createAsyncThunk(
    'products/create',
    async (payload: IProduct, { rejectWithValue }) => {
        try {
            const result = await productsApi.create(payload);
            return result.data
        } catch (error) {
            if (!error.response) {
                throw error
            }
            return rejectWithValue(error.response.data)
        }
    }
)

export const update = createAsyncThunk(
    'products/update',
    async (payload: IProductUpdatePayload, { rejectWithValue }) => {
        try {
            const result = await productsApi.update(payload)
            return result.data
        } catch (error) {
            if (!error.response) {
                throw error
            }
            return rejectWithValue(error.response.data)
        }
    }
)

import { createAsyncThunk } from "@reduxjs/toolkit";
import { IProduct, IProductUpdatePayload } from "@/interfaces";
import productsApi from "@/api/products";

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

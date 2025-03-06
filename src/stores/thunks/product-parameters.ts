import { createAsyncThunk } from "@reduxjs/toolkit";
import { IProductParameter, IProductParametersUpdatePayload } from "@/interfaces";
import productParametersApi from "@/api/productParameters";

export const getProductParameters = createAsyncThunk('productParameters/fetch',
    async (payload: string) => {
        try {
            const res = await productParametersApi.getProductParameters(payload);
            return res.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    });

export const getProductParameter = createAsyncThunk('productParameter/fetch',
    async (payload: string | string[]) => {
        try {
            const res = await productParametersApi.getProductParameter(payload);
            return res.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    });

export const deleteProductParameter = createAsyncThunk('productParameters/delete',
    async (payload: string, { rejectWithValue }) => {
        try {
            await productParametersApi.delete(payload);
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data)
        }
    });

export const create = createAsyncThunk(
    'productParameters/create',
    async (payload: IProductParameter, { rejectWithValue }) => {
        try {
            const result = await productParametersApi.create(payload);
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
    'productParameters/update',
    async (payload: IProductParametersUpdatePayload, { rejectWithValue }) => {
        try {
            const result = await productParametersApi.update(payload)
            return result.data
        } catch (error) {
            if (!error.response) {
                throw error
            }
            return rejectWithValue(error.response.data)
        }
    }
)

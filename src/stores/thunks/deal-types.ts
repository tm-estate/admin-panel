import { createAsyncThunk } from "@reduxjs/toolkit";
import { IDealType, IDealTypeUpdatePayload } from "@/interfaces";
import dealTypesApi from "@/api/dealTypes";

export const getDealTypes = createAsyncThunk('dealTypes/fetch',
    async (payload: string) => {
        try {
            const res = await dealTypesApi.getDealTypes(payload);
            return res.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    });

export const getDealType = createAsyncThunk('dealType/fetch',
    async (payload: string | string[]) => {
        try {
            const res = await dealTypesApi.getDealType(payload);
            return res.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    });

export const deleteDealType = createAsyncThunk('dealTypes/delete',
    async (payload: string, { rejectWithValue }) => {
        try {
            await dealTypesApi.delete(payload);
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data)
        }
    });

export const create = createAsyncThunk(
    'dealTypes/create',
    async (payload: IDealType, { rejectWithValue }) => {
        try {
            const result = await dealTypesApi.create(payload);
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
    'dealTypes/update',
    async (payload: IDealTypeUpdatePayload, { rejectWithValue }) => {
        try {
            const result = await dealTypesApi.update(payload)
            return result.data
        } catch (error) {
            if (!error.response) {
                throw error
            }
            return rejectWithValue(error.response.data)
        }
    }
)

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICity, ICityAreasUpdatePayload } from "@/interfaces";
import cityAreasApi from "@/api/cityAreas";

export const getCityAreas = createAsyncThunk('cityAreas/fetch',
    async (payload: string) => {
        try {
            const res = await cityAreasApi.getCityAreas(payload);
            return res.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    });

export const getCityArea = createAsyncThunk('cityArea/fetch',
    async (payload: string | string[]) => {
        try {
            const res = await cityAreasApi.getCityArea(payload);
            return res.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    });

export const deleteCityArea = createAsyncThunk('cityArea/delete',
    async (payload: string, { rejectWithValue }) => {
        try {
            await cityAreasApi.delete(payload);
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data)
        }
    });

export const create = createAsyncThunk(
    'cityArea/create',
    async (payload: ICity, { rejectWithValue }) => {
        try {
            const result = await cityAreasApi.create(payload);
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
    'cityArea/update',
    async (payload: ICityAreasUpdatePayload, { rejectWithValue }) => {
        try {
            const result = await cityAreasApi.update(payload)
            return result.data
        } catch (error) {
            if (!error.response) {
                throw error
            }
            return rejectWithValue(error.response.data)
        }
    }
)

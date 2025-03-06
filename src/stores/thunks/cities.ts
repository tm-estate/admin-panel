import { createAsyncThunk } from "@reduxjs/toolkit";
import citiesApi from "@/api/cities";
import { ICity, ICityUpdatePayload } from "@/interfaces";

export const getCities = createAsyncThunk('cities/fetch',
    async (payload: string) => {
    try {
        const res = await citiesApi.getCities(payload);
        return res.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
});

export const getCity = createAsyncThunk('city/fetch',
    async (payload: string | string[]) => {
    try {
        const res = await citiesApi.getCity(payload);
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
});

export const deleteCity = createAsyncThunk('city/delete',
    async (payload: string, { rejectWithValue }) => {
        try {
            await citiesApi.delete(payload);
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data)
        }
    });

export const create = createAsyncThunk(
    'city/create',
    async (payload: ICity, { rejectWithValue }) => {
        try {
            const result = await citiesApi.create(payload);
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
    'cities/update',
    async (payload: ICityUpdatePayload, { rejectWithValue }) => {
        try {
            const result = await citiesApi.update(payload)
            return result.data
        } catch (error) {
            if (!error.response) {
                throw error
            }
            return rejectWithValue(error.response.data)
        }
    }
)

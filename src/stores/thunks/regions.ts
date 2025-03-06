import { createAsyncThunk } from "@reduxjs/toolkit";
import { IRegion, IRegionUpdatePayload } from "../../interfaces";
import regionsApi from "../../api/regions";

export const getRegions = createAsyncThunk('regions/fetch',
    async (payload: string) => {
        try {
            const res = await regionsApi.getRegions(payload);
            return res.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    });

export const getRegion = createAsyncThunk('region/fetch',
    async (payload: string | string[]) => {
        try {
            const res = await regionsApi.getRegion(payload);
            return res.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    });

export const deleteRegion = createAsyncThunk('regions/delete',
    async (payload: string, { rejectWithValue }) => {
        try {
            await regionsApi.delete(payload);
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data)
        }
    });

export const create = createAsyncThunk(
    'regions/create',
    async (payload: IRegion, { rejectWithValue }) => {
        try {
            const result = await regionsApi.create(payload);
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
    'regions/update',
    async (payload: IRegionUpdatePayload, { rejectWithValue }) => {
        try {
            const result = await regionsApi.update(payload)
            return result.data
        } catch (error) {
            if (!error.response) {
                throw error
            }
            return rejectWithValue(error.response.data)
        }
    }
)

import { createAsyncThunk } from "@reduxjs/toolkit";
import { IAgencyType, IAgencyTypeUpdatePayload } from "@/interfaces";
import agencyTypesApi from "@/api/agencyTypes";

export const getAgencyTypes = createAsyncThunk('agencyTypes/fetch',
    async (payload: string) => {
        try {
            const res = await agencyTypesApi.getAgencyTypes(payload);
            return res.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    });

export const getAgencyType = createAsyncThunk('agencyType/fetch',
    async (payload: string | string[]) => {
        try {
            const res = await agencyTypesApi.getAgencyType(payload);
            return res.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    });

export const deleteAgencyType = createAsyncThunk('agencyTypes/delete',
    async (payload: string, { rejectWithValue }) => {
        try {
            await agencyTypesApi.delete(payload);
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data)
        }
    });

export const create = createAsyncThunk(
    'agencyTypes/create',
    async (payload: IAgencyType, { rejectWithValue }) => {
        try {
            const result = await agencyTypesApi.create(payload);
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
    'agencyTypes/update',
    async (payload: IAgencyTypeUpdatePayload, { rejectWithValue }) => {
        try {
            const result = await agencyTypesApi.update(payload)
            return result.data
        } catch (error) {
            if (!error.response) {
                throw error
            }
            return rejectWithValue(error.response.data)
        }
    }
)

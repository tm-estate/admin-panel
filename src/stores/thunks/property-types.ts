import { createAsyncThunk } from "@reduxjs/toolkit";
import { IPropertyType, IPropertyTypeUpdatePayload } from "@/interfaces";
import propertyTypesApi from "@/api/propertyTypes";

export const getPropertyTypes = createAsyncThunk('propertyTypes/fetch',
    async (payload: string) => {
        try {
            const res = await propertyTypesApi.getPropertyTypes(payload);
            return res.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    });

export const getPropertyType = createAsyncThunk('propertyType/fetch',
    async (payload: string | string[]) => {
        try {
            const res = await propertyTypesApi.getPropertyType(payload);
            return res.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    });

export const deletePropertyType = createAsyncThunk('propertyTypes/delete',
    async (payload: string, { rejectWithValue }) => {
        try {
            await propertyTypesApi.delete(payload);
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data)
        }
    });

export const create = createAsyncThunk(
    'propertyTypes/create',
    async (payload: IPropertyType, { rejectWithValue }) => {
        try {
            const result = await propertyTypesApi.create(payload);
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
    'propertyTypes/update',
    async (payload: IPropertyTypeUpdatePayload, { rejectWithValue }) => {
        try {
            const result = await propertyTypesApi.update(payload)
            return result.data
        } catch (error) {
            if (!error.response) {
                throw error
            }
            return rejectWithValue(error.response.data)
        }
    }
)

import { createAsyncThunk } from "@reduxjs/toolkit";
import { IUser, IUserUpdatePayload } from "@/interfaces";
import usersApi from "@/api/users";

export const getUsers = createAsyncThunk('users/fetch',
    async (payload: { query: string, data: any }) => {
        try {
            const { query, data } = payload;

            const res = await usersApi.getUsers(query, data);
            return res.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    });

export const getUser = createAsyncThunk('propertyType/fetch',
    async (payload: string | string[]) => {
        try {
            const res = await usersApi.getUser(payload);

            return res.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    });

export const deleteUser = createAsyncThunk('users/delete',
    async (payload: string, { rejectWithValue }) => {
        try {
            await usersApi.delete(payload);
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data)
        }
    });

export const create = createAsyncThunk(
    'users/create',
    async (payload: IUser, { rejectWithValue }) => {
        try {
            const result = await usersApi.create(payload);
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
    'users/update',
    async (payload: IUserUpdatePayload, { rejectWithValue }) => {
        try {
            const result = await usersApi.update(payload)
            return result.data
        } catch (error) {
            if (!error.response) {
                throw error
            }
            return rejectWithValue(error.response.data)
        }
    }
)

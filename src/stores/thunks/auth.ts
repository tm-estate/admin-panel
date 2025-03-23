// src/stores/thunks/auth.ts
// Auth-related thunks for Redux

import { createAsyncThunk } from '@reduxjs/toolkit';
import { ISignInPayload, ISignUpPayload, IUser } from '@/interfaces';
import authApi from '@/api/auth';
import { Role } from '@/constants/roles';
import { Permission } from '@/constants/permissions';
import Cookies from "js-cookie";
import { COOKIE_OPTIONS, TOKEN_COOKIE_NAME } from "@/constants/cookies";


export const register = createAsyncThunk<IUser, ISignUpPayload, { rejectValue: string }>(
    'auth/register',
    async (registerData, { rejectWithValue }) => {
      try {
        const response = await authApi.register(registerData);

        Cookies.set(TOKEN_COOKIE_NAME, response.token, COOKIE_OPTIONS);

        return response.data;
      } catch (error) {
        return rejectWithValue(error?.message || 'Registration failed');
      }
    }
);

export const login = createAsyncThunk<void, ISignInPayload, { rejectValue: string }>(
    'auth/login',
    async (loginData, { rejectWithValue, dispatch }) => {
      try {
        const response = await authApi.login(loginData);

        Cookies.set(TOKEN_COOKIE_NAME, response.token, COOKIE_OPTIONS);

        // Fetch user details
        dispatch(getMe());
      } catch (error) {
        return rejectWithValue(error?.message || 'Login failed');
      }
    }
);

export const getMe = createAsyncThunk<IUser, void, { rejectValue: string }>(
    'auth/getMe',
    async (_, { rejectWithValue }) => {
      try {
        const response = await authApi.getMe();
        return response;
      } catch (error) {
        return rejectWithValue(error?.message || 'Failed to fetch user data');
      }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
      await authApi.logout();
    }
);

export const changeUserRole = createAsyncThunk(
    'auth/changeUserRole',
    async ({ userId, role }: { userId: string; role: Role }, { dispatch }) => {
      try {
        await authApi.changeUserRole(userId, role);
        // Refresh user list or user details after role change
        // This would depend on your application's structure
      } catch (error) {
        console.error('Failed to change user role:', error);
        throw error;
      }
    }
);

export const assignPermission = createAsyncThunk(
    'auth/assignPermission',
    async ({ userId, permission }: { userId: string; permission: Permission }, { dispatch }) => {
      try {
        await authApi.assignPermission(userId, permission);
        // Refresh user data if needed
      } catch (error) {
        console.error('Failed to assign permission:', error);
        throw error;
      }
    }
);

export const removePermission = createAsyncThunk(
    'auth/removePermission',
    async ({ userId, permission }: { userId: string; permission: Permission }, { dispatch }) => {
      try {
        await authApi.removePermission(userId, permission);
        // Refresh user data if needed
      } catch (error) {
        console.error('Failed to remove permission:', error);
        throw error;
      }
    }
);

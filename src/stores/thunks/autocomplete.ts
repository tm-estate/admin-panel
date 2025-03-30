import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

const pendingRequests = {};

const CACHE_EXPIRATION = 5 * 60 * 1000;

export const getCacheKey = (entityType: string, search: string = '') => {
    return `${entityType}${search ? `:${search}` : ''}`;
};

export const fetchAutocompleteOptions = createAsyncThunk(
    'autocomplete/fetch',
    async ({
               entityType,
               search = '',
               limit = 100,
               customFilter = '',
               forceRefresh = false
           }: {
        entityType: string;
        search?: string;
        limit?: number;
        customFilter?: string;
        forceRefresh?: boolean;
    }, { getState, requestId, dispatch }) => {
        const state = getState() as any;
        const cacheKey = getCacheKey(entityType, search);
        const now = Date.now();

        if (pendingRequests[cacheKey]) {
            return {
                key: cacheKey,
                data: state.autocomplete.items[cacheKey] || [],
                fromCache: true,
                isDuplicate: true
            };
        }

        if (
            !forceRefresh &&
            state.autocomplete.items[cacheKey] &&
            state.autocomplete.items[cacheKey].length > 0 &&
            state.autocomplete.timestamp[cacheKey] &&
            now - state.autocomplete.timestamp[cacheKey] < CACHE_EXPIRATION
        ) {
            return {
                key: cacheKey,
                data: state.autocomplete.items[cacheKey],
                fromCache: true,
                isDuplicate: false
            };
        }

        try {
            pendingRequests[cacheKey] = true;

            const url = `/${entityType}/autocomplete?limit=${limit}&search=${encodeURIComponent(search)}${customFilter}`;
            const response = await axios.get(url);

            return {
                key: cacheKey,
                data: response.data.data,
                fromCache: false,
                isDuplicate: false,
                timestamp: now
            };
        } catch (error) {
            console.error(`Error fetching autocomplete data for ${cacheKey}:`, error);
            throw error;
        } finally {
            setTimeout(() => {
                delete pendingRequests[cacheKey];
            }, 500);
        }
    }
);

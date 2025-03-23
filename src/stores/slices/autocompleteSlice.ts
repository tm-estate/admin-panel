import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const pendingRequests = {};

interface AutocompleteItem {
    _id: string;
    [key: string]: any;
}

interface AutocompleteState {
    items: {
        [key: string]: AutocompleteItem[]; // key is entityType or entityType:searchTerm
    };
    loading: {
        [key: string]: boolean;
    };
    error: {
        [key: string]: string | null;
    };
    timestamp: {
        [key: string]: number;
    };
}

const initialState: AutocompleteState = {
    items: {},
    loading: {},
    error: {},
    timestamp: {}
};

const CACHE_EXPIRATION = 5 * 60 * 1000;

const getCacheKey = (entityType: string, search: string = '') => {
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

export const autocompleteSlice = createSlice({
    name: 'autocomplete',
    initialState,
    reducers: {
        clearAutocompleteCache: (state, action) => {
            const entityType = action.payload;

            Object.keys(state.items).forEach(key => {
                if (key === entityType || key.startsWith(`${entityType}:`)) {
                    delete state.items[key];
                    delete state.timestamp[key];
                }
            });
        },

        clearAllAutocompleteCache: (state) => {
            state.items = {};
            state.timestamp = {};
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAutocompleteOptions.pending, (state, action) => {
                const { entityType } = action.meta.arg;
                state.loading[entityType] = true;
                state.error[entityType] = null;
            })
            .addCase(fetchAutocompleteOptions.fulfilled, (state, action) => {
                const { key, data, fromCache, isDuplicate, timestamp } = action.payload;
                const { entityType } = action.meta.arg;

                if (!fromCache && !isDuplicate) {
                    state.items[key] = data;
                    state.timestamp[key] = timestamp;

                    if (key === entityType) {
                        state.items[entityType] = data;
                        state.timestamp[entityType] = timestamp;
                    }
                }

                state.loading[entityType] = false;
                state.error[entityType] = null;
            })
            .addCase(fetchAutocompleteOptions.rejected, (state, action) => {
                const { entityType } = action.meta.arg;
                state.loading[entityType] = false;
                state.error[entityType] = action.error.message || 'Failed to fetch options';
            });
    }
});

export const { clearAutocompleteCache, clearAllAutocompleteCache } = autocompleteSlice.actions;

export const selectAutocompleteOptions = (state, entityType, search = '') => {
    const cacheKey = getCacheKey(entityType, search);
    return state.autocomplete.items[cacheKey] || [];
};

export const selectAutocompleteLoading = (state, entityType) => {
    return state.autocomplete.loading[entityType] || false;
};

export const selectAutocompleteError = (state, entityType) => {
    return state.autocomplete.error[entityType] || null;
};

export default autocompleteSlice.reducer;

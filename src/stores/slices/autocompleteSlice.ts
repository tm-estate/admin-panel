import { createSlice } from '@reduxjs/toolkit';
import { fetchAutocompleteOptions, getCacheKey } from "@/stores/thunks/autocomplete";

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

import { Middleware } from 'redux';
import { clearAutocompleteCache } from '@/stores/slices/autocompleteSlice';

// This middleware automatically invalidates the autocomplete cache
// when related entities are created, updated, or deleted
export const autocompleteInvalidation: Middleware = store => next => action => {
    // Process the action first
    const result = next(action);

    // Check if the action is a fulfilled action for create, update, or delete
    if (action.type && typeof action.type === 'string' && action.type.endsWith('/fulfilled')) {
        // Map of actions that should invalidate specific autocomplete caches
        const invalidationMap = {
            // Cities actions
            'city/create/fulfilled': ['cities'],
            'cities/update/fulfilled': ['cities'],
            'city/delete/fulfilled': ['cities'],

            // City Areas actions
            'cityArea/create/fulfilled': ['cityAreas'],
            'cityArea/update/fulfilled': ['cityAreas'],
            'cityArea/delete/fulfilled': ['cityAreas'],

            // Deal Types actions
            'dealTypes/create/fulfilled': ['dealTypes'],
            'dealTypes/update/fulfilled': ['dealTypes'],
            'dealTypes/delete/fulfilled': ['dealTypes'],

            // Property Types actions
            'propertyTypes/create/fulfilled': ['propertyTypes'],
            'propertyTypes/update/fulfilled': ['propertyTypes'],
            'propertyTypes/delete/fulfilled': ['propertyTypes'],

            // Regions actions
            'regions/create/fulfilled': ['regions'],
            'regions/update/fulfilled': ['regions'],
            'regions/delete/fulfilled': ['regions'],

            // Product Parameters actions
            'productParameters/create/fulfilled': ['productParameters'],
            'productParameters/update/fulfilled': ['productParameters'],
            'productParameters/delete/fulfilled': ['productParameters'],

            // Users actions
            'users/create/fulfilled': ['users'],
            'users/update/fulfilled': ['users'],
            'users/delete/fulfilled': ['users'],

            // Products actions
            'products/create/fulfilled': ['products'],
            'products/update/fulfilled': ['products'],
            'products/delete/fulfilled': ['products'],
        };

        // If the action should invalidate cache, dispatch the clear action
        const cachesToInvalidate = invalidationMap[action.type];
        if (cachesToInvalidate) {
            cachesToInvalidate.forEach(cacheKey => {
                store.dispatch(clearAutocompleteCache(cacheKey));
            });
        }
    }

    return result;
};

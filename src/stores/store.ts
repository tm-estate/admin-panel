import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import authSlice from './slices/authSlice'
import agency_typesReducer from './slices/agency_typesSlice'
import autocompleteReducer from './slices/autocompleteSlice';
import citiesReducer from './slices/citiesSlice';
import city_areasReducer from './slices/city_areasSlice';
import deal_typesReducer from './slices/deal_typesSlice';
import mainReducer from './slices/mainSlice'
import productsReducer from './slices/productsSlice';
import product_parametersReducer from './slices/product_parametersSlice';
import product_parameters_itemsReducer from './slices/product_parameter_itemsSlice';
import property_typesReducer from './slices/property_typesSlice';
import styleReducer from './slices/styleSlice'
import regionsReducer from './slices/regionsSlice';
import usersReducer from './slices/usersSlice';
import { autocompleteInvalidation } from '@/middlewares/autocompleteInvalidation';
import agencyTypes from "@/api/agencyTypes";

// Combine all reducers
const rootReducer = combineReducers({
  style: styleReducer,
  main: mainReducer,
  auth: authSlice,

  agency_types: agency_typesReducer,
  autocomplete: autocompleteReducer,
  cities: citiesReducer,
  city_areas: city_areasReducer,
  deal_types: deal_typesReducer,
  products: productsReducer,
  product_parameters: product_parametersReducer,
  product_parameters_items: product_parameters_itemsReducer,
  property_types: property_typesReducer,
  regions: regionsReducer,
  users: usersReducer,
});

// Configure the store with the autocomplete invalidation middleware
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(autocompleteInvalidation),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

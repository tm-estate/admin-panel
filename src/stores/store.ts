import { configureStore } from '@reduxjs/toolkit'
import styleReducer from './styleSlice'
import mainReducer from './mainSlice'
import authSlice from './authSlice'

import usersSlice from './users/usersSlice'
import deal_typesSlice from './deal_types/deal_typesSlice'
import property_typesSlice from './property_types/property_typesSlice'
import product_parametersSlice from './product_parameters/product_parametersSlice'
import product_parameter_itemsSlice from './product_parameter_items/product_parameter_itemsSlice'
import city_areasSlice from './city_areas/city_areasSlice'
import citiesSlice from './cities/citiesSlice'
import regionsSlice from './regions/regionsSlice'
import agency_typesSlice from "./agency_types/agency_typesSlice";
import productsSlice from "./products/productsSlice";

export const store = configureStore({
  reducer: {
    style: styleReducer,
    main: mainReducer,
    auth: authSlice,

    users: usersSlice,
    deal_types: deal_typesSlice,
    property_types: property_typesSlice,
    agency_types: agency_typesSlice,
    products: productsSlice,
    product_parameters: product_parametersSlice,
    product_parameter_items: product_parameter_itemsSlice,
    city_areas: city_areasSlice,
    cities: citiesSlice,
    regions: regionsSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

import { configureStore } from '@reduxjs/toolkit'
// 1. Import the default reducer named as productReducer here
import productReducer from './slices/productSlice'

export const store = configureStore({
    reducer:{
        products:productReducer,
    },
});


// 2. Export RootState and AppDispatch types for types hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;




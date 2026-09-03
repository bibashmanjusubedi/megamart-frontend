import { configureStore } from '@reduxjs/toolkit'
// 1. Import the default reducer named as productReducer here
import productReducer from './slices/productSlice'
import authReducer from './slices/authSlice'
import categoryReducer from './slices/categorySlice'
import cartReducer from './slices/cartSlice'
import orderReducer from './slices/orderSlice'

export const store = configureStore({
    reducer:{
        products:productReducer,
        auth:authReducer,
        categories:categoryReducer,
        cart:cartReducer,
        orders:orderReducer,
    },
});


// 2. Export RootState and AppDispatch types for types hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;




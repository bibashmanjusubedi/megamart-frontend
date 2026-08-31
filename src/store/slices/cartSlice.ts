import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product, CartItem } from '../../types';

interface CartState {
    items:CartItem[];
    deliveryAddress:string;
    paymentMethod:'card' | 'upi';
}

const initialState: CartState = {
    items: [],
    deliveryAddress:'',
    paymentMethod:'card'
};

export const cartSlice = createSlice({
    name:'cart',
    initialState,
    reducers:{
        addToCart:(state, action: PayloadAction<{ product: Product; quantity: number }>) => {
            const existing = state.items.find((item) => item.product.id === action.payload.product.id);
            if (existing){
                existing.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
        },
        updateQuantity: (state,action:PayloadAction<{ productId: number; quantity:number }>) => {
            const item = state.items.find((i) => i.product.id  === action.payload.productId);
            if ( item && action.payload.quantity > 0){
                item.quantity = action.payload.quantity;
            }    
        },
        
        removeFromCart: (state,action:PayloadAction<number>) => {
            state.items = state.items.filter((i) => i.product.id !== action.payload);
        },

        setDeliveryAddress :(state,action:PayloadAction<string>) => {
            state.deliveryAddress = action.payload;
        },

        setPaymentMethod: (state, action:PayloadAction<'card' | 'upi'>) => {
            state.paymentMethod = action.payload;
        },

        clearCart:(state) => {
            state.items = []
        },
    },
});

export const {
    addToCart,
    updateQuantity,
    removeFromCart,
    setDeliveryAddress,
    setPaymentMethod,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

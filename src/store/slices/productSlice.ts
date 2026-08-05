import { createSlice,type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types';
import type { Category } from '../../types';
import { mockProducts } from '../../mock/mockData';
import { mockCategories } from '../../mock/mockData';

interface ProductState {
    products: Product[];
    searchQuery: string;
    categories: Category[];
    selectedCategoryId: number | null;
}

const initialState: ProductState = {
    products: mockProducts,
    searchQuery: '',
    categories: mockCategories,
    selectedCategoryId: null,
};


export const productSlice = createSlice({
    name:'products',
    initialState,
    reducers:{
        setSearchQuery:(state, action:PayloadAction<string>)=>{
            state.searchQuery = action.payload;
        },
        setSelectedCategory:(state,action:PayloadAction<number | null>)=>{
            state.selectedCategoryId = action.payload;
        },
    },
});


export const { setSearchQuery, setSelectedCategory } = productSlice.actions;
export default productSlice.reducer;
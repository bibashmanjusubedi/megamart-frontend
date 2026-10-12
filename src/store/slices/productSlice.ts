import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types';
import type { Category } from '../../types';
import { mockProducts } from '../../mock/mockData';
import { mockCategories } from '../../mock/mockData';
import api from '../../services/api';

interface ProductState {
    products: Product[];
    searchQuery: string;
    // categories: Category[];
    selectedCategoryId: number | null;
    loading:boolean;
    error: string | null;
}

const initialState: ProductState = {
    products: mockProducts,
    searchQuery: '',
    // categories: mockCategories,
    selectedCategoryId: null,
    loading: false,
    error: null
};


// 1. Create the async thunk to fetch products from your .NET API
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<Product[]>('/products');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
        }
    }
);




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
        deleteProduct: (state, action: PayloadAction<number>) => {
            state.products = state.products.filter((p) => p.id !== action.payload);
        },
    },

    // 2. Handle the async lifecycle states
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload; // Populate state with DB products
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'An error occurred';
            });
    },
});


export const { setSearchQuery, setSelectedCategory,deleteProduct } = productSlice.actions;
export default productSlice.reducer;
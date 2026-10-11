// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { Category } from '../../types';
// import { mockCategories } from '../../mock/mockData';

// interface CategoryState {
//     categories: Category[];
//     isLoading:boolean;
//     error:string | null;
// }

// const initialState: CategoryState = {
//     categories: mockCategories,
//     isLoading: false,
//     error: null
// };

// const categorySlice = createSlice({
//     name: 'categories',
//     initialState,
//     reducers:{
//         setCategories: (state,action: PayloadAction<Category[]>,) {
//             state.categories = action.payload;
//         },
//     },
// });

// export const { setCategories } = categorySlice.actions;
// export default categorySlice.reducer;

import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import type { Category } from '../../types';
import { mockCategories } from '../../mock/mockData';
import api from '../../services/api';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, thunkAPI) => {
    try{
      const response = await api.get<Category[]>('/Categories');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch categories';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: mockCategories,
  // categories: [],
  isLoading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
    },
  },
  extraReducers:(builder) => {
    builder
      .addCase(fetchCategories.pending,(state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled,(state,action)=> {
        state.isLoading = true;
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected,(state,action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to load categories';
      });
  },
});

export const { setCategories } = categorySlice.actions;
export default categorySlice.reducer;
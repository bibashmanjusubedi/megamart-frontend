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

// 1. Add the createCategory async thunk
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async(newCategory:{ name:string }, thunkAPI) => {
    try{
      const response = await api.post<Category>('/Categories', newCategory);
      return response.data;
    } catch(error: any){
      const message = error.response?.data?.message || error.message || 'Failed to create category';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// updateCategory async thunk
// Explicitly pass <Category, Category> (Fulfilled Return Type, Argument Type)
export const updateCategory = createAsyncThunk<Category, Category>(
  'categories/updateCategory',
  async (category, thunkAPI) => {
    try {
      // const response = await api.put<Category>(`/Categories/${category.id}`, { name: category.name });
      // return response.data; 
      await api.put(`/Categories/${category.id}`, { name: category.name });
      
      // Explicitly return the category object so Redux can update the UI
      return category;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to update category';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add deleteCategory thunk]
export const deleteCategory = createAsyncThunk<number|string,number|string>(
  'categories/deleteCategory',
  async (id, thunkAPI ) => {
    try{
      await api.delete(`/Categories/${id}`);
      return id;
    } catch(error: any){
      const message = error.response?.data?.message || error.message || ' Failed to delete categories';
      return thunkAPI.rejectWithValue(message);
    }

  }
)

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  // categories: mockCategories,
  categories: [],
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
      })
      //Create Category
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled,(state, action) => {
        state.isLoading = false;
        state.categories.push(action.payload);// Instantly adds the new category to Redux state
      })
      .addCase(createCategory.rejected, (state,action) => {
        state.isLoading = false;
        state.error = (action.payload as string ) || 'failed to create category';
      })
      // Update Category reducer
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled,(state,action) => {
        state.isLoading = false;
        const index = state.categories.findIndex((c) => c.id === action.payload.id);
        if (index !== -1){
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected,(state,action)=> {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to update category';
      })
      //Delete Category Reducer
      .addCase(deleteCategory.pending,(state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled,(state,action) => {
        state.isLoading = false;
        // Remove the deleted category from the array
        state.categories = state.categories.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state,action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to delete category';
      });

  },
});

export const { setCategories } = categorySlice.actions;
export default categorySlice.reducer;
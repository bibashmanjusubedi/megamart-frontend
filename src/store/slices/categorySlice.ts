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

import { createSlice,type PayloadAction } from '@reduxjs/toolkit';
import type { Category } from '../../types';
import { mockCategories } from '../../mock/mockData';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: mockCategories,
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
});

export const { setCategories } = categorySlice.actions;
export default categorySlice.reducer;
import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from '../../types';
import api from '../../services/api';

interface AuthState {
    isAuthenticated: boolean;
    currentUser: User | null;
    users: User[];
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    currentUser: null,
    users:[],
    loading:false,
    error:null
};

// Async thunk to fetch all users (Admin only)
export const fetchAllUsers = createAsyncThunk(
    'auth/fetchAllUsers',
    async(_,{ rejectWithValue }) => {
        try{
            const response = await api.get('/auth/users');// Matches your endpoint route
            return response.data;
        } catch(error:any){
            return rejectWithValue(error.response?.data.message|| 'Failed to fetch users');
        }
    }
)




export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        setUser:(state,action:PayloadAction<User | null>)=>{
            state.currentUser = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        logout:(state)=>{
            state.currentUser = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers:(builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchAllUsers.rejected,(state,action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
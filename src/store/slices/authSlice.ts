import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';

interface AuthState {
    isAuthenticated: boolean;
    currentUser: User | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    currentUser: null,
};

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
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
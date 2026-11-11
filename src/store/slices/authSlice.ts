import {
  createSlice,
  type PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import type { User } from "../../types";
import api from "../../services/api";

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
  users: [],
  loading: false,
  error: null,
};

// Async thunk to fetch all users (Admin only)
export const fetchAllUsers = createAsyncThunk(
  "auth/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/users"); // Matches your endpoint route
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.message || "Failed to fetch users",
      );
    }
  },
);

// Async thunk to update a user's role
export const updateUserRole = createAsyncThunk(
  "auth/updateUserRole",
  async (
    { id, role }: { id: string | number; role: string },
    { rejectWithValue },
  ) => {
    try {
      // Matches your endpoint route (adjust capitalization if needed, e.g., /auth/users/... vs /Auth/users/...)
      const response = await api.put(`/auth/users/${id}/role`, { role });
      return response.data; // Assumes backend returns the updated user object
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user role",
      );
    }
  },
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllUsers.fulfilled,
        (state, action: PayloadAction<User[]>) => {
          state.loading = false;
          state.users = action.payload;
        },
      )
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update User Role
      .addCase(
        updateUserRole.fulfilled,
        (state, action: PayloadAction<any>) => {
          // Read id and role directly from action.payload returned by the backend
          const { id, role } = action.payload;

          // Find the user in the local array (using loose equality `==` for safety)
          const index = state.users.findIndex((u) => u.id == id);

          if (index !== -1) {
            // Update the user's role in the local Redux state array
            state.users[index] = {
              ...state.users[index],
              role: role,
            };
          }
        },
      );
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;

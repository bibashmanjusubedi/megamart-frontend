import { createSlice,createAsyncThunk, type PayloadAction, isRejectedWithValue } from '@reduxjs/toolkit';
import type { Order } from '../../types';
// import axios from "axios";
import api from "../../services/api";


interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [], // Starts empty until orders are created or fetched
  loading: false,
  error: null,
};


// 1. Create the async thunk for fetching orders from the backend
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async(_,{ rejectWithValue }) => {
    try{
      const response = await api.get<Order[]>('/Orders/my-orders');
      return Array.isArray(response.data) ? response.data : [];
      // return response.data;
    } catch (error: any){
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);



export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
    },
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: number; status: Order['status'] }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
    },
  },

  // 2. Handle the lifecycle states of the async thunk
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action:PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload; // Populates state with data from GET /api/Orders
      })
      .addCase(fetchOrders.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { addOrder, setOrders,updateOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import type { Product, CartItem } from "../../types";
import api from "../../services/api";

interface CartState {
  items: CartItem[];
  deliveryAddress: string;
  paymentMethod: "card" | "upi";
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  deliveryAddress: "",
  paymentMethod: "card",
  loading: false,
  error: null,
};

// 1. Fetch cart from GET /api/carts
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/Carts");
      // Adjust response.data.items if your backend returns the array under a different property
      return response.data.items || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch cart");
    }
  },
);

// 2. Add item to cart via POST /api/cart/items with payload { productId, quantity }
export const addToCartBackend = createAsyncThunk(
  `cart/addToCartBackend`,
  async (
    { productId, quantity }: { productId: number; quantity: number },
    { dispatch, rejectWithValue },
  ) => {
    try {
      await api.post("/Carts/items", { productId, quantity });
      // Refresh the cart state from the backend after a successful addition
      // dispatch(fetchCart());
    } catch (error: any) {
      // If it fails, you can re-fetch to roll back or show an error
      dispatch(fetchCart());
      return rejectWithValue(
        error.response?.data || "Failed to add item to cart",
      );
    }
  },
);

// Async thunk to update item quantity in the database via PUT /api/Carts/items/{cartItemId}
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async (
    { cartItemId, quantity }: { cartItemId: number; quantity: number },
    { dispatch, rejectWithValue },
  ) => {
    try {
      await api.put(`/Carts/items/${cartItemId}`, { quantity });
      // Refresh the cart from the backend so the UI and database match perfectly
      //   dispatch(fetchCart());
    } catch (error: any) {
      dispatch(fetchCart());
      return rejectWithValue(
        error.response?.data || "Failed to update quantity",
      );
    }
  },
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (item) => item.productId === action.payload.productId,
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>,
    ) => {
      const item = state.items.find(
        (i) => i.productId === action.payload.productId,
      );
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },

    setDeliveryAddress: (state, action: PayloadAction<string>) => {
      state.deliveryAddress = action.payload;
    },

    setPaymentMethod: (state, action: PayloadAction<"card" | "upi">) => {
      state.paymentMethod = action.payload;
    },

    clearCart: (state) => {
      state.items = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
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

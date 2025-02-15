import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      console.log("Adding to cart:", newItem);

      if (!newItem.id) {
        throw new Error("Product ID is required");
      }

      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (state.items.length >= 5) {
        throw new Error("Cannot add more than 5 products to the cart");
      }

      if (existingItem) {
        throw new Error("This product is already in the cart");
      }

      state.items.push(newItem);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

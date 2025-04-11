import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { clearCart } from "./cartSlice";
import { clearWishlist } from "./wishlistSlice";

const initialState = {
  token: localStorage.getItem("token") || undefined,
  isLogged: false,
  user: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.userInfo;
      localStorage.setItem("token", action.payload.token);
    },
    updateUserName: (state, action) => {
      state.user.user_name = action.payload;
    },
    updateUserPicture: (state, action) => {
      state.user.profile_pic = action.payload;
    },
    updateUserState: (state, action) => {
      state.isLogged = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder.addCase(logout.fulfilled, (state) => {
      state.token = "";
      state.user = {};
    }),
});
export const logout = createAsyncThunk(
  "auth/logout",
  async function (_, { dispatch }) {
    localStorage.removeItem("token");
    dispatch(clearCart());
    dispatch(clearWishlist());
  }
);
export const { login, updateUserName, updateUserPicture, updateUserState } =
  authSlice.actions;
export default authSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "./loaderSlice";
import userReducer from "./userSlice";
const store = configureStore({
  reducer: {
    loaders: loaderReducer,
    user: userReducer, // ✅ user state slice correctly registered
  }
});

export default store;
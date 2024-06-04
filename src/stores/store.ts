import { configureStore } from "@reduxjs/toolkit";
import notificationActionReducer from "./notificationActionSlice";

export const store = configureStore({
  reducer: {
    notificationAction: notificationActionReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

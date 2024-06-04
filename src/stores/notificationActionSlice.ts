import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Severity } from "../types";

export interface NotificationActionState {
  open?: boolean;
  message: string;
  severity: Severity;
}

export const initialNotificationActionState: NotificationActionState = {
  open: false,
  message: "",
  severity: "error",
};

export const notificationActionSlice = createSlice({
  name: "notificationAction",
  initialState: initialNotificationActionState,
  reducers: {
    showNotificationAction(
      state,
      action: PayloadAction<NotificationActionState>
    ) {
      state.message = action.payload.message;
      state.severity = action.payload.severity;
      state.open = true;
    },
    hideNotificationAction(state) {
      state.open = false;
      // state.severity = initialNotificationActionState.severity;
      // state.message = initialNotificationActionState.message;
    },
  },
});

export const { showNotificationAction, hideNotificationAction } =
  notificationActionSlice.actions;
export default notificationActionSlice.reducer;

// Toast middleware for RTK Query (handles all non-GET API responses)
import type { Middleware } from "@reduxjs/toolkit";
import { isRejectedWithValue, isFulfilled } from "@reduxjs/toolkit";

// You must implement your own toast function/component
// Example: import { toast } from '@/lib/ui/toast';
// For now, use window.alert as a placeholder
const showToast = (msg: string, type: "success" | "error" = "success") => {
  // Replace with your toast system
  window.alert(`${type === "error" ? "Error: " : ""}${msg}`);
};

export const toastMiddleware: Middleware = () => (next) => (action) => {
  // RTK Query fulfilled action
  if (isFulfilled(action)) {
    // Only for non-GET endpoints (mutation)
    if (
      action.meta &&
      action.meta.arg &&
      action.meta.arg.endpointName &&
      !action.meta.arg.endpointName.toLowerCase().startsWith("get")
    ) {
      const message = action.payload?.message;
      if (message) {
        showToast(message, "success");
      }
    }
  }
  // RTK Query rejected action
  if (isRejectedWithValue(action)) {
    if (
      action.meta &&
      action.meta.arg &&
      action.meta.arg.endpointName &&
      !action.meta.arg.endpointName.toLowerCase().startsWith("get")
    ) {
      const message = action.payload?.data?.message || "Something went wrong";
      showToast(message, "error");
    }
  }
  return next(action);
};

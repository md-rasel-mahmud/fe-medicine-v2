/* eslint-disable @typescript-eslint/no-explicit-any */
// Toast middleware for RTK Query (handles all non-GET API responses)
import type { Middleware } from "@reduxjs/toolkit";
import { isRejectedWithValue, isFulfilled } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const toastMiddleware: Middleware = () => (next) => (action) => {
  // RTK Query fulfilled action
  if (isFulfilled(action)) {
    // Only for non-GET endpoints (mutation)
    const arg = action.meta?.arg as { endpointName?: string };
    if (
      arg &&
      typeof arg.endpointName === "string" &&
      !arg.endpointName.toLowerCase().startsWith("get")
    ) {
      const message = (action.payload as any)?.message;
      if (message) {
        toast.success(message);
      }
    }
  }
  // RTK Query rejected action
  if (isRejectedWithValue(action)) {
    const arg = action.meta?.arg as { endpointName?: string };
    if (
      arg &&
      typeof arg.endpointName === "string" &&
      !arg.endpointName.toLowerCase().startsWith("get")
    ) {
      const message =
        (action.payload as any)?.data?.message || "Something went wrong";
      toast.error(message);
    }
  }
  return next(action);
};

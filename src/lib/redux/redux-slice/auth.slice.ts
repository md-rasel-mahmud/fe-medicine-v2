import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserType } from "../api-services/auth/user.type";

export interface AuthState {
  token: string | null;
  user: UserType | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  user: (() => {
    const user = localStorage.getItem("user");

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as UserType;
    } catch {
      return null;
    }
  })(),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredential: (state, action: PayloadAction<AuthState>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;

      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      } else {
        localStorage.removeItem("token");
      }

      if (action.payload.user) {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      } else {
        localStorage.removeItem("user");
      }
    },
    clearCredential: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCredential, clearCredential } = authSlice.actions;

export default authSlice.reducer;

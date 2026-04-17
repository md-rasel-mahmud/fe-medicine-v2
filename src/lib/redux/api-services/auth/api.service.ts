import { baseApi } from "../base.api";
import type {
  AuthResponseType,
  LoginPayloadType,
  RegisterPayloadType,
} from "./user.type";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation<AuthResponseType, LoginPayloadType>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    registerUser: builder.mutation<AuthResponseType, RegisterPayloadType>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useLoginUserMutation, useRegisterUserMutation } = authApi;

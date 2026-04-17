import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiPrefix, baseURL } from "../../../config";

export const baseApi = createApi({
  reducerPath: "medicineApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseURL}${apiPrefix}`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as { auth: { token: string | null } }).auth
        .token;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    "Auth",
    "Dashboard",
    "Medicine",
    "Purchase",
    "Sale",
    "Stock",
    "Supplier",
    "Unit",
    "User",
  ],
  endpoints: () => ({}),
});

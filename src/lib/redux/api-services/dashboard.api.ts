import { baseApi } from "./base.api";
import type { ApiItemResponse, DashboardResultType } from "./types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<
      ApiItemResponse<DashboardResultType>,
      string | void
    >({
      query: (report = "daily") => `/dashboard?report=${report}`,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApi;

import { baseApi } from "./base.api";
import type { ApiItemResponse, ApiListResponse, UnitType } from "./types";

export type UnitInputType = UnitType;

export const unitApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUnits: builder.query<ApiListResponse<UnitType>, void>({
      query: () => "/unit/all",
      providesTags: ["Unit"],
    }),
    createUnit: builder.mutation<ApiItemResponse<UnitType>, UnitInputType>({
      query: (body) => ({
        url: "/unit",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Unit"],
    }),
    updateUnit: builder.mutation<
      ApiItemResponse<UnitType>,
      { id: string; body: Partial<UnitInputType> }
    >({
      query: ({ id, body }) => ({
        url: `/unit/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Unit"],
    }),
    deleteUnit: builder.mutation<ApiItemResponse<UnitType>, string>({
      query: (id) => ({
        url: `/unit/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Unit"],
    }),
  }),
});

export const {
  useGetUnitsQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} = unitApi;

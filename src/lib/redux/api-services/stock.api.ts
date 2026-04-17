import { baseApi } from "./base.api";
import type { ApiItemResponse, ApiListResponse, StockType } from "./types";

export type StockInputType = StockType;

export const stockApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStocks: builder.query<ApiListResponse<StockType>, { page?: number; limit?: number } | void>({
      query: (params) => {
        if (params?.page && params?.limit) {
          return `/stock/all?page=${params.page}&limit=${params.limit}`;
        }
        return "/stock/all";
      },
      providesTags: ["Stock"],
    }),
    getStockById: builder.query<ApiItemResponse<StockType>, string>({
      query: (id) => `/stock/${id}`,
      providesTags: ["Stock"],
    }),
    createStock: builder.mutation<ApiItemResponse<StockType>, StockInputType>({
      query: (body) => ({
        url: "/stock",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Stock"],
    }),
    updateStock: builder.mutation<
      ApiItemResponse<StockType>,
      { id: string; body: Partial<StockInputType> }
    >({
      query: ({ id, body }) => ({
        url: `/stock/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Stock"],
    }),
    deleteStock: builder.mutation<ApiItemResponse<StockType>, string>({
      query: (id) => ({
        url: `/stock/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Stock"],
    }),
  }),
});

export const {
  useGetStocksQuery,
  useGetStockByIdQuery,
  useCreateStockMutation,
  useUpdateStockMutation,
  useDeleteStockMutation,
} = stockApi;

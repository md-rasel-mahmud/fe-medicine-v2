import { baseApi } from "./base.api";
import type { ApiItemResponse, ApiListResponse, SaleType } from "./types";

export type SaleInputType = SaleType;

export const saleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSales: builder.query<ApiListResponse<SaleType>, { page?: number; limit?: number } | void>({
      query: (params) => {
        if (params?.page && params?.limit) {
          return `/sale/all?page=${params.page}&limit=${params.limit}`;
        }
        return "/sale/all";
      },
      providesTags: ["Sale"],
    }),
    getSaleById: builder.query<ApiItemResponse<SaleType>, string>({
      query: (id) => `/sale/${id}`,
      providesTags: ["Sale"],
    }),
    createSale: builder.mutation<ApiItemResponse<SaleType>, SaleInputType>({
      query: (body) => ({
        url: "/sale",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sale", "Stock"],
    }),
    updateSale: builder.mutation<
      ApiItemResponse<SaleType>,
      { id: string; body: Partial<SaleInputType> }
    >({
      query: ({ id, body }) => ({
        url: `/sale/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Sale", "Stock"],
    }),
    deleteSale: builder.mutation<ApiItemResponse<SaleType>, string>({
      query: (id) => ({
        url: `/sale/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sale", "Stock"],
    }),
  }),
});

export const {
  useGetSalesQuery,
  useGetSaleByIdQuery,
  useCreateSaleMutation,
  useUpdateSaleMutation,
  useDeleteSaleMutation,
} = saleApi;

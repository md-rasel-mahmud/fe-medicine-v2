import { baseApi } from "./base.api";
import type { ApiItemResponse, ApiListResponse, PurchaseType } from "./types";

export type PurchaseInputType = PurchaseType;

export const purchaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPurchases: builder.query<ApiListResponse<PurchaseType>, { page?: number; limit?: number } | void>({
      query: (params) => {
        if (params?.page && params?.limit) {
          return `/purchase/all?page=${params.page}&limit=${params.limit}`;
        }
        return "/purchase/all";
      },
      providesTags: ["Purchase"],
    }),
    getPurchaseById: builder.query<ApiItemResponse<PurchaseType>, string>({
      query: (id) => `/purchase/${id}`,
      providesTags: ["Purchase"],
    }),
    createPurchase: builder.mutation<
      ApiItemResponse<PurchaseType>,
      PurchaseInputType
    >({
      query: (body) => ({
        url: "/purchase",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Purchase", "Stock"],
    }),
    updatePurchase: builder.mutation<
      ApiItemResponse<PurchaseType>,
      { id: string; body: Partial<PurchaseInputType> }
    >({
      query: ({ id, body }) => ({
        url: `/purchase/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Purchase", "Stock"],
    }),
    deletePurchase: builder.mutation<ApiItemResponse<PurchaseType>, string>({
      query: (id) => ({
        url: `/purchase/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Purchase", "Stock"],
    }),
  }),
});

export const {
  useGetPurchasesQuery,
  useGetPurchaseByIdQuery,
  useCreatePurchaseMutation,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation,
} = purchaseApi;

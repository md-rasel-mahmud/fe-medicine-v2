import { baseApi } from "./base.api";
import type { ApiItemResponse, ApiListResponse, SupplierType } from "./types";

export type SupplierInputType = SupplierType;

export const supplierApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSuppliers: builder.query<ApiListResponse<SupplierType>, void>({
      query: () => "/supplier/all",
      providesTags: ["Supplier"],
    }),
    getSupplierById: builder.query<ApiItemResponse<SupplierType>, string>({
      query: (id) => `/supplier/${id}`,
      providesTags: ["Supplier"],
    }),
    createSupplier: builder.mutation<
      ApiItemResponse<SupplierType>,
      SupplierInputType
    >({
      query: (body) => ({
        url: "/supplier",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Supplier"],
    }),
    updateSupplier: builder.mutation<
      ApiItemResponse<SupplierType>,
      { id: string; body: SupplierInputType }
    >({
      query: ({ id, body }) => ({
        url: `/supplier/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Supplier"],
    }),
    deleteSupplier: builder.mutation<ApiItemResponse<SupplierType>, string>({
      query: (id) => ({
        url: `/supplier/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Supplier"],
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useGetSupplierByIdQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = supplierApi;

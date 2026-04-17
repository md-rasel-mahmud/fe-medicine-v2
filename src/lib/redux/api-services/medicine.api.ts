import { baseApi } from "./base.api";
import type { ApiItemResponse, ApiListResponse, MedicineType } from "./types";

export type MedicineInputType = MedicineType;

export const medicineApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMedicines: builder.query<
      ApiListResponse<MedicineType>,
      { page?: number; limit?: number } | void
    >({
      query: (params) => {
        if (params?.page && params?.limit) {
          return `/medicine/all?page=${params.page}&limit=${params.limit}`;
        }
        return "/medicine/all";
      },
      providesTags: ["Medicine"],
    }),
    getMedicineById: builder.query<ApiItemResponse<MedicineType>, string>({
      query: (id) => `/medicine/${id}`,
      providesTags: ["Medicine"],
    }),
    getMedicinesByIds: builder.query<ApiListResponse<MedicineType>, string[]>({
      query: (ids) => {
        const idsParam = ids.join(",");
        return `/medicine/ids?ids=${idsParam}`;
      },
      providesTags: ["Medicine"],
    }),
    createMedicine: builder.mutation<
      ApiItemResponse<MedicineType>,
      MedicineInputType
    >({
      query: (body) => ({
        url: "/medicine",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Medicine"],
    }),
    importMedicines: builder.mutation<
      ApiItemResponse<MedicineType[]>,
      { medicines: MedicineInputType[] }
    >({
      query: (body) => ({
        url: "/medicine/import",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Medicine"],
    }),
    updateMedicine: builder.mutation<
      ApiItemResponse<MedicineType>,
      { id: string; body: MedicineInputType }
    >({
      query: ({ id, body }) => ({
        url: `/medicine/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Medicine"],
    }),
    deleteMedicine: builder.mutation<ApiItemResponse<MedicineType>, string>({
      query: (id) => ({
        url: `/medicine/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Medicine"],
    }),
  }),
});

export const {
  useGetMedicinesQuery,
  useGetMedicineByIdQuery,
  useCreateMedicineMutation,
  useImportMedicinesMutation,
  useUpdateMedicineMutation,
  useDeleteMedicineMutation,
  useGetMedicinesByIdsQuery,
} = medicineApi;

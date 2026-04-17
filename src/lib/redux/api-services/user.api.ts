import { baseApi } from "./base.api";
import type { ApiItemResponse, ApiListResponse } from "./types";
import type { UserType } from "./auth/user.type";

export type UserInputType = Pick<
  UserType,
  "name" | "phone" | "email" | "address" | "role"
> & {
  password?: string;
};

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<ApiListResponse<UserType>, void>({
      query: () => "/user/all",
      providesTags: ["User"],
    }),
    getUserById: builder.query<ApiItemResponse<UserType>, string>({
      query: (id) => `/user/${id}`,
      providesTags: ["User"],
    }),
    updateUser: builder.mutation<
      ApiItemResponse<UserType>,
      { id: string; body: UserInputType }
    >({
      query: ({ id, body }) => ({
        url: `/user/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    updateUserRole: builder.mutation<
      ApiItemResponse<UserType>,
      { id: string; role: string }
    >({
      query: ({ id, role }) => ({
        url: `/user/role/${id}`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),

    approveUser: builder.mutation<
      ApiItemResponse<UserType>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/user/approve/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useUpdateUserRoleMutation,
  useApproveUserMutation,
} = userApi;

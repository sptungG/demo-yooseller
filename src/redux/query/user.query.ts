import { createApi } from "@reduxjs/toolkit/query/react";
import { TResponse } from "src/types/response.types";
import { TUpdateUser, TUser } from "src/types/user.types";
import { baseQueryWithReauth } from "../app/baseQueryWithReauth";
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users"],
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    getCurrentUser: builder.query<TResponse<TUser>, { at: boolean }>({
      query: () => "/api/services/app/UserDefault/GetDetail",
      providesTags: [{ type: "Users", id: "LIST" }],
    }),
    updateUser: builder.mutation<TResponse<any>, Partial<TUpdateUser>>({
      query: (data) => ({
        url: "/api/services/app/UserDefault/Update",
        body: data,
        method: "put",
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
  }),
});
export const { useGetCurrentUserQuery, useUpdateUserMutation } = userApi;

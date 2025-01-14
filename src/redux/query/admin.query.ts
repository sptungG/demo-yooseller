import { createApi } from "@reduxjs/toolkit/query/react";
import { TProvider, TProvidersFilter } from "src/types/provider.types";
import { TResultData } from "src/types/response.types";
import { baseQueryWithReauth } from "../app/baseQueryWithReauth";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Providers"],
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    getAllProvidersByAdmin: builder.query<TResultData<TProvider[]>, TProvidersFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/AdminProvider/GetAllProvidersByAdmin",
        method: "get",
        params: filter,
      }),
      providesTags: [{ type: "Providers", id: "LIST" }],
    }),
    // []
    updateStatusProviderByAdmin: builder.mutation<
      TResultData<boolean>,
      { id: number; formId: number }
    >({
      query: (body) => ({
        url: "/business/api/services/app/AdminProvider/UpdateStatusProviderByAdmin",
        method: "put",
        body,
      }),
      invalidatesTags: [{ type: "Providers", id: "LIST" }],
    }),
    // []
    approveProvider: builder.mutation<TResultData<boolean>, { id: number }>({
      query: (body) => ({
        url: "/business/api/services/app/AdminProvider/ApproveProvider",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Providers", id: "LIST" }],
    }),
    adminDeleteProvider: builder.mutation<TResultData<boolean>, { id: number }>({
      query: (params) => ({
        url: "/business/api/services/app/AdminProvider/DeleteProvider",
        method: "delete",
        params,
      }),
      invalidatesTags: [{ type: "Providers", id: "LIST" }],
    }),
  }),
});
export const {
  useGetAllProvidersByAdminQuery,
  useAdminDeleteProviderMutation,
  useApproveProviderMutation,
  useUpdateStatusProviderByAdminMutation,
} = adminApi;

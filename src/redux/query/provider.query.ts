import { createApi } from "@reduxjs/toolkit/query/react";
import {
  TCreateProviderData,
  TProvider,
  TProvidersFilter,
  TUpdateProviderDetailData,
} from "src/types/provider.types";
import { TResponse, TResultData } from "src/types/response.types";
import { baseQueryWithReauth } from "../app/baseQueryWithReauth";

export const providerApi = createApi({
  reducerPath: "providerApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Providers"],
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    getAllProvidersByPartner: builder.query<TResultData<TProvider[]>, TProvidersFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/Providers/GetListByPartner",
        method: "get",
        params: filter,
      }),
      providesTags: (res) =>
        !!res?.data?.length
          ? [
              ...res?.data.map(({ id }) => ({
                type: "Providers" as const,
                id,
              })),
              { type: "Providers", id: "LIST" },
            ]
          : [{ type: "Providers", id: "LIST" }],
    }),

    getProviderById: builder.query<TResultData<TProvider>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/Providers/GetById",
        method: "get",
        params: filter,
      }),
      providesTags: (result, error, { id }) => [{ type: "Providers", id: "LIST" }],
    }),
    // []
    createProvider: builder.mutation<TResponse<TResultData<boolean>>, TCreateProviderData>({
      query: (body) => ({
        url: "/business/api/services/app/Providers/Create",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Providers", id: "LIST" }],
    }),
    // []
    updateProviderDetail: builder.mutation<
      TResponse<TResultData<boolean>>,
      Partial<TUpdateProviderDetailData>
    >({
      query: (body) => ({
        url: "/business/api/services/app/Providers/Update",
        method: "put",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Providers", id: "LIST" }],
    }),
    // []
    updateStateOfProvider: builder.mutation<
      TResponse<TResultData<boolean>>,
      { id: number; state: number }
    >({
      query: (body) => ({
        url: "/business/api/services/app/Providers/UpdateState",
        method: "put",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Providers", id: "LIST" }],
    }),
    deleteProvider: builder.mutation<TResponse<TResultData<boolean>>, { id: number }>({
      query: (params) => ({
        url: "/business/api/services/app/Providers/Delete",
        method: "delete",
        params,
      }),
      invalidatesTags: [{ type: "Providers", id: "LIST" }],
    }),
  }),
});
export const {
  useGetAllProvidersByPartnerQuery,
  useCreateProviderMutation,
  useUpdateProviderDetailMutation,
  useGetProviderByIdQuery,
  useDeleteProviderMutation,
  useUpdateStateOfProviderMutation,
} = providerApi;

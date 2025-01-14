import { createApi } from "@reduxjs/toolkit/query/react";
import {
  TCreateProviderAddresses,
  TProviderAddressesFilter,
  TProviderAddressesItem,
  TUpdateProviderAddresses,
} from "src/types/addresses.type";
import { TResultData } from "src/types/response.types";
import { baseQueryWithReauth } from "../app/baseQueryWithReauth";
//const prefix = "";
export const addressApi = createApi({
  reducerPath: "addressApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["ProviderAddresses"],
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    // [ProviderAddresses]
    GetListProviderAddresses: builder.query<
      TResultData<TProviderAddressesItem[]>,
      TProviderAddressesFilter
    >({
      query: (filter) => ({
        url: "/business/api/services/app/ProviderAddresses/GetList",
        method: "get",
        params: filter,
      }),
      providesTags: (res) =>
        !!res?.data?.length
          ? [
              ...res?.data.map(({ id }) => ({
                type: "ProviderAddresses" as const,
                id,
              })),
              { type: "ProviderAddresses", id: "LIST" },
            ]
          : [{ type: "ProviderAddresses", id: "LIST" }],
    }),

    GetProviderAddressesById: builder.query<TResultData<TProviderAddressesItem>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/ProviderAddresses/GetById",
        method: "get",
        params: filter,
      }),
      providesTags: (result, error, { id }) => [{ type: "ProviderAddresses", id: "LIST" }],
    }),
    // [ProviderAddresses]
    CreateProviderAddresses: builder.mutation<TResultData<any>, TCreateProviderAddresses>({
      query: (body) => ({
        url: "/business/api/services/app/ProviderAddresses/Create",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "ProviderAddresses", id: "LIST" }],
    }),
    // [ProviderAddresses]
    UpdateProviderAddresses: builder.mutation<TResultData<any>, Partial<TUpdateProviderAddresses>>({
      query: (body) => ({
        url: "/business/api/services/app/ProviderAddresses/Update",
        method: "put",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "ProviderAddresses", id: "LIST" }],
    }),

    // [ProviderAddresses]
    DeleteProviderAddresses: builder.mutation<TResultData<any>, { id: number }>({
      query: (params) => ({
        url: "/business/api/services/app/ProviderAddresses/Delete",
        method: "delete",
        params,
      }),
      invalidatesTags: [{ type: "ProviderAddresses", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateProviderAddressesMutation,
  useDeleteProviderAddressesMutation,
  useGetProviderAddressesByIdQuery,
  useGetListProviderAddressesQuery,
  useUpdateProviderAddressesMutation,
} = addressApi;

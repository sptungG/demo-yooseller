import { createApi } from "@reduxjs/toolkit/query/react";
import {
  TCreateCustomers,
  TCustomersFilter,
  TCustomersItem,
  TUpdateCustomers,
} from "src/types/customers.types";
import { TResultData } from "src/types/response.types";
import { baseQueryWithReauth } from "../app/baseQueryWithReauth";

export const customerApi = createApi({
  reducerPath: "customersApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["OfflineCustomersAppServices"],
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    // [OfflineCustomersAppServices]
    GetListCustomers: builder.query<TResultData<TCustomersItem[]>, TCustomersFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/OfflineCustomersAppServices/GetListByPhone",
        method: "get",
        params: filter,
      }),
      providesTags: (res) =>
        !!res?.data?.length
          ? [
              ...res?.data.map(({ id }) => ({
                type: "OfflineCustomersAppServices" as const,
                id,
              })),
              { type: "OfflineCustomersAppServices", id: "LIST" },
            ]
          : [{ type: "OfflineCustomersAppServices", id: "LIST" }],
    }),

    GetCustomersById: builder.query<TResultData<TCustomersItem>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/OfflineCustomersAppServices/GetItemById",
        method: "get",
        params: filter,
      }),
      providesTags: (result, error, { id }) => [
        { type: "OfflineCustomersAppServices", id: "LIST" },
      ],
    }),
    // [OfflineCustomersAppServices]
    CreateCustomers: builder.mutation<TResultData<any>, TCreateCustomers>({
      query: (body) => ({
        url: "/business/api/services/app/OfflineCustomersAppServices/Create",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "OfflineCustomersAppServices", id: "LIST" }],
    }),
    // [OfflineCustomersAppServices]
    UpdateCustomers: builder.mutation<TResultData<any>, Partial<TUpdateCustomers>>({
      query: (body) => ({
        url: "/business/api/services/app/OfflineCustomersAppServices/Update",
        method: "put",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "OfflineCustomersAppServices", id: "LIST" },
      ],
    }),

    // [OfflineCustomersAppServices]
    DeleteCustomers: builder.mutation<TResultData<any>, { id: number }>({
      query: (body) => ({
        url: "/business/api/services/app/OfflineCustomersAppServices/Delete",
        method: "delete",
        body,
      }),
      invalidatesTags: [{ type: "OfflineCustomersAppServices", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateCustomersMutation,
  useDeleteCustomersMutation,
  useGetCustomersByIdQuery,
  useGetListCustomersQuery,
  useUpdateCustomersMutation,
} = customerApi;

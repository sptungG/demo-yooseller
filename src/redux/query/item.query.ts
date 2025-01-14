import { createApi } from "@reduxjs/toolkit/query/react";
import {
  TItem,
  TItemRate,
  TItemRateFilter,
  TItemsFilter,
  TUpdateBookingItemData,
  TUpdateItemDetailData,
  TUpdateListPriceItemModelData,
  TUpdateListStockItemModel,
} from "src/types/item.types";
import { TResultData } from "src/types/response.types";
import { baseQueryWithReauth } from "../app/baseQueryWithReauth";

export const itemApi = createApi({
  reducerPath: "itemApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Items"],
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    getAllItemsByPartner: builder.query<TResultData<TItem[]>, TItemsFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/Items/GetListByPartner",
        method: "get",
        params: filter,
      }),
      providesTags: (res) =>
        !!res?.data?.length
          ? [
              ...res?.data.map(({ id }) => ({
                type: "Items" as const,
                id,
              })),
              { type: "Items", id: "LIST" },
            ]
          : [{ type: "Items", id: "LIST" }],
    }),
    // []
    getItemById: builder.query<TResultData<TItem & { providerInfo: any }>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/Items/GetById",
        method: "get",
        params: filter,
      }),
      providesTags: (result, error, { id }) => [{ type: "Items", id: "LIST" }],
    }),
    // []
    createItem: builder.mutation<TResultData<boolean>, any>({
      query: (body) => ({
        url: "/business/api/services/app/Items/Create",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Items", id: "LIST" }],
    }),
    // []
    createItemBooking: builder.mutation<TResultData<boolean>, any>({
      query: (body) => ({
        url: "/business/api/services/app/Items/CreateBooking",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Items", id: "LIST" }],
    }),
    // []
    updateItemDetail: builder.mutation<TResultData<boolean>, Partial<TUpdateItemDetailData>>({
      query: (body) => ({
        url: "/business/api/services/app/Items/Update",
        method: "put",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Items", id: "LIST" }],
    }),
    // []
    updateItemBooking: builder.mutation<TResultData<boolean>, TUpdateBookingItemData>({
      query: (body) => ({
        url: "/business/api/services/app/Items/UpdateBooking",
        method: "put",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Items", id: "LIST" }],
    }),
    // []
    updateListStockItemModel: builder.mutation<TResultData<boolean>, TUpdateListStockItemModel>({
      query: (body) => ({
        url: "/business/api/services/app/Items/UpdateListStockItemModel",
        method: "put",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Items", id: "LIST" }],
    }),
    // []
    updateListPriceItemModel: builder.mutation<TResultData<boolean>, TUpdateListPriceItemModelData>(
      {
        query: (body) => ({
          url: "/business/api/services/app/Items/UpdateListPriceItemModel",
          method: "put",
          body,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "Items", id: "LIST" }],
      },
    ),
    // []
    showItem: builder.mutation<TResultData<boolean>, { id: number }>({
      query: (params) => ({
        url: "/business/api/services/app/Items/ShowItem",
        method: "post",
        params,
      }),
      invalidatesTags: [{ type: "Items", id: "LIST" }],
    }),
    // []
    hiddenItem: builder.mutation<TResultData<boolean>, { id: number }>({
      query: (params) => ({
        url: "/business/api/services/app/Items/HiddenItem",
        method: "post",
        params,
      }),
      invalidatesTags: [{ type: "Items", id: "LIST" }],
    }),
    // []
    deleteItem: builder.mutation<TResultData<boolean>, { id: number }>({
      query: (params) => ({
        url: "/business/api/services/app/Items/Delete",
        method: "delete",
        params,
      }),
      invalidatesTags: [{ type: "Items", id: "LIST" }],
    }),

    // [Item]
    UpdateItemStatus: builder.mutation<TResultData<boolean>, { id: number; status: number }>({
      query: (body) => ({
        url: "/business/api/services/app/Items/UpdateStatus",
        method: "put",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Items", id: "LIST" }],
    }),

    // Rate
    getAllRates: builder.query<TResultData<TItemRate[]>, TItemRateFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/Rates/GetList",
        method: "get",
        params: filter,
      }),
      providesTags: (res) =>
        !!res?.data?.length
          ? [
              ...res?.data.map(({ id }) => ({
                type: "Items" as const,
                id,
              })),
              { type: "Items", id: "LIST" },
            ]
          : [{ type: "Items", id: "LIST" }],
    }),

    createRateResponse: builder.mutation<TResultData<boolean>, any>({
      query: (body) => ({
        url: "/business/api/services/app/Rates/Response",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Items", id: "LIST" }],
    }),
  }),
});
export const {
  useCreateItemMutation,
  useUpdateItemDetailMutation,
  useGetItemByIdQuery,
  useDeleteItemMutation,
  useGetAllItemsByPartnerQuery,
  useCreateItemBookingMutation,
  useHiddenItemMutation,
  useShowItemMutation,
  useUpdateItemBookingMutation,
  useUpdateListPriceItemModelMutation,
  useUpdateListStockItemModelMutation,
  useUpdateItemStatusMutation,
  useGetAllRatesQuery,
  useCreateRateResponseMutation,
} = itemApi;

import { TConfirmPartner } from "@/types/farm.types";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  TCreateOrderData,
  TOrder,
  TOrderStatisticFilter,
  TOrdersFilter,
  TRankingItem,
  TRankingItemsFilter,
  TStatisticSomeProvidersFilter,
  TUpdateOrderDetailData,
} from "src/types/order.types";
import { TResultData } from "src/types/response.types";
import { baseQueryWithReauth } from "../app/baseQueryWithReauth";

type TStatisticSomeProviders = {
  providerId: number;
  count: number;
  revenue: number;
};

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Orders"],
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    getAllOrdersByPartner: builder.query<TResultData<TOrder[]>, TOrdersFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/Orders/GetListByPartner",
        method: "get",
        params: filter,
      }),
      providesTags: (res) =>
        !!res?.data?.length
          ? [
              ...res?.data.map(({ id }) => ({
                type: "Orders" as const,
                id,
              })),
              { type: "Orders", id: "LIST" },
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),
    // []
    getStatisticSomeProviders: builder.query<
      TResultData<{
        listCount: Record<string, number>;
        listRevenue: Record<string, number>;
      }>,
      TStatisticSomeProvidersFilter
    >({
      query: ({ listProviderId, ...filter }) => ({
        url:
          "/business/api/services/app/Orders/GetStatisticSomeProvider?" +
          (listProviderId || [])?.map((id) => `listProviderId=${id}`).join("&"),
        method: "get",
        params: filter,
      }),
      providesTags: [{ type: "Orders", id: "LIST" }],
    }),
    // []
    getStatisticOrders: builder.query<
      TResultData<{ listCount: number[]; listRevenue: number[] }>,
      TOrderStatisticFilter
    >({
      query: (filter) => ({
        url: "/business/api/services/app/Orders/GetStatistic",
        method: "get",
        params: filter,
      }),
      providesTags: [{ type: "Orders", id: "LIST" }],
    }),
    // []
    getItemRanking: builder.query<TResultData<TRankingItem[]>, TRankingItemsFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/Orders/GetItemRanking",
        method: "get",
        params: filter,
      }),
      providesTags: [{ type: "Orders", id: "LIST" }],
    }),
    // []
    getOrderById: builder.query<TResultData<TOrder>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/Orders/GetById",
        method: "get",
        params: filter,
      }),
      providesTags: (result, error, { id }) => [{ type: "Orders", id: "LIST" }],
    }),
    // []
    getOrdersCount: builder.query<
      TResultData<{
        toPay: number;
        toShip: number;
        shipping: number;
        completed: number;
        cancelled: number;
        returnRefund: number;
        itemSoldOut: number;
        itemBlocked: number;
      }>,
      { providerId: number; dateFrom?: string; dateTo?: string }
    >({
      query: (filter) => ({
        url: "/business/api/services/app/Orders/GetCount",
        method: "get",
        params: filter,
      }),
      providesTags: [{ type: "Orders", id: "LIST" }],
    }),
    // []
    createOrder: builder.mutation<TResultData<boolean>, TCreateOrderData>({
      query: (body) => ({
        url: "/business/api/services/app/Orders/Create",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
    // []
    updateOrderDetail: builder.mutation<TResultData<boolean>, Partial<TUpdateOrderDetailData>>({
      query: (body) => ({
        url: "/business/api/services/app/Orders/Update",
        method: "put",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Orders", id: "LIST" }],
    }),
    // []
    partnerConfirmOrder: builder.mutation<TResultData<boolean>, TConfirmPartner>({
      query: (body) => ({
        url: "/business/api/services/app/Orders/ConfirmByPartner",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
    // []
    partnerCancelOrder: builder.mutation<
      TResultData<boolean>,
      { id: number; typeAction: number; reason: string; urls: string[] }
    >({
      query: (body) => ({
        url: "/business/api/services/app/Orders/CancelByPartner",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
  }),
});
export const {
  useGetAllOrdersByPartnerQuery,
  useCreateOrderMutation,
  useUpdateOrderDetailMutation,
  useGetOrderByIdQuery,
  usePartnerConfirmOrderMutation,
  usePartnerCancelOrderMutation,
  useGetStatisticOrdersQuery,
  useGetItemRankingQuery,
  useGetStatisticSomeProvidersQuery,
  useGetOrdersCountQuery,
} = orderApi;

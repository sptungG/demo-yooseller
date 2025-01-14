import {
  TFlashSale,
  TFlashSaleConfig,
  TFlashSaleConfigsFilter,
  TFlashSaleItemCreateData,
  TFlashSaleItemUpdateData,
  TFlashSaleItemUpdateSaleData,
  TFlashSalesFilter,
} from "@/types/flashSale.types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { TResultData } from "src/types/response.types";
import { baseQueryWithReauth } from "../app/baseQueryWithReauth";

export const flashSaleApi = createApi({
  reducerPath: "flashSaleApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["FlashSaleItems"],
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    GetListByPartner: builder.query<TResultData<TFlashSale[]>, TFlashSalesFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/FlashSaleItems/GetListByPartner",
        method: "get",
        params: filter,
      }),
      providesTags: [{ type: "FlashSaleItems", id: "LIST" }],
    }),

    GetListConfig: builder.query<TResultData<TFlashSaleConfig[]>, Partial<TFlashSaleConfigsFilter>>(
      {
        query: (filter) => ({
          url: "/business/api/services/app/FlashSaleItems/GetListConfig",
          method: "get",
          params: filter,
        }),
        providesTags: [{ type: "FlashSaleItems", id: "LIST" }],
      },
    ),

    Create: builder.mutation<TResultData<any>, TFlashSaleItemCreateData>({
      query: (body) => ({
        url: "/business/api/services/app/FlashSaleItems/Create",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "FlashSaleItems", id: "LIST" }],
    }),
    CreateMany: builder.mutation<TResultData<any>, { items: TFlashSaleItemCreateData[] }>({
      query: (body) => ({
        url: "/business/api/services/app/FlashSaleItems/CreateMany",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "FlashSaleItems", id: "LIST" }],
    }),

    Update: builder.mutation<TResultData<any>, Partial<TFlashSaleItemUpdateData>>({
      query: (body) => ({
        url: "/business/api/services/app/FlashSaleItems/Update",
        method: "put",
        body,
      }),
      invalidatesTags: [{ type: "FlashSaleItems", id: "LIST" }],
    }),

    UpdateSale: builder.mutation<TResultData<any>, TFlashSaleItemUpdateSaleData>({
      query: (body) => ({
        url: "/business/api/services/app/FlashSaleItems/UpdateSale",
        method: "put",
        body,
      }),
      invalidatesTags: [{ type: "FlashSaleItems", id: "LIST" }],
    }),

    EndEarly: builder.mutation<TResultData<any>, { id: number }>({
      query: (body) => ({
        url: "/business/api/services/app/FlashSaleItems/EndEarly",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "FlashSaleItems", id: "LIST" }],
    }),

    Delete: builder.mutation<TResultData<any>, { id: number }>({
      query: (params) => ({
        url: "/business/api/services/app/FlashSaleItems/Delete",
        method: "delete",
        params,
      }),
      invalidatesTags: [{ type: "FlashSaleItems", id: "LIST" }],
    }),

    // DeleteMany: builder.mutation<TResultData<boolean>, { id: number }>({
    //   query: (params) => ({
    //     url: "/business/api/services/app/FlashSaleItems/DeleteMany",
    //     method: "delete",
    //     params,
    //   }),
    //   invalidatesTags: [{ type: "FlashSaleItems", id: "LIST" }],
    // }),
  }),
});

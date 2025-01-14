import { createApi } from "@reduxjs/toolkit/query/react";
import { TItemAttribute, TItemAttributeFilter } from "src/types/item.types";
import { TResultData } from "src/types/response.types";
import { baseQueryWithReauth } from "../app/baseQueryWithReauth";

export const itemAttributeApi = createApi({
  reducerPath: "itemAttributeApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["ItemAttributes"],
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    getAllItemAttributes: builder.query<TResultData<TItemAttribute[]>, TItemAttributeFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/ItemAttributes/GetList",
        method: "get",
        params: filter,
      }),
      providesTags: [{ type: "ItemAttributes", id: "LIST" }],
    }),
    // []
    getItemById: builder.query<TResultData<TItemAttribute>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/ItemAttributes/GetById",
        method: "get",
        params: filter,
      }),
      providesTags: [{ type: "ItemAttributes", id: "LIST" }],
    }),
  }),
});
export const { useGetItemByIdQuery, useGetAllItemAttributesQuery } = itemAttributeApi;

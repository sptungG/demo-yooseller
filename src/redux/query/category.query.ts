import { createApi } from "@reduxjs/toolkit/query/react";
import { TCategoriesFilter, TCategory } from "src/types/category.types";
import { TResultData } from "src/types/response.types";
import { baseQueryWithReauth } from "../app/baseQueryWithReauth";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Categories"],
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    getAllCategories: builder.query<TResultData<TCategory[]>, TCategoriesFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/Categories/GetList",
        method: "get",
        params: filter,
      }),
      providesTags: [{ type: "Categories", id: "LIST" }],
    }),
    getListCategoryFromChildren: builder.query<TResultData<TCategory[]>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/Categories/GetListFromChildren",
        method: "get",
        params: filter,
      }),
      providesTags: [{ type: "Categories", id: "LIST" }],
    }),
    getCategoryById: builder.query<TResultData<TCategory>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/Categories/GetById",
        method: "get",
        params: filter,
      }),
      providesTags: [{ type: "Categories", id: "LIST" }],
    }),
  }),
});
export const {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetListCategoryFromChildrenQuery,
} = categoryApi;

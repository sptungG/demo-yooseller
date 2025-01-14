import { createApi } from "@reduxjs/toolkit/query/react";
import {
  TCreatePageInformation,
  TCreatePartnerLink,
  TPageInformation,
  TPageTemplate,
  TPageTemplateFilter,
  TPartnerLink,
  TPartnerLinkFilter,
  TUpdatePageInformation,
  TUpdatePartnerLink,
} from "src/types/pageprivate.types";
import { TResultData } from "src/types/response.types";
import { baseQueryWithReauth } from "../app/baseQueryWithReauth";

export const pageprivateApi = createApi({
  reducerPath: "pageprivateApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["PageInformations", "PageTemplates", "PartnerLinks"],
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    // [PageTemplates]
    GetListPageTemplates: builder.query<TResultData<TPageTemplate[]>, TPageTemplateFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/PageTemplates/GetList",
        method: "get",
        params: filter,
      }),
      providesTags: (res) =>
        !!res?.data?.length
          ? [
              ...res?.data.map(({ id }) => ({
                type: "PageTemplates" as const,
                id,
              })),
              { type: "PageTemplates", id: "LIST" },
            ]
          : [{ type: "PageTemplates", id: "LIST" }],
    }),
    // [PageInformations]
    GetPageInformationsById: builder.query<TResultData<TPageInformation>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/PageInformations/GetItemById",
        method: "get",
        params: filter,
      }),
      providesTags: (result, error, { id }) => [{ type: "PageInformations", id: "LIST" }],
    }),
    // [PageInformations]
    GetPageInformationsByProviderId: builder.query<
      TResultData<TPageInformation>,
      { providerId: number }
    >({
      query: (filter) => ({
        url: "/business/api/services/app/PageInformations/GetByProviderId",
        method: "get",
        params: filter,
      }),
      providesTags: () => [{ type: "PageInformations", id: "LIST" }],
    }),
    // [PageInformations]
    CreatePageInformations: builder.mutation<TResultData<any>, TCreatePageInformation>({
      query: (body) => ({
        url: "/business/api/services/app/PageInformations/Create",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "PageInformations", id: "LIST" }],
    }),
    // [PageInformations]
    UpdatePageInformations: builder.mutation<TResultData<any>, Partial<TUpdatePageInformation>>({
      query: (body) => ({
        url: "/business/api/services/app/PageInformations/Update",
        method: "put",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PageInformations", id: "LIST" }],
    }),
    // [PageInformations]
    UpdateStatusPageInformations: builder.mutation<
      TResultData<any>,
      Partial<{ id: number; status: number }>
    >({
      query: (body) => ({
        url: "/business/api/services/app/PageInformations/UpdateStatus",
        method: "put",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PageInformations", id: "LIST" }],
    }),

    // [PageInformations]
    DeletePageInformations: builder.mutation<TResultData<any>, { id: number }>({
      query: (body) => ({
        url: "/business/api/services/app/PageInformations/Delete",
        method: "delete",
        body,
      }),
      invalidatesTags: [{ type: "PageInformations", id: "LIST" }],
    }),

    // [PartnerLinks]
    GetListPartnerLinks: builder.query<TResultData<TPartnerLink[]>, TPartnerLinkFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/PartnerLinks/GetList",
        method: "get",
        params: filter,
      }),
      providesTags: (res) =>
        !!res?.data?.length
          ? [
              ...res?.data.map(({ id }) => ({
                type: "PartnerLinks" as const,
                id,
              })),
              { type: "PartnerLinks", id: "LIST" },
            ]
          : [{ type: "PartnerLinks", id: "LIST" }],
    }),
    // [PartnerLinks]
    GetPartnerLinksById: builder.query<TResultData<TPartnerLink>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/PartnerLinks/GetItemById",
        method: "get",
        params: filter,
      }),
      providesTags: (result, error, { id }) => [{ type: "PartnerLinks", id: "LIST" }],
    }),

    // [PartnerLinks]
    CreatePartnerLinks: builder.mutation<TResultData<any>, TCreatePartnerLink>({
      query: (body) => ({
        url: "/business/api/services/app/PartnerLinks/Create",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "PartnerLinks", id: "LIST" }],
    }),
    // [PartnerLinks]
    UpdatePartnerLinks: builder.mutation<TResultData<any>, Partial<TUpdatePartnerLink>>({
      query: (body) => ({
        url: "/business/api/services/app/PartnerLinks/Update",
        method: "put",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PartnerLinks", id: "LIST" }],
    }),

    UpdateStatusPartnerLinks: builder.mutation<
      TResultData<any>,
      Partial<{ status: number; id: number }>
    >({
      query: (body) => ({
        url: "/business/api/services/app/PartnerLinks/UpdateStatus",
        method: "put",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PartnerLinks", id: "LIST" }],
    }),

    // [PartnerLinks]
    DeletePartnerLinks: builder.mutation<TResultData<any>, { id: number }>({
      query: (params) => ({
        url: "/business/api/services/app/PartnerLinks/Delete",
        method: "delete",
        params,
      }),
      invalidatesTags: [{ type: "PartnerLinks", id: "LIST" }],
    }),
  }),
});

export const {
  useCreatePageInformationsMutation,
  useDeletePageInformationsMutation,
  useGetPageInformationsByIdQuery,
  useGetPageInformationsByProviderIdQuery,
  useGetListPageTemplatesQuery,
  useUpdatePageInformationsMutation,
  useUpdateStatusPageInformationsMutation,

  useCreatePartnerLinksMutation,
  useDeletePartnerLinksMutation,
  useGetPartnerLinksByIdQuery,
  useGetListPartnerLinksQuery,
  useUpdatePartnerLinksMutation,
  useUpdateStatusPartnerLinksMutation,
} = pageprivateApi;

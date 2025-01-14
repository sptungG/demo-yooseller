import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
const baseQueryWithRetry = retry(
  fetchBaseQuery({
    baseUrl: "https://imaxtek.s3.ap-southeast-1.amazonaws.com",
  }),
  { maxRetries: 0 },
);

export const providerTypeApi = createApi({
  reducerPath: "providerTypeApi",
  baseQuery: baseQueryWithRetry,
  tagTypes: ["Types"],
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    getProviderTypes: builder.query<
      { label: string; value: number; type: number }[],
      { locale?: string }
    >({
      query: (filter) => {
        let url = "/assets/ProviderServiceType.json";
        if (filter.locale === "en") {
          url = "/assets/ProviderServiceType.json";
        }
        if (filter.locale === "ko") {
          url = "/assets/ProviderServiceType.json";
        }
        return {
          url,
          responseHandler: (response) => response.json(),
        };
      },
      providesTags: [{ type: "Types", id: "LIST" }],
    }),
    getFarmProviderTypes: builder.query<
      { label: string; value: number; type: number }[],
      { locale?: string }
    >({
      query: (filter) => {
        let url = "/assets/ProviderServiceType.json";
        if (filter.locale === "en") {
          url = "/assets/TypeOfProvider.json";
        }
        if (filter.locale === "ko") {
          url = "/assets/TypeOfProvider_KO.json";
        }
        return {
          url,
          responseHandler: (response) => response.json(),
        };
      },
      providesTags: [{ type: "Types", id: "LIST" }],
    }),
  }),
});
export const { useGetProviderTypesQuery, useGetFarmProviderTypesQuery } = providerTypeApi;

import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { DEFAULT_POSITION } from "src/configs/constant.config";

// https://nominatim.org/release-docs/develop/api/Reverse/
const baseQueryWithRetry = retry(
  fetchBaseQuery({
    baseUrl: "https://nominatim.openstreetmap.org",
    headers: { "Accept-Language": "vi-VI" },
  }),
  { maxRetries: 0 },
);

type TReverseGeocodingRes = {
  place_id: string;
  licence: string;
  osm_type: string;
  osm_id: string;
  lat: string;
  lon: string;
  place_rank: string;
  category: string;
  type: string;
  importance: string;
  addresstype: string;
  display_name: string;
  name: string;
  address: any;
  boundingbox: string[];
};

export const nominatimApi = createApi({
  reducerPath: "nominatimApi",
  baseQuery: baseQueryWithRetry,
  tagTypes: ["ReverseGeocoding"],
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    getReverseGeocoding: builder.query<TReverseGeocodingRes, { lat?: number; lng?: number }>({
      query: ({ lat = DEFAULT_POSITION.lat, lng = DEFAULT_POSITION.lng }) => ({
        url: "/reverse",
        params: { lat, lon: lng, format: "jsonv2" },
      }),
      providesTags: ["ReverseGeocoding"],
    }),
    reverseGeocoding: builder.mutation<TReverseGeocodingRes, { lat?: number; lng?: number }>({
      query: ({ lat = DEFAULT_POSITION.lat, lng = DEFAULT_POSITION.lng }) => ({
        url: "/reverse",
        method: "get",
        params: { lat, lon: lng, format: "jsonv2" },
      }),
      invalidatesTags: ["ReverseGeocoding"],
    }),
  }),
});
export const { useGetReverseGeocodingQuery, useReverseGeocodingMutation } = nominatimApi;

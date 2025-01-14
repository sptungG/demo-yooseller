import { fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import queryString from "query-string";
import { RootState } from "../store";

export const baseQuery = retry(
  fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_ENDPOINT as string,
    prepareHeaders: (headers, { getState }) => {
      //  By default, if we have a token in the store, let's use that for authenticated requests
      const at = (getState() as RootState).auth.accessToken;
      if (at) {
        headers.set("Authorization", `Bearer ${at}`);
      }
      return headers;
    },
    validateStatus: (response, result) => response.status === 200,
    paramsSerializer: (params) =>
      queryString.stringify(params, { skipNull: true, skipEmptyString: true }),
  }),
  { maxRetries: 0 },
);

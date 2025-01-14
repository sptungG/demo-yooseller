import { createApi } from "@reduxjs/toolkit/query/react";
import { TResponse, TResultData } from "src/types/response.types";
import { baseQuery } from "../app/baseQuery";

export const imageApi = createApi({
  reducerPath: "imageApi",
  baseQuery: baseQuery,
  tagTypes: ["Images"],
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    uploadListImage: builder.mutation<TResponse<TResultData<string[]>>, { files: File[] }>({
      query: ({ files }) => {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("files", file);
        });
        return { url: "/UploadBatchImage", method: "post", body: formData };
      },
      invalidatesTags: [{ type: "Images", id: "LIST" }],
    }),
    uploadImage: builder.mutation<TResponse<TResultData<string>>, { file: File }>({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return { url: "/UploadOneImage", method: "post", body: formData };
      },
      invalidatesTags: [{ type: "Images", id: "LIST" }],
    }),
  }),
});
export const { useUploadListImageMutation, useUploadImageMutation } = imageApi;

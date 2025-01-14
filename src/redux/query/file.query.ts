import { createApi } from "@reduxjs/toolkit/query/react";
import { TResponse, TResultData } from "../../types/response.types";
import { baseQuery } from "../app/baseQuery";

export const fileApi = createApi({
  reducerPath: "fileApi",
  baseQuery: baseQuery,
  tagTypes: ["Files"],
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    uploadListFile: builder.mutation<TResponse<TResultData<string[]>>, { files: File[] }>({
      query: ({ files }) => {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("files", file);
        });
        return { url: "/UploadBatchFile", method: "post", body: formData };
      },
      invalidatesTags: [{ type: "Files", id: "LIST" }],
    }),
    uploadFile: builder.mutation<TResponse<TResultData<string>>, { file: File }>({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return { url: "/UploadOneFile", method: "post", body: formData };
      },
      invalidatesTags: [{ type: "Files", id: "LIST" }],
    }),
  }),
});
export const { useUploadFileMutation, useUploadListFileMutation } = fileApi;

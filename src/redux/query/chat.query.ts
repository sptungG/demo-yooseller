import { createApi } from "@reduxjs/toolkit/query/react";
import { TCustomer, TMessage, TMessagesFilter } from "src/types/chat.types";
import { TResponse, TResultData } from "src/types/response.types";
import { baseQueryWithReauth } from "../app/baseQueryWithReauth";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Messages", "Conversations"],
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    getBusinessChatMessages: builder.query<TResponse<TResultData<TMessage[]>>, TMessagesFilter>({
      query: (filter) => ({
        url: "/api/services/app/ProviderBusinessChat/GetBusinessChatMessages",
        method: "get",
        params: filter,
      }),
      providesTags: [{ type: "Messages", id: "LIST" }],
    }),
    getUserFriendshipChats: builder.query<
      TResponse<TResultData<TCustomer[]>>,
      { providerId?: number }
    >({
      query: (filter) => ({
        url: "/api/services/app/ProviderBusinessChat/GetUserFriendshipChats",
        method: "get",
        params: filter,
      }),
      providesTags: [{ type: "Conversations", id: "LIST" }],
    }),
    // searchUserMessageByKeyword: builder.mutation<
    //   TResponse<TResultData<TMessage[]>>,
    //   { keyword?: string; maxResultCount?: number; skipCount?: number }
    // >({
    //   query: (filter) => ({
    //     url: "/api/services/app/Chat/SearchUserMessageByKeyword",
    //     method: "post",
    //     params: filter,
    //   }),
    //   invalidatesTags: [{ type: "Messages", id: "LIST" }],
    // }),
    getCountMessageUnreadUser: builder.query<TResponse<TResultData<any>>, any>({
      query: (filter) => ({
        url: "/api/services/app/Chat/CountMessageUnreadUser",
        method: "post",
        params: filter,
      }),
      providesTags: [{ type: "Messages", id: "LIST" }],
    }),
    countMessageUnreadUser: builder.mutation<TResponse<TResultData<any>>, any>({
      query: (filter) => ({
        url: "​/api/services/app/Chat/CountMessageUnreadUser",
        method: "post",
        params: filter,
      }),
      invalidatesTags: [{ type: "Messages", id: "LIST" }],
    }),
  }),
});
export const {
  useGetBusinessChatMessagesQuery,
  useGetUserFriendshipChatsQuery,
  useCountMessageUnreadUserMutation,
  useGetCountMessageUnreadUserQuery,
} = chatApi;

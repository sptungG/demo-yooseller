import { createApi } from "@reduxjs/toolkit/query/react";
import {
  TNotification,
  TNotificationItem,
  TNotificationSetting,
  TNotificationSettingUpdate,
  TNotificationsFilter,
} from "src/types/notification.types";
import { TResponse, TResultData } from "src/types/response.types";
import { baseQueryWithReauth } from "../app/baseQueryWithReauth";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Notifications"],
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    getUserNotifications: builder.query<
      TResponse<TResultData<{ totalUnread: number; totalCount: number; items: TNotification[] }>>,
      TNotificationsFilter
    >({
      query: (filter) => ({
        url: "/api/services/app/NotificationNew/GetAllNotifications",
        method: "get",
        params: filter,
      }),
      providesTags: [{ type: "Notifications", id: "LIST" }],
    }),
    getNotificationSettings: builder.query<TResponse<TNotificationSetting>, any>({
      query: (filter) => ({
        url: "​/api​/services​/app​/NotificationNew​/GetNotificationSettings",
        method: "get",
        params: filter,
      }),
      providesTags: [{ type: "Notifications", id: "LIST" }],
    }),
    setAllNotificationsAsRead: builder.mutation<TResponse<TResultData<any>>, any>({
      query: (filter) => ({
        url: "/api/services/app/NotificationNew/SetAllNotificationsAsReadNew",
        method: "post",
        params: filter,
      }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),
    setNotificationAsRead: builder.mutation<TResponse<TResultData<any>>, { id?: string }>({
      query: (filter) => ({
        url: "/api/services/app/NotificationNew/SetNotificationAsReadNew",
        method: "post",
        body: filter,
      }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),
    updateNotificationSettings: builder.mutation<TResponse<any>, TNotificationSettingUpdate>({
      query: (filter) => ({
        url: "/api/services/app/NotificationNew/UpdateNotificationSettings",
        method: "put",
        body: filter,
      }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),

    getListNotifications: builder.query<TResultData<TNotificationItem[]>, TNotificationsFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/Notifications/GetList",
        method: "get",
        params: filter,
      }),
      providesTags: [{ type: "Notifications", id: "LIST" }],
    }),

    getCountNotifications: builder.query<
      TResultData<{ totalCount: number; totalUnread: number }>,
      TNotificationsFilter
    >({
      query: (filter) => ({
        url: "/business/api/services/app/Notifications/GetCount",
        method: "get",
        params: filter,
      }),
      providesTags: [{ type: "Notifications", id: "LIST" }],
    }),

    setAsReadNotifications: builder.mutation<TResultData<any>, { id: string }>({
      query: (body) => ({
        url: "/business/api/services/app/Notifications/SetAsRead",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),

    setAllAsReadNotifications: builder.mutation<TResultData<any>, TNotificationsFilter>({
      query: (body) => ({
        url: "/business/api/services/app/Notifications/SetAllAsRead",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),

    setAsUnReadNotifications: builder.mutation<TResultData<any>, { id: string }>({
      query: (body) => ({
        url: "/business/api/services/app/Notifications/SetAsUnRead",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),

    deleteNotification: builder.mutation<TResultData<any>, { id: string }>({
      query: (filter) => ({
        url: "/business/api/services/app/Notifications/Delete",
        method: "delete",
        params: filter,
      }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),
    deleteAllNotifications: builder.mutation<TResultData<any>, TNotificationsFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/Notifications/DeleteAll",
        method: "delete",
        params: filter,
      }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),
  }),
});
export const {
  useGetUserNotificationsQuery,
  useSetNotificationAsReadMutation,
  useGetNotificationSettingsQuery,
  useSetAllNotificationsAsReadMutation,
  useUpdateNotificationSettingsMutation,
  //New
  useGetListNotificationsQuery,
  useGetCountNotificationsQuery,
  useSetAsReadNotificationsMutation,
  useSetAllAsReadNotificationsMutation,
  useSetAsUnReadNotificationsMutation,
  useDeleteAllNotificationsMutation,
  useDeleteNotificationMutation,
} = notificationApi;

import { createApi } from "@reduxjs/toolkit/query/react";
import {
  TBooking,
  TBookingsFilter,
  TCreateBookingData,
  TUpdateBookingDetailData,
} from "src/types/booking.types";
import { TResponse, TResultData } from "src/types/response.types";
import { baseQueryWithReauth } from "../app/baseQueryWithReauth";

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Bookings"],
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    getAllBookingsByPartner: builder.query<TResponse<TResultData<TBooking[]>>, TBookingsFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/Booking/GetAllBookingsByPartner",
        method: "get",
        params: filter,
      }),
      providesTags: (res) =>
        !!res?.result.data?.length
          ? [
              ...res?.result.data.map(({ id }) => ({
                type: "Bookings" as const,
                id,
              })),
              { type: "Bookings", id: "LIST" },
            ]
          : [{ type: "Bookings", id: "LIST" }],
    }),
    // []
    getBookingById: builder.query<TResponse<TResultData<TBooking>>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/Booking/GetBookingById",
        method: "get",
        params: filter,
      }),
      providesTags: (result, error, { id }) => [{ type: "Bookings", id: "LIST" }],
    }),
    // []
    createBooking: builder.mutation<TResponse<TResultData<boolean>>, TCreateBookingData>({
      query: (body) => ({
        url: "/business/api/services/app/Booking/CreateBooking",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Bookings", id: "LIST" }],
    }),
    // []
    updateBookingDetail: builder.mutation<
      TResponse<TResultData<boolean>>,
      Partial<TUpdateBookingDetailData>
    >({
      query: (body) => ({
        url: "/business/api/services/app/Booking/UpdateBooking",
        method: "put",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Bookings", id: "LIST" }],
    }),
    // []
    confirmBookingPartner: builder.mutation<
      TResponse<TResultData<boolean>>,
      { id: number; type: number }
    >({
      query: (body) => ({
        url: "/business/api/services/app/Booking/PartnerConfirmBooking",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Bookings", id: "LIST" }],
    }),
    // []
    refuseBookingPartner: builder.mutation<
      TResponse<TResultData<boolean>>,
      { id: number; type: number }
    >({
      query: (body) => ({
        url: "/business/api/services/app/Booking/PartnerConfirmBooking",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Bookings", id: "LIST" }],
    }),
    // []
    cancelBookingPartner: builder.mutation<
      TResponse<TResultData<boolean>>,
      { id: number; reason: string }
    >({
      query: (body) => ({
        url: "/business/api/services/app/Booking/PartnerCancelBooking",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Bookings", id: "LIST" }],
    }),
    // []
    deleteBooking: builder.mutation<TResponse<TResultData<boolean>>, { id: number }>({
      query: (params) => ({
        url: "/business/api/services/app/Booking/DeleteBooking",
        method: "delete",
        params,
      }),
      invalidatesTags: [{ type: "Bookings", id: "LIST" }],
    }),
  }),
});
export const {
  useCreateBookingMutation,
  useUpdateBookingDetailMutation,
  useGetBookingByIdQuery,
  useDeleteBookingMutation,
  useGetAllBookingsByPartnerQuery,
  useCancelBookingPartnerMutation,
  useConfirmBookingPartnerMutation,
  useRefuseBookingPartnerMutation,
} = bookingApi;

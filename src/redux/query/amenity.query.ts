import {
  TAmenitiesAttributesFilter,
  TAmenitiesBooking,
  TAmenitiesBookingFilter,
  TAmenitiesCombo,
  TAmenitiesComboFilter,
  TAmenitiesFilter,
  TAmenitiesGroup,
  TAmenitiesGroupFilter,
  TAmenity,
  TAmenityAttribute,
  TCreateAmenitiesCombo,
  TCreateAmenitiesGroup,
  TCreateAmenityData,
  TUpdateAmenitiesCombo,
  TUpdateAmenitiesGroup,
  TUpdateAmenityData,
  TUpdateStateBooking,
} from "@/types/amenity.types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { TResultData } from "src/types/response.types";
import { baseQueryWithReauth } from "../app/baseQueryWithReauth";

export const amenityApi = createApi({
  reducerPath: "amenityApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Amenities"],
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    getAllAmenitiesItems: builder.query<TResultData<TAmenity[]>, TAmenitiesFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/AmenitiesItem/GetAll",
        method: "get",
        params: filter,
      }),
      providesTags: (res) =>
        !!res?.data?.length
          ? [
              ...res?.data.map(({ id }) => ({
                type: "Amenities" as const,
                id,
              })),
              { type: "Amenities", id: "LIST" },
            ]
          : [{ type: "Amenities", id: "LIST" }],
    }),

    getAllAmenitiesAttributes: builder.query<
      TResultData<TAmenityAttribute[]>,
      TAmenitiesAttributesFilter
    >({
      query: (filter) => ({
        url: "/business/api/services/app/ProviderAmenitiesAttribute/GetByBusinessType",
        method: "get",
        params: filter,
      }),
      providesTags: (res) =>
        !!res?.data?.length
          ? [
              ...res?.data.map(({ id }) => ({
                type: "Amenities" as const,
                id,
              })),
              { type: "Amenities", id: "LIST" },
            ]
          : [{ type: "Amenities", id: "LIST" }],
    }),

    getAmenityItem: builder.query<TResultData<TAmenity>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/AmenitiesItem/Get",
        method: "get",
        params: filter,
      }),
      providesTags: (data, error, { id }) => [{ type: "Amenities", id }],
    }),

    createAmenityItem: builder.mutation<TResultData<boolean>, TCreateAmenityData>({
      query: (body) => ({
        url: "/business/api/services/app/AmenitiesItem/Create",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Amenities", id: "LIST" }],
    }),

    updateAmenityItem: builder.mutation<TResultData<boolean>, Partial<TUpdateAmenityData>>({
      query: (body) => ({
        url: "/business/api/services/app/AmenitiesItem/Update",
        method: "put",
        body,
      }),
      invalidatesTags: (data, error, { id }) => [{ type: "Amenities", id }],
    }),

    deleteAmenityItem: builder.mutation<TResultData<boolean>, { id: number }>({
      query: (params) => ({
        url: "/business/api/services/app/AmenitiesItem/Delete",
        method: "delete",
        params,
      }),
      invalidatesTags: [{ type: "Amenities", id: "LIST" }],
    }),

    // Amenities Group
    createAmenitiesGroup: builder.mutation<TResultData<boolean>, TCreateAmenitiesGroup>({
      query: (body) => ({
        url: "/business/api/services/app/AmenitiesGroup/Create",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Amenities", id: "LIST" }],
    }),

    updateAmenitiesGroup: builder.mutation<TResultData<boolean>, Partial<TUpdateAmenitiesGroup>>({
      query: (body) => ({
        url: "/business/api/services/app/AmenitiesGroup/Update",
        method: "put",
        body,
      }),
      invalidatesTags: (data, error, { id }) => [{ type: "Amenities", id }],
    }),

    deleteAmenitiesGroup: builder.mutation<TResultData<boolean>, { id: number }>({
      query: (params) => ({
        url: "/business/api/services/app/AmenitiesGroup/Delete",
        method: "delete",
        params,
      }),
      invalidatesTags: [{ type: "Amenities", id: "LIST" }],
    }),

    getAllAmenitiesGroups: builder.query<TResultData<TAmenitiesGroup[]>, TAmenitiesGroupFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/AmenitiesGroup/GetAll",
        method: "get",
        params: filter,
      }),
      providesTags: (res) =>
        !!res?.data?.length
          ? [
              ...res?.data.map(({ id }) => ({
                type: "Amenities" as const,
                id,
              })),
              { type: "Amenities", id: "LIST" },
            ]
          : [{ type: "Amenities", id: "LIST" }],
    }),

    getAmenitiesGroupById: builder.query<TResultData<TAmenitiesGroup>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/AmenitiesGroup/Get",
        method: "get",
        params: filter,
      }),
      providesTags: (data, error, { id }) => [{ type: "Amenities", id }],
    }),

    // Amenities Combo
    createAmenitiesCombo: builder.mutation<TResultData<boolean>, TCreateAmenitiesCombo>({
      query: (body) => ({
        url: "/business/api/services/app/AmenitiesCombo/Create",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Amenities", id: "LIST" }],
    }),

    updateAmenitiesCombo: builder.mutation<TResultData<boolean>, Partial<TUpdateAmenitiesCombo>>({
      query: (body) => ({
        url: "/business/api/services/app/AmenitiesCombo/Update",
        method: "put",
        body,
      }),
      invalidatesTags: (data, error, { id }) => [{ type: "Amenities", id }],
    }),

    deleteAmenitiesCombo: builder.mutation<TResultData<boolean>, { id: number }>({
      query: (params) => ({
        url: "/business/api/services/app/AmenitiesCombo/Delete",
        method: "delete",
        params,
      }),
      invalidatesTags: [{ type: "Amenities", id: "LIST" }],
    }),

    getAllAmenitiesCombos: builder.query<TResultData<TAmenitiesCombo[]>, TAmenitiesComboFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/AmenitiesCombo/GetAll",
        method: "get",
        params: filter,
      }),
      providesTags: (res) =>
        !!res?.data?.length
          ? [
              ...res?.data.map(({ id }) => ({
                type: "Amenities" as const,
                id,
              })),
              { type: "Amenities", id: "LIST" },
            ]
          : [{ type: "Amenities", id: "LIST" }],
    }),

    getAmenitiesComboById: builder.query<TResultData<TAmenitiesCombo>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/AmenitiesCombo/Get",
        method: "get",
        params: filter,
      }),
      providesTags: (data, error, { id }) => [{ type: "Amenities", id }],
    }),

    // Amenities Booking
    getAllAmenitiesBooking: builder.query<
      TResultData<TAmenitiesBooking[]>,
      TAmenitiesBookingFilter
    >({
      query: (filter) => ({
        url: "/business/api/services/app/ProviderAmenitiesBooking/GetAll",
        method: "get",
        params: filter,
      }),
      providesTags: (res) =>
        !!res?.data?.length
          ? [
              ...res?.data.map(({ id }) => ({
                type: "Amenities" as const,
                id,
              })),
              { type: "Amenities", id: "LIST" },
            ]
          : [{ type: "Amenities", id: "LIST" }],
    }),

    getAmenitiesBookingById: builder.query<TResultData<TAmenitiesBooking>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/ProviderAmenitiesBooking/GetById",
        method: "get",
        params: filter,
      }),
      providesTags: (data, error, { id }) => [{ type: "Amenities", id }],
    }),

    updateStateBooking: builder.mutation<TResultData<boolean>, Partial<TUpdateStateBooking>>({
      query: (body) => ({
        url: "/business/api/services/app/ProviderAmenitiesBooking/UpdateStateBooking",
        method: "put",
        body,
      }),
      invalidatesTags: (data, error, { id }) => [{ type: "Amenities", id }],
    }),
  }),
});
export const {
  useGetAllAmenitiesItemsQuery,
  useGetAllAmenitiesAttributesQuery,
  useGetAmenityItemQuery,
  useCreateAmenityItemMutation,
  useDeleteAmenityItemMutation,
  useUpdateAmenityItemMutation,

  useGetAllAmenitiesGroupsQuery,
  useGetAmenitiesGroupByIdQuery,
  useCreateAmenitiesGroupMutation,
  useUpdateAmenitiesGroupMutation,
  useDeleteAmenitiesGroupMutation,

  useGetAllAmenitiesCombosQuery,
  useGetAmenitiesComboByIdQuery,
  useCreateAmenitiesComboMutation,
  useUpdateAmenitiesComboMutation,
  useDeleteAmenitiesComboMutation,

  useGetAllAmenitiesBookingQuery,
  useGetAmenitiesBookingByIdQuery,
  useUpdateStateBookingMutation,
} = amenityApi;

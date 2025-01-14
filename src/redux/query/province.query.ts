import { createApi } from "@reduxjs/toolkit/query/react";
import { TResponse } from "src/types/response.types";
import { baseQuery } from "../app/baseQuery";

type TProvince = {
  code: string;
  name: string;
  nameEn: string;
  fullName: string;
  fullNameEn: string;
  codeName: string;
  administrativeRegionId: number;
  administrativeUnitId: number;
};
type TDistrict = {
  code: string;
  name: string;
  nameEn: string;
  fullName: string;
  fullNameEn: string;
  codeName: string;
  provinceCode: string;
  administrativeUnitId: number;
};
type TWard = {
  code: string;
  name: string;
  nameEn: string;
  fullName: string;
  fullNameEn: string;
  codeName: string;
  districtCode: string;
  administrativeUnitId: number;
};

export const provincesApi = createApi({
  reducerPath: "provincesApi",
  baseQuery: baseQuery,
  tagTypes: ["Provinces", "Districts", "Wards"],
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    getProvinces: builder.query<TResponse<TProvince[]>, any>({
      query: () => `/api/services/app/VietnameseAdministrative/GetAllProvinces`,
      providesTags: ["Provinces"],
    }),
    getDistricts: builder.query<TResponse<TDistrict[]>, string | number | undefined>({
      query: (pcode) =>
        `/api/services/app/VietnameseAdministrative/GetAllDistricts?provinceCode=${pcode}`,
      providesTags: ["Districts"],
    }),
    getWards: builder.query<TResponse<TWard[]>, string | number | undefined>({
      query: (dcode) =>
        `/api/services/app/VietnameseAdministrative/GetAllWards?districtCode=${dcode}`,
      providesTags: ["Wards"],
    }),
    mutateGetProvinces: builder.mutation<TResponse<TProvince[]>, any>({
      query: () => ({
        url: `/api/services/app/VietnameseAdministrative/GetAllProvinces`,
        method: "GET",
      }),
      invalidatesTags: ["Provinces"],
    }),
    mutateGetDistricts: builder.mutation<TResponse<TDistrict[]>, string | number | undefined>({
      query: (pcode) => ({
        url: `/api/services/app/VietnameseAdministrative/GetAllDistricts?provinceCode=${pcode}`,
        method: "GET",
      }),
      invalidatesTags: ["Districts"],
    }),
    mutateGetWards: builder.mutation<TResponse<TWard[]>, string | number | undefined>({
      query: (dcode) => ({
        url: `/api/services/app/VietnameseAdministrative/GetAllWards?districtCode=${dcode}`,
        method: "GET",
      }),
      invalidatesTags: ["Wards"],
    }),
  }),
});
export const {
  useGetProvincesQuery,
  useGetDistrictsQuery,
  useGetWardsQuery,
  useMutateGetDistrictsMutation,
  useMutateGetProvincesMutation,
  useMutateGetWardsMutation,
} = provincesApi;

import {
  TCreateVoucherData,
  TUpdateVoucherData,
  TVoucher,
  TVouchersFilter,
} from "@/types/voucher.types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { TResultData } from "src/types/response.types";
import { baseQueryWithReauth } from "../app/baseQueryWithReauth";

export const voucherApi = createApi({
  reducerPath: "voucherApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Vouchers"],
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    getAllVouchers: builder.query<TResultData<TVoucher[]>, TVouchersFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/Vouchers/GetListByPartner",
        method: "get",
        params: filter,
      }),
      providesTags: (res) =>
        !!res?.data?.length
          ? [
              ...res?.data.map(({ id }) => ({
                type: "Vouchers" as const,
                id,
              })),
              { type: "Vouchers", id: "LIST" },
            ]
          : [{ type: "Vouchers", id: "LIST" }],
    }),

    getVoucherById: builder.query<TResultData<TVoucher>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/Vouchers/GetById",
        method: "get",
        params: filter,
      }),
      providesTags: (data, error, { id }) => [{ type: "Vouchers", id: "LIST" }],
    }),

    createVoucher: builder.mutation<TResultData<boolean>, TCreateVoucherData>({
      query: (body) => ({
        url: "/business/api/services/app/Vouchers/Create",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Vouchers", id: "LIST" }],
    }),

    updateVoucher: builder.mutation<TResultData<boolean>, Partial<TUpdateVoucherData>>({
      query: (body) => ({
        url: "/business/api/services/app/Vouchers/Update",
        method: "put",
        body,
      }),
      invalidatesTags: (data, error, { id }) => [{ type: "Vouchers", id: "LIST" }],
    }),

    deleteVoucher: builder.mutation<TResultData<boolean>, { id: number }>({
      query: (params) => ({
        url: "/business/api/services/app/Vouchers/Delete",
        method: "delete",
        params,
      }),
      invalidatesTags: [{ type: "Vouchers", id: "LIST" }],
    }),

    StartEarly: builder.mutation<TResultData<boolean>, { id: number }>({
      query: (params) => ({
        url: "/business/api/services/app/Vouchers/StartEarly",
        method: "post",
        body: params,
      }),
      invalidatesTags: [{ type: "Vouchers", id: "LIST" }],
    }),

    EndEarly: builder.mutation<TResultData<boolean>, { id: number }>({
      query: (params) => ({
        url: "/business/api/services/app/Vouchers/EndEarly",
        method: "post",
        body: params,
      }),
      invalidatesTags: [{ type: "Vouchers", id: "LIST" }],
    }),
  }),
});
export const {
  useGetAllVouchersQuery,
  useGetVoucherByIdQuery,
  useCreateVoucherMutation,
  useDeleteVoucherMutation,
  useUpdateVoucherMutation,
  useEndEarlyMutation,
  useStartEarlyMutation,
} = voucherApi;

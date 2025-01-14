import {
  TOrderStatisticFilter,
  TRankingItemsFilter,
  TStatisticSomeProvidersFilter,
} from "@/types/order.types";
import { createApi } from "@reduxjs/toolkit/query/react";
import queryString from "query-string";
import {
  TCategoriesFilter,
  TCategory,
  TConfirmPartner,
  TCreateEcofarmPaymentData,
  TCreateItemData,
  TCreatePackageActivityData,
  TCreatePackageData,
  TCreateProviderEcofarmData,
  TCreateRegisterData,
  TCreateVoucher,
  TItemAttribute,
  TItemAttributeFilter,
  TItemsFilter,
  TItemsItem,
  TOrdersFilter,
  TOrdersItem,
  TPackageActivitiesFilter,
  TPackageActivity,
  TPackageDetail,
  TPackageFilter,
  TPackageItem,
  TProviderEcofarmDetail,
  TProviderEcofarmFilter,
  TProviderEcofarmItem,
  TRegisterDetail,
  TRegisterFilter,
  TRegisterItem,
  TUpdateEcofarmPackageActivityData,
  TUpdateItemsDetailData,
  TUpdatePackageDetailData,
  TUpdateProviderEcofarmDetailData,
  TUpdateRegisterDetailData,
  TUpdateVoucher,
  TVoucherFilter,
  TVoucherItem,
} from "src/types/farm.types";
import { TResultData } from "src/types/response.types";
import { baseQueryWithReauth } from "../app/baseQueryWithReauth";
//const prefix = "";
export const farmApi = createApi({
  reducerPath: "farmApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Ecofarm",
    "Package",
    "Register",
    "Items",
    "Orders",
    "Voucher",
    "Categories",
    "ItemAttributes",
    "PackageActivities",
  ],
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    // [EcofarmPackage]
    GetListEcofarmPackageByPartner: builder.query<TResultData<TPackageItem[]>, TPackageFilter>({
      query: ({ provinceCodes, ...filter }) => ({
        url:
          "/business/api/services/app/EcoFarmPackages/GetListByPartner" +
          `?${queryString.stringify({ provinceCodes }, { arrayFormat: "none", skipNull: true })}`,
        method: "get",
        params: filter,
      }),

      providesTags: (res) =>
        !!res?.data?.length
          ? [
              ...res?.data.map(({ id }) => ({
                type: "Package" as const,
                id,
              })),
              { type: "Package", id: "LIST" },
            ]
          : [{ type: "Package", id: "LIST" }],
    }),
    // [EcofarmPackage]
    GetListEcofarmPackage: builder.query<TResultData<TPackageItem[]>, TPackageFilter>({
      query: ({ provinceCodes, ...filter }) => ({
        url:
          "/business/api/services/app/EcoFarmPackages/GetList" +
          `?${queryString.stringify({ provinceCodes }, { arrayFormat: "none", skipNull: true })}`,
        method: "get",
        params: filter,
      }),

      providesTags: (res) =>
        !!res?.data?.length
          ? [
              ...res?.data.map(({ id }) => ({
                type: "Package" as const,
                id,
              })),
              { type: "Package", id: "LIST" },
            ]
          : [{ type: "Package", id: "LIST" }],
    }),
    GetEcofarmPackageById: builder.query<TResultData<TPackageDetail>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/EcoFarmPackages/GetById",
        method: "get",
        params: filter,
      }),
      providesTags: (result, error, { id }) => [{ type: "Package", id: "LIST" }],
    }),
    // [EcofarmPackage]
    CreateEcofarmPackage: builder.mutation<TResultData<any>, TCreatePackageData>({
      query: (body) => ({
        url: "/business/api/services/app/EcoFarmPackages/Create",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Package", id: "LIST" }],
    }),
    // [EcofarmPackage]
    UpdateEcofarmPackage: builder.mutation<TResultData<any>, Partial<TUpdatePackageDetailData>>({
      query: (body) => ({
        url: "/business/api/services/app/EcoFarmPackages/Update",
        method: "put",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Package", id: "LIST" }],
    }),
    // [EcofarmPackage]
    UpdateStatusEcofarmPackage: builder.mutation<
      TResultData<boolean>,
      { id: number; status: number }
    >({
      query: (body) => ({
        url: "/business/api/services/app/EcoFarmPackages/UpdateStatus",
        method: "put",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Package", id: "LIST" }],
    }),

    // [EcofarmPackage]
    DeleteEcofarmPackage: builder.mutation<TResultData<any>, { id: number }>({
      query: (params) => ({
        url: "/business/api/services/app/EcoFarmPackages/Delete",
        method: "delete",
        params,
      }),
      invalidatesTags: [{ type: "Package", id: "LIST" }],
    }),

    // [EcofarmPackageActivities]
    GetListEcofarmPackageActivities: builder.query<
      TResultData<TPackageActivity[]>,
      TPackageActivitiesFilter
    >({
      query: (filter) => ({
        url: "/business/api/services/app/EcoFarmPackageActivities/GetListByPartner",
        method: "get",
        params: filter,
      }),
      providesTags: () => [{ type: "PackageActivities", id: "LIST" }],
    }),
    // [EcofarmPackageActivities]
    GetEcofarmPackageActivityById: builder.query<TResultData<TPackageActivity>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/EcoFarmPackageActivities/GetById",
        method: "get",
        params: filter,
      }),
      providesTags: (result, error, { id }) => [{ type: "PackageActivities", id: "LIST" }],
    }),
    // [EcofarmPackageActivities]
    CreateEcofarmPackageActivity: builder.mutation<TResultData<any>, TCreatePackageActivityData>({
      query: (body) => ({
        url: "/business/api/services/app/EcoFarmPackageActivities/Create",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "PackageActivities", id: "LIST" }],
    }),
    // [EcofarmPackageActivities]
    UpdateEcofarmPackageActivity: builder.mutation<
      TResultData<any>,
      TUpdateEcofarmPackageActivityData
    >({
      query: (body) => ({
        url: "/business/api/services/app/EcoFarmPackageActivities/Update",
        method: "put",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PackageActivities", id: "LIST" }],
    }),
    // [EcofarmPackageActivities]
    UpdateStatusEcofarmPackageActivity: builder.mutation<
      TResultData<boolean>,
      { id: number; status: number }
    >({
      query: (body) => ({
        url: "/business/api/services/app/EcoFarmPackageActivities/UpdateStatus",
        method: "put",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PackageActivities", id: "LIST" }],
    }),
    // [EcofarmPackageActivities]
    DeleteEcofarmPackageActivity: builder.mutation<TResultData<any>, { id: number }>({
      query: (params) => ({
        url: "/business/api/services/app/EcoFarmPackageActivities/Delete",
        method: "delete",
        params,
      }),
      invalidatesTags: [{ type: "PackageActivities", id: "LIST" }],
    }),

    // [EcofarmPayment]
    CreateEcofarmPayment: builder.mutation<TResultData<any>, TCreateEcofarmPaymentData>({
      query: (body) => ({
        url: "/business/api/services/app/EcoFarmPayments/Create",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Ecofarm", id: "LIST" }],
    }),

    //
    // [EcofarmRegister]
    GetListEcofarmRegisterByPartner: builder.query<TResultData<TRegisterItem[]>, TRegisterFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/EcoFarmRegisters/GetListByPartner",
        method: "get",
        params: filter,
      }),
      providesTags: (res) =>
        !!res?.data?.length
          ? [
              ...res?.data.map(({ id }) => ({
                type: "Register" as const,
                id,
              })),
              { type: "Register", id: "LIST" },
            ]
          : [{ type: "Register", id: "LIST" }],
    }),
    GetEcofarmRegisterById: builder.query<TResultData<TRegisterDetail>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/EcoFarmRegisters/GetById",
        method: "get",
        params: filter,
      }),
      providesTags: (result, error, { id }) => [{ type: "Register", id: "LIST" }],
    }),
    // [EcofarmRegister]
    GetRegisterCountEcoFarm: builder.query<
      TResultData<{
        pending: number;
        investing: number;
        completed: number;
        cancelled: number;
      }>,
      { providerId: number; dateFrom?: string; dateTo?: string }
    >({
      query: (filter) => ({
        url: "/business/api/services/app/EcoFarmRegisters/GetCount",
        method: "get",
        params: filter,
      }),
      providesTags: () => [{ type: "Register", id: "LIST" }],
    }),
    // [EcofarmRegister]
    CreateEcofarmRegister: builder.mutation<TResultData<any>, TCreateRegisterData>({
      query: (body) => ({
        url: "/business/api/services/app/EcoFarmRegisters/Create",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Register", id: "LIST" }],
    }),
    // [EcofarmRegister]
    UpdateEcofarmRegister: builder.mutation<TResultData<any>, Partial<TUpdateRegisterDetailData>>({
      query: (body) => ({
        url: "/business/api/services/app/EcoFarmRegisters/Update",
        method: "put",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Register", id: "LIST" }],
    }),
    // [EcofarmRegister]
    UpdateStateEcofarmRegister: builder.mutation<
      TResultData<boolean>,
      { id: number; status: number }
    >({
      query: (body) => ({
        url: "/business/api/services/app/EcoFarmRegisters/UpdateStatus",
        method: "put",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Register", id: "LIST" }],
    }),

    // [EcofarmRegister]
    DeleteEcofarmRegister: builder.mutation<TResultData<any>, { id: number }>({
      query: (params) => ({
        url: "/business/api/services/app/EcoFarmRegisters/Delete",
        method: "delete",
        params,
      }),
      invalidatesTags: [{ type: "Register", id: "LIST" }],
    }),
    // [EcofarmRegister]
    DeleteManyEcofarmRegister: builder.mutation<
      TResultData<any>,
      { ids: number[]; providerId: number }
    >({
      query: (params) => ({
        url: "/business/api/services/app/Ecofarm/DeleteManyEcofarmRegister",
        method: "delete",
        params,
      }),
      invalidatesTags: [{ type: "Register", id: "LIST" }],
    }),

    // [EcofarmItems]
    GetAllItemsByPartnerForEcoFarm: builder.query<TResultData<TItemsItem[]>, TItemsFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/EcoFarmItems/GetListByPartner",
        method: "get",
        params: filter,
      }),
      providesTags: (res) =>
        !!res?.data?.length
          ? [
              ...res?.data.map(({ id }) => ({
                type: "Items" as const,
                id,
              })),
              { type: "Items", id: "LIST" },
            ]
          : [{ type: "Items", id: "LIST" }],
    }),
    // [EcofarmItems]
    GetItemByIdForEcoFarm: builder.query<TResultData<TItemsItem>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/EcoFarmItems/GetById",
        method: "get",
        params: filter,
      }),
      providesTags: (result, error, { id }) => [{ type: "Items", id: "LIST" }],
    }),
    // [EcofarmItems]
    CreateItemForEcoFarm: builder.mutation<TResultData<any>, TCreateItemData>({
      query: (body) => ({
        url: "/business/api/services/app/EcoFarmItems/Create",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Items", id: "LIST" }],
    }),
    // [EcofarmItems]
    UpdateItemForEcoFarm: builder.mutation<TResultData<any>, Partial<TUpdateItemsDetailData>>({
      query: (body) => ({
        url: "/business/api/services/app/EcoFarmItems/Update",
        method: "put",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Items", id: "LIST" }],
    }),
    // [EcofarmItems]
    UpdateItemStatusForEcoFarm: builder.mutation<
      TResultData<boolean>,
      { id: number; status: number }
    >({
      query: (body) => ({
        url: "/business/api/services/app/EcoFarmItems/UpdateStatus",
        method: "put",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Items", id: "LIST" }],
    }),

    // [EcofarmItems]
    DeleteItemForEcoFarm: builder.mutation<TResultData<any>, { id: number }>({
      query: (params) => ({
        url: "/business/api/services/app/EcoFarmItems/Delete",
        method: "delete",
        params,
      }),
      invalidatesTags: [{ type: "Items", id: "LIST" }],
    }),

    // [EcofarmProviders]
    GetAllProvidersEcofarmByPartner: builder.query<
      TResultData<TProviderEcofarmItem[]>,
      TProviderEcofarmFilter
    >({
      query: (filter) => ({
        url: "/business/api/services/app/EcoFarmProviders/GetListByPartner",
        method: "get",
        params: filter,
      }),
      providesTags: (res) =>
        !!res?.data?.length
          ? [
              ...res?.data.map(({ id }) => ({
                type: "Ecofarm" as const,
                id,
              })),
              { type: "Ecofarm", id: "LIST" },
            ]
          : [{ type: "Ecofarm", id: "LIST" }],
    }),
    // [EcofarmProviders]
    GetProviderEcofarmById: builder.query<TResultData<TProviderEcofarmDetail>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/EcoFarmProviders/GetById",
        method: "get",
        params: filter,
      }),
      providesTags: (result, error, { id }) => [{ type: "Ecofarm", id: "LIST" }],
    }),

    // [EcofarmProviders]
    CreateProviderEcoFarm: builder.mutation<TResultData<any>, TCreateProviderEcofarmData>({
      query: (body) => ({
        url: "/business/api/services/app/EcoFarmProviders/Create",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Ecofarm", id: "LIST" }],
    }),
    // [EcofarmProviders]
    UpdateProviderEcoFarm: builder.mutation<
      TResultData<any>,
      Partial<TUpdateProviderEcofarmDetailData>
    >({
      query: (body) => ({
        url: "/business/api/services/app/EcoFarmProviders/Update",
        method: "put",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Ecofarm", id: "LIST" }],
    }),
    UpdateStateOfProviderEcoFarm: builder.mutation<
      TResultData<boolean>,
      { id: number; state: number }
    >({
      query: (body) => ({
        url: "/business/api/services/app/EcoFarmProviders/UpdateState",
        method: "put",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Ecofarm", id: "LIST" }],
    }),
    // [EcofarmProviders]
    DeleteProviderEcoFarm: builder.mutation<TResultData<any>, { id: number }>({
      query: (params) => ({
        url: "/business/api/services/app/EcoFarmProviders/Delete",
        method: "delete",
        params,
      }),
      invalidatesTags: [{ type: "Ecofarm", id: "LIST" }],
    }),

    // [EcoFarmOrders]
    GetOrdersListByPartnerEcoFarm: builder.query<TResultData<TOrdersItem[]>, TOrdersFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/EcoFarmOrders/GetListByPartner",
        method: "get",
        params: filter,
      }),
      providesTags: (res) =>
        !!res?.data?.length
          ? [
              ...res?.data.map(({ id }) => ({
                type: "Orders" as const,
                id,
              })),
              { type: "Orders", id: "LIST" },
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),
    // [EcoFarmOrders]
    GetOrdersEcofarmByIdEcoFarm: builder.query<TResultData<TOrdersItem>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/EcoFarmOrders/GetById",
        method: "get",
        params: filter,
      }),
      providesTags: (result, error, { id }) => [{ type: "Orders", id: "LIST" }],
    }),
    // [EcoFarmOrders]
    GetOrdersCountEcoFarm: builder.query<
      TResultData<{
        cancelled: number;
        completed: number;
        itemBlocked: number;
        itemSoldOut: number;
        returnRefund: number;
        shipping: number;
        toPay: number;
        toShip: number;
      }>,
      { providerId: number; dateFrom?: string; dateTo?: string }
    >({
      query: (filter) => ({
        url: "/business/api/services/app/EcoFarmOrders/GetCount",
        method: "get",
        params: filter,
      }),
      providesTags: () => [{ type: "Orders", id: "LIST" }],
    }),

    // []
    getStatisticSomeProviders: builder.query<
      TResultData<{
        listCount: Record<string, number>;
        listRevenue: Record<string, number>;
      }>,
      TStatisticSomeProvidersFilter
    >({
      query: ({ listProviderId, ...filter }) => ({
        url:
          "/business/api/services/app/EcoFarmOrders/GetStatisticSomeProvider?" +
          (listProviderId || [])?.map((id) => `listProviderId=${id}`).join("&"),
        method: "get",
        params: filter,
      }),
      providesTags: [{ type: "Orders", id: "LIST" }],
    }),
    // []
    getStatisticOrders: builder.query<
      TResultData<{ listCount: number[]; listRevenue: number[] }>,
      TOrderStatisticFilter
    >({
      query: (filter) => ({
        url: "/business/api/services/app/EcoFarmOrders/GetStatistic",
        method: "get",
        params: filter,
      }),
      providesTags: [{ type: "Orders", id: "LIST" }],
    }),
    // []
    getItemRanking: builder.query<TResultData<any[]>, TRankingItemsFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/EcoFarmOrders/GetItemRanking",
        method: "get",
        params: filter,
      }),
      providesTags: [{ type: "Orders", id: "LIST" }],
    }),
    // []
    // [EcoFarmOrders]
    OrderConfirmByPartner: builder.mutation<TResultData<any>, TConfirmPartner>({
      query: (body) => ({
        url: "/business/api/services/app/EcoFarmOrders/ConfirmByPartner",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
    // [EcoFarmOrders]
    OrderRefuseByPartner: builder.mutation<TResultData<any>, { id: number; typeAction: number }>({
      query: (body) => ({
        url: "/business/api/services/app/EcoFarmOrders/RefuseByPartner",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
    // [EcoFarmOrders]
    OrderCancelByPartner: builder.mutation<
      TResultData<any>,
      { id: number; typeAction: number; reason: string; urls: string[] }
    >({
      query: (body) => ({
        url: "/business/api/services/app/EcoFarmOrders/CancelByPartner",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
    // [EcoFarmOrders]
    DeleteOrderEcoFarm: builder.mutation<TResultData<any>, { id: number }>({
      query: (params) => ({
        url: "/business/api/services/app/EcoFarmOrders/Delete",
        method: "delete",
        params,
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
    // [Voucher]
    GetAllVouchersByPartner: builder.query<TResultData<TVoucherItem[]>, TVoucherFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/EcoFarmVouchers/GetListByPartner",
        method: "get",
        params: filter,
      }),
      providesTags: (res) =>
        !!res?.data?.length
          ? [
              ...res?.data.map(({ id }) => ({
                type: "Voucher" as const,
                id,
              })),
              { type: "Voucher", id: "LIST" },
            ]
          : [{ type: "Voucher", id: "LIST" }],
    }),
    GetVoucherById: builder.query<TResultData<TVoucherItem>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/EcoFarmVouchers/GetById",
        method: "get",
        params: filter,
      }),
      providesTags: (result, error, { id }) => [{ type: "Voucher", id: "LIST" }],
    }),
    // [Voucher]
    CreateVoucher: builder.mutation<TResultData<any>, TCreateVoucher>({
      query: (body) => ({
        url: "/business/api/services/app/EcoFarmVouchers/Create",
        method: "post",
        body,
      }),
      invalidatesTags: [{ type: "Voucher", id: "LIST" }],
    }),
    // [Voucher]
    UpdateVoucher: builder.mutation<TResultData<any>, Partial<TUpdateVoucher>>({
      query: (body) => ({
        url: "/business/api/services/app/EcoFarmVouchers/Update",
        method: "put",
        body,
      }),
      invalidatesTags: () => [{ type: "Voucher", id: "LIST" }],
    }),
    // [Voucher]
    StartEarlyVoucher: builder.mutation<TResultData<boolean>, { id: number }>({
      query: (body) => ({
        url: "/business/api/services/app/EcoFarmVouchers/StartEarly",
        method: "post",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Voucher", id: "LIST" }],
    }),
    // [Voucher]
    EndedVoucher: builder.mutation<TResultData<boolean>, { id: number }>({
      query: (body) => ({
        url: "/business/api/services/app/EcoFarmVouchers/EndEarly",
        method: "post",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Voucher", id: "LIST" }],
    }),
    // [Voucher]
    DeleteVoucher: builder.mutation<TResultData<any>, { id: number }>({
      query: (params) => ({
        url: "/business/api/services/app/EcoFarmVouchers/Delete",
        method: "delete",
        params,
      }),
      invalidatesTags: [{ type: "Voucher", id: "LIST" }],
    }),

    // [Category]
    GetAllCategories: builder.query<TResultData<TCategory[]>, TCategoriesFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/EcoFarmCategories/GetList",
        method: "get",
        params: filter,
      }),
      providesTags: (res) =>
        !!res?.data?.length
          ? [
              ...res?.data.map(({ id }) => ({
                type: "Categories" as const,
                id,
              })),
              { type: "Categories", id: "LIST" },
            ]
          : [{ type: "Categories", id: "LIST" }],
    }),
    // [Category]
    GetListCategoryFromChildren: builder.query<TResultData<TCategory[]>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/EcoFarmCategories/GetListFromChildren",
        method: "get",
        params: filter,
      }),
      providesTags: (result, error, { id }) => [{ type: "Categories", id: "LIST" }],
    }),
    // [Category]
    GetCategoryById: builder.query<TResultData<TCategory>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/EcoFarmCategories/GetById",
        method: "get",
        params: filter,
      }),
      providesTags: (result, error, { id }) => [{ type: "Categories", id: "LIST" }],
    }),

    // [ItemAttributes]
    getAllItemAttributes: builder.query<TResultData<TItemAttribute[]>, TItemAttributeFilter>({
      query: (filter) => ({
        url: "/business/api/services/app/EcoFarmItemAttributes/GetList",
        method: "get",
        params: filter,
      }),
      providesTags: (res) =>
        !!res?.data.length
          ? [
              ...res?.data.map(({ id }) => ({
                type: "ItemAttributes" as const,
                id,
              })),
              { type: "ItemAttributes", id: "LIST" },
            ]
          : [{ type: "ItemAttributes", id: "LIST" }],
    }),
    // [ItemAttributes]
    getItemAttributesById: builder.query<TResultData<TItemAttribute>, { id: number }>({
      query: (filter) => ({
        url: "/business/api/services/app/EcoFarmItemAttributes/GetById",
        method: "get",
        params: filter,
      }),
      providesTags: (result, error, { id }) => [{ type: "ItemAttributes", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateEcofarmPackageActivityMutation,
  useCreateEcofarmPackageMutation,
  useCreateEcofarmRegisterMutation,
  useCreateItemForEcoFarmMutation,
  useDeleteEcofarmPackageActivityMutation,
  useDeleteEcofarmPackageMutation,
  useDeleteEcofarmRegisterMutation,
  useDeleteItemForEcoFarmMutation,
  useDeleteManyEcofarmRegisterMutation,
  useGetItemByIdForEcoFarmQuery,
  useGetAllItemsByPartnerForEcoFarmQuery,
  useGetAllProvidersEcofarmByPartnerQuery,
  useGetEcofarmPackageByIdQuery,
  useGetEcofarmRegisterByIdQuery,
  useGetListEcofarmPackageActivitiesQuery,
  useGetEcofarmPackageActivityByIdQuery,
  useGetListEcofarmPackageByPartnerQuery,
  useGetListEcofarmPackageQuery,
  useGetListEcofarmRegisterByPartnerQuery,
  useGetProviderEcofarmByIdQuery,
  useUpdateEcofarmPackageActivityMutation,
  useUpdateStatusEcofarmPackageActivityMutation,
  useUpdateEcofarmPackageMutation,
  useUpdateEcofarmRegisterMutation,
  useUpdateItemForEcoFarmMutation,
  useUpdateItemStatusForEcoFarmMutation,
  useUpdateStatusEcofarmPackageMutation,
  useUpdateStateEcofarmRegisterMutation,
  useCreateEcofarmPaymentMutation,
  useCreateProviderEcoFarmMutation,
  useUpdateProviderEcoFarmMutation,
  useUpdateStateOfProviderEcoFarmMutation,
  useDeleteProviderEcoFarmMutation,

  useGetOrdersListByPartnerEcoFarmQuery,
  useGetOrdersEcofarmByIdEcoFarmQuery,
  useDeleteOrderEcoFarmMutation,
  useOrderConfirmByPartnerMutation,
  useOrderRefuseByPartnerMutation,
  useOrderCancelByPartnerMutation,
  useGetOrdersCountEcoFarmQuery,
  useGetItemRankingQuery,
  useGetStatisticOrdersQuery,
  useGetStatisticSomeProvidersQuery,

  useCreateVoucherMutation,
  useUpdateVoucherMutation,
  useStartEarlyVoucherMutation,
  useEndedVoucherMutation,
  useDeleteVoucherMutation,
  useGetAllVouchersByPartnerQuery,
  useGetVoucherByIdQuery,

  useGetAllCategoriesQuery,
  useGetListCategoryFromChildrenQuery,
  useGetCategoryByIdQuery,
  useGetAllItemAttributesQuery,
  useGetItemAttributesByIdQuery,

  useGetRegisterCountEcoFarmQuery,
} = farmApi;

export const EcoFarmOrders = {
  useGetOrdersListByPartnerEcoFarmQuery,
  useGetOrdersEcofarmByIdEcoFarmQuery,
  useDeleteOrderEcoFarmMutation,
  useOrderConfirmByPartnerMutation,
  useOrderRefuseByPartnerMutation,
  useOrderCancelByPartnerMutation,
  useGetOrdersCountEcoFarmQuery,
  useGetItemRankingQuery,
  useGetStatisticOrdersQuery,
  useGetStatisticSomeProvidersQuery,
};

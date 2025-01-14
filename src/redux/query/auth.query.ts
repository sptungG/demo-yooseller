import { createApi } from "@reduxjs/toolkit/query/react";
import { TRegisterData } from "src/types/auth.types";
import { TResponse } from "src/types/response.types";
import { baseQuery } from "../app/baseQuery";

type TLoginData = {
  userNameOrEmailAddress: string;
  password: string;
  tenancyName: string;
  rememberClient: boolean;
};
type TLoginRes = {
  accessToken: string;
  encryptedAccessToken: string;
  expireInSeconds: number;
  thirdAccounts: string;
  userId: number;
  tenantId: number;
  emailAddress: string;
  isCitizen: true;
  mobileConfig: string;
  refreshToken: string;
  refreshTokenExpireInSeconds: number;
};

type TRegisterRes = {
  canLogin: boolean;
  thirdAccounts: string;
};

type TIsTenantAvailableRes = {
  adminPageConfig: string | null;
  mobileConfig: string | null;
  permissions: string | null;
  state: number;
  tenantId: number | null;
};

type TCreateFcmReq = {
  token: string;
  deviceId?: string;
  deviceType?: number;
  tenantId: number;
  appType: number;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery,
  tagTypes: ["auth"],
  endpoints: (builder) => ({
    login: builder.mutation<TResponse<TLoginRes>, TLoginData>({
      query: (data) => ({
        url: "/api/TokenAuth/Authenticate",
        method: "post",
        body: data,
      }),
      invalidatesTags: [{ type: "auth", id: "login" }],
    }),
    register: builder.mutation<
      TResponse<TRegisterRes>,
      Partial<TRegisterData> & { tenancyId: number }
    >({
      query: ({ tenancyId, ...data }) => ({
        url: "/api/services/app/Account/Register",
        method: "post",
        body: data,
        headers: { "abp.tenantid": String(tenancyId) },
      }),
      invalidatesTags: [{ type: "auth", id: "register" }],
    }),
    logout: builder.mutation<any, any>({
      query: () => ({
        url: "/api/TokenAuth/LogOut",
        method: "get",
      }),
      invalidatesTags: [{ type: "auth", id: "logout" }],
    }),
    logoutFcm: builder.mutation<any, { token: string }>({
      query: (data) => ({
        url: "/api/services/app/FcmToken/LogoutFcmToken",
        method: "post",
        body: data,
      }),
      invalidatesTags: [{ type: "auth", id: "fcmtoken" }],
    }),
    createFcm: builder.mutation<any, TCreateFcmReq>({
      query: (data) => ({
        url: "/api/services/app/FcmToken/CreateFcmToken",
        method: "post",
        body: data,
      }),
      invalidatesTags: [{ type: "auth", id: "fcmtoken" }],
    }),
    getAllTenantName: builder.query<TResponse<{ displayName: string; tenancyName: string }[]>, any>(
      {
        query: (data) => "/api/services/app/Account/GetAllTenantName",
        providesTags: [{ type: "auth", id: "GetAllTenantName" }],
      },
    ),
    isTenantAvailable: builder.mutation<TResponse<TIsTenantAvailableRes>, { tenancyName: string }>({
      query: (data) => ({
        url: "/api/services/app/Account/IsTenantAvailable",
        method: "post",
        body: data,
      }),
      invalidatesTags: [{ type: "auth", id: "isTenantAvailable" }],
    }),
  }),
});
export const {
  useLoginMutation,
  useIsTenantAvailableMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetAllTenantNameQuery,
  useCreateFcmMutation,
  useLogoutFcmMutation,
} = authApi;

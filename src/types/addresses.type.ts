import { ID } from "./global.types";
export type TProviderAddressesFilter = {
  type?: number | null;
  default?: boolean | null;
  pickUp?: boolean | null;
  return?: boolean | null;
  providerId?: number | null;
  keyword?: string | null;
  orderBy?: number | null;
  sortBy?: number | null;
  maxResultCount?: number | null;
  skipCount?: number | null;
};

export type TCreateProviderAddresses = {
  default: boolean;
  pickUp: boolean;
  return: boolean;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  name: string;
  districtCode: string;
  provinceCode: string;
  wardCode: string;
  detail: string;
  providerId: number;
};
export type TUpdateProviderAddresses = TCreateProviderAddresses & {
  id: ID;
};
export type TProviderAddressesItem = TUpdateProviderAddresses & {
  type?: number;
  districtName: string;
  provinceName: string;
  wardName: string;
};

export enum TEProviderAddressOrderBy {
  Id = 1,
  DistrictCode = 2,
  ProvinceCode = 3,
  WardCode = 4,
  ProviderId = 5,
  UserId = 6,
}

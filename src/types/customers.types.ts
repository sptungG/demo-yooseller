import { ID } from "./global.types";
export type TCustomersFilter = {
  phoneNumber?: string | null;
  providerId?: number | null;
  keyword?: string | null;
  orderBy?: number | null;
  sortBy?: number | null;
  maxResultCount?: number | null;
  skipCount?: number | null;
  fieldSearch?: number | null;
  tuKhoa?: string | null;
};

export type TCreateCustomers = {
  homeAddress: string;
  dateOfBirth?: string | null;
  gender?: string;
  emailAddress?: string;
  fullName: string;
  phoneNumber: string;
  totalPoints: number;
  usedPoints: number;
  unusedPoints: number;
  providerId: number;
};
export type TUpdateCustomers = TCreateCustomers & {
  id: ID;
};
export type TCustomersItem = TUpdateCustomers & {
  creationTime: string;
  LastModificationTime?: string;
  creatorUserId?: number;
};
export type TDeleteCustomers = {
  id: ID;
};
export enum TECustomersOrderBy {
  Id = 1,
  DistrictCode = 2,
  ProvinceCode = 3,
  WardCode = 4,
  ProviderId = 5,
  UserId = 6,
}

export enum TECustomersSearchBy {
  SoDienThoai = 1,
  keyword = 2,
}

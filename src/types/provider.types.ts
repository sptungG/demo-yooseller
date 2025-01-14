import { ID } from "./global.types";

export type TProvider = {
  id: ID;
  name: string;
  email: string;
  contact: string;
  description: string;
  phoneNumber: string;
  imageUrls: string[];
  ownerInfo: string;
  businessInfo: string;
  workTime: string;
  tenantId: number;
  socialTenantId: number;
  type: number;
  groupType: number;
  latitude: number;
  longitude: number;
  propertyHistories: string;
  properties: string;
  state: number;
  stateProperties: string;
  countRate: number;
  ratePoint: number;
  isDataStatic: false;
  isAdminCreate: false;
  districtId: string;
  provinceId: string;
  wardId: string;
  address: string;
  creationTime: {
    seconds: number;
    nanos: number;
  };
  distance: number;
  ownerId: number;
  creatorUserId: number;
  carrierList: number[];
};

export type TProvidersFilter = {
  type?: number | null;
  groupType?: number | null;
  formId?: number | null;
  orderBy?: number | null;
  skipCount?: number | null;
  maxResultCount?: number | null;
  keyword?: string;
  sortBy?: number | null;
};

export type TCreateProviderData = {
  name: string;
  email: string;
  contact: string;
  description: string;
  phoneNumber: string;
  imageUrls: string[];
  ownerInfo: string;
  businessInfo: string;
  type: number;
  groupType: number;
  latitude: number;
  longitude: number;
  properties: string;
  districtId: string;
  provinceId: string;
  wardId: string;
  address: string;
  serviceType?: number;
  workTime: string;
  carrierList: number[];
};
export type TUpdateProviderDetailData = TCreateProviderData & {
  id: ID;
};

export enum TProviderState {
  PENDING = 1,
  ACTIVATED = 2,
  INACTIVATED = 3,
  HIDDEN = 4,
  BLOCKED = 5,
}

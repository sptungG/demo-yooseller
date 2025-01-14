import { ID } from "./global.types";
export type TPackage = {
  id: ID;
  tenantId: number;
  name: string;
  description: string;
  providerId: number;
  imageUrlList: string[];
  videoUrlList: string[];
  imageUrlTimeline: string;
  videoUrlTimeline: string;
  status: number;
  address: string;
  startDate: Date;
  expectedEndDate: Date;
  totalInvestmentTerm: number;
  pricePerShare: number;
  totalNumberShares: number;
  numberSharesSold: number;
  packagePrice: number;
  properties: string;
  countRate: number;
  ratePoint: number;
  type: number;
  viewCount: number;
  creationTime: {
    seconds: number;
    nanos: number;
  };
  creatorUserId: number;
};

export type TPackageFilter = {
  tenantId?: number;
  providerId?: number;
  status?: any;
  type?: number;
  rating?: number;
  minPrice?: number;
  maxPrice?: number;
  keyword?: string;
  orderBy?: number;
  maxResultCount?: number;
  skipCount?: number;
};
export type TCreatePackageData = {
  name: string;
  description: string;
  providerId: number;
  imageUrlList: string[];
  videoUrlList: string[];
  address: string;
  startDate: Date;
  expectedEndDate: Date;
  totalInvestmentTerm: number;
  pricePerShare: number;
  totalNumberShares: number;
  numberSharesSold: number;
  packagePrice: number;
  properties: string;
  type: number;
  listItems: string;
};
export type TUpdatePackageDetailData = TCreatePackageData & {
  id: ID;
};

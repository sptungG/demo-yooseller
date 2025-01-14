import { ID } from "./global.types";

export type TBaseFilter = {
  keyword?: string | null;
  orderBy?: number | null;
  sortBy?: number | null;
  maxResultCount?: number | null;
  skipCount?: number | null;
};

export type TPageTemplate = {
  id: ID;
  code: number;
  name: string;
  imageUrlList: string[];
  creationTime: {
    seconds: number;
    nanos: number;
  };
  creatorUserId: number;
};

export type TPageTemplateFilter = TBaseFilter & {
  code?: string | null;
};

export type TCreatePageInformation = {
  pageTemplatesCode: string;
  providerId: number;
  logo: string;
  aboutUs: string;
  website: string;
  background: string[];
  certificate: string[];
  aboutUsImageUrl: string;
  productImageRanking: string;
};

export type TUpdatePageInformation = TCreatePageInformation & {
  id: ID;
};
export type TPageInformation = TUpdatePageInformation & {
  status: number;
  provider: {
    name: string;
  };
};

export type TPageInformationFilter = TBaseFilter & {
  code?: string | null;
};

export type TCreatePartnerLink = {
  name: string;
  providerId: number;
  imageUrl: string;
  link: string;
  stt: number;
};

export type TUpdatePartnerLink = TCreatePartnerLink & {
  id: ID;
};
export type TPartnerLink = TUpdatePartnerLink & {
  status: number;
  provider: object;
};

export type TPartnerLinkFilter = TBaseFilter & {
  providerId?: number | null;
  status?: number | null;
};
export enum TEPartnerLinkOrderBy {
  Id = 1,
  STT = 2,
  Status = 3,
}
export enum TEPartnerLinkStatus {
  Pendding = 1,
  Approved = 2,
}
export enum TEPageInformationStatus {
  Pending = 1, //Tạo mới chờ duyệt
  Approved = 2, //Đã phê duyệt - đang hoạt động
  Hide = 3, // Ẩn
  Lock = 4, //Bị khóa
}

import { DateISO, ID } from "./global.types";

export type TItem = {
  id: ID;
  tenantId: number;
  name: string;
  providerId: number;
  categoryId: number;
  sku: string;
  address: string;
  imageUrlList: string[];
  videoUrlList: string[];
  description: string;
  minPrice: number;
  minPrices: number;
  maxPrices: number;
  pitchtype: string;
  maxPrice: number;
  pricesMatch: number;
  sizeInfo: string;
  logisticInfo: string;
  status: TItemStatus;
  condition: TItemCondition;
  complaintPolicy: string;
  stock: number;
  attributeList: any[];
  tierVariationList: TItemTierVariation[];
  modelList: TItemModel[];
  creationTime: string;
  countRate: number;
  ratePoint: number;
  sales: number;
  creatorUserId: number;
  properties: any;
  viewCount: number;
};

export type TItem2 = {
  name: string;
  providerId: number;
  categoryId: number;
  sku: string;
  imageUrlList: string[];
  videoUrlList: string[];
  description: string;
  sizeInfo: {
    weight: number;
    height: number;
    width: number;
    length: number;
  };
  logisticInfo: string;
  status: number;
  countRate: number;
  ratePoint: number;
  minPrice: number;
  condition: number;
  maxPrice: number;
  stock: number;
  sales: number;
  attributeList: any[];
  tierVariationList: {
    name: string;
    optionList: string[];
  }[];
  modelList: TItemModel2[];
  creationTime: string;
  creatorUserId: number;
  properties: string;
  type: number;
  viewCount: number;
  isLike: boolean;
  isItemBooking: boolean;
  address: string;
  businessType: number;
  ecofarmPackageId: number;
  ecofarmPackageInfo: any;
  providerInfo: any;
  listItemRelated: number;
  isFlashSale: boolean;
  id: number;
};

export type TItemModel2 = {
  name: string;
  itemId: number;
  isDefault: boolean;
  sku: string;
  stock: number;
  sales: number;
  originalPrice: number;
  currentPrice: number;
  imageUrl: string;
  tierIndex: number[];
  itemName: string;
  quantity: number;
  isFlashSale: boolean;
  id: number;
};

export enum TItemCondition {
  NEW = 1,
  USED = 2,
}

export enum TItemStatus {
  PENDING = 1,
  ACTIVATED = 2,
  DEBOOSTED = 31,
  BANNED = 32,
  DELETED_BY_ADMIN = 32,
  DELETED = 4,
  HIDDEN = 5,
  INACTIVED = 6,
}

export type TItemModel = {
  id: number;
  sku: string;
  name: string;
  stock: number;
  sales: number;
  isDefault: boolean;
  originalPrice: number;
  currentPrice: number;
  tierIndex: number[];
  imageUrl: string;
};

export type TItemTierVariation = {
  name: string;
  optionList: string[];
};

export type TItemsFilter = {
  providerId?: number | null;
  formId?: number | null;
  orderBy?: number | null;
  categoryId?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  minStock?: number | null;
  maxStock?: number | null;
  minSales?: number | null;
  maxSales?: number | null;
  rating?: number | null;
  ecofarmPackageId?: number | null;
  skipCount?: number | null;
  maxResultCount?: number | null;
  keyword?: string | null;
  sortBy?: number | null;
  isItemBooking?: boolean | null;
};

export type TCreateItemData = {
  tenantId: number;
  name: string;
  providerId: number;
  categoryId: number;
  sku: string;
  imageUrlList: string[];
  videoUrlList: string[];
  description: string;
  sizeInfo: any;
  logisticInfo: string;
  type: number;
  condition: TItemCondition;
  complaintPolicy: string;
  attributeList: any[];
  tierVariationList: TItemTierVariation[];
  modelList: Omit<TItemModel, "id" | "isDefault">[];
  properties: string;
};

export type TUpdateItemModel = {
  name: string;
  tenantId: ID;
  itemId: ID;
  isDefault: boolean;
  sku: string;
  stock: number;
  originalPrice: number;
  currentPrice: number;
  imageUrl: string;
  tierIndex: number[];
  isDeleted: boolean;
  deletionTime: DateISO;
  deleterUserId: ID;
  id: ID;
};
export type TUpdateItemDetailData = Omit<TCreateItemData, "modelList"> & {
  id: ID;
  modelList: TItemModel[];
};

export type TCreateBookingItemData = {
  tenantId: ID;
  name: string;
  providerId: ID;
  imageUrlList: string[];
  videoUrlList: string[];
  description: string;
  sizeInfo: string;
  type: number;
  properties: string;
  itemModel: {
    originalPrice: number;
    currentPrice: number;
    imageUrl: string;
  };
};
export type TUpdateBookingItemData = {
  id: ID;
  name: string;
  imageUrlList: string[];
  videoUrlList: string[];
  description: string;
  sizeInfo: string;
  logisticInfo: string;
  condition: number;
  attributeList: {
    id: ID;
    unitList: [string];
    valueList: [string];
  }[];
  properties: string;
};
export type TUpdateListStockItemModel = {
  id: ID;
  items: {
    id: ID;
    stock: number;
  }[];
};
export type TUpdateListPriceItemModelData = {
  id: ID;
  items: {
    id: ID;
    originalPrice: number;
    currentPrice: number;
  }[];
};

export type TItemAttribute = {
  id: ID;
  name: string;
  displayName: string;
  description?: string;
  dataType: number;
  inputType: number;
  isRequired: boolean;
  unitList?: string[];
  valueList?: string[];
};

export type TItemAttributeFilter = {
  categoryId?: ID;
  tenantId?: ID;
  search?: string;
};

export type TCreateItemAttributeData = {
  tenantId: number;
  categoryId: number;
  name: string;
  displayName: string;
  description: string;
  dataType: TIADataType;
  inputType: TIAInputType;
  isRequired: boolean;
  unitList: string[];
  valueList: string[];
};

export type TUpdateItemAttributeData = {
  id: ID;
  isChooseToDelete: boolean;
  tenantId: number;
  categoryId: number;
  name: string;
  displayName: string;
  description: string;
  dataType: TIADataType;
  inputType: TIAInputType;
  isRequired: boolean;
  unitList: string[];
  valueList: string[];
};

export enum TIAInputType {
  Input = 1,
  TextArea = 2,
  InputNumber = 3,
  DateTime = 4,
  Select = 5,
  MultiSelect = 6,
  Checkbox = 7,
  Radio = 8,
  Editor = 9,
}

export enum TIADataType {
  String = 1,
  Number = 2,
  DateTime = 3,
  Boolean = 4,
  Array = 5,
}

export enum TEItemFormIdPartner {
  ALL = 10, // tất cả
  LIVE = 11, // còn hàng
  SOLD_OUT = 12, // bán hết
  REVIEWING = 13, // chờ duyệt
  VIOLATION = 14, // vi phạm
  VIOLATION_BANNED = 141, // bị cấm
  VIOLATION_DEBOOSTED = 142, // bị gỡ
  VIOLATION_ADMIN_DELETED = 143, // bị admin xóa
  DELISTED = 15, // partner xóa
  INACTIVED = 16, // ngừng kinh doanh
}

export type TItemRate = {
  id: ID;
  itemId?: number;
  providerId?: number;
  ratePoint: number;
  fileUrl?: string;
  comment?: string;
  type: number;
  userName: string;
  email?: string;
  avatar?: string;
  answerRateId?: number;
  transactionId?: number;
  transactionType: number;
  creatorUserId: number;
  creationTime: DateISO;
  objectDto?: any;
  partnerResponse?: any;
};

export type TItemRateFilter = {
  itemId?: number;
  providerId?: number;
  userId?: number;
  rating?: number;
  orderBy?: number;
  type?: number;
  transactionId?: number;
  transactionType?: number;
  skipCount?: number | null;
  maxResultCount?: number | null;
  keyword?: string | null;
  sortBy?: number | null;
};

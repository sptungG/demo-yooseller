export type TFlashSalesFilter = {
  dateStart: string | null;
  dateEnd: string | null;
  providerId: number | null;
  formId: number | null;
  orderBy: number | null;
  skipCount: number | null;
  maxResultCount: number | null;
  keyword: string;
  sortBy: number | null;
};

export type TFlashSale = {
  dateRange: {
    start: string;
    end: string;
  };
  flashSaleItems: {
    itemId: number;
    providerId: number;
    dateStart: string;
    dateEnd: string;
    discountType: number;
    maxDistributionBuyer: number;
    stock: number;
    sales: number;
    listItemModels: {
      flashSaleItemId: number;
      itemModelId: number;
      stock: number;
      sales: number;
      discountAmount: number;
      percent: number;
      currentPrice: number;
      originalPrice: number;
      id: number;
    }[];
    itemInfo: {
      id: number;
      name: string;
      imageUrlList: string[];
      countRate: number;
      ratePoint: number;
      creationTime: string;
      creatorUserId: number;
      viewCount: number;
    };
    status: number;
    creationTime: string;
    creatorUserId: number;
    id: number;
  }[];
};

export enum TEFlashSaleItemStatus {
  // [EnumDisplayString("Sắp diễn ra")]
  OnGoing = 1,
  // [EnumDisplayString("Đang diễn ra")]
  Activated = 2,
  // [EnumDisplayString("Đã kết thúc")]
  Expired = 3,
  // [EnumDisplayString("Đã đóng/hủy")]
  Closed = 4,
}

export type TFlashSaleConfigsFilter = {
  dateStart: string;
  dateEnd: string;
  formId: number;
  orderBy: number;
  skipCount: number;
  maxResultCount: number;
  keyword: string;
  sortBy: number;
};
export type TFlashSaleConfig = {
  data: string[];
  date: string;
  minQuantity: number;
  maxQuantity: number;
  promotionLevelMin: number;
  promotionLevelMax: number;
  isDefault: boolean;
  creationTime: string;
  creatorUserId: number;
  id: number;
  listDate: { item1: string; item2: string }[];
};

export type TFlashSaleItemCreateData = {
  itemId: number;
  providerId: number;
  dateStart: string;
  dateEnd: string;
  discountType: number;
  maxDistributionBuyer: number;
  listItemModels: {
    itemModelId: number;
    stock: number;
    discountAmount: number;
    percent: number;
  }[];
};

export type TFlashSaleItemUpdateData = {
  id: number;
  itemId: number;
  providerId: number;
  dateStart: string;
  dateEnd: string;
  discountType: number;
  maxDistributionBuyer: number;
  listItemModels: {
    itemModelId: number;
    stock: number;
    discountAmount: number;
    percent: number;
  }[];
};

export type TFlashSaleItemUpdateSaleData = {
  items: {
    itemId: number;
    userId: number;
    flashSaleItemId: number;
    itemModelId: number;
    quantity: number;
    typeSale: number;
    typeQuantityUser: number;
  }[];
};

import { DateISO, ID } from "./global.types";

export type TVoucher = {
  id: ID;
  tenantId: number;
  providerId: number;
  type: number;
  discountType: number;
  voucherCode: string;
  name: string;
  quantity: number;
  currentUsage: number;
  minBasketPrice: number;
  maxPrice: number;
  percentage: number;
  discountAmount: number;
  dateStart: DateISO;
  dateEnd: DateISO;
  status: number;
  creationTime: DateISO;
  description: string;
  isAdminCreate: boolean;
  maxDistributionBuyer: number;
  creatorUserId: number;
  listUser: TUsers[];
  listItems: number[];
  scope: number;
  displayChannelList: number[];
  displayDateStart: DateISO;
};

export type TVouchersFilter = {
  providerId?: number | null;
  formId?: number | null;
  orderBy?: number | null;
  skipCount?: number | null;
  maxResultCount?: number | null;
  keyword?: string;
  sortBy?: number | null;
};

export type TCreateVoucherData = {
  tenantId: number;
  providerId: number;
  type: number;
  scope: number;
  description: string;
  discountType: number;
  voucherCode: string;
  name: string;
  quantity: number;
  minBasketPrice: number;
  maxPrice: number;
  percentage: number;
  discountAmount: number;
  dateStart: DateISO;
  dateEnd: DateISO;
  isAdminCreate: boolean;
  maxDistributionBuyer: number;
  listItems: number[];
  displayChannelList: number[];
  displayDateStart: DateISO;
};

export type TUpdateVoucherData = {
  id: ID;
  description: string;
  name: string;
  quantity: number;
  minBasketPrice: number;
  maxPrice: number;
  percentage: number;
  discountAmount: number;
  dateStart: DateISO;
  dateEnd: DateISO;
  maxDistributionBuyer: number;
};

export type TUsers = {
  userId: ID;
  count: number;
};

export enum TVoucherScope {
  SHOP_VOUCHER = 1,
  PRODUCT_VOUCHER = 2,
}

export enum TDiscountType {
  FIX_AMOUNT = 1,
  DISCOUNT_PERCENTAGE = 2,
}

export enum TVoucherType {
  VOUCHER_SHIPPING = 1,
  VOUCHER_DISCOUNT = 2,
}

export enum TVoucherStatus {
  UPCOMING = 1,
  ACTIVATED = 2,
  EXPIRED = 3,
}

export const VoucherScopeDesc: Record<number, string> = {
  [TVoucherScope.SHOP_VOUCHER]: "Người mua có thể sử dụng voucher này cho tất cả sản phẩm của Shop",
  [TVoucherScope.PRODUCT_VOUCHER]:
    "Người mua có thể sử dụng voucher này cho các sản phẩm đã chọn của Shop",
};

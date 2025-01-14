import { ID } from "./global.types";
export type TUserEcofarm = {
  id: ID;
  tenantId: number;
  surName: string;
  name: string;
  emailAddress: string;
};
export type TBaseEcofarmFilter = {
  keyword?: string | null;
  orderBy?: number | null;
  sortBy?: number | null;
  maxResultCount?: number | null;
  skipCount?: number | null;
};
export type TPackageItem = {
  id: ID;
  tenantId: number;
  name: string;
  description: string;
  providerId: number;
  imageUrlList: string[];
  videoUrlList: string[];
  imageUrlTimeline: string;
  videoUrlTimeline: string;
  status: TPackageStatus;
  address: string;
  startDate: string;
  expectedEndDate: string;
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
export type TPackageDetail = {
  name: string;
  description: string;
  providerId: number;
  imageUrlList: string[];
  videoUrlList: string[];
  status: number;
  address: string;
  startDate: string;
  expectedEndDate: string;
  totalInvestmentTerm: number;
  pricePerShare: number;
  totalNumberShares: number;
  numberSharesSold: number;
  packagePrice: number;
  properties: any;
  countRate: number;
  ratePoint: number;
  type: number;
  viewCount: number;
  creatorUserId: number;
  creationTime: string;
  id: number;
};
export type TPackageFilter = {
  type?: number | null;
  providerId?: number | null;
  formId?: number | null;
  rating?: number | null;
  orderBy?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  provinceCodes?: string[] | null;
  skipCount?: number | null;
  maxResultCount?: number | null;
  keyword?: string;
  sortBy?: number | null;
};

export type TCreatePackageData = {
  name: string;
  description: string;
  providerId: number;
  imageUrlList: string[];
  videoUrlList: string[];
  address: string;
  startDate: string;
  expectedEndDate: string;
  totalInvestmentTerm: number;
  pricePerShare: number;
  totalNumberShares: number;
  packagePrice: number;
  properties: string;
};
export type TUpdatePackageDetailData = TCreatePackageData & {
  id: ID;
};

export type TPackageActivity = {
  providerId: number;
  ecofarmPackageId: number;
  ecofarmPackageInfo: TPackageItem;
  name: string;
  dateStart: string;
  dateExpect: string;
  imageUrlList: string[];
  videoUrlList: string[];
  status: number;
  description: string;
  type: number;
  properties: string;
  creatorUserId: number;
  creationTime: string;
  id: ID;
};
export type TPackageActivitiesFilter = TBaseEcofarmFilter & {
  type?: number;
  providerId?: number;
  ecofarmPackageId?: any;
  dateStartFrom?: Date;
  dateStartTo?: Date;
  dateExpectFrom?: Date;
  dateExpectTo?: Date;
};
export type TCreatePackageActivityData = {
  providerId: number;
  ecofarmPackageId: number;
  name: string;
  dateStart: string;
  dateExpect: string;
  imageUrlList: string[];
  videoUrlList: string[];
  description: string;
  type: number;
  properties: string;
};
export type TUpdateEcofarmPackageActivityData = TCreatePackageActivityData & {
  id: ID;
};

export enum TEEcoFarmPackageActivityStatus {
  //[EnumDisplayString("Sắp diễn ra")]
  ONGOING = 1,

  //[EnumDisplayString("Đang diễn ra")]
  ACTIVATED = 2,

  //[EnumDisplayString("Đã hoàn thành - kết thúc")]
  COMPLETED = 3,

  //[EnumDisplayString("Đã hủy")]
  CANCELED = 4,
}

export type TRegisterItem = {
  id: ID;
  providerId: number;
  ecofarmPackageId: number;
  investorId: number;
  status: number;
  note: string;
  properties: string;
  imageUrlList: string[];
  paymentMethod: number;
  code: string;
  paymentStatus: number;
  creationTime: string;
  creatorUserId: number;
  numberOfShared: number;
  totalPrice: number;
  partnerId: number;
  ecofarmType: number;
  ecoFarmPackage: {
    name: string;
    description: string;
    providerId: number;
    imageUrlList: string[];
    videoUrlList: string[];
    status: number;
    address: string;
    startDate: string;
    expectedEndDate: string;
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
    creatorUserId: number;
    creationTime: string;
    id: number;
  };
  userInfo: {
    tenantId: number;
    name: string;
    surName: string;
    emailAddress: string;
    imageUrl: string;
    id: number;
  };
  partnerInfo: {
    tenantId: number;
    name: string;
    surName: string;
    emailAddress: string;
    imageUrl: string;
    id: number;
  };
  recipientAddress: {
    districtId: number | null;
    fullAddress: string | null;
    name: string | null;
    phone: string | null;
  };
};
export type TRegisterDetail = {
  id: ID;
  creatorUserId: number;
  ecofarmPackageId: number;
  ecofarmType: number;
  imageUrlList: string[];
  investorId: number;
  note: string;
  numberOfShared: number;
  partnerId: number;
  partnerInfo: {
    tenantId: number;
    name: string;
    surName: string;
    emailAddress: string;
    id: ID;
  };
  properties: string;
  providerId: number;
  registrationDate: string;
  status: number;
  tenantId: number;
  totalPrice: number;
  userInfo: {
    tenantId: number;
    name: string;
    surName: string;
    emailAddress: string;
    id: ID;
  };
  recipientAddress: {
    districtId: number | null;
    fullAddress: string | null;
    name: string | null;
    phone: string | null;
  };
  ecoFarmPackage: TPackageItem;
  creationTime: string;
  paymentMethod: string;
};
export type TRegisterFilter = TBaseEcofarmFilter & {
  formId?: number | null;
  ecofarmPackageId?: number | null;
  providerId?: number | null;
  ecofarmType?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
};
export type TCreateRegisterData = any;
export type TUpdateRegisterDetailData = any;

export type TItemsItem = {
  id: ID;
  tenantId?: number;
  ecofarmPackageId?: number;
  ecofarmPackageInfo: TPackageItem;
  name: string;
  providerId: number;
  categoryId: number;
  sku: string;
  address: string;
  imageUrlList: string[];
  videoUrlList: string[];
  description: string;
  sizeInfo: {
    width: number;
    weight: number;
    length: number;
    height: number;
  };
  logisticInfo: string;
  status: TItemStatus;
  condition: TItemCondition;
  complaintPolicy: string;
  countRate: number;
  ratePoint: number;
  minPrice: number;
  maxPrice: number;
  stock: number;
  sales: number;
  attributeList: TItemAttribute[];
  tierVariationList: TItemTierVariation[];
  modelList: TItemModel[];
  properties: string;
  type: number;
  isItemBooking: boolean;
  isLike: boolean;
  businessType?: number;
  creationTime: string;
  LastModificationTime?: string;
  creatorUserId?: number;
  viewCount: number;
};
export type TItemsDetail = any;
export type TItemsFilter = TBaseEcofarmFilter & {
  formId?: number | null;
  ecofarmPackageId?: number | null;
  providerId?: number | null;
  categoryId?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  minStock?: number | null;
  maxStock?: number | null;
  minSales?: number | null;
  maxSales?: number | null;
  rating?: number | null;
};
export type TCreateItemData = {
  tenantId?: number;
  name: string;
  providerId: number;
  categoryId: number;
  sku: string;
  imageUrlList: string[];
  videoUrlList: string[];
  description: string;
  sizeInfo: {
    width: number;
    weight: number;
    length: number;
    height: number;
  };
  logisticInfo: string;
  status?: TItemStatus;
  condition?: TItemCondition;
  complaintPolicy: string;
  attributeList: TItemAttribute[];
  tierVariationList?: TItemTierVariation[];
  modelList?: TItemModel[];
  properties: string;
  ecofarmPackageId: number;
};
export type TUpdateItemsDetailData = {
  id: ID;
  name: string;
  sku: string;
  imageUrlList: string[];
  videoUrlList: string[];
  description: string;
  sizeInfo: {
    width: number;
    weight: number;
    length: number;
    height: number;
  };
  logisticInfo: string;
  properties: string;
  ecofarmPackageId: number;
  modelList: TItemModel[];
};

export type TOrdersItem = {
  id: ID;
  description: string;
  detailCancel: string;
  orderCode: string;
  // orderItemList: [
  //   {
  //     id: ID;
  //     tenantId: ID;
  //     name: string;
  //     itemId: ID;
  //     sku: string;
  //     originalPrice: number;
  //     currentPrice: number;
  //     imageUrl: string;
  //     isDefault: boolean;
  //     sales: number;
  //     stock: number;
  //     quantity: number;
  //   },
  // ];
  ordererId: number;
  partnerId: number;
  paymentMethod: number;
  properties: string;
  providerId: number;
  recipientAddress: TRecipientAddress;
  state: number;
  tenantId: number;
  totalPrice: number;
  transaction: [
    {
      trackingItemTime: string;
      trackingItemState: number;
      trackingItemDetail: string;
    },
  ];
  trackingInfo: [
    {
      actionAt: string;
      title: string;
      content: string;
    },
  ];
  orderItemList: [
    {
      id: ID;
      tenantId: ID;
      name: string;
      itemName: string;
      itemId: ID;
      sku: string;
      originalPrice: number;
      currentPrice: number;
      imageUrl: string;
      isDefault: boolean;
      sales: number;
      stock: number;
      quantity: number;
    },
  ];
};
export type TOrdersDetail = {
  id: ID;
  providerId: ID;
  orderCode: string;
  tenantId: ID;
  type: number;
  ordererId: ID;
  totalPrice: number;
  state: number;
  quantity: number;
  isDeleted: boolean;
  description: string;
  creationTime: string;
  orderItemList: [
    {
      id: ID;
      tenantId: ID;
      name: string;
      itemName: string;
      itemId: ID;
      sku: string;
      originalPrice: number;
      currentPrice: number;
      imageUrl: string;
      isDefault: boolean;
      sales: number;
      stock: number;
      quantity: number;
    },
  ];
  recipientAddress: TRecipientAddress;
  trackingInfo: [
    {
      actionAt: string;
      title: string;
      content: string;
    },
  ];
  paymentMethod: number;
  providerName: string;
  creatorUserId: ID;
};
export type TConfirmPartner = {
  id: number;
  typeAction: number;
  address?: {
    fromProvinceName?: string;
    fromDistrictName?: string;
    fromWardName?: string;
    fromAddress?: string;
    fromName?: string;
    fromPhone?: string;
    height?: number;
    width?: number;
    length?: number;
  };
};
export type TOrdersFilter = TBaseEcofarmFilter & {
  providerId?: number | null;
  formId?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
};
export type TRecipientAddress = {
  toDistrictName: string;
  toName: string;
  toPhone: string;
  toProvinceName: string;
  toWardName: string;
  toAddress: string;
  deliveryProvider: TEDeliveryProvider;
  fromAddress: string;
  fromDistrictName: string;
  fromProvinceName: string;
  fromWardName: string;
  fromName: string;
  fromPhone: string;
  height: number;
  length: number;
  weight: number;
  width: number;
};

export enum TStatusOrder {
  TO_CONFIRM = 1, // Chờ xác nhận

  // Chờ lấy hàng
  TO_SHIP_TO_PROCESS = 21, // đã xác nhận, đang chuẩn bị
  TO_SHIP_PROCESSED = 22, // đã chuẩn bị, chờ vận chuyển

  SHIPPING = 3, // Đang vận chuyển

  // Đã giao
  SHIPPER_COMPLETED = 41, // shipper đã giao
  USER_COMPLETED = 42, // user đã xác nhận nhận hàng
  USER_RATED = 43, // user đã đánh giá đơn hàng

  // Đơn hủy
  CANCELLATION_TO_RESPOND = 51, // chờ phản hồi
  CANCELLATION_CANCELLED = 52, // đã phản hồi

  // trả hàng/hoàn tiền
  RETURN_REFUND_NEW_REQUEST = 61, // yêu cầu mới
  RETURN_REFUND_TO_RESPOND = 62, // đã tiếp nhận
  RETURN_REFUND_RESPONDED = 63, // đã phản hồi
  RETURN_REFUND_COMPLETED = 64, // hoàn thành
}

export enum TEOrderTypeConfirm {
  CONFIRM = 1, //Xác nhận đơn hàng
  CONFIRM_SHIPPING = 2, //Xác nhận giao cho đơn vị vận chuyển
  CONFIRM_SHIPPER_COMPLETED = 3, //Xác nhận giao hàng thành công
  CONFIRM_CANCEL = 4, //Xác nhận hủy đơn hàng
  CONFIRM_RETURN_REFUND = 5, //Xác nhận trả hàng/hoàn tiền
  CONFIRM_TO_SHIP_PROCESSED = 6,
}

export enum TEOrderTypeRefuse {
  REFUSE = 1, //Từ chối đơn hàng
  REFUSE_CANCEL = 2, //Từ chối hủy đơn hàng
  REFUSE_RETURN_REFUND = 3, //Từ chối hoàn tiền trả hàng
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
export enum TItemCondition {
  NEW = 1,
  USED = 2,
}

export type TProviderEcofarmItem = {
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
  state: TProviderEcoFarmState;
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
export type TProviderEcofarmDetail = any;
export type TProviderEcofarmFilter = {
  type?: number | null;
  groupType?: number | null;
  formId?: number | null;
  orderBy?: number | null;
  skipCount?: number | null;
  maxResultCount?: number | null;
  keyword?: string;
  sortBy?: number | null;
};

export type TCreateProviderEcofarmData = {
  name: string;
  email: string;
  contact: string;
  description: string;
  phoneNumber: string;
  imageUrls: string[];
  ownerInfo: string;
  type: number;
  groupType: number;
  latitude: number;
  longitude: number;
  properties: string;
  districtId: string;
  provinceId: string;
  wardId: string;
  address: string;
  carrierList: number[];
};
export type TUpdateProviderEcofarmDetailData = TCreateProviderEcofarmData & {
  id: ID;
};

export enum TPackageStatus {
  ONGOING = 1,
  ACTIVATED = 2,
  COMPLETED = 3,
  CLOSED = 4,
}

export enum TProviderEcoFarmState {
  PENDING = 1,
  ACTIVATED = 2,
  INACTIVATED = 3,
  HIDDEN = 4,
  BLOCKED = 5,
}

export enum TRegisterStatus {
  PENDING_APPROVAL = 1, // chờ duyệt
  INVESTING = 2, // đang đầu tư
  COMPLETED = 3, // hoàn thành
  CANCELLED = 4, // đã hủy
}

export enum TEcofarmType {
  COMBO = 1,
  OTHER = 2,
}
export type TItemTierVariation = {
  name: string;
  optionList: string[];
};
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

export enum TStateTrackingOrderFarm {
  ORDER_PLACED = 1,
  PREPARING_TO_SHIP = 2,
  SHIPPING = 3,
  DELIVERED = 4,
  CANCELLED = 5,
}
export type TVoucherItem = {
  id: ID;
  tenantId: number;
  providerId: number;
  type: number;
  scope: number;
  description: string;
  discountType: number;
  voucherCode: string;
  name: string;
  quantity: number;
  currentUsage: number;
  minBasketPrice: number;
  maxPrice: number;
  percentage: number;
  discountAmount: number;
  dateStart: string;
  dateEnd: string;
  state: number;
  isAdminCreate: boolean;
  maxDistributionBuyer: number;
  listUser: any[];
  creatorUserId: number;
  creationTime: string;
  listItems: any[];
  displayChannelList: any[];
};
export type TVoucherFilter = {
  formId: number;
  providerId?: number;
  keyword?: string;
  orderBy?: number;
  sortBy?: number;
  maxResultCount?: number;
  skipCount?: number;
};

export type TCreateVoucher = {
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
  dateStart: string;
  dateEnd: string;
  maxDistributionBuyer: number;
  listItems: any[];
  displayChannelList: any[];
};
export type TUpdateVoucher = TCreateVoucher & {
  id: ID;
};

export enum TEVoucherDiscountType {
  //Giảm giá theo giá trị cố định
  FIX_AMOUNT = 1,
  //Giảm giá theo phần trăm
  DISCOUNT_PERCENTAGE = 2,
}
export enum TEVoucherType {
  //[EnumDisplayString("Voucher giảm giá vận chuyển")]
  VOUCHER_SHIPPING = 1,
  //[EnumDisplayString("Voucher giảm giá sản phẩm")]
  VOUCHER_DISCOUNT = 2,
}
export enum TEVoucherScope {
  //[EnumDisplayString("Voucher áp dụng toàn shop")]
  SHOP_VOUCHER = 1,
  //[EnumDisplayString("Voucher áp dụng cho từng sản phẩm")]
  PRODUCT_VOUCHER = 2,
}

export enum TEVoucherForm {
  //[EnumDisplayString("Form partner get all vouchers")]
  ALL = 20,
  //[EnumDisplayString("Form partner get all vouchers on_going")]
  ON_GOING = 21,
  //[EnumDisplayString("Form partner get all vouchers up_coming")]
  UPCOMING = 22,
  //[EnumDisplayString("Form partner get all expired")]
  EXPIRED = 23,
}
export enum TEVoucherChannelDisplay {
  //[EnumDisplayString("Tất cả các màn")]
  ALL = 1,
  //[EnumDisplayString("Màn trong shop")]
  SHOP = 2,
  //[EnumDisplayString("Màn đặt sản phẩm")]
  ORDER_PAGE = 3,
  //[EnumDisplayString("Sự kiện")]
  FEED = 4,
  //[EnumDisplayString("Live streaming")]
  LIVE_STREAMING = 5,
}

export type TCategory = {
  id: ID;
  tenantId: number;
  name: string;
  parentId: ID;
  businessType: number;
  iconUrl: string;
  hasChildren: boolean;
};

export type TCategoriesFilter = {
  parentId?: ID;
  businessType?: number;
  search?: string;
  maxResultCount?: number;
  skipCount?: number;
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

export enum TProviderState {
  PENDING = 1,
  ACTIVATED = 2,
  INACTIVATED = 3,
  HIDDEN = 4,
  BLOCKED = 5,
}

export enum TEProviderOrderBy {
  Id = 1,
  Name = 2,
  RatePoint = 3,
  CountRate = 4,
  Distance = 5,
}

export enum TEVoucherOrderBy {
  Id = 1,
  VoucherCode = 2,
  Quantity = 3,
  DiscountAmount = 4,
  DateStart = 5,
  DateEnd = 6,
}
export enum TEEcoFarmPackageFormId {
  GET_ALL = 0,
  GET_ONGOING = 1,
  GET_ACTIVATED = 2,
  GET_COMPLETED = 3,
  GET_CLOSED = 4,
}
export enum TEOrderFormIdPartner {
  PARTNER_ALL = 20,
  PARTNER_TO_PAY = 21,
  PARTNER_TO_SHIP = 22,
  PARTNER_TO_SHIP_TO_PROCESS = 221,
  PARTNER_TO_SHIP_PROCESSED = 222,
  PARTNER_SHIPPING = 23,
  PARTNER_COMPLETED = 24,
  PARTNER_CANCELLATION = 25,
  PARTNER_CANCELLATION_TO_RESPOND = 251,
  PARTNER_CANCELLATION_CANCELLED = 252,
  PARTNER_RETURN_REFUND = 26,
  PARTNER_RETURN_REFUND_NEW_REQUEST = 261,
  PARTNER_RETURN_REFUND_TO_RESPOND = 262,
  PARTNER_RETURN_REFUND_RESPONDED = 263,
  PARTNER_RETURN_REFUND_COMPLETE = 264,
}

export enum TEDeliveryProvider {
  GiaoHangNhanh = 1,
  GiaoHangTietKiem = 2,
  Lalamove = 3,
  Self = 4,
}

export type TCreateEcofarmPaymentData = {};

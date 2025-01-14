import { TRecipientAddress } from "./farm.types";
import { DateISO, ID } from "./global.types";

export type TOrder = {
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
  creationTime: string;
  description: string;
  orderItemList: [
    {
      id: ID;
      tenantId: ID;
      name: string;
      itemId: ID;
      sku: string;
      originalPrice: number;
      currentPrice: number;
      imageUrl: string;
      quantity: number;
      itemName: string;
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
export type TOrderItem = {
  id: ID;
  tenantId: ID;
  name: string;
  itemId: ID;
  sku: string;
  originalPrice: number;
  currentPrice: number;
  imageUrl: string;
  quantity: number;
  itemName: string;
};
export type TOrdersFilter = {
  providerId?: number | null;
  formId?: number | null;
  orderBy?: number | null;
  skipCount?: number | null;
  maxResultCount?: number | null;
  keyword?: string | null;
  sortBy?: number | null;
};
export type TCreateOrderData = {
  tenantId: ID;
  providerId: ID;
  totalPrice: number;
  orderItemList: [
    {
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
      deletionTime: string;
      deleterUserId: ID;
      quantity: number;
      itemName: string;
      id: ID;
    },
  ];
  recipientAddress: {
    name: string;
    phone: string;
    town: string;
    city: string;
    fullAddress: string;
  };
  paymentMethod: number;
};
export type TUpdateOrderDetailData = {
  id: ID;
  recipientAddress: {
    name: string;
    phone: string;
    town: string;
    city: string;
    fullAddress: string;
  };
};

export type TUpdateStateOrderData = {
  id: ID;
  currentState: number;
  updateState: number;
};

export type TStatisticSomeProvidersFilter = {
  listProviderId?: ID[];
  formId?: ID;
  dateFrom?: DateISO;
  dateTo?: DateISO;
  type?: number;
  year?: number;
  month?: number;
  day?: number;
};

export type TOrderStatisticFilter = {
  providerId?: ID;
  formId?: ID;
  dateFrom?: DateISO;
  dateTo?: DateISO;
  type?: number;
  year?: number;
  month?: number;
  day?: number;
};

export type TRankingItem = {
  count: number;
  sales: number;
  itemDto: string;
  itemId: ID;
};
export type TRankingItemsFilter = {
  tenantId?: ID;
  providerId?: ID;
  formId?: number;
  sortBy?: number;
  dateFrom?: string;
  dateTo?: string;
};
export enum TStateOrder {
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

export enum TStateTrackingOrder {
  ORDER_PLACED = 1,
  PREPARING_TO_SHIP = 2,
  SHIPPING = 3,
  DELIVERED = 4,
  CANCELLED = 5,
}

export enum TPaymentMethods {
  COD = 1,
  MOMO = 2,
  VNPAY = 3,
  VIETTELPAY = 4,
}

export enum TPaymentStatus {
  PENDING = 1,
  COMPLETED = 2,
  FAILED = 3,
}

import { DateISO, ID } from "./global.types";

export type TBooking = {
  id: ID;
  tenantId: ID;
  bookingCode: string;
  name: string;
  phoneNumber: string;
  email: string;
  providerId: ID;
  type: number;
  bookerId: ID;
  totalPrice: number;
  state: number;
  bookingItemList: {
    id: ID;
    tenantId: ID;
    isDefault: boolean;
    name: string;
    itemId: ID;
    originalPrice: number;
    currentPrice: number;
    imageUrl: string;
    quantity: number;
    itemName: string;
  }[];
  recipientAddress: {
    districtName: string;
    fullAddress: string;
    name: string;
    phone: string;
    provinceName: string;
    wardName: string;
  } | null;
  paymentMethod: number;
  checkIn: DateISO;
  checkOut: DateISO;
  description: string;
  creationTime: DateISO;
  providerName: string;
  quantity: number;
  creatorUserId: ID;
  partnerId: ID;
  detailCancelRefund: string;
};
export type TBookingsFilter = {
  tenantId?: ID;
  bookerId?: ID;
  search?: string;
  providerId?: ID;
  formId?: number;
  orderBy?: number;
  type?: number;
  minPrice?: number;
  maxPrice?: number;
  dateFrom?: DateISO;
  dateTo?: DateISO;
  maxResultCount?: number;
  skipCount?: number;
};
export type TCreateBookingData = {
  tenantId: ID;
  providerId: ID;
  name: string;
  phoneNumber: string;
  description: string;
  email: string;
  checkIn: DateISO;
  checkOut: DateISO;
  type: number;
  totalPrice: number;
  bookingItemList: {
    id?: ID;
    name: string;
    tenantId?: ID;
    itemId?: ID;
    isDefault?: boolean;
    originalPrice: number;
    currentPrice: number;
    imageUrl: string;
    quantity: number;
    itemName?: string;
  }[];
  recipientAddress: {
    name: string;
    phone: string;
    town: string;
    city: string;
    fullAddress: string;
  };
  paymentMethod: number;
};
export type TUpdateBookingDetailData = {
  id: ID;
  name: string;
  phoneNumber: string;
  description: string;
  email: string;
  checkIn: DateISO;
  checkOut: DateISO;
  recipientAddress: {
    name: string;
    phone: string;
    town: string;
    city: string;
    fullAddress: string;
  };
  paymentMethod: number;
};

export enum TBState {
  WAIT_FOR_CONFIRM = 1,

  CONFIRMED = 2,

  USER_COMPLETED = 3,

  CANCELLATION = 4,
  CANCELLATION_TO_RESPOND = 41,
  CANCELLATION_CANCELLED = 42,

  RETURN_REFUND = 5,
  RETURN_REFUND_NEW_REQUEST = 51,
  RETURN_REFUND_RESPONDED = 52,
  RETURN_REFUND_COMPLETED = 53,
}

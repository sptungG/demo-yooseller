import { ID } from "./global.types";

export type TNotificationsFilter = {
  state?: number;
  appType?: number;
  formId?: number;
  providerId?: number;
  startDate?: string;
  endDate?: string;
  maxResultCount?: number;
  skipCount?: number;
  keyword?: string;
  sortBy?: number;
};

export type TNotificationsDeleteFilter = {
  state?: number;
  appType?: number;
  formId?: number;
  providerId?: number;
  startDate?: string;
  endDate?: string;
};

export type TNotificationSetting = {
  receiveNotifications: boolean;
  notifications: {
    displayName: string;
    description: string;
    name: string;
    isSubscribed: boolean;
  }[];
};

export type TNotificationSettingUpdate = {
  receiveNotifications: boolean;
  notifications: {
    name: string;
    isSubscribed: boolean;
  }[];
};

export type TNotification = {
  creationTime: string;
  creatorUserId: ID;
  // data: '{"Action":"App.CreateOrderSuccessAction","Icon":"App.CreateOrderSuccessIcon","Message":"Đơn hàng được đặt vào lúc 7/19/2023","Description":"","TypeAction":0,"ImageUrl":"","ProviderId":10}';
  data: any;
  dataTypeName: string;
  entityId: string;
  entityTypeAssemblyQualifiedName: string;
  entityTypeName: string;
  excludedUserIds: string;
  id: string;
  notificationName: string;
  severity: number;
  state: number;
  tenantIds: string;
  type: number;
};
export type TNotificationItem = {
  appType: number;
  creationTime: string;
  creatorUserId: ID;
  // data: '{"Action":"App.CreateOrderSuccessAction","Icon":"App.CreateOrderSuccessIcon","Message":"Đơn hàng được đặt vào lúc 7/19/2023","Description":"","TypeAction":0,"ImageUrl":"","ProviderId":10}';
  data: any;
  dataTypeName: string;
  entityId: string;
  entityTypeAssemblyQualifiedName: string;
  entityTypeName: string;
  excludedUserIds: string;
  id: string;
  notificationName: string;
  pageId: number;
  providerId: number;
  severity: number;
  state: number;
  tenantIds: string;
  type: number;
  userId: number;
  serviceType: TEProviderServiceType;
};
export enum TEAppType {
  AppUser = 1, // app user
  AppPartner = 2, // app|web nhà cung cấp (seller)
}

export enum TENotificationState {
  NoSeen = 1, // chưa xem
  Seen = 2, // đã xem
}
export enum TETransactionType {
  Order = 1,
  Booking = 2,
  EcoFarmRegister = 3,
}
export enum TENotificationsPageId {
  NOTIFICATION_PARTNER = 1,
  NOTIFICATION_USER_SHOPPING = 2,
  NOTIFICATION_USER_BOOKING = 3,
  NOTIFICATION_USER_FORUM = 4,

  // eco-farm
  NOTIFICATION_USER_REGISTER_PACKAGE = 5,
  NOTIFICATION_USER_ACTIVITY_PACKAGE = 6,
  NOTIFICATION_PARTNER_REGISTER = 7,
}

export enum TEProviderServiceType {
  Shopping = 1,
  BookingItem = 2,
  BookingNoItem = 3,
  EcoFarm = 4,
}

import { DateISO, ID } from "./global.types";

export type TMessage = {
  creationTime: DateISO;
  id: ID;
  message: string;
  messageRepliedId?: ID;
  providerId: ID;
  readState: number;
  receiverReadState: number;
  sharedMessageId: ID;
  side: number;
  targetTenantId: ID;
  targetUserId: ID;
  tenantId?: ID;
  typeMessage: number;
  userId: ID;
};

export type TCustomer = {
  creationTime: DateISO;
  friendImageUrl: string;
  friendName: string;
  friendTenantId: number;
  friendUserId: ID;
  id: ID;
  isOnline: boolean;
  lastMessage: TMessage;
  lastMessageDate: DateISO;
  providerId: ID;
  tenantId?: ID;
  unreadMessageCount: number;
  userId: ID;
};

export type TMessagesFilter = {
  userId?: number;
  tenantId?: number;
  providerId?: number;
  skipCount?: number;
  maxResultCount?: number;
};

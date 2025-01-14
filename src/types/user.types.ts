import { DateISO, ID } from "./global.types";

export type TGetMeParams = {
  accessToken: string;
};

export type TUser = {
  id: ID;
  userName: string;
  name: string;
  surname: string;
  emailAddress: string;
  isActive: boolean;
  fullName: string;
  phoneNumber?: string;
  lastLoginTime?: string;
  creationTime: string;
  roleNames?: any;
  homeAddress?: any;
  addressOfBirth?: any;
  dateOfBirth?: any;
  gender?: any;
  nationality?: any;
  profilePictureId?: any;
  imageUrl?: any;
  phanKhuId?: any;
  houseId?: any;
  identityNumber?: any;
  qrCodeBase64?: any;
  stateFriend?: number;
};

export type TUpdateUser = {
  userName: string;
  name: string;
  surname: string;
  emailAddress: string;
  isActive: boolean;
  fullName: string;
  phoneNumber: string;
  lastLoginTime: DateISO;
  creationTime: DateISO;
  roleNames: string[];
  homeAddress: string;
  addressOfBirth: string;
  dateOfBirth: DateISO;
  gender: string;
  nationality: string;
  profilePictureId: string;
  imageUrl: string;
  phanKhuId: ID;
  houseId: ID;
  identityNumber: string;
  qrCodeBase64: string;
  stateFriend: ID;
  id: ID;
};

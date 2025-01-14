import { DateISO, ID } from "./global.types";

export type TAmenity = {
  id: ID;
  providerId: number;
  name: string;
  detail: string;
  price: number;
  minimumDeposit: number;
  attributeExtensions: string;
  groupId: number;
  isActive: boolean;
  isDisplay: boolean;
  stock: number;
  avatarUrl: string;
  imageUrls: string[];
  videoUrls: string[];
};

export type TAmenityAttribute = {
  id: ID;
  key: string;
  displayName: string;
  dataType: number;
  inputType: number;
  businessType: number;
  iconUrl: string;
  objectType: number;
  isRequired: boolean;
  unitList: string[];
  valueList: string[];
};

export type TAmenitiesFilter = {
  providerId?: number | null;
  groupId?: number | null;
  skipCount?: number | null;
  maxResultCount?: number | null;
  keyword?: string;
  sortBy?: number | null;
};

export type TAmenitiesAttributesFilter = {
  type?: number | null;
  objectType?: number | null;
};

export type TCreateAmenityData = {
  providerId: number;
  name: string;
  detail?: string;
  price: number;
  minimumDeposit: number;
  attributeExtensions?: string;
  groupId?: number;
  isActive: boolean;
  isDisplay: boolean;
  stock?: number;
  avatarUrl?: string;
  imageUrls?: string[];
  videoUrls?: string[];
};

export type TUpdateAmenityData = {
  id: ID;
  providerId: number;
  name: string;
  detail?: string;
  price: number;
  minimumDeposit: number;
  attributeExtensions?: string;
  groupId?: number;
  isActive: boolean;
  isDisplay: boolean;
  stock?: number;
  avatarUrl?: string;
  imageUrls?: string[];
  videoUrls?: string[];
};

// Amenities Group
export type TAmenitiesGroup = {
  id: ID;
  providerId: number;
  name: string;
  businessType: number;
  description: string;
  attributeExtensions: string;
};

export type TCreateAmenitiesGroup = {
  providerId: number;
  name: string;
  businessType?: number;
  description?: string;
  attributeExtensions?: string;
};

export type TUpdateAmenitiesGroup = {
  id: ID;
  providerId: number;
  name: string;
  businessType?: number;
  description?: string;
  attributeExtensions?: string;
};

export type TAmenitiesGroupFilter = {
  providerId?: number | null;
  skipCount?: number | null;
  maxResultCount?: number | null;
  keyword?: string;
  sortBy?: number | null;
};

// Amenities Combo
export type TAmenitiesCombo = {
  id: ID;
  name: string;
  providerId: number;
  originPrice: number;
  totalPrice: number;
  deposit: number;
  description: string;
  attributeExtensions: string;
  itemIds: number[];
  businessType: number;
  stock: number;
  avatarUrl: string;
};

export type TCreateAmenitiesCombo = {
  name: string;
  providerId: number;
  originPrice: number;
  totalPrice: number;
  deposit: number;
  description?: string;
  attributeExtensions?: string;
  itemIds?: number[];
  businessType?: number;
  stock?: number;
  avatarUrl?: string;
};

export type TUpdateAmenitiesCombo = {
  id: ID;
  name: string;
  providerId: number;
  originPrice: number;
  totalPrice: number;
  deposit: number;
  description?: string;
  attributeExtensions?: string;
  itemIds?: number[];
  businessType?: number;
  stock?: number;
  avatarUrl?: string;
};

export type TAmenitiesComboFilter = {
  providerId?: number | null;
  skipCount?: number | null;
  maxResultCount?: number | null;
  keyword?: string;
  sortBy?: number | null;
};

// Amenities Booking
export type TAmenitiesBooking = {
  id: ID;
  providerInfo: {
    name: string;
    phoneNumber: string;
    email: string;
    imageUrls: string[];
    type: number;
  };
  items: [
    {
      name: string;
      detail: string;
      price: number;
      minimumDeposit: number;
      attributeExtensions: string;
      avatarUrl: string;
      imageUrls: string[];
      videoUrls: string[];
    },
  ];
  combos: any[];
  providerId: number;
  bookingCode: string;
  name: string;
  phoneNumber: string;
  email: string;
  description: string;
  checkIn: DateISO;
  checkOut: DateISO;
  bookerId: number;
  totalPrice: number;
  state: number;
  amenitiesIds: number[];
  amenities: string;
  isAmenitiesBooking: boolean;
  isAmenitiesCombo: boolean;
  totalDepist: number;
  recipientAddress: string;
};

export type TAmenitiesBookingFilter = {
  providerId?: number | null;
  state?: number | null;
  bookingStateFormId?: number | null;
  skipCount?: number | null;
  maxResultCount?: number | null;
  keyword?: string;
  sortBy?: number | null;
};

export type TUpdateStateBooking = {
  id: ID;
  state: number;
  amount: number;
  rejectReason?: string;
};

export const enum EAmenityAttributeDataType {
  string = 1,
  int = 2,
  float = 3,
  date = 4,
  boolean = 5,
  array = 6,
  stringArray = 7,
}

export const dataTypes = [
  { label: "String", value: EAmenityAttributeDataType.string },
  { label: "Int", value: EAmenityAttributeDataType.int },
  { label: "Float", value: EAmenityAttributeDataType.float },
  { label: "Date", value: EAmenityAttributeDataType.date },
  { label: "Boolean", value: EAmenityAttributeDataType.boolean },
  { label: "Array", value: EAmenityAttributeDataType.array },
  { label: "String Array", value: EAmenityAttributeDataType.stringArray },
];

export const enum EAmenityAttributeInputType {
  text = 1,
  textarea = 2,
  number = 3,
  date = 4,
  select = 5,
  multiSelect = 6,
  checkbox = 7,
  radio = 8,
  editor = 9,
  image = 10,
  video = 11,
}

export const inputTypes = [
  { label: "Text", value: EAmenityAttributeInputType.text },
  { label: "Textarea", value: EAmenityAttributeInputType.textarea },
  { label: "Number", value: EAmenityAttributeInputType.number },
  { label: "Date", value: EAmenityAttributeInputType.date },
  { label: "Select", value: EAmenityAttributeInputType.select },
  { label: "MultiSelect", value: EAmenityAttributeInputType.multiSelect },
  { label: "Checkbox", value: EAmenityAttributeInputType.checkbox },
  { label: "Radio", value: EAmenityAttributeInputType.radio },
  { label: "Editor", value: EAmenityAttributeInputType.editor },
  { label: "Image", value: EAmenityAttributeInputType.image },
  { label: "Video", value: EAmenityAttributeInputType.video },
];

export enum TAmenitiesState {
  USER_REQUESTED = 101,
  USER_REQUESTED_WITH_PAY_DEPOSIT = 102,
  USER_REQUESTED_WITH_PAY_ALL = 103,
  USER_CANCELED = 104,
  USER_PAID = 105,
  USER_RATED = 106,

  PROVIDER_ACCEPTED = 201,
  PROVIDER_REJECTED = 202,
  PROVIDER_COMPLETED = 203,
}

export enum TAmenityBookingStateFormId {
  ALL = 0,
  REQUESTED = 1,
  PENDING = 2,
  COMPLETED = 3,
  CANCELED = 4,
  RATED = 5,
}

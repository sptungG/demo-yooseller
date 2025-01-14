export type TLoginData = {
  userNameOrEmailAddress: string;
  password: string;
  tenancyName?: string;
  rememberClient?: boolean;
};

export type TRegisterData = {
  fullName: string;
  name: string;
  surname: string;
  userName: string;
  emailAddress: string;
  password: string;
  captchaResponse?: string;
  isCitizen?: boolean;
  phoneNumber?: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string;
  thirdAccount?: string;
};

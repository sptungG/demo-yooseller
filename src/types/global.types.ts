export type DateISO = string;
export type ID = number;

export type TBaseFilter = {
  formId?: number | null;
  orderBy?: number | null;
  skipCount?: number | null;
  maxResultCount?: number | null;
  keyword?: string;
  sortBy?: number | null;
};

export type TLocale = "vi" | "en" | "ko";

export type TAntdVariant = "borderless" | "outlined" | "filled" | undefined;

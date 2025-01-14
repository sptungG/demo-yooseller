import { ID } from "./global.types";

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

export type TCreateCategoryData = {
  tenantId: number;
  name: string;
  parentId: ID;
  businessType: number;
  iconUrl: string;
  hasChildren: boolean;
};

export type TUpdateCategoryData = {
  id: ID;
  tenantId: number;
  name: string;
  parentId: ID;
  businessType: number;
  iconUrl: string;
  hasChildren: boolean;
};

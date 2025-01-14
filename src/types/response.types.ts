export type TResponse<TResult extends any> = {
  result: TResult;
  error: TError;
  success: boolean;
  targetUrl: string | null;
  unAuthorizedRequest: boolean;
  __abp?: boolean;
};
export type TResultData<TData extends any> = {
  data: TData;
  error: any;
  message: string;
  result_Code: any;
  success: boolean;
  totalRecords: number;
};
export type TError = {
  code: number;
  details: string;
  message: string;
  validationErrors: [{ message: string; members: string[] }] | null;
} | null;

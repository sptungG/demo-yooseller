import { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import {
  setAccessToken,
  setEncryptedAccessToken,
  setFcmToken,
  setRefreshToken,
} from "../reducer/auth.reducer";
import { RootState } from "../store";
import { baseQuery } from "./baseQuery";

type TRefreshTokenRes = {
  accessToken: string;
  encryptedAccessToken: string;
  expireInSeconds: number;
};

// https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#preventing-multiple-unauthorized-errors
const mutex = new Mutex();
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const localRt = (api.getState() as RootState)?.auth?.refreshToken;
        if (!localRt) {
          window.history.replaceState({}, "", "/login");
        } else {
          const refreshResult = await baseQuery(
            {
              url: "/api/TokenAuth/RefreshToken",
              method: "post",
              params: { refreshToken: localRt },
            },
            api,
            extraOptions,
          );
          if ((refreshResult.data as any)?.accessToken) {
            // retry the initial query
            api.dispatch(setAccessToken((refreshResult.data as any).accessToken));
            result = await baseQuery(args, api, extraOptions);
          } else {
            await baseQuery({ url: "/api/TokenAuth/LogOut", method: "get" }, api, extraOptions);
            api.dispatch(setAccessToken(null));
            api.dispatch(setRefreshToken(null));
            api.dispatch(setEncryptedAccessToken(null));
            api.dispatch(setFcmToken(null));
            window.history.replaceState({}, "", "/login");
          }
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

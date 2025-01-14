import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../query/auth.query";

type TState = {
  accessToken: string | null;
  refreshToken: string | null;
  encryptedAccessToken: string | null;
  fcmToken: string | null;
};

const initialState: TState = {
  accessToken: null,
  refreshToken: null,
  encryptedAccessToken: null,
  fcmToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
    },
    setRefreshToken(state, action: PayloadAction<string | null>) {
      state.refreshToken = action.payload;
    },
    setEncryptedAccessToken(state, action: PayloadAction<string | null>) {
      state.encryptedAccessToken = action.payload;
    },
    setFcmToken(state, action: PayloadAction<string | null>) {
      state.fcmToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
      state.accessToken = payload.result.accessToken;
      state.refreshToken = payload.result.refreshToken;
      state.encryptedAccessToken = payload.result.encryptedAccessToken;
    });
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state, action) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.encryptedAccessToken = null;
      state.fcmToken = null;
    });
    builder.addMatcher(authApi.endpoints.logout.matchRejected, (state, { payload }) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.encryptedAccessToken = null;
      state.fcmToken = null;
    });
  },
});

export const { setAccessToken, setRefreshToken, setEncryptedAccessToken, setFcmToken } =
  authSlice.actions;

export default authSlice.reducer;

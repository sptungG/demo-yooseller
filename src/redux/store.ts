import { combineReducers, configureStore, isRejectedWithValue, Middleware } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { getPersistConfig } from "redux-deep-persist";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { addressApi } from "./query/addresses.query";
import { adminApi } from "./query/admin.query";
import { amenityApi } from "./query/amenity.query";
import { authApi } from "./query/auth.query";
import { bookingApi } from "./query/booking.query";
import { categoryApi } from "./query/category.query";
import { chatApi } from "./query/chat.query";
import { customerApi } from "./query/customers.query";
import { farmApi } from "./query/farm.query";
import { fileApi } from "./query/file.query";
import { flashSaleApi } from "./query/flashSale.query";
import { imageApi } from "./query/image.query";
import { itemApi } from "./query/item.query";
import { itemAttributeApi } from "./query/itemAttribute.query";
import { nominatimApi } from "./query/nominatim.query";
import { notificationApi } from "./query/notification.query";
import { orderApi } from "./query/order.query";
import { pageprivateApi } from "./query/pageprivate.query";
import { providerApi } from "./query/provider.query";
import { providerTypeApi } from "./query/providerType.query";
import { provincesApi } from "./query/province.query";
import { userApi } from "./query/user.query";
import { voucherApi } from "./query/voucher.query";

import authReducer, {
  setAccessToken,
  setEncryptedAccessToken,
  setFcmToken,
  setRefreshToken,
} from "./reducer/auth.reducer";
import chatReducer from "./reducer/chat.reducer";
import themeReducer from "./reducer/theme.reducer";
import userReducer, { setUser } from "./reducer/user.reducer";
import visibleReducer from "./reducer/visible.reducer";

const reducers = combineReducers({
  auth: authReducer,
  user: userReducer,
  theme: themeReducer,
  visible: visibleReducer,
  chat: chatReducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
  [providerApi.reducerPath]: providerApi.reducer,
  [bookingApi.reducerPath]: bookingApi.reducer,
  [farmApi.reducerPath]: farmApi.reducer,
  [addressApi.reducerPath]: addressApi.reducer,
  [customerApi.reducerPath]: customerApi.reducer,
  [flashSaleApi.reducerPath]: flashSaleApi.reducer,
  [provincesApi.reducerPath]: provincesApi.reducer,
  [nominatimApi.reducerPath]: nominatimApi.reducer,
  [imageApi.reducerPath]: imageApi.reducer,
  [fileApi.reducerPath]: fileApi.reducer,
  [itemApi.reducerPath]: itemApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [itemAttributeApi.reducerPath]: itemAttributeApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [notificationApi.reducerPath]: notificationApi.reducer,
  [providerTypeApi.reducerPath]: providerTypeApi.reducer,
  [voucherApi.reducerPath]: voucherApi.reducer,
  [pageprivateApi.reducerPath]: pageprivateApi.reducer,
  [amenityApi.reducerPath]: amenityApi.reducer,
});

const persistReducerConfig = getPersistConfig({
  key: "root",
  version: 1,
  storage: storage,
  whitelist: ["auth", "visible.isSiderCollapsed", "theme"],
  rootReducer: reducers,
});

const persistedReducer = persistReducer(persistReducerConfig, reducers);

const rtkQueryErrorLogger: Middleware = (api) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    if (process.env.NODE_ENV !== "production") console.warn("38:", action.payload);
    // [403, 500, "FETCH_ERROR"]
    if ([403].includes(action.payload.status)) {
      api.dispatch(setAccessToken(null));
      api.dispatch(setRefreshToken(null));
      api.dispatch(setEncryptedAccessToken(null));
      api.dispatch(setFcmToken(null));
      api.dispatch(setUser(null));
      window.history.replaceState({}, "", "/login");
    }
    // const { status, data } = action.payload;
    // if (![404, 401].includes(status))
    //   message.error({ content: `${status || 400} : ${data?.err || "Đã có lỗi xảy ra"}` });
  }

  return next(action);
};

const store = configureStore({
  reducer: persistedReducer,
  middleware: (gDM) =>
    gDM({
      serializableCheck: false,
    }).concat(
      authApi.middleware,
      chatApi.middleware,
      fileApi.middleware,
      adminApi.middleware,
      providerApi.middleware,
      provincesApi.middleware,
      bookingApi.middleware,
      flashSaleApi.middleware,
      nominatimApi.middleware,
      imageApi.middleware,
      itemApi.middleware,
      orderApi.middleware,
      itemAttributeApi.middleware,
      categoryApi.middleware,
      providerTypeApi.middleware,
      notificationApi.middleware,
      userApi.middleware,
      farmApi.middleware,
      addressApi.middleware,
      customerApi.middleware,
      voucherApi.middleware,
      pageprivateApi.middleware,
      amenityApi.middleware,
      rtkQueryErrorLogger,
    ),
  devTools: process.env.NODE_ENV !== "production",
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const persistor = persistStore(store);
export default store;

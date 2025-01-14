import { useRouter } from "next/router";
import { useLogoutFcmMutation, useLogoutMutation } from "src/redux/query/auth.query";
import { setConnection } from "src/redux/reducer/chat.reducer";
import { setSiderCollapsed } from "src/redux/reducer/visible.reducer";
import { useAppDispatch, useAppSelector } from "src/redux/store";
import useApp from "./useApp";
import useChangeLocale from "./useChangeLocale";

export default function useLogout() {
  const { notification } = useApp();
  const { replace } = useRouter();
  const [mutateLogout, { isLoading }] = useLogoutMutation();
  const [mutateLogoutFcm, {}] = useLogoutFcmMutation();
  const authData = useAppSelector((s) => s.auth);
  const hubConnection = useAppSelector((s) => s.chat.hubSignalR);
  const dispatch = useAppDispatch();
  const { i18n } = useChangeLocale();

  const deleteFcmToken = () => {
    if (!!authData.fcmToken)
      mutateLogoutFcm({ token: authData.fcmToken })
        .unwrap()
        .then(() => {
          console.log("Token deleted.");
        })
        .catch((err) => {
          console.log("Unable to delete token. ", err);
        });
  };

  const handleLogout = () => {
    mutateLogout({})
      .unwrap()
      .then(() => {
        notification.success({ message: i18n["Đăng xuất thành công"], placement: "bottomRight" });
      })
      .catch((err) => {})
      .finally(() => {
        if (!!hubConnection) {
          hubConnection.off("getBusinessChatMessage");
          hubConnection.off("deleteBusinessChatMessage");
          dispatch(setConnection(undefined));
        }
        dispatch(setSiderCollapsed(false));
        deleteFcmToken();
        replace("/login");
      });
  };
  return { isLoadingLogout: isLoading, handleLogout };
}

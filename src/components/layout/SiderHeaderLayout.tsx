import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import * as signalR from "@microsoft/signalr";
import { useSafeState } from "ahooks";
import { Divider, FloatButton, Layout, LayoutProps, Popover, Space, Typography, theme } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { HiChatAlt2 } from "react-icons/hi";
import { TbChevronDown } from "react-icons/tb";
import { useMediaQuery } from "react-responsive";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useCreateFcmMutation } from "src/redux/query/auth.query";
import { chatApi, useGetCountMessageUnreadUserQuery } from "src/redux/query/chat.query";
import { setConnection } from "src/redux/reducer/chat.reducer";
import { setSiderCollapsed } from "src/redux/reducer/visible.reducer";
import { useAppDispatch, useAppSelector } from "src/redux/store";
import { TMessage } from "src/types/chat.types";
import Button from "../button/Button";
import NotiDrawer from "../drawer/NotiDrawer";
import ProviderSelectG from "../field/ProviderSelectG";
import AutocompleteSearch from "../popover/AutocompleteSearch";
import LocaleSelect from "../popover/LocaleSelect";
import ProfilePopover from "../popover/ProfilePopover";
import Container from "../shared/Container";
import LogoWithText from "./LogoWithText";
import MessageLayout from "./MessageLayout";
import SiderMenuNav, { SiderMenuNavFarm } from "./SiderMenuNav";

// Your Firebase-related code here

type TSiderHeaderLayoutProps = LayoutProps & {
  hideProviderSelect?: boolean;
  hideSider?: boolean;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  type?: string;
};

const SiderHeaderLayout = ({
  children,
  hideProviderSelect,
  hideSider,
  headerLeft,
  headerRight,
  ...props
}: TSiderHeaderLayoutProps) => {
  const { generatedColors } = useTheme();
  const {
    pathname,
    query: { storeId, farmId },
  } = useRouter();
  const { notification } = useApp();
  const { i18n } = useChangeLocale();

  const mediaAbove767 = useMediaQuery({ minWidth: 767 });
  const {
    token: { colorBgBase, colorBgLayout, colorTextSecondary, colorPrimary },
  } = theme.useToken();
  const isSiderCollapsed = useAppSelector((s) => s.visible.isSiderCollapsed);
  const authData = useAppSelector((s) => s.auth);
  const userData = useAppSelector((s) => s.user.data);
  const hubConnection = useAppSelector((s) => s.chat.hubSignalR);
  const dispatch = useAppDispatch();

  const [chatOpen, setChatOpen] = useSafeState(false);

  const [createFcmMutate, {}] = useCreateFcmMutation();
  const { data: getCountMessageUnreadUserRes } = useGetCountMessageUnreadUserQuery(
    {},
    { refetchOnMountOrArgChange: true, refetchOnFocus: true },
  );
  const getCountMessageUnreadUser = getCountMessageUnreadUserRes?.result.data || 0;

  // useEffect(() => {
  //   if ("Notification" in window && "serviceWorker" in navigator && "PushManager" in window) {
  //     const messaging = getMessaging(fapp);
  //     const analytics = getAnalytics(fapp);
  //     Notification.requestPermission().then((permission) => {
  //       if (permission === "granted") {
  //         getToken(messaging, {
  //           vapidKey:
  //             "BKI4dVlnYlpqxcFYK-iWfOBT4CvY8t9-mQ72_Wwc1cPGO2Cvw9EZpAUK_ZwRZqvCoo3enPqdr7xmTgXKOwhY8pw",
  //         })
  //           .then((currentToken) => {
  //             if (currentToken) {
  //               if (!authData.fcmToken) {
  //                 dispatch(setFcmToken(currentToken));
  //                 createFcmMutate({ token: currentToken, tenantId: 0, appType: 2 });
  //               }
  //             } else {
  //               console.log("No Instance ID token available. Request permission to generate one.");
  //               dispatch(setFcmToken(null));
  //             }
  //           })
  //           .catch((err) => {
  //             console.log("An error occurred while retrieving token.");
  //             dispatch(setFcmToken(null));
  //           });
  //       } else {
  //         console.log("Unable to get permission to notify.");
  //       }
  //     });
  //   }
  // }, [authData.fcmToken, dispatch, userData]);

  // useEffect(() => {
  //   if ("Notification" in window && "serviceWorker" in navigator && "PushManager" in window) {
  //     const messaging = getMessaging(fapp);
  //     onMessage(messaging, (payload) => {
  //       dispatch(notificationApi.util.invalidateTags([{ type: "Notifications", id: "LIST" }]));
  //       notification.open({
  //         key: payload.messageId,
  //         placement: "bottomRight",
  //         duration: 3,
  //         message: (
  //           <NotiTitleStyled>
  //             {!!payload?.notification?.image && (
  //               <Avatar
  //                 src={String(payload?.notification?.image)}
  //                 size={60}
  //                 shape="square"
  //               ></Avatar>
  //             )}
  //             <Typography.Text strong ellipsis style={{ maxWidth: 256 }}>
  //               {payload?.notification?.title}
  //             </Typography.Text>
  //           </NotiTitleStyled>
  //         ),
  //         description: (
  //           <Typography.Text ellipsis type="secondary" style={{ maxWidth: 256 }}>
  //             {payload?.notification?.body}
  //           </Typography.Text>
  //         ),
  //       });
  //     });
  //   }
  // });

  useEffect(() => {
    if (!hubConnection && !!authData.encryptedAccessToken) {
      const _hubConnection = new signalR.HubConnectionBuilder()
        .withAutomaticReconnect()
        .withUrl(
          process.env.NEXT_PUBLIC_API_ENDPOINT +
            "/messager?enc_auth_token" +
            encodeURIComponent(authData.encryptedAccessToken),
          {
            transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
          },
        )
        .build();
      _hubConnection
        .start()
        .then(() => {
          console.log("[START_CONNECT_HUBCONNECTION]");
        })
        .catch((err: any) => {
          console.log("[ERROR_START_CONNECT_SIGNALR]", err);
        });
      _hubConnection.onclose((e: any) => {
        if (e) {
          console.log("Chat connection closed with error: ", e);
        } else {
          console.log("Chat disconnected");
        }
        _hubConnection.start().then(() => {});
      });
      _hubConnection?.on("getBusinessChatMessage", (message: TMessage) => {
        dispatch(
          chatApi.util.invalidateTags([
            { type: "Messages", id: "LIST" },
            { type: "Conversations", id: "LIST" },
          ]),
        );
      });
      _hubConnection?.on("deleteBusinessChatMessage", (message: TMessage) => {
        dispatch(
          chatApi.util.invalidateTags([
            { type: "Messages", id: "LIST" },
            { type: "Conversations", id: "LIST" },
          ]),
        );
      });
      dispatch(setConnection(_hubConnection));
    }
    return () => {};
  }, [authData.encryptedAccessToken, hubConnection]);

  return (
    <SiderHeaderLayoutStyled {...props}>
      <header className="header-wrapper" style={{ backgroundColor: colorBgBase }}>
        <div className="header-left">
          {!!headerLeft ? (
            headerLeft
          ) : (
            <LogoWithText
              fontSize={pathname !== "/" ? [0, 0] : [26, 26]}
              logoSize={[48, 48]}
              style={{ height: 64 }}
            />
          )}
        </div>
        <Space
          className="header-right"
          wrap={false}
          size={3}
          align="center"
          split={<Divider type="vertical" />}
        >
          {headerRight}
          {!hideProviderSelect && (
            <div className="provider">
              <ProviderSelectG
                size="large"
                placement="bottomRight"
                className="border-b"
                popupMatchSelectWidth={424}
              />
            </div>
          )}
          {/* {!!storeId && (
            <Badge
              color={generatedColors[6]}
              count={getCountMessageUnreadUser}
              overflowCount={10}
              offset={[-2, 2]}
            >
              <Button
                className="message-item"
                type="text"
                color="#595959"
                icon={<HiChatAlt2 size={24} />}
                onClick={() => setChatOpen(!chatOpen)}
              ></Button>
            </Badge>
          )} */}
          <NotiDrawer />
          {!!storeId && <AutocompleteSearch />}
          <LocaleSelect />
          <ProfilePopover />
        </Space>
      </header>
      <Layout
        className="layout"
        hasSider
        style={{ position: "relative", zIndex: 0, width: "100vw" }}
      >
        {!hideSider && mediaAbove767 && (
          <Layout.Sider
            className="sider"
            collapsible
            collapsed={isSiderCollapsed}
            onCollapse={(c) => dispatch(setSiderCollapsed(c))}
            width={220}
            collapsedWidth={84}
            theme="light"
          >
            <Container
              className="sider-container"
              suppressScrollX
              style={{ height: "100%", paddingBottom: 48 }}
            >
              {!!farmId ? <SiderMenuNavFarm /> : <SiderMenuNav />}
            </Container>
          </Layout.Sider>
        )}
        {children}
      </Layout>
      {!!storeId && (
        <Popover
          placement="left"
          arrow={false}
          title={
            <ChatTitleStyled>
              <div className="left-wrapper">
                <Typography.Text style={{ fontSize: 18, color: colorPrimary }}>
                  Chat
                </Typography.Text>
                {!!getCountMessageUnreadUser ? (
                  <Typography.Text style={{ fontSize: 12, marginLeft: 4, color: colorPrimary }}>
                    {`(${getCountMessageUnreadUser})`}
                  </Typography.Text>
                ) : (
                  <></>
                )}
              </div>
              <div className="right-wrapper">
                <Button
                  size="small"
                  icon={<TbChevronDown />}
                  tooltip={i18n["Thu gọn"]}
                  tooltipProps={{ placement: "left" }}
                  onClick={() => setChatOpen(false)}
                ></Button>
              </div>
            </ChatTitleStyled>
          }
          content={<MessageLayout />}
          trigger={["click"]}
          overlayInnerStyle={{ padding: 0 }}
          open={chatOpen}
          onOpenChange={setChatOpen}
        >
          <FloatButtonStyled
            icon={<HiChatAlt2 size={24} />}
            description="Chat"
            shape="square"
            style={{ right: 0, bottom: 64 }}
            badge={{
              count: getCountMessageUnreadUser,
              overflowCount: 99,
              color: generatedColors[6],
            }}
          />
        </Popover>
      )}
    </SiderHeaderLayoutStyled>
  );
};

const FloatButtonStyled = styled(FloatButton)`
  border-radius: 8px 0 0 8px;
  .ant-float-btn-body {
    min-height: 64px;
    border-radius: 8px 0 0 8px;
    .ant-float-btn-content {
      padding: 0;
      .ant-float-btn-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        svg {
          flex-shrink: 0;
        }
      }
    }
  }
`;

const ChatTitleStyled = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: -8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  & > .left-wrapper {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
  }
  & > .right-wrapper {
    padding: 16px;
    margin-left: auto;
    display: flex;
    align-items: center;
  }
`;

const NotiTitleStyled = styled.div`
  position: relative;
  z-index: 1;
  .ant-avatar {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(30px, -2px);
    z-index: 1;
  }
`;

const SiderHeaderLayoutStyled = styled(Layout)`
  position: relative;
  align-items: flex-start;
  flex-direction: column;
  min-height: 100dvh;
  & > .layout {
    flex: 1 1 auto;
    min-width: 0px;
    min-height: 0px;
    & > .bg-image-wrapper {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 100%;
      width: 100%;
      z-index: -1;
      opacity: 0.2;
    }
  }
  .sider {
    height: calc(100vh - 64px);
    position: sticky;
    top: 64px;
    padding: 0;
    &:before {
      content: " ";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0.25;
      background-image: url(/images/nav_nachos_2x.png);
      background-position: left 0 bottom 0;
      background-repeat: no-repeat;
      background-size: 220px 452px;
      z-index: -1;
    }
    /* .sider-container {
      background-color: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(2px);
    } */
    .logo-wrapper {
      padding-left: 20px;
    }
    .ant-layout-sider-children {
      margin-bottom: 80px;
    }
    .collapse-button {
      position: absolute;
      top: 32px;
      right: 0;
      transform: translate(50%, -50%);
      z-index: 10;
    }
  }
  & > .header-wrapper {
    position: sticky;
    top: 0;
    width: 100%;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    padding: 0 12px;
    flex: 0 0 64px;
    z-index: 1;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02),
      0 2px 4px 0 rgba(0, 0, 0, 0.02);
    .header-left {
      flex: 1 1 auto;
      max-width: 560px;
      min-width: 0px;
      flex-shrink: 0;
    }
    .header-right {
      flex: 0 0 none;
      margin-left: 24px;
    }
  }
  .ant-statistic-content {
    display: flex;
    align-items: center;
    .ant-statistic-content-prefix {
      height: fit-content;
      display: flex;
    }
  }
`;

export default SiderHeaderLayout;

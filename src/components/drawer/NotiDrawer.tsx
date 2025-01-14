import { LoadingOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { useSafeState, useSize } from "ahooks";
import { Badge, Divider, Dropdown, Empty, Popconfirm, Space, Tabs, Typography } from "antd";
import VirtualList from "rc-virtual-list";
import { useId, useRef, useState } from "react";
import { BsCheck2, BsCheck2All, BsCheckLg, BsXLg } from "react-icons/bs";
import { FaBell } from "react-icons/fa";
import { MdOutlineDeleteSweep } from "react-icons/md";
import { TbTrash } from "react-icons/tb";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import {
  useDeleteAllNotificationsMutation,
  useDeleteNotificationMutation,
  useGetCountNotificationsQuery,
  useGetListNotificationsQuery,
  useSetAllAsReadNotificationsMutation,
  useSetAsReadNotificationsMutation,
  useSetAsUnReadNotificationsMutation,
} from "src/redux/query/notification.query";
import {
  TEAppType,
  TENotificationState,
  TEProviderServiceType,
  TETransactionType,
  TNotificationItem,
  TNotificationsFilter,
} from "src/types/notification.types";
import { formatDate } from "src/utils/utils-date";
import Avatar from "../avatar/Avatar";
import Button from "../button/Button";
import Spin from "../loader/Spin";
import Pagination from "../shared/Pagination";

type TNotiDrawerProps = {};

const NotiDrawer = ({}: TNotiDrawerProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { message } = useApp();
  const ref = useRef<HTMLDivElement | null>(null);
  const size = useSize(ref);
  const [isOpen, setIsOpen] = useState(false);

  const [filterData, setFilterData] = useSafeState<TNotificationsFilter>({
    appType: TEAppType.AppPartner,
    state: TENotificationState.NoSeen,
    //formId: TENotificationsPageId.NOTIFICATION_PARTNER,
    maxResultCount: 10,
    sortBy: 1,
  });
  const {
    data: getAllNotificationsRes,
    refetch,
    isFetching,
  } = useGetListNotificationsQuery(filterData, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const { data: getCountData } = useGetCountNotificationsQuery(
    { ...filterData, state: undefined },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const getAllNotificationsData = getAllNotificationsRes?.data;
  const currentListLength = getAllNotificationsData?.length;

  const totalUnread = getCountData?.data?.totalUnread || 0;
  const total = getCountData?.data?.totalCount || 0;
  const totalRead = total - totalUnread;

  const [mutateSetAllNotificationsAsRead, { isLoading: isLoadingAllNotificationsAsRead }] =
    useSetAllAsReadNotificationsMutation();
  const [mutateSetNotificationAsRead, { isLoading: isLoadingSetNotificationAsRead }] =
    useSetAsReadNotificationsMutation();
  const [mutateSetNotificationAsUnRead, { isLoading: isLoadingSetNotificationAsUnRead }] =
    useSetAsUnReadNotificationsMutation();
  const [mutateDeleteNotification, { isLoading: isLoadingDeleteNotification }] =
    useDeleteNotificationMutation();
  const [mutateDeleteAllUserNotification, { isLoading: isLoadingDeleteAllUserNotification }] =
    useDeleteAllNotificationsMutation();

  const handleRefresh = () => {
    refetch();
  };

  const handleSetAllRead = async () => {
    try {
      const res = await mutateSetAllNotificationsAsRead({}).unwrap();
      message.success(i18n["Đánh đấu đã đọc tất cả thông báo thành công"]);
    } catch (error) {
      message.error(i18n["Đã có lỗi xảy ra khi đánh đấu đã đọc tất cả thông báo"]);
    }
  };

  const handleSetReadItem = async (id?: string) => {
    try {
      if (!id) return;
      const res = await mutateSetNotificationAsRead({ id }).unwrap();
      message.success(i18n["Đánh dấu đã đọc thông báo thành công"]);
    } catch (error) {
      message.error(i18n["Đã có lỗi xảy ra khi đánh dấu đã đọc thông báo"]);
    }
  };

  const handleSetUnReadItem = async (id?: string) => {
    try {
      if (!id) return;
      const res = await mutateSetNotificationAsUnRead({ id }).unwrap();
      message.success(i18n["Đánh dấu chưa đọc thông báo thành công"]);
    } catch (error) {
      message.error(i18n["Đã có lỗi xảy ra khi đánh dấu chưa đọc thông báo"]);
    }
  };

  const handleDeleteItem = async (id?: string) => {
    try {
      if (!id) return;
      const res = await mutateDeleteNotification({ id }).unwrap();
      message.success(i18n["Xóa thông báo thành công"]);
    } catch (error) {
      message.error(i18n["Đã có lỗi xảy ra khi xóa thông báo"]);
    }
  };

  const handleDeleteAll = async (filter: TNotificationsFilter) => {
    try {
      if (!Object.keys(filter).length) return;
      const res = await mutateDeleteAllUserNotification(filter).unwrap();
      message.success(i18n["Xóa tất cả thông báo thành công"]);
    } catch (error) {
      message.error(i18n["Đã có lỗi xảy ra khi xóa tất cả thông báo"]);
    }
  };
  const viewDetail = async (itemView: TNotificationItem) => {
    let url = "";
    if (itemView.data?.transactionType == TETransactionType.Order) {
      if (itemView.serviceType == TEProviderServiceType.Shopping)
        url =
          "/supplier/store/" + itemView.providerId + "/order?sid=" + itemView.data?.transactionId;
      else if (itemView.serviceType == TEProviderServiceType.EcoFarm)
        url =
          "/supplier/farm/" + itemView.providerId + "/order?sid=" + itemView.data?.transactionId;
    } else if (itemView.data?.transactionType == TETransactionType.EcoFarmRegister)
      url =
        "/supplier/farm/" + itemView.providerId + "/register?sid=" + itemView.data?.transactionId;
    else if (itemView.data?.transactionType == TETransactionType.Booking)
      url =
        "/supplier/store/" + itemView.providerId + "/booking?sid=" + itemView.data?.transactionId;
    if (itemView.state === 1) {
      const res = await mutateSetNotificationAsRead({ id: itemView.id }).unwrap();
    }
    window.location.href = url;
  };

  return (
    <>
      <Dropdown
        trigger={["click"]}
        open={isOpen}
        onOpenChange={setIsOpen}
        mouseEnterDelay={0.01}
        mouseLeaveDelay={0.01}
        placement="bottomRight"
        destroyPopupOnHide
        dropdownRender={() => (
          <NotiDrawerStyled ref={ref} id={uid}>
            <div className="title-wrapper">
              <Tabs
                className="tabs"
                size={"middle"}
                tabBarStyle={{ margin: 0, padding: "0 6px 0 18px" }}
                items={[
                  {
                    label: (
                      <Typography.Text style={{ margin: 0 }}>
                        {i18n["Đã đọc"]} • {totalRead}
                      </Typography.Text>
                    ),
                    key: "2",
                  },
                  {
                    label: (
                      <Typography.Text style={{ margin: 0 }}>
                        {i18n["Chưa đọc"]} • {totalUnread}
                      </Typography.Text>
                    ),
                    key: "1",
                  },
                ]}
                tabBarGutter={16}
                defaultActiveKey="0"
                activeKey={String(filterData?.state || 0)}
                onChange={(key) => {
                  setFilterData({ ...filterData, state: +key });
                }}
                tabBarExtraContent={
                  <Space size={0} split={<Divider type="vertical" />}>
                    {filterData.state === 1 && (
                      <Popconfirm
                        placement="bottomRight"
                        title={`${i18n["Đánh đấu đã đọc tất cả thông báo"]}?`}
                        onConfirm={() => handleSetAllRead()}
                        okText={<BsCheckLg size={16} />}
                        cancelText={<BsXLg size={16} />}
                        arrow={{ pointAtCenter: true }}
                        getPopupContainer={(node) => {
                          return document.getElementById(uid) || document.body;
                        }}
                      >
                        <Button
                          title={`${i18n["Đánh đấu đã đọc tất cả thông báo"]}?`}
                          loading={isLoadingAllNotificationsAsRead}
                          icon={<BsCheck2All size={20} />}
                          shape={"circle"}
                          type="dashed"
                        ></Button>
                      </Popconfirm>
                    )}
                    <Popconfirm
                      placement="bottomRight"
                      title={`${i18n["Xóa tất cả thông báo"]} ${
                        !!filterData.state
                          ? i18n["Đã đọc"].toLowerCase()
                          : i18n["Chưa đọc"].toLowerCase()
                      }?`}
                      onConfirm={() => handleDeleteAll({ ...filterData })}
                      cancelText={<BsXLg size={16} />}
                      okText={<TbTrash size={16} />}
                      okButtonProps={{ danger: true }}
                      arrow={{ pointAtCenter: true }}
                      getPopupContainer={(node) => {
                        return document.getElementById(uid) || document.body;
                      }}
                    >
                      <Button
                        loading={isLoadingDeleteAllUserNotification}
                        icon={<MdOutlineDeleteSweep size={18} />}
                        shape={"circle"}
                        type="dashed"
                        title={`${i18n["Xóa tất cả thông báo"]} ${
                          !!filterData.state
                            ? i18n["Đã đọc"].toLowerCase()
                            : i18n["Chưa đọc"].toLowerCase()
                        }?`}
                      ></Button>
                    </Popconfirm>
                  </Space>
                }
              />
            </div>
            <Spin spinning={isFetching} wrapperClassName="body-wrapper">
              {!!currentListLength ? (
                <VirtualList
                  data={getAllNotificationsData || []}
                  height={
                    !currentListLength ? 500 : currentListLength > 5 ? 500 : currentListLength * 76
                  }
                  itemHeight={76}
                  itemKey="id"
                >
                  {(item) => {
                    //const itemData = JSON.parse(item.data);
                    const itemData = item.data;
                    return (
                      <NotiItemStyled key={uid + item.id}>
                        <div className="left-wrapper">
                          <Badge dot={item.state === 1} status="error">
                            <Avatar size={48} shape="square" src={String(itemData.imageUrl)} />
                          </Badge>
                        </div>
                        <div className="right-wrapper" onClick={() => viewDetail(item)}>
                          <Typography.Text strong ellipsis className="notificationName">
                            {item.notificationName}
                          </Typography.Text>
                          <Typography.Paragraph
                            type="secondary"
                            ellipsis={{
                              rows: 2,
                              tooltip: {
                                title: itemData.message,
                                placement: "bottomRight",
                                arrow: false,
                              },
                            }}
                            className="message"
                          >
                            {itemData.message}
                          </Typography.Paragraph>
                          <Typography.Text type="secondary" className="creationTime">
                            {formatDate(item.creationTime, "HH:mm DD/MM/YYYY")}
                          </Typography.Text>
                        </div>
                        <div className="actions-wrapper">
                          {item.state === 1 && (
                            <Button
                              title={i18n["Đánh dấu đã đọc"]}
                              icon={<BsCheck2 size={20} />}
                              shape={"circle"}
                              type="text"
                              onClick={() => handleSetReadItem(item.id)}
                            ></Button>
                          )}
                          {item.state === 2 && (
                            <Button
                              title={i18n["Đánh dấu chưa đọc"]}
                              icon={<BsCheck2 size={20} />}
                              shape={"circle"}
                              type="text"
                              onClick={() => handleSetUnReadItem(item.id)}
                            ></Button>
                          )}
                          {!!item.state && (
                            <Button
                              title={i18n["Xóa thông báo"]}
                              icon={<TbTrash size={20} />}
                              shape={"circle"}
                              type="text"
                              onClick={() => handleDeleteItem(item.id)}
                            ></Button>
                          )}
                        </div>
                      </NotiItemStyled>
                    );
                  }}
                </VirtualList>
              ) : (
                <div className="body-wrapper-empty">
                  <Empty className="list-empty" imageStyle={{ height: 144 }} description={false} />
                </div>
              )}
            </Spin>
            <div className="footer-wrapper">
              {!!getAllNotificationsRes?.totalRecords && (
                <Pagination
                  showLessItems
                  showSizeChanger={false}
                  total={getAllNotificationsRes?.totalRecords || 0}
                  pageSizeOptions={[10, 20, 50, 100]}
                  defaultPageSize={10}
                  onChange={(current, pageSize) => {
                    setFilterData({
                      ...filterData,
                      skipCount: pageSize * (current > 0 ? current - 1 : 0),
                      maxResultCount: pageSize,
                    });
                  }}
                />
              )}
            </div>
          </NotiDrawerStyled>
        )}
      >
        <Badge
          count={
            isFetching ? (
              <LoadingOutlined spin rev={undefined} />
            ) : totalUnread > 9 ? (
              "9+"
            ) : (
              totalUnread
            )
          }
          offset={[-2, 2]}
        >
          <Button
            type="text"
            color="#595959"
            icon={<FaBell size={22} />}
            onClick={() => setIsOpen(true)}
          ></Button>
        </Badge>
      </Dropdown>
    </>
  );
};

const NotiDrawerStyled = styled.div`
  max-height: calc(100vh - 54px);
  width: 500px;
  background: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px #f0f1f2;
  border-radius: 8px;
  & > .title-wrapper {
    padding: 0;
    flex: 0 0 54px;
    .ant-tabs .ant-tabs-tab {
      padding: 16px 0;
    }
  }
  & > .body-wrapper {
    padding: 0;
    flex: 1 1 auto;
    min-height: 0px;
    z-index: 0;
  }
  & .body-wrapper-empty {
    padding: 24px 0;
  }

  & > .footer-wrapper {
    margin-top: auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 10px 4px;
    background: #fff;
    z-index: 1;
    flex: 0 0 53px;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }
`;
const NotiItemStyled = styled.div`
  display: flex;
  cursor: pointer;
  padding: 14px 6px 10px 16px;
  & > .left-wrapper {
    flex: 0 0 48px;
    min-width: 0px;
    margin-right: 14px;
  }
  & > .right-wrapper {
    flex: 1 1 auto;
    min-width: 0px;
    display: flex;
    flex-direction: column;
    .notificationName {
      line-height: 1;
      margin-bottom: 2px;
    }
    .message {
      margin-bottom: 0;
      line-height: 1.2;
    }
    .creationTime {
      font-size: 12px;
    }
  }
  & > .actions-wrapper {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    margin-left: auto;
    margin-top: -8px;
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    & > .right-wrapper {
      .notificationName {
        color: ${({ theme }) => theme.colorPrimary};
      }
    }
  }
`;

export default NotiDrawer;

import Avatar from "@/components/avatar/Avatar";
import Card from "@/components/card/Card";
import Spin from "@/components/loader/Spin";
import useApp from "@/hooks/useApp";
import useChangeLocale from "@/hooks/useChangeLocale";
import {
  useDeleteNotificationMutation,
  useGetListNotificationsQuery,
  useSetAsReadNotificationsMutation,
  useSetAsUnReadNotificationsMutation,
} from "@/redux/query/notification.query";
import {
  TEAppType,
  TENotificationState,
  TEProviderServiceType,
  TETransactionType,
  TNotificationsFilter,
} from "@/types/notification.types";
import { formatDate } from "@/utils/utils-date";
import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/query";
import { useDebounce } from "ahooks";
import { Badge, Button, CardProps, Empty, Flex, Typography } from "antd";
import VirtualList from "rc-virtual-list";
import { useId, useState } from "react";
import { BsCheck2 } from "react-icons/bs";
import { TbTrash } from "react-icons/tb";

type TNotificationsCardProps = CardProps & {
  storeId?: number;
  desc?: string;
};

const NotificationsCard = ({ storeId, desc, ...props }: TNotificationsCardProps) => {
  const uid = useId();
  const { message } = useApp();
  const { i18n } = useChangeLocale();
  const [filterData, setFilterData] = useState<TNotificationsFilter>({
    appType: TEAppType.AppPartner,
    state: TENotificationState.NoSeen,
    sortBy: 1,
    maxResultCount: 10,
  });
  const debouncedFilterData = useDebounce(
    {
      ...filterData,
      providerId: storeId,
    },
    { wait: 500 },
  );
  const { data, refetch, isFetching } = useGetListNotificationsQuery(
    debouncedFilterData?.providerId ? debouncedFilterData : skipToken,
    {
      refetchOnMountOrArgChange: true,
      pollingInterval: 60000 * 2,
    },
  );

  const itemListData = data?.data || [];
  const itemListTotal = data?.totalRecords;
  const [mutateSetNotificationAsRead, { isLoading: isLoadingSetNotificationAsRead }] =
    useSetAsReadNotificationsMutation();
  const [mutateSetNotificationAsUnRead, { isLoading: isLoadingSetNotificationAsUnRead }] =
    useSetAsUnReadNotificationsMutation();
  const [mutateDeleteNotification, { isLoading: isLoadingDeleteNotification }] =
    useDeleteNotificationMutation();
  const handleSetReadItem = async (id?: string) => {
    try {
      if (!id) return;
      const res = await mutateSetNotificationAsRead({ id }).unwrap();
      message.success(i18n["Đánh dấu đã đọc thông báo thành công"]);
    } catch (error) {
      message.error(i18n["Đã có lỗi xảy ra khi đánh dấu đã đọc thông báo"]);
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
  const handleSetUnReadItem = async (id?: string) => {
    try {
      if (!id) return;
      const res = await mutateSetNotificationAsUnRead({ id }).unwrap();
      message.success(i18n["Đánh dấu chưa đọc thông báo thành công"]);
    } catch (error) {
      message.error(i18n["Đã có lỗi xảy ra khi đánh dấu chưa đọc thông báo"]);
    }
  };

  return (
    <StyledWrapper {...props}>
      {!!desc && (
        <Typography.Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
          {desc}
        </Typography.Text>
      )}
      <Spin spinning={isFetching} wrapperClassName="body-wrapper">
        {!!itemListData?.length ? (
          <VirtualList data={itemListData || []} height={180} itemHeight={80} itemKey="id">
            {(item) => {
              // const itemData = JSON.parse(item.data);
              const itemData = item.data;
              let url = "/";
              if (item.data?.transactionType == TETransactionType.Order) {
                if (item.serviceType == TEProviderServiceType.Shopping)
                  url =
                    "/supplier/store/" + item.providerId + "/order?sid=" + item.data?.transactionId;
                else if (item.serviceType == TEProviderServiceType.EcoFarm)
                  url =
                    "/supplier/farm/" + item.providerId + "/order?sid=" + item.data?.transactionId;
              } else if (item.data?.transactionType == TETransactionType.EcoFarmRegister) {
                url =
                  "/supplier/farm/" + item.providerId + "/register?sid=" + item.data?.transactionId;
              } else if (item.data?.transactionType == TETransactionType.Booking) {
                url =
                  "/supplier/store/" + item.providerId + "/booking?sid=" + item.data?.transactionId;
              }

              return (
                <Flex key={uid + item.id} style={{ padding: "8px 8px 0 8px" }}>
                  <Badge
                    dot={item.state === 1}
                    status="error"
                    styles={{ root: { marginRight: 8, flexShrink: 0, width: 48 } }}
                  >
                    <Avatar size={48} shape="square" src={String(itemData.imageUrl)} />
                  </Badge>
                  <Flex vertical flex={"1 1 auto"} style={{ minWidth: 0, marginTop: -4 }}>
                    <Typography.Link strong href={url} ellipsis title={item.notificationName}>
                      {item.notificationName}
                    </Typography.Link>
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
                      style={{ margin: 0, lineHeight: 1.1 }}
                    >
                      {itemData.message}
                    </Typography.Paragraph>
                    <Typography.Text type="secondary" className="creationTime">
                      {formatDate(item.creationTime, "DD-MM-YYYY HH:mm")}
                    </Typography.Text>
                  </Flex>
                  <Flex align="flex-start" style={{ margin: "-8px -6px 0 0" }}>
                    {item.state === 1 && (
                      <Button
                        title={i18n["Đánh dấu đã đọc"]}
                        icon={<BsCheck2 size={20} />}
                        shape={"circle"}
                        type="text"
                        onClick={() => handleSetReadItem(item.id)}
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
                  </Flex>
                </Flex>
              );
            }}
          </VirtualList>
        ) : (
          <div className="body-wrapper-empty">
            <Empty
              className="list-empty"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              imageStyle={{ height: 80 }}
              description={false}
            />
          </div>
          // <Skeleton
          //   title={false}
          //   paragraph={{ rows: 4, ...(typeof paragraph === "object" ? paragraph : {}) }}
          //   style={{ margin: "4px 0 -8px" }}
          // />
        )}
      </Spin>
    </StyledWrapper>
  );
};

const StyledWrapper = styled(Card)``;

export default NotificationsCard;

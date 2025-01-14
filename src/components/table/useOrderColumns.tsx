import styled from "@emotion/styled";
import { Divider, Dropdown, Empty, Flex, Popover, TagProps, Timeline, Typography } from "antd";
import type { ColumnGroupType, ColumnType } from "antd/es/table";
import { CSSProperties, useId } from "react";
import { BiEdit } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaInfo } from "react-icons/fa";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useStateConf from "src/hooks/useStateConf";
import { TOrder, TStateOrder } from "src/types/order.types";
import { formatNumber, getTotalByDatakey, mappedAddressDetail } from "src/utils/utils";
import { formatDate } from "src/utils/utils-date";
import Avatar, { AvatarGroup } from "../avatar/Avatar";
import Button from "../button/Button";
import PaymentMethodTag from "../tag/PaymentMethodTag";
import Tag from "../tag/Tag";
import SmItemModelTableStyled from "./SmItemModelTable";
import {
  CurrentStateActionBtn,
  ItemsInfoWrapper,
  Price2Wrapper,
  RecipientAddressWrapper,
  TrackingInfoWrapper,
} from "./StyledTable";
import useItemModelColumns from "./useItemModelColumns";

type TuseOrderColumnsProps = { onClickUpdateState?: (order: TOrder) => void };

type TRes = Record<string, ColumnGroupType<TOrder> | ColumnType<TOrder>>;

const useOrderColumns = ({ onClickUpdateState }: TuseOrderColumnsProps): TRes => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { message } = useApp();

  const { nameCombined2, sku, quantity, currentPrice, originalPrice } = useItemModelColumns({});

  const { mappedOrderStateTrackingConf } = useStateConf();
  const statusStyle = (status: TStateOrder): CSSProperties => ({
    opacity: [TStateOrder.CANCELLATION_CANCELLED].includes(status) ? 0.45 : 1,
  });

  const stateTagConf: Record<string, TagProps> = {
    [TStateOrder.TO_CONFIRM]: {
      color: "default",
      children: i18n["Chờ xác nhận"],
    },
    [TStateOrder.TO_SHIP_TO_PROCESS]: {
      color: "blue",
      children: i18n["Đã xác nhận, đang chuẩn bị"],
    },
    [TStateOrder.TO_SHIP_PROCESSED]: {
      color: "blue",
      children: i18n["Đã chuẩn bị, chờ vận chuyển"],
    },
    [TStateOrder.SHIPPING]: {
      color: "blue",
      children: i18n["Đang giao"],
    },
    [TStateOrder.SHIPPER_COMPLETED]: {
      color: "blue",
      children: i18n["Shipper hoàn thành giao"],
    },
    [TStateOrder.USER_COMPLETED]: {
      color: "green",
      children: i18n["Ng. nhận hoàn thành đơn"],
    },
    [TStateOrder.USER_RATED]: {
      color: "green",
      children: i18n["Ng. nhận đã đánh giá"],
    },
    [TStateOrder.CANCELLATION_TO_RESPOND]: {
      color: "default",
      children: i18n["Yêu cầu huỷ"],
    },
    [TStateOrder.CANCELLATION_CANCELLED]: {
      color: "red",
      children: i18n["Đã xác nhận huỷ đơn"],
    },
    [TStateOrder.RETURN_REFUND_NEW_REQUEST]: {
      color: "red",
      children: i18n["Yêu cầu hoàn đơn"],
    },
    [TStateOrder.RETURN_REFUND_TO_RESPOND]: {
      color: "red",
      children: i18n["Hoàn đơn"],
    },
    [TStateOrder.RETURN_REFUND_RESPONDED]: {
      color: "red",
      children: i18n["Đã phản hồi hoàn đơn"],
    },
    [TStateOrder.RETURN_REFUND_COMPLETED]: {
      color: "red",
      children: i18n["Đã hoàn đơn"],
    },
  };

  return {
    codeCombined2: {
      title: i18n["Đơn hàng"],
      dataIndex: "orderCode",
      key: "orderCode",
      ellipsis: true,
      render: (text, item, index) => (
        <Flex vertical style={{ maxWidth: "100%", ...statusStyle(item.state) }}>
          {/* <Avatar style={{ marginRight: 8 }}>{index + 1}</Avatar> */}
          <Button
            style={{ padding: 0, maxWidth: "100%", justifyContent: "flex-start" }}
            type="link"
            onClick={() => {
              onClickUpdateState?.(item);
            }}
          >
            <Typography.Text ellipsis strong style={{ maxWidth: "100%", color: "inherit" }}>
              {item.orderCode}
            </Typography.Text>
          </Button>
          <Typography.Text ellipsis type="secondary">
            {i18n["Đã tạo"]}: {formatDate(item.creationTime, "DD-MM-YYYY HH:mm")}
          </Typography.Text>
        </Flex>
      ),
    },
    trackingInfo: {
      title: i18n["Trạng thái"],
      dataIndex: "trackingInfo",
      key: "trackingInfo",
      width: 240,
      render: (text, item) => {
        const finalTrackingInfo =
          item.trackingInfo && item.trackingInfo.length > 0
            ? item.trackingInfo[item.trackingInfo.length - 1]
            : null;
        return (
          <TrackingInfoWrapper style={{ maxWidth: 240 }}>
            {finalTrackingInfo && (
              <Timeline
                mode="left"
                items={[
                  {
                    color: "gray",
                    dot:
                      item.trackingInfo.length === 1 ? <></> : <>+{item.trackingInfo.length - 1}</>,
                  },
                  {
                    color: "blue",
                    children: (
                      <>
                        <Typography.Text ellipsis>{finalTrackingInfo.title}</Typography.Text>
                        <Typography.Text ellipsis type="secondary">
                          {formatDate(finalTrackingInfo.actionAt, "DD-MM-YYYY HH:mm")}
                        </Typography.Text>
                      </>
                    ),
                  },
                  { dot: <></> },
                ]}
              />
            )}
            <div className="actions-wrapper">
              <Button
                className="btn-update"
                icon={<BiEdit size={16} />}
                htmlType="button"
                shape="circle"
                type="text"
                onClick={() => {
                  onClickUpdateState?.(item);
                }}
              ></Button>
            </div>
          </TrackingInfoWrapper>
        );
      },
    },
    orderItemList: {
      title: i18n["Sản phẩm"],
      dataIndex: "orderItemList",
      key: "orderItemList",
      width: 260,
      ellipsis: true,
      sorter: (a, b) =>
        getTotalByDatakey(a.orderItemList, "quantity") -
        getTotalByDatakey(b.orderItemList, "quantity"),
      render: (text, item) => {
        return (
          <ItemsInfoWrapper>
            <AvatarGroup size={40} className="remain-items" maxCount={4}>
              {item.orderItemList.map((oItem, index) => (
                <div className="remain-item" key={uid + index + "remain"}>
                  <Avatar src={oItem.imageUrl} shape="square">
                    {oItem.name?.[0] || "---"}
                  </Avatar>
                  <div className="quantity-wrapper">{`x${oItem.quantity}`}</div>
                </div>
              ))}
            </AvatarGroup>
            <Popover
              placement="bottomRight"
              arrow={false}
              overlayInnerStyle={{ padding: 0 }}
              content={
                <PopoverContentStyled>
                  {!!item?.orderItemList?.length ? (
                    <SmItemModelTableStyled
                      style={{ maxWidth: 600 }}
                      showSorterTooltip={false}
                      size="small"
                      columns={
                        [
                          nameCombined2,
                          { ...sku, width: 94 },
                          quantity,
                          currentPrice,
                          originalPrice,
                        ] as any
                      }
                      dataSource={item.orderItemList}
                      pagination={false}
                      rowKey={(item: any) => item.id + uid}
                    />
                  ) : (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      imageStyle={{ height: 32 }}
                      style={{ padding: 0, margin: "2px 0 -8px 0" }}
                      description={false}
                    />
                  )}
                </PopoverContentStyled>
              }
            >
              <Avatar size={24} icon={<FaInfo />} className="info" />
            </Popover>
          </ItemsInfoWrapper>
        );
      },
    },
    recipientAddress: {
      title: i18n["Thông tin người nhận"],
      dataIndex: "recipientAddress",
      key: "recipientAddress",
      width: 240,
      render: (text, item) => {
        const addressDetail = !!item?.recipientAddress
          ? `${
              item.recipientAddress?.toAddress ? item.recipientAddress?.toAddress + " | " : ""
            }${mappedAddressDetail(item.recipientAddress)}`
          : "___";
        return (
          <RecipientAddressWrapper style={{ maxWidth: 240 }}>
            <div className="header-wrapper">
              <Typography.Text ellipsis type="secondary">
                {item.recipientAddress?.toName}
              </Typography.Text>
              <Divider type="vertical" />
              <Typography.Text ellipsis type="secondary">
                {item.recipientAddress?.toPhone}
              </Typography.Text>
            </div>
            <Typography.Text ellipsis>{addressDetail}</Typography.Text>
          </RecipientAddressWrapper>
        );
      },
    },
    price2: {
      title: i18n["Giá"],
      dataIndex: "totalPrice",
      key: "totalPrice",
      ellipsis: true,
      width: 180,
      render: (text, item) => (
        <Price2Wrapper>
          <div className="price-container">
            <Typography.Text ellipsis type="success">
              {`${formatNumber(item.totalPrice)}₫`}
            </Typography.Text>
          </div>
          <div className="paymentMethod-wrapper">
            <PaymentMethodTag method={item.paymentMethod} />
          </div>
        </Price2Wrapper>
      ),
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    actions: {
      title: <Typography.Text type="secondary">{i18n["Hành động"]}</Typography.Text>,
      dataIndex: "id",
      key: "actions",
      width: 180,
      render: (text, item) => {
        return (
          <Dropdown
            placement="bottomRight"
            trigger={["click"]}
            mouseEnterDelay={0.01}
            mouseLeaveDelay={0.01}
            menu={{
              items: [
                {
                  key: "updateState",
                  label: i18n["Cập nhật trạng thái"],
                  icon: <BiEdit size={16} />,
                  onClick: () => {
                    onClickUpdateState?.(item);
                  },
                },
              ],
            }}
          >
            <CurrentStateActionBtn type="button">
              <Tag
                {...(stateTagConf?.[item.state] || {
                  color: "gray",
                  label: "______",
                })}
                className="tag"
                bordered
              />
              <BsThreeDots size={20} className="dots-icon" />
            </CurrentStateActionBtn>
          </Dropdown>
        );
      },
    },
  };
};
const PopoverContentStyled = styled.div``;

const DetailWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  .container {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-width: 0px;
    max-width: 244px;
  }
`;

export default useOrderColumns;

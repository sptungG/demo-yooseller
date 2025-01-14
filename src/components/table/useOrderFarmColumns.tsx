import styled from "@emotion/styled";
import { useCreation } from "ahooks";
import { Button, Divider, Dropdown, Empty, Popover, Timeline, Typography } from "antd";
import type { ColumnGroupType, ColumnType } from "antd/es/table";
import { CSSProperties, useId } from "react";
import { BiEdit } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaInfo } from "react-icons/fa";
import { MdVisibility } from "react-icons/md";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useStateConf from "src/hooks/useStateConf";
import { TOrdersDetail, TStatusOrder } from "src/types/farm.types";
import { formatNumber, getTotalByDatakey, mappedAddressDetail } from "src/utils/utils";
import { formatDate } from "src/utils/utils-date";
import Avatar, { AvatarGroup } from "../avatar/Avatar";
import OrderStateFarm from "../card/OrderStateFarm";
import PaymentMethodTag from "../tag/PaymentMethodTag";
import SmItemModelTableStyled from "./SmItemModelTable";
import {
  CurrentStateActionBtn,
  ItemsInfoWrapper,
  NameWithViewIcon,
  Price2Wrapper,
  RecipientAddressWrapper,
  TrackingInfoWrapper,
} from "./StyledTable";
import useItemFarmModelColumns from "./useItemFarmModelColumns";

type TuseOrderFarmColumnsProps = { onClickUpdateState?: (order: TOrdersDetail) => void };

type TRes = Record<string, ColumnGroupType<TOrdersDetail> | ColumnType<TOrdersDetail>>;

const useOrderFarmColumns = ({ onClickUpdateState }: TuseOrderFarmColumnsProps): TRes => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { message } = useApp();

  const { nameCombined2, sku, quantity, currentPrice, originalPrice } = useItemFarmModelColumns({});

  const { mappedOrderStateFarmTrackingConf } = useStateConf();
  const statusStyle = (status: TStatusOrder): CSSProperties => ({
    opacity: [TStatusOrder.CANCELLATION_CANCELLED].includes(status) ? 0.45 : 1,
  });

  const res: TRes = useCreation(
    () => ({
      codeCombined2: {
        title: i18n["Đơn hàng"],
        dataIndex: "orderCode",
        key: "orderCode",
        ellipsis: true,
        render: (text, item) => (
          <DetailWrapper style={{ ...statusStyle(item.state) }}>
            <div className="container" style={{ alignSelf: "center" }}>
              <NameWithViewIcon
                onClick={() => {
                  onClickUpdateState?.(item);
                }}
              >
                <Typography.Text className="code" ellipsis>
                  {item.orderCode}
                </Typography.Text>
                <MdVisibility className="view-icon" size={16} />
              </NameWithViewIcon>
              <Typography.Text ellipsis type="secondary">
                {i18n["Đã tạo"]}: {formatDate(item.creationTime, "DD-MM-YYYY HH:mm")}
              </Typography.Text>
            </div>
          </DetailWrapper>
        ),
      },
      trackingInfo: {
        title: i18n["Trạng thái"],
        dataIndex: "trackingInfo",
        key: "trackingInfo",
        width: 240,
        render: (text, item) => {
          if (item.trackingInfo) {
            const finalTrackingInfo = item.trackingInfo[item.trackingInfo.length - 1];
            return (
              <TrackingInfoWrapper>
                <Timeline
                  mode="left"
                  items={[
                    {
                      color: "gray",
                      dot:
                        item.trackingInfo.length === 1 ? (
                          <></>
                        ) : (
                          <>+{item.trackingInfo.length - 1}</>
                        ),
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
          } else return "";
        },
      },
      orderItemList: {
        title: i18n["Sản phẩm"],
        dataIndex: "orderItemList",
        key: "orderItemList",
        width: 240,
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
                      {oItem.name?.[0]}
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
          // const addressDetail = !!item?.recipientAddress
          //   ? `${item.recipientAddress.fullAddress ? item.recipientAddress.fullAddress : ""}`
          //   : "___";
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
              <Typography.Text ellipsis title={addressDetail}>
                {addressDetail}
              </Typography.Text>
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
                  TStatusOrder.TO_CONFIRM,
                  TStatusOrder.TO_SHIP_TO_PROCESS,
                  TStatusOrder.TO_SHIP_PROCESSED,
                  TStatusOrder.SHIPPING,
                  TStatusOrder.CANCELLATION_TO_RESPOND,
                  TStatusOrder.RETURN_REFUND_NEW_REQUEST,
                ].includes(item.state)
                  ? [
                      {
                        key: "updateState",
                        label: i18n["Cập nhật trạng thái"],
                        icon: <BiEdit size={16} />,
                        onClick: () => {
                          onClickUpdateState?.(item);
                        },
                      },
                    ]
                  : [],
              }}
            >
              <CurrentStateActionBtn type="button">
                <OrderStateFarm state={item.state} className="tag" bordered />
                <BsThreeDots size={20} className="dots-icon" />
              </CurrentStateActionBtn>
            </Dropdown>
          );
        },
      },
    }),
    [uid, i18n, onClickUpdateState, getTotalByDatakey],
  );
  return res;
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

export default useOrderFarmColumns;

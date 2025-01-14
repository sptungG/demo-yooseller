import { formatDate } from "@/utils/utils-date";
import styled from "@emotion/styled";
import { Checkbox, Divider, Dropdown, Timeline, Typography } from "antd";
import { useId, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { MdVisibility } from "react-icons/md";
import { RiPhoneFill, RiUserReceivedFill } from "react-icons/ri";
import useChangeLocale from "src/hooks/useChangeLocale";
import useStateConf from "src/hooks/useStateConf";
import { TOrder } from "src/types/order.types";
import { formatNumber, getTotalByDatakey, mappedAddressDetail } from "src/utils/utils";
import Avatar, { AvatarGroup } from "../avatar/Avatar";
import Button from "../button/Button";
import Image from "../next/Image";
import PaymentMethodTag from "../tag/PaymentMethodTag";
import OrderState from "./OrderState";

export type TOrderCard = Pick<
  TOrder,
  | "id"
  | "orderCode"
  | "orderItemList"
  | "paymentMethod"
  | "quantity"
  | "state"
  | "providerName"
  | "providerId"
  | "totalPrice"
  | "trackingInfo"
  | "creationTime"
  | "recipientAddress"
>;
type TOrderCardProps = TOrderCard & {
  loading?: boolean;
  checked?: boolean;
  hideCheckbox?: boolean;
  viewMode?: string;
  onClickUpdateAddress?: (id?: number) => void;
  onClickUpdateState?: (id?: number) => void;
};

const OrderCard = ({
  loading,
  hideCheckbox,
  checked,
  viewMode = "grid",
  onClickUpdateAddress,
  onClickUpdateState,
  ...item
}: TOrderCardProps) => {
  const uid = useId();
  const { i18n, locale } = useChangeLocale();
  const [oItemIndex, setOItemIndex] = useState<number>(0);
  const selectedOItem = item.orderItemList[oItemIndex];
  const remainOItems = item.orderItemList.filter((_, index) => index !== oItemIndex);
  const { mappedOrderStateTrackingConf, mappedOrderStateConf } = useStateConf();
  const addressDetail = mappedAddressDetail(item.recipientAddress);

  const finalTrackingInfo = item.trackingInfo[item.trackingInfo.length - 1];

  return (
    <OrderCardStyled
      className={`item-wrapper ${checked ? "checked" : ""} ${
        hideCheckbox ? "hideCheckbox" : ""
      } ${viewMode}`}
    >
      {viewMode === "grid" && (
        <div
          className="border-top-state"
          style={{ borderColor: mappedOrderStateConf(item.state)?.color || "transparent" }}
        ></div>
      )}
      {!hideCheckbox && (
        <div className="checkbox-wrapper">
          <Checkbox value={item.id} />
        </div>
      )}
      {/* <div className="banner"></div> */}
      <div className="code-wrapper" onClick={() => onClickUpdateState?.(item.id)}>
        <div className="container">
          <Typography.Title className="code" level={5} ellipsis>
            {item.orderCode}
          </Typography.Title>
          <MdVisibility className="view-icon" size={16} />
        </div>
        {viewMode === "list" && (
          <div className="bottom-wrapper">
            <div className="price-wrapper">
              <Typography.Text ellipsis type="success">
                {`${formatNumber(item.totalPrice)}₫`}
              </Typography.Text>
            </div>
            <div className="paymentMethod-wrapper">
              <PaymentMethodTag method={item.paymentMethod} />
            </div>
          </div>
        )}
      </div>
      <div className="recipientAddress-wrapper">
        <Typography.Text ellipsis type="secondary">
          <RiUserReceivedFill size={12} />
          <span style={{ marginRight: 2 }}>•</span>
          {item.recipientAddress?.toName}
        </Typography.Text>
        <Typography.Text ellipsis type="secondary">
          <RiPhoneFill size={12} />
          <span style={{ marginRight: 2 }}>•</span>
          {item.recipientAddress?.toPhone}
        </Typography.Text>
        <Typography.Text ellipsis>{addressDetail}</Typography.Text>
      </div>
      {viewMode === "grid" && <Divider style={{ margin: "12px 0" }} />}
      <div className="state-wrapper">
        <Timeline
          mode="left"
          items={[
            {
              color: "gray",
              dot: item.trackingInfo.length === 1 ? <></> : <>+{item.trackingInfo.length - 1}</>,
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
            onClick={() => onClickUpdateState?.(item.id)}
          ></Button>
        </div>
      </div>
      {viewMode === "grid" && <Divider style={{ margin: "12px 0" }} />}
      <div className="orderItems-wrapper">
        <div className="orderItem" key={uid + "firstOItem"}>
          <div className="image-wrapper">
            <Image
              src={selectedOItem.imageUrl}
              alt={uid + selectedOItem.id}
              width={viewMode === "grid" ? 82 : 62}
              height={viewMode === "grid" ? 82 : 62}
            />
            <div className="quantity-wrapper">{`x${selectedOItem.quantity}`}</div>
          </div>
          <div className="name-wrapper">
            <Typography.Text strong ellipsis>
              {selectedOItem.itemName}
            </Typography.Text>
            <div className="other-wrapper">
              <Typography.Text ellipsis type="secondary">
                {`(${selectedOItem.name}) |`}
              </Typography.Text>
              <Typography.Text ellipsis type="secondary">
                {`SKU: ${selectedOItem.sku || "__"}`}
              </Typography.Text>
            </div>
            <div className="price-wrapper">
              <Typography.Text ellipsis type="success">
                {`${formatNumber(selectedOItem.currentPrice)}₫`}
              </Typography.Text>
              <Typography.Text ellipsis type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                {`${formatNumber(selectedOItem.originalPrice)}₫`}
              </Typography.Text>
            </div>
          </div>
        </div>
        <div className="bottom-wrapper">
          {!!remainOItems.length && (
            <AvatarGroup size={viewMode === "grid" ? 40 : 28} className="remain-items" maxCount={4}>
              {remainOItems.map((oItem, index) => (
                <div
                  className="remain-item"
                  key={uid + index + "remain"}
                  onClick={() => setOItemIndex(index + 1)}
                >
                  <Avatar src={oItem.imageUrl} shape="square">
                    {oItem.name[0]}
                  </Avatar>
                  <div className="quantity-wrapper">{`x${item.orderItemList[0].quantity}`}</div>
                </div>
              ))}
            </AvatarGroup>
          )}
          <Typography.Text ellipsis type="secondary" style={{ flexShrink: 0, marginLeft: "auto" }}>
            {i18n["Tổng sản phẩm"]}: <b>{`${getTotalByDatakey(item.orderItemList, "quantity")}`}</b>
          </Typography.Text>
        </div>
      </div>
      {viewMode === "grid" && (
        <div className="bottom-wrapper">
          <div className="price-wrapper">
            <Typography.Text ellipsis type="success">
              {`${formatNumber(item.totalPrice)}₫`}
            </Typography.Text>
          </div>
          <div className="paymentMethod-wrapper">
            <PaymentMethodTag method={item.paymentMethod} />
          </div>
        </div>
      )}
      <div className="actions-wrapper">
        <Dropdown
          placement="bottomRight"
          destroyPopupOnHide
          trigger={["click"]}
          mouseEnterDelay={0.01}
          mouseLeaveDelay={0.01}
          menu={{
            items: [
              {
                key: "updateState",
                label: i18n["Cập nhật trạng thái"],
                icon: <BiEdit size={16} />,
                onClick: () => onClickUpdateState?.(item.id),
              },
            ],
          }}
        >
          <Button className={`btn-action ${locale}`} type="text">
            <BsThreeDots size={20} />
          </Button>
        </Dropdown>
      </div>
      <div className="currentState-wrapper">
        <OrderState state={item.state} />
      </div>
    </OrderCardStyled>
  );
};
const OrderCardStyled = styled.div`
  --box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02),
    0 2px 4px 0 rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 6px;
  box-shadow: var(--box-shadow);
  cursor: pointer;
  padding: 56px 12px 12px 12px;
  &.hideCheckbox {
    padding: 12px 12px 12px 12px;
  }
  & > .border-top-state {
    position: absolute;
    top: 0;
    left: 8px;
    right: 8px;
    border-top: 1px solid transparent;
    opacity: 0.2;
  }
  .checkbox-wrapper {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 1;
    padding: 6px;
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: var(--box-shadow);
  }
  .banner {
    position: absolute;
    left: 0;
    top: 0;
    height: 56px;
    width: 100%;
    background-color: ${({ theme }) => theme.generatedColors[0]};
  }
  .code-wrapper .container {
    display: flex;
    align-items: center;
    .view-icon {
      display: none;
      margin-left: 8px;
      color: ${({ theme }) => theme.colorPrimary};
    }
    .code {
      color: ${({ theme }) => theme.colorPrimary};
      margin: 0;
      user-select: none;
      pointer-events: none;
    }
    &:hover {
      .code {
        text-decoration: underline;
      }
      .view-icon {
        display: block;
      }
    }
  }
  .recipientAddress-wrapper {
    position: relative;
    & > .ant-typography-secondary {
      display: flex;
      align-items: center;
    }
    & > .actions-wrapper {
      display: none;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      .btn-update {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
  .orderItems-wrapper {
    .bottom-wrapper {
      margin-top: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .remain-items {
        flex-shrink: 0;
      }
      .remain-item {
        position: relative;
        .quantity-wrapper {
          position: absolute;
          bottom: 0;
          left: 0;
          padding: 2px 4px;
          background-color: #d9d9d9;
          border-radius: 0 4px 0 4px;
          font-size: 13px;
          max-width: calc(100% - 8px);
          overflow: hidden;
          line-height: 1.1;
        }
      }
    }
    .orderItem {
      padding: 8px 12px 8px 8px;
      width: 100%;
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0.05);
      border-bottom: 1px solid transparent;
      display: flex;
      align-items: stretch;
      .image-wrapper {
        position: relative;
        height: 100%;
        align-self: stretch;
        flex: 0 0 auto;
        min-width: 0px;
        & > .ant-image {
          height: 100% !important;
          .ant-image-img {
            height: 100% !important;
            border-radius: 4px;
          }
        }
        .quantity-wrapper {
          position: absolute;
          bottom: 0;
          left: 0;
          padding: 0px 6px;
          background-color: #d9d9d9;
          border-radius: 0 4px 0 4px;
        }
      }
      .name-wrapper {
        flex: 1 1 auto;
        min-width: 0px;
        margin-left: 8px;
        display: flex;
        flex-direction: column;
        & * {
          line-height: 1.2 !important;
        }
        .other-wrapper {
          display: flex;
          flex-direction: column;
        }
        .price-wrapper {
          margin-top: auto;
          white-space: nowrap;
        }
      }
    }
  }
  & > .bottom-wrapper {
    display: flex;
    align-items: center;
    margin-top: 12px;
    .paymentMethod-wrapper {
      margin-left: auto;
    }
    .price-wrapper {
      .ant-typography {
        font-size: 16px;
      }
    }
  }
  .state-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    .ant-timeline-item {
      padding-bottom: 0;
      display: flex;
      flex-direction: column;
      .ant-timeline-item-head {
        top: 16px;
      }
      .ant-timeline-item-tail {
        height: 100%;
        inset-block-start: 0px;
      }
      .ant-timeline-item-content {
        display: flex;
        flex-direction: column;
        margin-top: 12px;
        & > .ant-typography {
          line-height: 1.2;
          margin-bottom: 0;
        }
      }
    }
    .ant-timeline-item:first-of-type {
      display: block;
      .ant-timeline-item-head {
        top: 0;
        background-color: transparent;
      }
    }
    .ant-timeline-item-last {
      .ant-timeline-item-content {
        min-height: 0px;
      }
    }
    & > .actions-wrapper {
      display: none;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      .btn-update {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
  & > .actions-wrapper {
    position: absolute;
    top: 52px;
    right: 12px;
  }
  & > .currentState-wrapper {
    position: absolute;
    top: 12px;
    right: 12px;
  }
  &.list {
    flex-direction: row;
    padding: 12px;
    border-radius: 0px;
    &:last-of-type {
      box-shadow: none;
    }
    .checkbox-wrapper {
      position: unset;
      margin-right: 12px;
      align-self: center;
      flex-shrink: 0;
    }
    .code-wrapper {
      padding: 0 12px;
      border-left: 1px solid #d9d9d9;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      margin-right: 12px;
      flex: 1 1 auto;
      min-width: 0px;
      & > .bottom-wrapper {
        display: flex;
        align-items: flex-start;
        gap: 4px;
        flex-direction: column;
      }
    }
    .recipientAddress-wrapper {
      flex: 0 0 300px;
      max-width: 300px;
      padding: 0 12px;
      border-left: 1px solid #d9d9d9;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
    }
    .orderItems-wrapper {
      max-width: 300px;
      flex: 0 0 300px;
      width: 100%;
      flex-shrink: 0;
      padding: 0 12px;
      margin-left: 12px;
      border-left: 1px solid #d9d9d9;
      .orderItem .name-wrapper .other-wrapper {
        display: flex;
        flex-direction: row;
      }
    }
    .state-wrapper {
      flex: 0 0 266px;
      max-width: 266px;
      width: 100%;
      padding: 0 12px;
      border-left: 1px solid #d9d9d9;
    }
    & > .bottom-wrapper {
      margin-left: auto;
      display: flex;
      flex-direction: column;
    }
    & > .actions-wrapper {
      position: unset;
      align-self: stretch;
      padding: 0 12px;
      border-left: 1px solid #d9d9d9;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
    .recipientAddress-wrapper {
      padding-right: 32px;
      & > .actions-wrapper {
        display: block;
      }
    }
    .state-wrapper {
      padding-right: 32px;
      & > .actions-wrapper {
        display: block;
      }
    }
  }
  &.checked {
    .checkbox-wrapper {
      background-color: ${({ theme }) => theme.generatedColors[1]};
      border: 1px solid ${({ theme }) => theme.colorPrimary};
    }
  }
`;

export default OrderCard;

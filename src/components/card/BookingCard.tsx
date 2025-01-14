import styled from "@emotion/styled";
import { Checkbox, Divider, Dropdown, Typography } from "antd";
import { useId, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { MdEmail, MdVisibility } from "react-icons/md";
import { RiPhoneFill, RiUserReceivedFill } from "react-icons/ri";
import useChangeLocale from "src/hooks/useChangeLocale";
import useStateConf from "src/hooks/useStateConf";
import { TBooking } from "src/types/booking.types";
import { formatNumber, mappedAddressDetail } from "src/utils/utils";
import { formatDate } from "src/utils/utils-date";
import Button from "../button/Button";
import Image from "../next/Image";
import PaymentMethodTag from "../tag/PaymentMethodTag";
import BookingState from "./BookingState";

export type TBookingCard = Pick<
  TBooking,
  | "id"
  | "bookingCode"
  | "bookingItemList"
  | "paymentMethod"
  | "totalPrice"
  | "quantity"
  | "state"
  | "providerName"
  | "providerId"
  | "totalPrice"
  | "creationTime"
  | "recipientAddress"
  | "checkIn"
  | "checkOut"
  | "name"
  | "email"
  | "phoneNumber"
  | "description"
>;
type TBookingCardProps = TBookingCard & {
  loading?: boolean;
  checked?: boolean;
  hideCheckbox?: boolean;
  viewMode?: string;
  onClickUpdateAddress?: (id?: number) => void;
  onClickUpdateState?: (id?: number) => void;
};

const BookingCard = ({
  loading,
  checked,
  hideCheckbox,
  viewMode = "grid",
  onClickUpdateAddress,
  onClickUpdateState,
  ...item
}: TBookingCardProps) => {
  const uid = useId();
  const { i18n, locale } = useChangeLocale();
  const [oItemIndex, setOItemIndex] = useState<number>(0);
  const selectedOItem = item.bookingItemList[oItemIndex];
  const remainOItems = item.bookingItemList.filter((_, index) => index !== oItemIndex);

  const { mappedBookingStateConf } = useStateConf();

  const addressDetail = !!item?.recipientAddress ? mappedAddressDetail(item.recipientAddress) : "";

  return (
    <BookingCardStyled
      className={`item-wrapper ${checked ? "checked" : ""} ${hideCheckbox ? "hideCheckbox" : ""}`}
    >
      {!hideCheckbox && (
        <div className="checkbox-wrapper">
          <Checkbox value={item.id} />
        </div>
      )}
      {viewMode === "grid" && (
        <div
          className="border-top-state"
          style={{ borderColor: mappedBookingStateConf(item.state)?.color || "transparent" }}
        ></div>
      )}
      {/* <div className="banner"></div> */}
      <div className="code-wrapper" onClick={() => onClickUpdateState?.(item.id)}>
        <Typography.Title className="code" level={5} ellipsis>
          {item.bookingCode}
        </Typography.Title>
        <MdVisibility className="view-icon" size={16} />
      </div>
      <Typography.Text ellipsis type="secondary">
        {i18n["Đã tạo"]}: {formatDate(item.creationTime, "DD-MM-YYYY HH:mm")}
      </Typography.Text>
      <div className="user-wrapper">
        <Typography.Text ellipsis>
          <RiUserReceivedFill size={16} color={"rgba(0,0,0,0.45)"} />: {item.recipientAddress?.name}
        </Typography.Text>
        <Typography.Text ellipsis>
          <RiPhoneFill size={16} color={"rgba(0,0,0,0.45)"} />: {item.recipientAddress?.phone}
        </Typography.Text>
        <Typography.Text ellipsis>
          <MdEmail size={16} color={"rgba(0,0,0,0.45)"} />: {item.email}
        </Typography.Text>
        {!!item?.recipientAddress && <Typography.Text ellipsis>{addressDetail}</Typography.Text>}
      </div>
      <Divider style={{ margin: "12px 0" }} />
      <div className="orderItems-wrapper">
        <Typography.Text ellipsis className="checkin" type="secondary">
          Checkin: {formatDate(item.checkIn, "DD-MM-YYYY HH:mm")}
        </Typography.Text>
        <div className="orderItem-wrapper">
          <div className="orderItem" key={uid + "firstOItem"}>
            <div className="image-wrapper">
              <Image
                src={selectedOItem.imageUrl}
                alt={uid + selectedOItem.id}
                width={48}
                height={48}
              />
            </div>
            <div className="name-wrapper">
              <Typography.Text strong ellipsis>
                {selectedOItem.name}
              </Typography.Text>
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
          <div className="description-wrapper">
            <Typography.Paragraph
              ellipsis={{ rows: 2 }}
              className="description"
              style={{ margin: 0 }}
            >
              <Typography.Text type="secondary" style={{ marginRight: 4, whiteSpace: "nowrap" }}>
                {i18n["Mô tả"]}:
              </Typography.Text>
              {item.description}
            </Typography.Paragraph>
          </div>
        </div>
        <Typography.Text ellipsis className="checkout" type="secondary"></Typography.Text>
      </div>
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
        <BookingState state={item.state} />
      </div>
    </BookingCardStyled>
  );
};
const BookingCardStyled = styled.div`
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
  .user-wrapper {
    display: flex;
    flex-direction: column;
    & > * {
      display: flex;
      align-items: center;
    }
  }
  .code-wrapper {
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
    display: flex;
    flex-direction: column;
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
    position: relative;
    .checkin,
    .checkout {
      position: relative;
      padding-left: 16px;
      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(0, -50%);
        width: 10px;
        height: 10px;
        background-color: #ffffff;
        border: 3px solid #1677ff;
        border-radius: 50%;
      }
    }
    .checkin {
    }
    .checkout {
      margin-top: 8px;
    }
    .bottom-wrapper {
      margin-top: auto;
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
    .orderItem-wrapper {
      position: relative;
      padding-left: 16px;
      .description-wrapper {
        padding-left: 8px;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: column;
        column-gap: 4px;
      }
      &::before {
        content: "";
        position: absolute;
        inset-block-start: 10px;
        inset-inline-start: 4px;
        border-inline-start: 2px solid rgba(5, 5, 5, 0.06);
        top: 0;
        left: 0;
        height: calc(100% + 8px);
        transform: translate(4px, 0);
      }
    }
    .orderItem {
      position: relative;
      padding: 8px 12px 8px 8px;
      width: 100%;
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0.05);
      border-bottom: 1px solid transparent;
      display: flex;
      align-items: stretch;
      .image-wrapper {
        position: relative;
        & > .ant-image > .ant-image-img {
          border-radius: 4px;
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
        margin-left: 8px;
        display: flex;
        flex-direction: column;
        padding-bottom: 1px;
        & > * {
          line-height: 1.25;
        }
        .price-wrapper {
          margin-top: auto;
        }
      }
    }
  }
  .bottom-wrapper {
    display: flex;
    align-items: center;
    margin-top: auto;
  }
  .paymentMethod-wrapper {
    margin-left: auto;
  }
  .price-wrapper {
    .ant-typography {
      font-size: 16px;
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
  & > .border-top-state {
    position: absolute;
    top: 0;
    left: 8px;
    right: 8px;
    border-top: 1px solid transparent;
    opacity: 0.2;
  }
  &:hover {
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
  &.expanded {
    .code-wrapper {
      .code {
        text-decoration: underline;
      }
      .view-icon {
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

export default BookingCard;

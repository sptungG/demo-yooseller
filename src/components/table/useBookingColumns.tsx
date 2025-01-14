import styled from "@emotion/styled";
import { useCreation } from "ahooks";
import { Divider, Dropdown, Typography } from "antd";
import type { ColumnGroupType, ColumnType } from "antd/es/table";
import { useRouter } from "next/router";
import { CSSProperties, useId } from "react";
import { BiEdit } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { MdVisibility } from "react-icons/md";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import { TBState, TBooking } from "src/types/booking.types";
import { formatNumber, mappedAddressDetail } from "src/utils/utils";
import { formatDate, sorterByDate } from "src/utils/utils-date";
import Avatar from "../avatar/Avatar";
import BookingState from "../card/BookingState";
import PaymentMethodTag from "../tag/PaymentMethodTag";
import {
  CurrentStateActionBtn,
  NameWithViewIcon,
  Price2Wrapper,
  RecipientAddressWrapper,
} from "./StyledTable";

type TuseBookingColumnsProps = { onClickUpdateState?: (item: number) => void };

type TRes = Record<string, ColumnGroupType<TBooking> | ColumnType<TBooking>>;

const useBookingColumns = ({ onClickUpdateState }: TuseBookingColumnsProps): TRes => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { message } = useApp();
  const {
    query: { storeId },
  } = useRouter();

  const statusStyle = (status: TBState): CSSProperties => ({
    opacity: [TBState.CANCELLATION, TBState.CANCELLATION_CANCELLED].includes(status) ? 0.45 : 1,
  });

  const res: TRes = useCreation(
    () => ({
      codeCombined2: {
        title: i18n["Dịch vụ"],
        dataIndex: "bookingCode",
        key: "bookingCode",
        ellipsis: true,
        render: (text, item) => (
          <BookingDetailWrapper style={{ ...statusStyle(item.state) }}>
            <Avatar
              key={uid + "bookingItem"}
              size={52}
              src={item.bookingItemList[0].imageUrl}
              alt={""}
              shape="square"
            />
            <div className="container" style={{ alignSelf: "center", marginLeft: 8 }}>
              <NameWithViewIcon
                onClick={() => {
                  onClickUpdateState?.(item.id);
                }}
              >
                <Typography.Text className="code" ellipsis>
                  {item.name}
                </Typography.Text>
                <MdVisibility className="view-icon" size={16} />
              </NameWithViewIcon>
              <Typography.Text ellipsis style={{ fontSize: 12, marginTop: 4 }}>
                {"#"}
                {item.bookingCode}
              </Typography.Text>
              <Typography.Text ellipsis type="secondary" style={{ fontSize: 12 }}>
                {i18n["Đã tạo"]}: {formatDate(item.creationTime, "DD-MM-YYYY HH:mm")}
              </Typography.Text>
            </div>
          </BookingDetailWrapper>
        ),
        sorter: (a, b) => sorterByDate("creationTime")(a, b),
      },
      recipientAddress: {
        title: i18n["Thông tin người đặt"],
        dataIndex: "recipientAddress",
        key: "recipientAddress",
        width: 320,
        render: (text, item) => {
          const addressDetail = !!item?.recipientAddress
            ? `${
                item.recipientAddress.fullAddress ? item.recipientAddress.fullAddress + " | " : ""
              }${mappedAddressDetail(item.recipientAddress)}`
            : "___";
          return (
            <RecipientAddressWrapper style={{ maxWidth: 320 }}>
              <div className="header-wrapper">
                <Typography.Text ellipsis type="secondary" style={{ maxWidth: 132 }}>
                  {item.recipientAddress?.name}
                </Typography.Text>
                <Divider type="vertical" />
                <Typography.Text ellipsis type="secondary">
                  {item.recipientAddress?.phone}
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
        width: 140,
        render: (text, item) => (
          <Price2Wrapper>
            <div className="price-container">
              <Typography.Text ellipsis type="success" style={{ maxWidth: 140 }}>
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
      checkIn: {
        title: "Checkin",
        dataIndex: "checkIn",
        key: "checkIn",
        width: 120,
        render: (text, item) => (
          <div className="checkin-wrapper">
            <Typography.Text ellipsis type="secondary">
              {formatDate(item.checkIn, "DD-MM-YYYY")}
            </Typography.Text>
            <Typography.Text ellipsis type="secondary">
              {formatDate(item.checkIn, "HH:mm")}
            </Typography.Text>
          </div>
        ),
        sorter: (a, b) => sorterByDate("checkIn")(a, b),
      },
      checkOut: {
        title: "Checkout",
        dataIndex: "checkOut",
        key: "checkOut",
        width: 120,
        render: (text, item) => (
          <div className="checkout-wrapper">
            <Typography.Text ellipsis type="secondary">
              {formatDate(item.checkOut, "DD-MM-YYYY")}
            </Typography.Text>
            <Typography.Text ellipsis type="secondary">
              {formatDate(item.checkOut, "HH:mm")}
            </Typography.Text>
          </div>
        ),
        sorter: (a, b) => sorterByDate("checkOut")(a, b),
      },
      description: {
        title: i18n["Mô tả từ người đặt"],
        dataIndex: "description",
        key: "description",
        width: 120,
        render: (text, item) => (
          <Typography.Paragraph
            ellipsis={{
              rows: 2,
              tooltip: { arrow: false, title: item.description, placement: "bottomRight" },
            }}
            type="secondary"
            style={{ margin: 0 }}
          >
            {item.description}
          </Typography.Paragraph>
        ),
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
                      onClickUpdateState?.(item.id);
                    },
                  },
                ],
              }}
            >
              <CurrentStateActionBtn type="button">
                <BookingState state={item.state} className="tag" bordered />
                <BsThreeDots size={20} className="dots-icon" />
              </CurrentStateActionBtn>
            </Dropdown>
          );
        },
      },
    }),
    [i18n, onClickUpdateState],
  );
  return res;
};
const PopoverContentStyled = styled.div``;

const BookingDetailWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  .container {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-width: 0px;
    max-width: 244px;
    .ant-typography {
      line-height: 1.2;
    }
  }
`;

const BookingItemListWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  .list {
    display: flex;
    align-items: center;
    align-self: flex-end;
  }
  .info {
    margin-left: 8px;
  }
  .description {
    align-self: flex-end;
  }
`;

export default useBookingColumns;

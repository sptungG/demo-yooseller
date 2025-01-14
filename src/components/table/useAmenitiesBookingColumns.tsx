import { TAmenitiesBooking, TAmenityBookingStateFormId } from "@/types/amenity.types";
import { formatNumber } from "@/utils/utils";
import { formatDate } from "@/utils/utils-date";
import styled from "@emotion/styled";
import { Avatar, Dropdown, Empty, Flex, Popover, Typography } from "antd";
import type { ColumnGroupType, ColumnType } from "antd/es/table";
import { useRouter } from "next/router";
import { CSSProperties, useId } from "react";
import { BiEdit } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaInfo } from "react-icons/fa";
import useChangeLocale from "src/hooks/useChangeLocale";
import Button from "../button/Button";
import AmenitiesBookingState from "../card/AmenitiesBookingState";
import SmItemModelTableStyled from "./SmItemModelTable";
import { CurrentStateActionBtn } from "./StyledTable";
import useAmenityColumns from "./useAmenityColumns";

type TRes = Record<string, ColumnGroupType<TAmenitiesBooking> | ColumnType<TAmenitiesBooking>>;
type TuseAmenitiesBookingColumnsProps = {
  onClickUpdateState?: (booking: TAmenitiesBooking) => void;
};

const useAmenitiesBookingColumns = ({
  onClickUpdateState,
}: TuseAmenitiesBookingColumnsProps): TRes => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const {
    query: { storeId },
  } = useRouter();

  const statusStyle = (status: TAmenityBookingStateFormId): CSSProperties => ({
    opacity: [TAmenityBookingStateFormId.CANCELED].includes(status) ? 0.45 : 1,
  });

  const { nameCombined1, price, minimumDeposit } = useAmenityColumns({});

  return {
    bookingCode: {
      title: i18n["Mã đơn hàng"],
      dataIndex: "bookingCode",
      key: "bookingCode",
      render: (text, item) => <Typography.Text ellipsis>{item.bookingCode}</Typography.Text>,
    },

    codeCombined1: {
      title: i18n["Đơn hàng"],
      dataIndex: "bookingCode",
      key: "bookingCode",
      width: 160,
      render: (text, item) => {
        return (
          <Flex gap="small" align="center">
            <Avatar size={40} shape="square" src={item?.items?.[0].avatarUrl}>
              {item?.items?.[0]?.name?.[0] || "---"}
            </Avatar>
            <Flex vertical style={{ maxWidth: 240, ...statusStyle(item.state) }}>
              <Button
                style={{ padding: 0, maxWidth: "100%", justifyContent: "flex-start" }}
                type="link"
                onClick={() => {
                  onClickUpdateState?.(item);
                }}
              >
                <Typography.Text ellipsis strong style={{ maxWidth: "100%", color: "inherit" }}>
                  {item.bookingCode}
                </Typography.Text>
              </Button>
              <Typography.Text ellipsis type="secondary">
                {i18n["Đã tạo"]}: {formatDate(item.checkIn, "DD-MM-YYYY HH:mm")}
              </Typography.Text>
            </Flex>
          </Flex>
        );
      },
    },

    name: {
      title: i18n["Khách hàng"],
      dataIndex: "name",
      key: "name",
      render: (text, item) => <Typography.Text ellipsis>{item.name}</Typography.Text>,
    },

    items: {
      title: i18n["Dịch vụ"],
      dataIndex: "items",
      key: "items",
      render: (text, item) => (
        <Flex justify="space-between">
          <Flex vertical>
            {item?.items?.map((oItem, index) => (
              <div key={uid + index}>- {oItem?.name}</div>
            ))}
          </Flex>
          <Popover
            placement="bottomRight"
            arrow={false}
            overlayInnerStyle={{ padding: 0 }}
            content={
              <PopoverContentStyled>
                {!!item?.items?.length ? (
                  <SmItemModelTableStyled
                    style={{ maxWidth: 600 }}
                    showSorterTooltip={false}
                    size="small"
                    columns={[nameCombined1, price, minimumDeposit] as any}
                    dataSource={item?.items}
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
        </Flex>
      ),
    },

    totalPrice: {
      title: i18n["Giá tiền"],
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text, item) => {
        return (
          <Typography.Text ellipsis>{`${formatNumber(item.totalPrice)}₫` || "---"}</Typography.Text>
        );
      },
    },

    totalDepist: {
      title: i18n["Đã đặt cọc"],
      dataIndex: "totalDepist",
      key: "totalDepist",
      render: (text, item) => {
        return (
          <Typography.Text ellipsis>
            {`${formatNumber(item.totalDepist)}₫` || "---"}
          </Typography.Text>
        );
      },
    },

    actionsState: {
      title: <Typography.Text type="secondary">{i18n["Hành động"]}</Typography.Text>,
      dataIndex: "id",
      key: "actionsState",
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
              ].filter((i) => !!i) as any[],
            }}
          >
            <CurrentStateActionBtn type="button">
              <AmenitiesBookingState state={item.state} className="tag" bordered />
              <BsThreeDots size={20} className="dots-icon" />
            </CurrentStateActionBtn>
          </Dropdown>
        );
      },
    },
  };
};

const PopoverContentStyled = styled.div``;

export default useAmenitiesBookingColumns;

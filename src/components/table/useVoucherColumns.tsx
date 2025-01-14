import { TEVoucherType } from "@/types/farm.types";
import { useTheme } from "@emotion/react";
import { Badge, Dropdown, Flex, Typography } from "antd";
import type { ColumnGroupType, ColumnType } from "antd/es/table";
import { rgba } from "emotion-rgba";
import { useRouter } from "next/router";
import { useId } from "react";
import { BiEdit } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaTruck } from "react-icons/fa";
import { LuCalendarCheck, LuCalendarX } from "react-icons/lu";
import { MdOutlineDelete } from "react-icons/md";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useModalDangerConfirm from "src/hooks/useModalDangerConfirm";
import {
  useDeleteVoucherMutation,
  useEndEarlyMutation,
  useStartEarlyMutation,
} from "src/redux/query/voucher.query";
import { TDiscountType, TVoucher, TVoucherScope, TVoucherStatus } from "src/types/voucher.types";
import { formatNumber } from "src/utils/utils";
import { formatDate } from "src/utils/utils-date";
import Avatar from "../avatar/Avatar";
import Link from "../next/Link";
import Tag from "../tag/Tag";
import { CurrentStateActionBtn } from "./StyledTable";
type TUseVoucherColumnsProps = {
  storeId?: number;
};

type TRes = Record<string, ColumnGroupType<TVoucher> | ColumnType<TVoucher>>;

const useVoucherColumns = ({}: TUseVoucherColumnsProps): TRes => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { message } = useApp();
  const {
    query: { storeId },
  } = useRouter();
  const { generatedColors } = useTheme();

  const [deleteMutate, { isLoading: isLoadingDeleteItem }] = useDeleteVoucherMutation();
  const { handleConfirm } = useModalDangerConfirm({
    onOk: (id) => {
      deleteMutate({ id })
        .unwrap()
        .then((data) => {
          if (data.success === true) {
            message.success(i18n["Xóa khuyến mãi thành công"]);
          } else {
            message.error(i18n["Đã có lỗi xảy ra khi xóa khuyến mãi"]);
          }
        })
        .catch((err) => {
          message.error(i18n["Đã có lỗi xảy ra khi xóa khuyến mãi"]);
        });
    },
  });

  const [startEarlyMutate, { isLoading: isLoadingStartEarly }] = useStartEarlyMutation();
  const [endEarlyMutate, { isLoading: isLoadingEndEarly }] = useEndEarlyMutation();

  const { handleConfirm: handleConfirmStartEarly } = useModalDangerConfirm({
    onOk: (id) => {
      startEarlyMutate({ id })
        .unwrap()
        .then((data) => {
          if (data.success === true) {
            message.success(i18n["Bắt đầu sớm khuyến mãi thành công"]);
          } else {
            message.error(i18n["Đã có lỗi xảy ra khi bắt đầu sớm khuyến mãi"]);
          }
        })
        .catch((err) => {
          message.error(i18n["Đã có lỗi xảy ra khi bắt đầu sớm khuyến mãi"]);
        });
    },
    okButtonProps: { size: "middle", type: "primary" },
  });

  const { handleConfirm: handleConfirmEndEarly } = useModalDangerConfirm({
    onOk: (id) => {
      endEarlyMutate({ id })
        .unwrap()
        .then((data) => {
          if (data.success === true) {
            message.success(i18n["Kết thúc sớm khuyến mãi thành công"]);
          } else {
            message.error(i18n["Đã có lỗi xảy ra khi kết thúc sớm khuyến mãi"]);
          }
        })
        .catch((err) => {
          message.error(i18n["Đã có lỗi xảy ra khi kết thúc sớm khuyến mãi"]);
        });
    },
  });

  return {
    voucherCode: {
      title: i18n["Mã giảm giá"],
      dataIndex: "voucherCode",
      key: "voucherCode",
      width: 160,
      render: (text, item) => (
        <Flex vertical>
          <Typography.Text ellipsis>{item.name}</Typography.Text>
          <Typography.Text ellipsis type="secondary">
            Code:
            <Typography.Text type="success" copyable>
              {item.voucherCode}
            </Typography.Text>
          </Typography.Text>
        </Flex>
      ),
    },

    nameCombined1: {
      title: i18n["Mã giảm giá"],
      dataIndex: "voucherCode",
      key: "voucherCode",
      width: 160,
      render: (text, item) => {
        const discountTypeConf: Record<string, any> = {
          [TDiscountType.FIX_AMOUNT]: "₫",
          [TDiscountType.DISCOUNT_PERCENTAGE]: "%",
        };
        const scopeConf: Record<string, any> = {
          [TVoucherScope.PRODUCT_VOUCHER]: `${i18n["Voucher áp dụng cho sản phẩm"]} • ${
            item.listItems?.length || 0
          }`,
          [TVoucherScope.SHOP_VOUCHER]: i18n["Voucher áp dụng toàn shop"],
        };
        return (
          <Flex gap={8} style={{ opacity: item.status === TVoucherStatus.EXPIRED ? 0.5 : 1 }}>
            <Badge
              offset={[-4, 60]}
              showZero={false}
              count={
                item.type === TEVoucherType.VOUCHER_SHIPPING ? (
                  <FaTruck style={{ color: generatedColors[5] }} size={18} className="" />
                ) : (
                  0
                )
              }
            >
              <Avatar
                size={64}
                shape="square"
                style={{
                  backgroundColor: rgba(generatedColors[5], 0.2),
                  color: generatedColors[5],
                  flexShrink: 0,
                }}
              >
                {discountTypeConf?.[item.discountType] || ""}
              </Avatar>
            </Badge>
            <Flex vertical flex={"1 1 auto"} style={{ minWidth: 0 }}>
              <Typography.Title
                level={5}
                ellipsis
                style={{ maxWidth: "100%", lineHeight: 1.2, margin: 0 }}
              >
                {item.name}
              </Typography.Title>
              <Typography.Text
                type="secondary"
                ellipsis
                style={{ marginTop: "auto", lineHeight: 1.1 }}
              >
                {scopeConf?.[item.scope] || ""}
              </Typography.Text>
              <Flex style={{ maxWidth: "100%", margin: 0 }} gap={4}>
                <Typography.Text type="secondary">Mã:</Typography.Text>
                <Typography.Text type="success" copyable>
                  {item.voucherCode}
                </Typography.Text>
              </Flex>
            </Flex>
          </Flex>
        );
      },
    },

    scope: {
      title: i18n["Loại mã"],
      dataIndex: "scope",
      key: "scope",
      render: (text, item) => {
        const scopeConf: Record<string, any> = {
          [TVoucherScope.PRODUCT_VOUCHER]: i18n["Voucher áp dụng cho sản phẩm"],
          [TVoucherScope.SHOP_VOUCHER]: i18n["Voucher áp dụng toàn shop"],
        };
        return <Typography.Text ellipsis>{scopeConf?.[item.scope] || ""}</Typography.Text>;
      },
    },
    discountAmount: {
      title: i18n["Mức giảm"],
      dataIndex: "discountAmount",
      key: "discountAmount",
      width: 160,
      render: (text, item) => {
        const discountTypeConf: Record<string, any> = {
          [TDiscountType.FIX_AMOUNT]: `${formatNumber(item?.discountAmount)}₫`,
          [TDiscountType.DISCOUNT_PERCENTAGE]: `${item?.percentage}% Giảm`,
        };
        return (
          <Flex vertical align="flex-end">
            <Typography.Text ellipsis style={{}}>
              {discountTypeConf?.[item.discountType] || "---"}
            </Typography.Text>
            <Flex align="baseline" gap={4}>
              {!!item.maxPrice && (
                <Typography.Text style={{ fontSize: 11 }} type="secondary" ellipsis>
                  Giảm tối đa:
                </Typography.Text>
              )}
              <Typography.Text ellipsis type="warning" style={{ flexShrink: 0 }}>
                {item.maxPrice ? `${formatNumber(item.maxPrice)}₫` : "---"}
              </Typography.Text>
            </Flex>
          </Flex>
        );
      },
    },
    minBasketPrice: {
      title: (
        <Flex vertical align="flex-end" style={{ marginBottom: -6 }}>
          <Typography.Text style={{ lineHeight: 1.1, fontSize: 12 }}>
            {i18n["Giá trị đơn hàng"]}
          </Typography.Text>
          <Typography.Text type="success" style={{ lineHeight: 1.1, fontSize: 12 }}>
            {i18n["Tối thiểu"].toLowerCase()}
          </Typography.Text>
        </Flex>
      ),
      dataIndex: "minBasketPrice",
      key: "minBasketPrice",
      width: 200,
      render: (text, item) => (
        <Typography.Text type="success" style={{ opacity: !!item.minBasketPrice ? 1 : 0.5 }}>
          {item.minBasketPrice ? `${formatNumber(item.minBasketPrice)}₫` : "0₫"}
        </Typography.Text>
      ),
    },
    quantity: {
      title: i18n["Số lượng"],
      dataIndex: "quantity",
      key: "quantity",
      width: 160,
      render: (text, item) => (
        <Typography.Text style={{ opacity: !!item.quantity ? 1 : 0.5 }}>
          {item.quantity}
        </Typography.Text>
      ),
    },
    currentUsage: {
      title: i18n["Đã sử dụng"],
      dataIndex: "currentUsage",
      key: "currentUsage",
      width: 160,
      render: (text, item) => (
        <Typography.Text style={{ opacity: !!item.currentUsage ? 1 : 0.5 }}>
          {item.currentUsage}
        </Typography.Text>
      ),
    },
    datetime: {
      title: (
        <Flex vertical style={{ marginBottom: -4 }}>
          <Typography.Text style={{ lineHeight: 1.1 }}>{i18n["Thời gian"]}</Typography.Text>
          <Typography.Text type="secondary" style={{ lineHeight: 1.1, fontSize: 10 }}>
            bắt đầu → kết thúc
          </Typography.Text>
        </Flex>
      ),
      dataIndex: "datetime",
      key: "datetime",
      width: 160,
      render: (text, item) => (
        <Flex vertical style={{ opacity: item.status === TVoucherStatus.EXPIRED ? 0.5 : 1 }}>
          <Typography.Text ellipsis>
            {formatDate(item.dateStart, "HH:mm DD-MM-YYYY")}
          </Typography.Text>
          <Typography.Text ellipsis>
            →{formatDate(item.dateEnd, "HH:mm DD-MM-YYYY")}
          </Typography.Text>
        </Flex>
      ),
    },

    actionsState: {
      title: (
        <Typography.Text type="secondary" ellipsis>
          {i18n["Trạng thái"]}
        </Typography.Text>
      ),
      dataIndex: "id",
      key: "actionsState",
      width: 180,
      render: (text, item) => {
        const stateConf: Record<string, any> = {
          [TVoucherStatus.UPCOMING]: {
            children: "Sắp diễn ra",
            color: "blue",
          },
          [TVoucherStatus.ACTIVATED]: {
            children: "Đang diễn ra",
            color: "green",
          },
          [TVoucherStatus.EXPIRED]: {
            children: "Đã kết thúc",
            color: "default",
            bordered: false,
          },
        };
        return (
          <Dropdown
            placement="bottomRight"
            trigger={["click"]}
            mouseEnterDelay={0.01}
            mouseLeaveDelay={0.01}
            menu={{
              items: [
                item.status === TVoucherStatus.EXPIRED
                  ? undefined
                  : {
                      key: "edit",
                      label: (
                        <Link
                          href={`/supplier/store/${item.providerId}/marketing/voucher/${item.id}/edit`}
                        >
                          {i18n["Sửa khuyến mãi"]}
                        </Link>
                      ),
                      icon: <BiEdit size={16} />,
                    },
                { key: "divider01", type: "divider" },
                item.status === TVoucherStatus.UPCOMING
                  ? {
                      key: "StartEarly",
                      label: i18n["Bắt đầu sớm"],
                      icon: <LuCalendarCheck size={16} />,
                      onClick: () =>
                        handleConfirmStartEarly(
                          item.id,
                          item.name,
                          i18n["Bắt đầu sớm"].toLowerCase(),
                        ),
                    }
                  : undefined,
                item.status === TVoucherStatus.ACTIVATED
                  ? {
                      key: "EndEarly",
                      label: i18n["Kết thúc sớm"],
                      icon: <LuCalendarX size={16} />,
                      danger: true,
                      onClick: () =>
                        handleConfirmEndEarly(
                          item.id,
                          item.name,
                          i18n["Kết thúc sớm"].toLowerCase(),
                        ),
                    }
                  : undefined,
                item.status === TVoucherStatus.UPCOMING
                  ? { key: "divider01", type: "divider" }
                  : undefined,
                item.status === TVoucherStatus.UPCOMING
                  ? {
                      key: "delete",
                      label: i18n["Xóa khuyến mãi"],
                      danger: true,
                      icon: <MdOutlineDelete size={16} />,
                      onClick: () => handleConfirm(item.id, item.name),
                    }
                  : undefined,
              ].filter((i) => !!i) as any[],
            }}
          >
            <CurrentStateActionBtn type="button">
              <Tag
                className="tag"
                bordered
                {...(stateConf?.[item.status] || { children: "---" })}
              />
              <BsThreeDots size={20} className="dots-icon" />
            </CurrentStateActionBtn>
          </Dropdown>
        );
      },
    },
  };
};
export default useVoucherColumns;

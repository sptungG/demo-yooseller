import { useCreation } from "ahooks";
import { Dropdown, Typography } from "antd";
import type { ColumnGroupType, ColumnType } from "antd/es/table";
import { useRouter } from "next/router";
import { BiEdit, BiShowAlt } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaPercent } from "react-icons/fa";
import { MdAttachMoney, MdOutlineDelete } from "react-icons/md";

import { dateFormatVoucher1, dayjs, formatDate, isAfterDate } from "@/utils/utils-date";
import { FaRegStopCircle } from "react-icons/fa";
import { MdOutlineNotStarted, MdVisibility } from "react-icons/md";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useModalDangerConfirm from "src/hooks/useModalDangerConfirm";
import {
  useDeleteVoucherMutation,
  useEndedVoucherMutation,
  useStartEarlyVoucherMutation,
} from "src/redux/query/farm.query";
import { TEVoucherDiscountType, TEVoucherScope, TVoucherItem } from "src/types/farm.types";
import { formatNumber, sorterByWords } from "src/utils/utils";
import VoucherFarmStatus from "../card/VoucherFarmStatus";
import Link from "../next/Link";
import { CurrentStateActionBtn, ItemNameCombined4, NameWithViewIcon } from "./StyledTable";

type TRes = Record<string, ColumnGroupType<TVoucherItem> | ColumnType<TVoucherItem>>;

const useFarmVoucherColumns = (): TRes => {
  const { i18n } = useChangeLocale();
  const { message } = useApp();
  const {
    query: { farmId },
  } = useRouter();

  const [deleteMutate] = useDeleteVoucherMutation();
  const [endVoucherMutate] = useEndedVoucherMutation();
  const [startVoucherMutate] = useStartEarlyVoucherMutation();
  const { handleConfirm } = useModalDangerConfirm({
    onOk: (id) => {
      deleteMutate({ id })
        .unwrap()
        .then(() => {
          message.success(i18n["Xóa voucher thành công"]);
        })
        .catch(() => {
          message.error(i18n["Đã có lỗi xảy ra khi xóa voucher"]);
        });
    },
  });

  const res: TRes = useCreation(
    () => ({
      nameCombined: {
        title: i18n["Mã Voucher"] + " | " + i18n["Tên"],
        dataIndex: "voucherCode",
        key: "voucherCode",
        render: (text, item) => (
          <ItemNameCombined4 style={{ opacity: new Date(item.dateEnd) < new Date() ? 0.45 : 1 }}>
            <div style={{ marginRight: 7 }}>
              {item.discountType == TEVoucherDiscountType.FIX_AMOUNT ? (
                <MdAttachMoney size={55} color={"white"} style={{ backgroundColor: "#339fd9" }} />
              ) : (
                <FaPercent
                  size={55}
                  color={"white"}
                  style={{ backgroundColor: "#339fd9", padding: 15 }}
                />
              )}
            </div>
            <div className="container" style={{ alignSelf: "center", maxWidth: 240 }}>
              <NameWithViewIcon>
                <Link
                  href={`/supplier/farm/${farmId}/voucher/${item.id}`}
                  passHref
                  className="name"
                >
                  {item.voucherCode}
                </Link>
                <MdVisibility className="view-icon" size={16} />
              </NameWithViewIcon>
              <div className="desc-wrapper">{item.name}</div>
              <div
                className="desc-wrapper"
                dangerouslySetInnerHTML={{
                  __html: item.description,
                }}
              ></div>
            </div>
          </ItemNameCombined4>
        ),
        sorter: (a, b) => sorterByWords("voucherCode")(a, b),
      },
      typeCode: {
        title: i18n["Loại mã"],
        dataIndex: "scope",
        key: "scope",
        width: 160,
        render: (text, item) =>
          item.scope == TEVoucherScope.SHOP_VOUCHER ? (
            <div>
              {i18n["Voucher toàn Shop"]}
              <Typography.Text ellipsis type="secondary">
                ({i18n["Tất cả sản phẩm"]})
              </Typography.Text>
            </div>
          ) : (
            <div>{i18n["Voucher sản phẩm"]}</div>
          ),
      },
      discount: {
        title: i18n["Giảm giá"],
        dataIndex: "discountType",
        key: "discountType",
        width: 140,
        render: (text, item) =>
          item.discountType == TEVoucherDiscountType.FIX_AMOUNT ? (
            <Typography.Text ellipsis type="success">
              {formatNumber(item.discountAmount)}₫
            </Typography.Text>
          ) : (
            <>
              <Typography.Text ellipsis type="success">
                {item.percentage}%
              </Typography.Text>
              <Typography.Text ellipsis type="secondary">
                {i18n["Tối đa"]}: {formatNumber(item.maxPrice)}₫
              </Typography.Text>
            </>
          ),
      },
      quantity: {
        title: i18n["Số lượng mã"],
        dataIndex: "quantity",
        key: "quantity",
        width: 140,
        render: (text, item) => (
          <Typography.Text ellipsis strong>
            {formatNumber(item.quantity)}
          </Typography.Text>
        ),
      },
      currentUsage: {
        title: i18n["Đã dùng"],
        dataIndex: "currentUsage",
        key: "currentUsage",
        width: 140,
        render: (text, item) => (
          <Typography.Text ellipsis strong>
            {formatNumber(item.currentUsage)}
          </Typography.Text>
        ),
      },
      time: {
        title: i18n["Thời gian sử dụng mã"],
        dataIndex: "dateStart",
        key: "dateStart",
        width: 100,
        render: (text, item) => (
          <Typography.Text ellipsis>
            {formatDate(item.dateStart, dateFormatVoucher1)}
            {" - "}
            <br />
            {formatDate(item.dateEnd, dateFormatVoucher1)}
          </Typography.Text>
        ),
      },

      actionsStatus: {
        title: <Typography.Text type="secondary">{i18n["Trạng thái"]}</Typography.Text>,
        dataIndex: "id",
        key: "actions",
        width: 160,
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
                    key: "view",
                    label: (
                      <Link href={`/supplier/farm/${farmId}/voucher/${item.id}`}>
                        {i18n["Xem voucher"]}
                      </Link>
                    ),
                    icon: <BiShowAlt size={17} />,
                  },
                  isAfterDate(item.dateStart, dayjs())
                    ? {
                        key: "edit",
                        label: (
                          <Link href={`/supplier/farm/${farmId}/voucher/${item.id}/edit`}>
                            {i18n["Sửa voucher"]}
                          </Link>
                        ),
                        icon: <BiEdit size={16} />,
                      }
                    : undefined,
                  isAfterDate(item.dateStart, dayjs())
                    ? {
                        key: "start",
                        label: i18n["Bắt đầu voucher"],
                        icon: <MdOutlineNotStarted size={13} />,
                        onClick: () => startVoucherMutate({ id: item.id }),
                      }
                    : undefined,
                  isAfterDate(dayjs(), item.dateStart) && isAfterDate(item.dateEnd, dayjs())
                    ? {
                        key: "end",
                        label: i18n["Kết thúc voucher"],
                        icon: <FaRegStopCircle size={13} />,
                        onClick: () => endVoucherMutate({ id: item.id }),
                      }
                    : undefined,

                  isAfterDate(item.dateStart, dayjs())
                    ? {
                        key: "delete",
                        label: i18n["Xóa voucher"],
                        danger: true,
                        icon: <MdOutlineDelete size={16} />,
                        onClick: () => handleConfirm(item.id, item.name),
                      }
                    : undefined,
                ].filter((i) => !!i) as any[],
              }}
            >
              <CurrentStateActionBtn type="button">
                <VoucherFarmStatus item={item} className="tag" bordered />
                <BsThreeDots size={20} className="dots-icon" />
              </CurrentStateActionBtn>
            </Dropdown>
          );
        },
      },
    }),
    [i18n],
  );
  return res;
};
export default useFarmVoucherColumns;

import { TEFlashSaleItemStatus, TFlashSale } from "@/types/flashSale.types";
import { useTheme } from "@emotion/react";
import { Flex, Typography } from "antd";
import type { ColumnGroupType, ColumnType } from "antd/es/table";
import { useRouter } from "next/router";
import { useId } from "react";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useModalDangerConfirm from "src/hooks/useModalDangerConfirm";
import {
  useDeleteVoucherMutation,
  useEndEarlyMutation,
  useStartEarlyMutation,
} from "src/redux/query/voucher.query";
import { formatDate } from "src/utils/utils-date";
type TUseFlashSaleColumnsProps = {
  storeId?: number;
};

type TRes = Record<string, ColumnGroupType<TFlashSale> | ColumnType<TFlashSale>>;

const useFlashSaleColumns = ({}: TUseFlashSaleColumnsProps): TRes => {
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
    dateRange: {
      title: (
        <Flex vertical style={{ marginBottom: -4 }}>
          <Typography.Text style={{ lineHeight: 1.1 }}>{i18n["Khung giờ"]}</Typography.Text>
          <Typography.Text type="secondary" style={{ lineHeight: 1.1, fontSize: 10 }}>
            bắt đầu → kết thúc
          </Typography.Text>
        </Flex>
      ),
      dataIndex: "dateRange",
      key: "dateRange",
      width: 160,
      render: (text, item) => (
        <Flex wrap="nowrap" align="center" gap={4}>
          <Typography.Text ellipsis>
            {formatDate(item.dateRange.start, "HH:mm DD-MM-YYYY")}
          </Typography.Text>
          <Typography.Text ellipsis>→ {formatDate(item.dateRange.end, "HH:mm")}</Typography.Text>
        </Flex>
      ),
    },
    itemModels01: {
      title: <Typography.Text>{i18n["Sản phẩm"]}</Typography.Text>,
      key: "itemModels",
      width: 160,
      render: (_, item) => (
        <Flex vertical>
          <Flex align="center" gap={4}>
            <Typography.Text ellipsis type="secondary" style={{ fontSize: 14 }}>
              Bật FlashSale:
            </Typography.Text>
            <Typography.Text strong style={{ color: generatedColors[5], flexShrink: 0 }}>
              {item.flashSaleItems?.filter((i) =>
                [TEFlashSaleItemStatus.OnGoing, TEFlashSaleItemStatus.Activated].includes(i.status),
              )?.length || 0}
            </Typography.Text>
          </Flex>
          <Typography.Text type="secondary" style={{ flexShrink: 0 }}>
            Số sản phẩm tham gia <b>{item.flashSaleItems?.length || 0}</b>
          </Typography.Text>
        </Flex>
      ),
    },

    // actionsState: {
    //   title: (
    //     <Typography.Text type="secondary" ellipsis>
    //       {i18n["Trạng thái"]}
    //     </Typography.Text>
    //   ),
    //   dataIndex: "id",
    //   key: "actionsState",
    //   width: 180,
    //   render: (text, item) => {
    //     const stateConf: Record<string, any> = {
    //       [TVoucherStatus.UPCOMING]: {
    //         children: "Sắp diễn ra",
    //         color: "blue",
    //       },
    //       [TVoucherStatus.ACTIVATED]: {
    //         children: "Đang diễn ra",
    //         color: "green",
    //       },
    //       [TVoucherStatus.EXPIRED]: {
    //         children: "Đã kết thúc",
    //         color: "default",
    //         bordered: false,
    //       },
    //     };
    //     return (
    //       <Dropdown
    //         placement="bottomRight"
    //         trigger={["click"]}
    //         mouseEnterDelay={0.01}
    //         mouseLeaveDelay={0.01}
    //         menu={{
    //           items: [
    //             item.status === TVoucherStatus.EXPIRED
    //               ? undefined
    //               : {
    //                   key: "edit",
    //                   label: (
    //                     <Link
    //                       href={`/supplier/store/${item.providerId}/marketing/voucher/${item.id}/edit`}
    //                     >
    //                       {i18n["Sửa khuyến mãi"]}
    //                     </Link>
    //                   ),
    //                   icon: <BiEdit size={16} />,
    //                 },
    //             { key: "divider01", type: "divider" },
    //             item.status === TVoucherStatus.UPCOMING
    //               ? {
    //                   key: "StartEarly",
    //                   label: i18n["Bắt đầu sớm"],
    //                   icon: <LuCalendarCheck size={16} />,
    //                   onClick: () =>
    //                     handleConfirmStartEarly(
    //                       item.id,
    //                       item.name,
    //                       i18n["Bắt đầu sớm"].toLowerCase(),
    //                     ),
    //                 }
    //               : undefined,
    //             item.status === TVoucherStatus.ACTIVATED
    //               ? {
    //                   key: "EndEarly",
    //                   label: i18n["Kết thúc sớm"],
    //                   icon: <LuCalendarX size={16} />,
    //                   danger: true,
    //                   onClick: () =>
    //                     handleConfirmEndEarly(
    //                       item.id,
    //                       item.name,
    //                       i18n["Kết thúc sớm"].toLowerCase(),
    //                     ),
    //                 }
    //               : undefined,
    //             item.status === TVoucherStatus.UPCOMING
    //               ? { key: "divider01", type: "divider" }
    //               : undefined,
    //             item.status === TVoucherStatus.UPCOMING
    //               ? {
    //                   key: "delete",
    //                   label: i18n["Xóa khuyến mãi"],
    //                   danger: true,
    //                   icon: <MdOutlineDelete size={16} />,
    //                   onClick: () => handleConfirm(item.id, item.name),
    //                 }
    //               : undefined,
    //           ].filter((i) => !!i) as any[],
    //         }}
    //       >
    //         <CurrentStateActionBtn type="button">
    //           <Tag
    //             className="tag"
    //             bordered
    //             {...(stateConf?.[item.status] || { children: "---" })}
    //           />
    //           <BsThreeDots size={20} className="dots-icon" />
    //         </CurrentStateActionBtn>
    //       </Dropdown>
    //     );
    //   },
    // },
  };
};
export default useFlashSaleColumns;

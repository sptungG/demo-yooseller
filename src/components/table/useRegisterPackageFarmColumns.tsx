import { TPaymentStatus } from "@/types/order.types";
import { formatDate } from "@/utils/utils-date";
import { Dropdown, Flex, TagProps, Typography, theme } from "antd";
import type { ColumnGroupType, ColumnType } from "antd/es/table";
import Link from "next/link";
import { useRouter } from "next/router";
import { CSSProperties } from "react";
import { BiShowAlt } from "react-icons/bi";
import { BsCheckCircle, BsThreeDots, BsXCircle } from "react-icons/bs";
import { MdVisibility } from "react-icons/md";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useUpdateStateEcofarmRegisterMutation } from "src/redux/query/farm.query";
import { TRegisterItem, TRegisterStatus } from "src/types/farm.types";
import { formatNumber } from "src/utils/utils";
import Avatar from "../avatar/Avatar";
import AvatarGroupItem from "../avatar/AvatarGroupItem";
import PaymentMethodTag from "../tag/PaymentMethodTag";
import Tag from "../tag/Tag";
import { CurrentStateActionBtn, ItemNameCombined4, NameWithViewIcon } from "./StyledTable";

type TRes = Record<string, ColumnGroupType<TRegisterItem> | ColumnType<TRegisterItem>>;
type TuseRegisterPackageFarmColumnsProps = {
  onClickViewDetail?: (id: number) => void;
  onClickUpdateStatus?: (id: number) => void;
};

const useRegisterPackageFarmColumns = ({
  onClickUpdateStatus,
}: TuseRegisterPackageFarmColumnsProps): TRes => {
  const { i18n } = useChangeLocale();
  const { message } = useApp();
  const {
    query: { farmId },
  } = useRouter();

  const {
    token: { colorPrimary, colorSuccess },
  } = theme.useToken();

  const [updateStatus] = useUpdateStateEcofarmRegisterMutation();

  const handleCancel = (id?: number) => {
    if (!!id)
      updateStatus({ id, status: TRegisterStatus.CANCELLED })
        .unwrap()
        .then(() => {
          message.success(i18n["Hủy đăng ký gói farming thành công"]);
        })
        .catch(() => {
          message.error(i18n["Đã có lỗi xảy ra khi hủy đăng ký gói farming"]);
        });
  };
  const handleApproval = (id?: number) => {
    if (!!id)
      updateStatus({ id, status: TRegisterStatus.INVESTING })
        .unwrap()
        .then(() => {
          message.success(i18n["Đồng ý đăng ký gói farming thành công"]);
        })
        .catch(() => {
          message.error(i18n["Đã có lỗi xảy ra khi đồng ý đăng ký gói farming"]);
        });
  };

  const statusStyle = (status: TRegisterStatus): CSSProperties => ({
    opacity: [TRegisterStatus.PENDING_APPROVAL, TRegisterStatus.COMPLETED].includes(status) ? 1 : 1,
  });

  return {
    nameCombined: {
      title: i18n["Người đăng ký"],
      dataIndex: "investorId",
      key: "investorId",
      render: (text, item) => (
        <Flex gap={8} style={{ ...statusStyle(item.status) }}>
          <Avatar shape="square" size={64}>
            {item.recipientAddress?.name?.[0] || "N"}
          </Avatar>
          <Flex vertical flex="1 1 auto" style={{ minWidth: 0 }}>
            <NameWithViewIcon
              onClick={() => {
                onClickUpdateStatus?.(item.id);
              }}
            >
              <Typography.Text className="code" ellipsis>
                {item.recipientAddress?.name}
              </Typography.Text>
              <MdVisibility className="view-icon" size={16} />
            </NameWithViewIcon>
            <Typography.Text
              style={{ fontSize: 12, lineHeight: 1.1, marginTop: "auto" }}
              ellipsis
              type="secondary"
            >
              {item.recipientAddress?.phone}
            </Typography.Text>
            <Typography.Text
              style={{ fontSize: 12, lineHeight: 1.1, marginTop: "auto" }}
              ellipsis
              type="secondary"
            >
              {item.recipientAddress?.fullAddress}
            </Typography.Text>
            <Flex align="baseline" gap={2} style={{ marginTop: "auto" }}>
              <Typography.Text ellipsis style={{ fontSize: 10 }}>
                Ngày đăng ký:
              </Typography.Text>
              <Typography.Text ellipsis style={{ fontSize: 12 }}>
                {formatDate(item.creationTime, "DD-MM-YYYY HH:mm")}
              </Typography.Text>
            </Flex>
          </Flex>
        </Flex>
      ),
    },
    ecofarmType: {
      title: i18n["Số lượng"],
      dataIndex: "ecofarmType",
      key: "ecofarmType",
      width: 100,
      render: (text, item) => (
        <Flex vertical>
          <Typography.Text ellipsis style={{ marginBottom: -2 }}>
            Đăng ký
          </Typography.Text>
          <Typography.Text ellipsis style={{}}>
            {item.ecofarmType == 1 ? (
              i18n["Combo gói"]
            ) : (
              <>
                <b>{item.numberOfShared}</b> {i18n["suất"]}
              </>
            )}
          </Typography.Text>
        </Flex>
      ),
    },
    ecofarmPackage: {
      title: i18n["Gói farming"],
      dataIndex: "ecofarmPackageId",
      key: "ecofarmPackageId",
      width: 100,
      render: (text, item) => (
        <ItemNameCombined4>
          <AvatarGroupItem
            className="image-wrapper"
            size={64}
            items={item.ecoFarmPackage.imageUrlList}
          />
          <div className="container">
            <NameWithViewIcon style={{ maxWidth: "100%" }}>
              <Link
                href={`/supplier/farm/${farmId}/package/${item.ecoFarmPackage.id}`}
                passHref
                className="name"
              >
                {item.ecoFarmPackage.name}
              </Link>
            </NameWithViewIcon>
            <div
              className="desc-wrapper"
              dangerouslySetInnerHTML={{
                __html: item.ecoFarmPackage.description,
              }}
            ></div>

            <div className="price-wrapper">
              <Typography.Text ellipsis type="success" style={{ fontSize: 14 }}>
                {item.ecoFarmPackage.pricePerShare === item.ecoFarmPackage.packagePrice
                  ? `${formatNumber(item.ecoFarmPackage.pricePerShare)}₫`
                  : `${formatNumber(item.ecoFarmPackage.pricePerShare)}₫ ~ ${formatNumber(
                      item.ecoFarmPackage.packagePrice,
                    )}₫`}
              </Typography.Text>
            </div>
          </div>
        </ItemNameCombined4>
      ),
    },

    totalPrice: {
      title: i18n["Thanh toán"],
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 130,
      render: (text, item) => (
        <Flex vertical align="flex-end">
          <Typography.Text ellipsis type="success">
            {`${formatNumber(item.totalPrice)}₫`}
          </Typography.Text>
          <PaymentMethodTag method={+item.paymentMethod} />
        </Flex>
      ),
    },

    paymentStatus: {
      title: i18n["Thanh toán"],
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 130,
      render: (text, item) => {
        const statusConf: Record<string, TagProps> = {
          [TPaymentStatus.PENDING]: { color: "warning", children: i18n["Chờ duyệt"] },
          [TPaymentStatus.FAILED]: {
            color: "default",
            children: i18n["Đã hủy"],
            bordered: false,
          },
          [TPaymentStatus.COMPLETED]: {
            color: "green",
            children: i18n["Hoàn thành"],
          },
        };
        return (
          <Flex vertical align="flex-end">
            <Tag bordered {...(statusConf?.[String(item.paymentStatus)] || { children: "---" })} />
          </Flex>
        );
      },
    },
    actionsStatus: {
      title: <Typography.Text type="secondary">{i18n["Trạng thái"]}</Typography.Text>,
      dataIndex: "id",
      key: "actions",
      width: 180,
      render: (text, item) => {
        const statusConf: Record<string, TagProps> = {
          [TRegisterStatus.PENDING_APPROVAL]: { color: "cyan", children: i18n["Chờ duyệt"] },
          [TRegisterStatus.CANCELLED]: {
            color: "error",
            children: i18n["Đã hủy"],
          },
          [TRegisterStatus.INVESTING]: {
            color: "blue",
            children: i18n["Đã duyệt, Đang đầu tư"],
          },
          [TRegisterStatus.COMPLETED]: {
            color: "green",
            children: i18n["Hoàn thành"],
          },
        };

        const paymentStatusConf: Record<string, TagProps> = {
          [TPaymentStatus.PENDING]: { children: i18n["Đang chờ"] },
          [TPaymentStatus.FAILED]: {
            children: i18n["Thất bại"],
          },
          [TPaymentStatus.COMPLETED]: {
            children: i18n["Hoàn thành"],
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
                {
                  key: "view",
                  label: i18n["Xem chi tiết"],
                  icon: <BiShowAlt size={17} />,
                  onClick: () => {
                    //onClickViewDetail?.(item.id);
                    onClickUpdateStatus?.(item.id);
                  },
                },
                [TRegisterStatus.PENDING_APPROVAL].includes(item.status)
                  ? { key: "divider01", type: "divider" }
                  : undefined,
                [TRegisterStatus.PENDING_APPROVAL].includes(item.status)
                  ? {
                      key: "ok",
                      label: i18n["Xác nhận đăng ký"],
                      icon: <BsCheckCircle size={16} style={{ color: colorSuccess }} />,
                      onClick: () => handleApproval(item.id),
                    }
                  : undefined,
                [TRegisterStatus.PENDING_APPROVAL].includes(item.status)
                  ? {
                      key: "cancel",
                      label: i18n["Từ chối đăng ký"],
                      icon: <BsXCircle size={16} />,
                      onClick: () => handleCancel(item.id),
                    }
                  : undefined,
                // [TRegisterStatus.INVESTING].includes(item.status)
                //   ? {
                //       key: "complete",
                //       label: i18n["Hoàn thành"],
                //       icon: <MdPlaylistAddCheck size={16} />,
                //       onClick: () => handleComplete(item.id),
                //     }
                //   : undefined,
              ].filter((i) => !!i) as any[],
            }}
          >
            <CurrentStateActionBtn type="button">
              <Tag
                className="tag"
                bordered
                {...(statusConf?.[String(item.status)] || { children: "---" })}
              />
              <BsThreeDots size={20} className="dots-icon" />
              <Flex className="actions-bottom" align="center" gap={4}>
                <Typography.Text style={{ fontSize: 11 }}>Thanh toán:</Typography.Text>
                <Typography.Text
                  style={{ fontSize: 12 }}
                  {...(paymentStatusConf?.[String(item.paymentStatus)] || { children: "---" })}
                ></Typography.Text>
              </Flex>
            </CurrentStateActionBtn>
          </Dropdown>
        );
      },
    },
  };
};

export default useRegisterPackageFarmColumns;

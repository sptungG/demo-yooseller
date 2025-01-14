import {
  useDeleteEcofarmPackageMutation,
  useUpdateStatusEcofarmPackageMutation,
} from "@/redux/query/farm.query";
import { Descriptions, Dropdown, Flex, Popover, TagProps, Typography } from "antd";
import type { ColumnGroupType, ColumnType } from "antd/es/table";
import { useRouter } from "next/router";
import { CSSProperties } from "react";
import { BiEdit, BiShowAlt } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaInfo } from "react-icons/fa";
import { LuCalendarCheck, LuCalendarX } from "react-icons/lu";
import { MdOutlineDelete, MdStarRate, MdVisibility } from "react-icons/md";
import { TbClockPlay } from "react-icons/tb";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useModalDangerConfirm from "src/hooks/useModalDangerConfirm";
import { TPackageItem, TPackageStatus } from "src/types/farm.types";
import { formatNumber, sorterByWords } from "src/utils/utils";
import { formatDate } from "src/utils/utils-date";
import Avatar from "../avatar/Avatar";
import AvatarGroupItem from "../avatar/AvatarGroupItem";
import RegistersPackageFarmCell from "../list/RegistersPackageFarmCell";
import Link from "../next/Link";
import Tag from "../tag/Tag";
import {
  CurrentStateActionBtn,
  ItemNameCombined4,
  ItemStock,
  NameWithViewIcon,
} from "./StyledTable";
type TUsePackageColumnsProps = {
  onOpenPackageModal?: (item?: any) => void;
};

type TRes = Record<string, ColumnGroupType<TPackageItem> | ColumnType<TPackageItem>>;

const usePackageColumns = ({ onOpenPackageModal }: TUsePackageColumnsProps): TRes => {
  const { i18n } = useChangeLocale();
  const { message } = useApp();
  const {
    query: { farmId },
  } = useRouter();

  const [deleteEcofarmPackageMutate] = useDeleteEcofarmPackageMutation();
  const { handleConfirm } = useModalDangerConfirm({
    onOk: (id) => {
      deleteEcofarmPackageMutate({ id })
        .unwrap()
        .then((result) => {
          if (result.data === true) {
            message.success(i18n["Xóa gói dịch vụ farming thành công"]);
          } else {
            message.error(i18n["Đã có lỗi xảy ra khi xóa gói dịch vụ farming"]);
          }
        })
        .catch(() => {
          message.error(i18n["Đã có lỗi xảy ra khi xóa gói dịch vụ farming"]);
        });
    },
  });

  const [updateStatusEcofarmPackageMutate] = useUpdateStatusEcofarmPackageMutation();
  const { handleConfirm: handleConfirmEndEarly } = useModalDangerConfirm({
    onOk: (id) => {
      updateStatusEcofarmPackageMutate({ id, status: TPackageStatus.COMPLETED })
        .unwrap()
        .then((data) => {
          if (data.success === true) {
            message.success(i18n["Kết thúc sớm gói dịch vụ thành công"]);
          } else {
            message.error(i18n["Đã có lỗi xảy ra khi kết thúc sớm gói dịch vụ"]);
          }
        })
        .catch((err) => {
          message.error(i18n["Đã có lỗi xảy ra khi kết thúc sớm gói dịch vụ"]);
        });
    },
    okButtonProps: { size: "middle", type: "primary", icon: <LuCalendarCheck /> },
  });

  const { handleConfirm: handleConfirmStartEarly } = useModalDangerConfirm({
    onOk: (id) => {
      updateStatusEcofarmPackageMutate({ id, status: TPackageStatus.ACTIVATED })
        .unwrap()
        .then((data) => {
          if (data.success === true) {
            message.success(i18n["Bắt đầu sớm gói dịch vụ thành công"]);
          } else {
            message.error(i18n["Đã có lỗi xảy ra khi bắt đầu sớm gói dịch vụ"]);
          }
        })
        .catch((err) => {
          message.error(i18n["Đã có lỗi xảy ra khi bắt đầu sớm gói dịch vụ"]);
        });
    },
    okButtonProps: { size: "middle", type: "primary", icon: <TbClockPlay /> },
  });

  const { handleConfirm: handleConfirmClose } = useModalDangerConfirm({
    onOk: (id) => {
      updateStatusEcofarmPackageMutate({ id, status: TPackageStatus.CLOSED })
        .unwrap()
        .then((data) => {
          if (data.success === true) {
            message.success(i18n["Đóng gói dịch vụ thành công"]);
          } else {
            message.error(i18n["Đã có lỗi xảy ra khi đóng gói dịch vụ"]);
          }
        })
        .catch((err) => {
          message.error(i18n["Đã có lỗi xảy ra khi đóng gói dịch vụ"]);
        });
    },
    okButtonProps: { size: "middle", type: "primary", danger: true, icon: <LuCalendarX /> },
  });

  const statusStyle = (status: TPackageStatus): CSSProperties => ({
    opacity: [TPackageStatus.CLOSED].includes(status) ? 0.45 : 1,
  });

  return {
    nameCombined: {
      title: i18n["Gói farming"],
      dataIndex: "name",
      key: "name",
      render: (text, item) => (
        <ItemNameCombined4 style={{ ...statusStyle(item.status) }}>
          <AvatarGroupItem className="image-wrapper" size={64} items={item.imageUrlList} />
          <div className="container">
            <NameWithViewIcon style={{ maxWidth: "100%" }}>
              <Link href={`/supplier/farm/${farmId}/package/${item.id}`} passHref className="name">
                {item.name}
              </Link>
              <MdVisibility className="view-icon" size={16} />
            </NameWithViewIcon>
            <div
              className="desc-wrapper"
              dangerouslySetInnerHTML={{
                __html: item.description,
              }}
            ></div>

            <Flex gap={8}>
              <Tag
                color={!!item.ratePoint ? "gold" : "default"}
                bordered={false}
                icon={<MdStarRate style={{ margin: "-2px 2px 0 0" }} />}
              >
                {item.ratePoint || "0"}
              </Tag>
              <Tag
                color={"default"}
                bordered={false}
                icon={<MdVisibility style={{ margin: "0 4px 0 0" }} />}
              >
                {formatNumber(item.viewCount) || "0"}
              </Tag>
            </Flex>
          </div>
        </ItemNameCombined4>
      ),
      sorter: (a, b) => sorterByWords("name")(a, b),
    },

    viewMore: {
      title: "",
      dataIndex: "name",
      key: "viewMore",
      width: 36,
      render: (text, item) => (
        <ItemStock>
          <Popover
            placement="leftTop"
            arrow={false}
            content={
              <div style={{ maxWidth: 240 }}>
                <Descriptions
                  title={i18n["Thông tin gói farming"]}
                  layout="vertical"
                  size="small"
                  column={1}
                  labelStyle={{ marginBottom: 0 }}
                  contentStyle={{ marginTop: -10, lineHeight: 1.2 }}
                >
                  <Descriptions.Item label={i18n["Giá trên 1 gói"]}>
                    {formatNumber(item.packagePrice)} ₫
                  </Descriptions.Item>
                  <Descriptions.Item label={i18n["Giá trên 1 suất"]}>
                    {formatNumber(item.pricePerShare)} ₫
                  </Descriptions.Item>
                  <Descriptions.Item label={"Số tháng đầu tư"}>
                    {item.totalInvestmentTerm} tháng
                  </Descriptions.Item>
                  <Descriptions.Item label={i18n["Thời gian bắt đầu đầu tư"]}>
                    {formatDate(item.startDate.toString())}
                  </Descriptions.Item>
                  <Descriptions.Item label={i18n["Ngày thu hoạch dự kiến"]}>
                    {formatDate(item.expectedEndDate.toString())}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            }
          >
            <Avatar size={24} icon={<FaInfo />} className="info" />
          </Popover>
        </ItemStock>
      ),
    },

    datetime: {
      title: (
        <Flex vertical style={{ marginBottom: -4 }}>
          <Typography.Text style={{ lineHeight: 1.1 }}>{i18n["Thời gian"]}</Typography.Text>
          <Typography.Text type="secondary" style={{ lineHeight: 1.1, fontSize: 10 }}>
            bắt đầu → thu hoạch
          </Typography.Text>
        </Flex>
      ),
      dataIndex: "datetime",
      key: "datetime",
      width: 160,
      render: (text, item) => (
        <Flex vertical>
          <Typography.Text ellipsis>
            {formatDate(item.startDate, "HH:mm DD-MM-YYYY")}
          </Typography.Text>
          <Typography.Text ellipsis>
            →{formatDate(item.expectedEndDate, "HH:mm DD-MM-YYYY")}
          </Typography.Text>
        </Flex>
      ),
    },

    numberSharesSold: {
      title: <Typography.Text style={{ fontSize: 12 }}>{i18n["Số suất đã bán"]}</Typography.Text>,
      dataIndex: "numberSharesSold",
      key: "numberSharesSold",
      width: 160,
      render: (text, item) => (
        <Typography.Text style={{ opacity: !!item.numberSharesSold ? 1 : 0.5 }}>
          {formatNumber(item.numberSharesSold)}
        </Typography.Text>
      ),
    },

    pricePerShare: {
      title: (
        <Flex vertical style={{ marginBottom: -4 }}>
          <Typography.Text style={{ fontSize: 12, marginBottom: -6 }}>
            {i18n["Giá tiền từng suất"]}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            | {i18n["Tổng số suất"]}
          </Typography.Text>
        </Flex>
      ),
      dataIndex: "pricePerShare",
      key: "pricePerShare",
      width: 160,
      render: (text, item) => (
        <Flex vertical>
          <Typography.Text type="success" style={{ opacity: !!item.pricePerShare ? 1 : 0.5 }}>
            {formatNumber(item.pricePerShare)}₫
          </Typography.Text>
          <Typography.Text type="secondary">
            <span>{formatNumber(item.totalNumberShares)}</span>{" "}
            <span style={{ fontSize: 10 }}>suất</span>
          </Typography.Text>
        </Flex>
      ),
    },

    packagePrice: {
      title: (
        <Typography.Text style={{ fontSize: 12 }}>{i18n["Tổng giá tiền gói"]}</Typography.Text>
      ),
      dataIndex: "packagePrice",
      key: "packagePrice",
      width: 160,
      render: (text, item) => (
        <Typography.Text type="success" style={{ opacity: !!item.packagePrice ? 1 : 0.5 }}>
          {formatNumber(item.packagePrice)}₫
        </Typography.Text>
      ),
    },

    registerList: {
      title: (
        <Flex vertical style={{ marginBottom: -4 }}>
          <Typography.Text style={{ fontSize: 12, marginBottom: -6 }}>
            {i18n["Đăng ký"]}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            | {i18n["Đầu tư"]}
          </Typography.Text>
        </Flex>
      ),
      dataIndex: "id",
      key: "registerList",
      width: 160,
      render: (text, item) => (
        <RegistersPackageFarmCell
          onClick={() => onOpenPackageModal?.(item)}
          ecofarmPackageId={item.id}
          providerId={item.providerId}
        />
      ),
    },

    actionsStatus: {
      title: (
        <Typography.Text
          type="secondary"
          style={{ fontSize: 12 }}
        >{`${i18n["Trạng thái"]} | ${i18n["Hành động"]}`}</Typography.Text>
      ),
      dataIndex: "id",
      key: "actions",
      width: 160,
      render: (text, item) => {
        const stateConf: Record<number, TagProps> = {
          [TPackageStatus.ONGOING]: {
            children: "Sắp diễn ra",
            color: "cyan",
          },
          [TPackageStatus.ACTIVATED]: {
            children: "Đang diễn ra",
            color: "blue",
          },
          [TPackageStatus.COMPLETED]: {
            children: "Đã hoàn thành/kết thúc",
            color: "success",
          },
          [TPackageStatus.CLOSED]: {
            children: "Đã đóng/hủy",
            color: "error",
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
                {
                  key: "view",
                  label: i18n["Xem gói farming"],
                  icon: <BiShowAlt size={17} />,
                  onClick: () => onOpenPackageModal?.(item),
                },
                [TPackageStatus.COMPLETED, TPackageStatus.CLOSED].includes(item.status)
                  ? undefined
                  : {
                      key: "edit",
                      label: (
                        <Link href={`/supplier/farm/${farmId}/package/${item.id}/edit`}>
                          {i18n["Sửa gói farming"]}
                        </Link>
                      ),
                      icon: <BiEdit size={16} />,
                    },
                [TPackageStatus.CLOSED, TPackageStatus.ACTIVATED, TPackageStatus.ONGOING].includes(
                  item.status,
                )
                  ? { key: "divider01", type: "divider" }
                  : undefined,
                item.status === TPackageStatus.ACTIVATED
                  ? {
                      key: "EndEarly",
                      label: i18n["Kết thúc sớm"],
                      icon: <LuCalendarCheck size={16} />,
                      onClick: () =>
                        handleConfirmEndEarly(
                          item.id,
                          item.name,
                          i18n["Kết thúc sớm"].toLowerCase(),
                        ),
                    }
                  : undefined,
                item.status === TPackageStatus.ONGOING
                  ? {
                      key: "StartEarly",
                      label: i18n["Bắt đầu sớm"],
                      icon: <TbClockPlay size={16} />,
                      onClick: () =>
                        handleConfirmStartEarly(
                          item.id,
                          item.name,
                          i18n["Bắt đầu sớm"].toLowerCase(),
                        ),
                    }
                  : undefined,
                item.status === TPackageStatus.ONGOING
                  ? {
                      key: "Closed",
                      label: i18n["Đóng"],
                      icon: <LuCalendarX size={16} />,
                      danger: true,
                      onClick: () =>
                        handleConfirmClose(item.id, item.name, i18n["Đóng"].toLowerCase()),
                    }
                  : undefined,
                [TPackageStatus.CLOSED].includes(item.status)
                  ? {
                      key: "delete",
                      label: i18n["Xóa gói farming"],
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

export default usePackageColumns;

import StoreWorkTime from "@/components/tag/StoreWorkTime";
import { Descriptions, Dropdown, Popover, Typography } from "antd";
import type { ColumnGroupType, ColumnType } from "antd/es/table";
import { CSSProperties, useId } from "react";
import { BiEdit, BiHide, BiShowAlt } from "react-icons/bi";
import { BsCalendarWeekFill, BsCheckCircle, BsPersonLinesFill, BsThreeDots } from "react-icons/bs";
import { FaStoreAlt, FaStoreAltSlash } from "react-icons/fa";
import { MdStarRate, MdVisibility } from "react-icons/md";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProviderFarmTypes from "src/hooks/useGetProviderFarmTypes";
import useModalDangerConfirm from "src/hooks/useModalDangerConfirm";
import {
  useAdminDeleteProviderMutation,
  useApproveProviderMutation,
} from "src/redux/query/admin.query";
import {
  useDeleteProviderEcoFarmMutation,
  useUpdateStateOfProviderEcoFarmMutation,
} from "src/redux/query/farm.query";
import { TProviderEcoFarmState, TProviderEcofarmItem } from "src/types/farm.types";
import { sorterByWords } from "src/utils/utils";
import Avatar, { AvatarGroup } from "../avatar/Avatar";
import ProviderEcoFarmState from "../card/ProviderEcoFarmState";
import Link from "../next/Link";
import Tag from "../tag/Tag";
import {
  CurrentStateActionBtn,
  IconsInfoWrapper,
  NameWithViewIcon,
  StoreDetailWrapper,
} from "./StyledTable";

type TuseFarmColumnsProps = {};

type TRes = Record<
  string,
  ColumnGroupType<TProviderEcofarmItem> | ColumnType<TProviderEcofarmItem>
>;

const useFarmColumns = ({}: TuseFarmColumnsProps): TRes => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { message } = useApp();
  const { mappedFarmTypes } = useGetProviderFarmTypes();

  const [deleteMutate] = useDeleteProviderEcoFarmMutation();
  const { handleConfirm } = useModalDangerConfirm({
    onOk: (id) => {
      deleteMutate({ id })
        .unwrap()
        .then(() => {
          message.success(i18n["Xóa trang trại thành công"]);
        })
        .catch(() => {
          message.error(i18n["Đã có lỗi xảy ra khi xóa trang trại"]);
        });
    },
  });

  const [approveMutate] = useApproveProviderMutation();
  const handleApprove = (id?: number) => {
    !!id &&
      approveMutate({ id })
        .unwrap()
        .then(() => {
          message.success(i18n["Duyệt cửa hàng thành công"]);
        })
        .catch(() => {
          message.error(i18n["Đã có lỗi xảy ra khi duyệt cửa hàng"]);
        });
  };
  const [updateStateOfProviderEcoFarmMutation] = useUpdateStateOfProviderEcoFarmMutation();
  const handleUpdateStatus = ({ id, state }: { id?: number; state?: number }) => {
    if (!!id && !!state)
      updateStateOfProviderEcoFarmMutation({ id, state })
        .unwrap()
        .then(() => {
          if (state === 3) message.warning(i18n["Ngừng kinh doanh trang trại thành công"]);
          if (state === 2) message.success(i18n["Mở kinh doanh trang trại thành công"]);
          if (state === 4) message.warning(i18n["Ẩn trang trại thành công"]);
        })
        .catch(() => {
          message.error(i18n["Đã có lỗi xảy ra khi cập nhật trang trại"]);
        });
  };
  const [adminDeleteMutate] = useAdminDeleteProviderMutation();
  const { handleConfirm: handleConfirmAdminDelete } = useModalDangerConfirm({
    onOk: (id) => {
      adminDeleteMutate({ id })
        .unwrap()
        .then((result) => {
          if (result.success === true) {
            message.success(i18n["Xóa trang trại thành công"]);
          } else {
            message.error(i18n["Đã có lỗi xảy ra khi xóa trang trại"]);
          }
        })
        .catch(() => {
          message.error(i18n["Đã có lỗi xảy ra khi xóa trang trại"]);
        });
    },
  });

  const statusStyle = (status: TProviderEcoFarmState): CSSProperties => ({
    opacity: [TProviderEcoFarmState.PENDING, TProviderEcoFarmState.ACTIVATED].includes(status)
      ? 1
      : 0.45,
  });

  return {
    nameCombined4: {
      title: i18n["Trang trại"],
      dataIndex: "name",
      key: "name",
      render: (text, item) => (
        <StoreDetailWrapper style={{ ...statusStyle(item.state) }}>
          <AvatarGroup className="detail-images" maxCount={1}>
            {item.imageUrls.map((url, index) => (
              <Avatar size={64} shape="square" src={url} key={uid + "image:" + index}>
                {item?.name || ""}
              </Avatar>
            ))}
          </AvatarGroup>
          <div className="container">
            <NameWithViewIcon>
              <Link href={`/supplier/farm/${item.id}`} passHref className="name">
                {item.name}
              </Link>
              <MdVisibility className="view-icon" size={16} />
            </NameWithViewIcon>
            <div
              className="desc-wrapper"
              dangerouslySetInnerHTML={{ __html: item.description }}
            ></div>

            <div className="rate-wrapper">
              <Tag
                color={!!item?.ratePoint ? "gold" : "default"}
                bordered={false}
                icon={<MdStarRate />}
              >
                {item.ratePoint || "0"}
              </Tag>
              <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                <span style={{ margin: 2 }}>•</span>
                <span style={{ fontWeight: 600 }}>{item.countRate}</span>{" "}
                {i18n["Đánh giá"].toLowerCase()}
              </Typography.Text>
            </div>
          </div>
        </StoreDetailWrapper>
      ),
      sorter: (a, b) => sorterByWords("name")(a, b),
    },
    type: {
      title: i18n["Loại trang trại"],
      dataIndex: "type",
      key: "type",
      render: (text, item) => {
        return (
          <Tag bordered={false} style={{ flexShrink: 0 }}>{`${mappedFarmTypes(item.groupType)}${
            !!item.type ? " / " + mappedFarmTypes(item.type) : ""
          }`}</Tag>
        );
      },
    },
    others: {
      title: <></>,
      dataIndex: "id",
      key: "properties",
      render: (text, item) => {
        return (
          <IconsInfoWrapper>
            {!!item.phoneNumber && (
              <Popover
                placement="leftTop"
                arrow={false}
                content={
                  <div style={{ maxWidth: 240 }}>
                    <Descriptions
                      title={i18n["Liên hệ"]}
                      layout="vertical"
                      size="small"
                      column={1}
                      labelStyle={{ marginBottom: 0 }}
                      contentStyle={{ marginTop: -10, lineHeight: 1.2 }}
                    >
                      <Descriptions.Item label={i18n["Số điện thoại"]}>
                        {item.phoneNumber}
                      </Descriptions.Item>
                      <Descriptions.Item label={i18n["Tên liên hệ"]}>
                        {item.contact}
                      </Descriptions.Item>
                      <Descriptions.Item label={"Email"}>{item.email}</Descriptions.Item>
                      <Descriptions.Item label={i18n["Địa chỉ"]}>{item.address}</Descriptions.Item>
                    </Descriptions>
                  </div>
                }
              >
                <Avatar icon={<BsPersonLinesFill />} size={32} />
              </Popover>
            )}
            {!!item.workTime && (
              <Popover
                placement="leftTop"
                arrow={false}
                content={
                  <>
                    <StoreWorkTime workTime={item.workTime} />
                  </>
                }
              >
                <Avatar icon={<BsCalendarWeekFill />} size={32} />
              </Popover>
            )}
          </IconsInfoWrapper>
        );
      },
    },
    actionsState: {
      title: <Typography.Text type="secondary">{i18n["Trạng thái"]}</Typography.Text>,
      dataIndex: "id",
      key: "actionsState",
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
                  label: <Link href={`/supplier/farm/${item.id}`}>{i18n["Xem trang trại"]}</Link>,
                  icon: <BiShowAlt size={17} />,
                },
                {
                  key: "edit",
                  label: (
                    <Link href={`/supplier/farm/${item.id}/edit`}>{i18n["Sửa trang trại"]}</Link>
                  ),
                  icon: <BiEdit size={16} />,
                },
                { key: "divider01", type: "divider" },
                ,
                [TProviderEcoFarmState.INACTIVATED, TProviderEcoFarmState.HIDDEN].includes(
                  item.state,
                )
                  ? {
                      key: "show",
                      label: i18n["Mở kinh doanh"],
                      icon: <FaStoreAlt size={13} />,
                      onClick: () => handleUpdateStatus({ id: item.id, state: 2 }),
                    }
                  : undefined,
                [TProviderEcoFarmState.ACTIVATED].includes(item.state)
                  ? {
                      key: "hide",
                      label: i18n["Ngừng kinh doanh"],
                      icon: <FaStoreAltSlash size={13} />,
                      onClick: () => handleUpdateStatus({ id: item.id, state: 3 }),
                    }
                  : undefined,
                [TProviderEcoFarmState.ACTIVATED].includes(item.state)
                  ? {
                      key: "hidden",
                      label: i18n["Ẩn trang trại"],
                      icon: <BiHide size={16} />,
                      onClick: () => handleUpdateStatus({ id: item.id, state: 4 }),
                    }
                  : undefined,
                // [
                //   TProviderEcoFarmState.PENDING,
                //   TProviderEcoFarmState.ACTIVATED,
                //   // TProviderEcoFarmState.INACTIVATED,
                //   // TProviderEcoFarmState.HIDDEN,
                //   // TProviderEcoFarmState.BLOCKED,
                // ].includes(item.state)
                //   ? {
                //       key: "delete",
                //       label: i18n["Xóa trang trại"],
                //       danger: true,
                //       icon: <MdOutlineDelete size={16} />,
                //       onClick: () => handleConfirm(item.id, item.name),
                //     }
                //   : undefined,
              ].filter((i) => !!i) as any[],
            }}
          >
            <CurrentStateActionBtn type="button">
              <ProviderEcoFarmState state={item.state} className="tag" bordered />
              <BsThreeDots size={20} className="dots-icon" />
            </CurrentStateActionBtn>
          </Dropdown>
        );
      },
    },
    adminActionsState: {
      title: <Typography.Text type="secondary">{i18n["Trạng thái"]}</Typography.Text>,
      dataIndex: "id",
      key: "actionsState",
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
                  label: <Link href={`/supplier/farm/${item.id}`}>{i18n["Xem trang trại"]}</Link>,
                  icon: <BiShowAlt size={17} />,
                  disabled: true,
                },
                {
                  key: "edit",
                  label: (
                    <Link href={`/supplier/farm/${item.id}/edit`}>{i18n["Sửa trang trại"]}</Link>
                  ),
                  icon: <BiEdit size={16} />,
                  disabled: true,
                },
                { key: "divider01", type: "divider" },
                ,
                [TProviderEcoFarmState.PENDING].includes(item.state)
                  ? {
                      key: "show",
                      label: i18n["Duyệt cửa hàng"],
                      icon: <BsCheckCircle size={13} />,
                      onClick: () => handleApprove(item.id),
                    }
                  : undefined,
                [TProviderEcoFarmState.INACTIVATED].includes(item.state)
                  ? {
                      key: "show",
                      label: i18n["Mở kinh doanh"],
                      icon: <FaStoreAlt size={13} />,
                      onClick: () => handleUpdateStatus({ id: item.id, state: 2 }),
                    }
                  : undefined,
                [TProviderEcoFarmState.ACTIVATED].includes(item.state)
                  ? {
                      key: "hide",
                      label: i18n["Ngừng kinh doanh"],
                      icon: <FaStoreAltSlash size={13} />,
                      onClick: () => handleUpdateStatus({ id: item.id, state: 3 }),
                    }
                  : undefined,
                // [
                //   TProviderEcoFarmState.PENDING,
                //   TProviderEcoFarmState.ACTIVATED,
                //   TProviderEcoFarmState.INACTIVATED,
                //   TProviderEcoFarmState.HIDDEN,
                //   TProviderEcoFarmState.BLOCKED,
                // ].includes(item.state)
                //   ? {
                //       key: "delete",
                //       label: i18n["Xóa trang trại"],
                //       danger: true,
                //       icon: <MdOutlineDelete size={16} />,
                //       onClick: () => handleConfirmAdminDelete(item.id, item.name),
                //     }
                //   : undefined,
              ].filter((i) => !!i) as any[],
            }}
          >
            <CurrentStateActionBtn type="button">
              <ProviderEcoFarmState state={item.state} className="tag" bordered />
              <BsThreeDots size={20} className="dots-icon" />
            </CurrentStateActionBtn>
          </Dropdown>
        );
      },
    },
  };
};

export default useFarmColumns;

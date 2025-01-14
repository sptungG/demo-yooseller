import styled from "@emotion/styled";
import { Descriptions, Dropdown, Popover, Typography } from "antd";
import type { ColumnGroupType, ColumnType } from "antd/es/table";
import { useRouter } from "next/router";
import { CSSProperties, useId } from "react";
import { BiEdit, BiHide, BiShowAlt } from "react-icons/bi";
import { BsCalendarWeekFill, BsCheckCircle, BsPersonLinesFill, BsThreeDots } from "react-icons/bs";
import { FaStoreAlt, FaStoreAltSlash } from "react-icons/fa";
import { MdOutlineDelete, MdStarRate, MdVisibility } from "react-icons/md";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProviderTypes from "src/hooks/useGetProviderTypes";
import useModalDangerConfirm from "src/hooks/useModalDangerConfirm";
import useUpdateStateStore from "src/hooks/useUpdateStateStore";
import {
  useAdminDeleteProviderMutation,
  useApproveProviderMutation,
} from "src/redux/query/admin.query";
import {
  useDeleteProviderMutation,
  useUpdateStateOfProviderMutation,
} from "src/redux/query/provider.query";
import { TProvider, TProviderState } from "src/types/provider.types";
import { sorterByWords } from "src/utils/utils";
import Avatar, { AvatarGroup } from "../avatar/Avatar";
import ProviderState from "../card/ProviderState";
import Link from "../next/Link";
import StoreWorkTime from "../tag/StoreWorkTime";
import Tag from "../tag/Tag";
import {
  CurrentStateActionBtn,
  IconsInfoWrapper,
  NameWithViewIcon,
  StoreDetailWrapper,
} from "./StyledTable";

type TuseStoreColumnsProps = {};

type TRes = Record<string, ColumnGroupType<TProvider> | ColumnType<TProvider>>;

const useStoreColumns = ({}: TuseStoreColumnsProps): TRes => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { message } = useApp();
  const { mappedTypes } = useGetProviderTypes();
  const {
    query: { storeId },
  } = useRouter();

  const { mutateState } = useUpdateStateStore();

  const [deleteMutate, { isLoading: isLoadingDelete }] = useDeleteProviderMutation();
  const { handleConfirm } = useModalDangerConfirm({
    onOk: (id) => {
      deleteMutate({ id })
        .unwrap()
        .then(({ result }) => {
          message.success(i18n["Xóa cửa hàng thành công"]);
        })
        .catch((err) => {
          message.error(i18n["Đã có lỗi xảy ra khi xóa cửa hàng"]);
        });
    },
  });

  const [approveMutate] = useApproveProviderMutation();
  const handleApprove = (id?: number) => {
    !!id &&
      approveMutate({ id })
        .unwrap()
        .then((res) => {
          message.success(i18n["Duyệt cửa hàng thành công"]);
        })
        .catch((err) => {
          message.error(i18n["Đã có lỗi xảy ra khi duyệt cửa hàng"]);
        });
  };
  const [updateStatusProvider] = useUpdateStateOfProviderMutation();
  const handleUpdateStatus = ({ id, state }: { id?: number; state?: number }) => {
    if (!!id && !!state)
      updateStatusProvider({ id, state })
        .unwrap()
        .then(() => {
          if (state === 3) message.warning(i18n["Ngừng kinh doanh cửa hàng thành công"]);
          if (state === 2) message.success(i18n["Mở kinh doanh cửa hàng thành công"]);
          if (state === 4) message.warning(i18n["Ẩn cửa hàng thành công"]);
        })
        .catch((err) => {
          message.error(i18n["Đã có lỗi xảy ra khi cập nhật cửa hàng"]);
        });
  };
  const [adminDeleteMutate, { isLoading: isLoadingAdminDelete }] = useAdminDeleteProviderMutation();
  const { handleConfirm: handleConfirmAdminDelete } = useModalDangerConfirm({
    onOk: (id) => {
      adminDeleteMutate({ id })
        .unwrap()
        .then((result) => {
          if (result.success === true) {
            message.success(i18n["Xóa cửa hàng thành công"]);
          } else {
            message.error(i18n["Đã có lỗi xảy ra khi xóa cửa hàng"]);
          }
        })
        .catch((err) => {
          message.error(i18n["Đã có lỗi xảy ra khi xóa cửa hàng"]);
        });
    },
  });

  const statusStyle = (status: TProviderState): CSSProperties => ({
    opacity: [TProviderState.PENDING, TProviderState.ACTIVATED].includes(status) ? 1 : 0.45,
  });

  return {
    nameCombined4: {
      title: i18n["Cửa hàng"],
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
              <Link href={`/supplier/store/${item.id}`} passHref className="name">
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
                {item?.ratePoint ? item.ratePoint.toFixed(2) : "0"}
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
      title: i18n["Loại cửa hàng"],
      dataIndex: "type",
      key: "type",
      render: (text, item) => {
        return (
          <Tag bordered={false} style={{ flexShrink: 0 }}>{`${mappedTypes(item.groupType)}${
            !!item.type ? " / " + mappedTypes(item.type) : ""
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
                  label: <Link href={`/supplier/store/${item.id}`}>{i18n["Xem cửa hàng"]}</Link>,
                  icon: <BiShowAlt size={17} />,
                },
                {
                  key: "edit",
                  label: (
                    <Link href={`/supplier/store/${item.id}/edit`}>{i18n["Sửa cửa hàng"]}</Link>
                  ),
                  icon: <BiEdit size={16} />,
                },
                { key: "divider01", type: "divider" },
                ,
                [TProviderState.INACTIVATED, TProviderState.HIDDEN].includes(item.state)
                  ? {
                      key: "show",
                      label: i18n["Mở kinh doanh"],
                      icon: <FaStoreAlt size={13} />,
                      onClick: () => handleUpdateStatus({ id: item.id, state: 2 }),
                    }
                  : undefined,
                [TProviderState.ACTIVATED].includes(item.state)
                  ? {
                      key: "hide",
                      label: i18n["Ngừng kinh doanh"],
                      icon: <FaStoreAltSlash size={13} />,
                      onClick: () => handleUpdateStatus({ id: item.id, state: 3 }),
                    }
                  : undefined,
                [TProviderState.ACTIVATED].includes(item.state)
                  ? {
                      key: "hidden",
                      label: i18n["Ẩn cửa hàng"],
                      icon: <BiHide size={16} />,
                      onClick: () => handleUpdateStatus({ id: item.id, state: 4 }),
                    }
                  : undefined,
                [
                  TProviderState.PENDING,
                  TProviderState.ACTIVATED,
                  // TProviderState.INACTIVATED,
                  // TProviderState.HIDDEN,
                  // TProviderState.BLOCKED,
                ].includes(item.state)
                  ? {
                      key: "delete",
                      label: i18n["Xóa cửa hàng"],
                      danger: true,
                      icon: <MdOutlineDelete size={16} />,
                      onClick: () => handleConfirm(item.id, item.name),
                    }
                  : undefined,
              ].filter((i) => !!i) as any[],
            }}
          >
            <CurrentStateActionBtn type="button">
              <ProviderState state={item.state} className="tag" bordered />
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
                  label: <Link href={`/supplier/store/${item.id}`}>{i18n["Xem cửa hàng"]}</Link>,
                  icon: <BiShowAlt size={17} />,
                  disabled: true,
                },
                {
                  key: "edit",
                  label: (
                    <Link href={`/supplier/store/${item.id}/edit`}>{i18n["Sửa cửa hàng"]}</Link>
                  ),
                  icon: <BiEdit size={16} />,
                  disabled: true,
                },
                { key: "divider01", type: "divider" },
                ,
                [TProviderState.PENDING].includes(item.state)
                  ? {
                      key: "show",
                      label: i18n["Duyệt cửa hàng"],
                      icon: <BsCheckCircle size={13} />,
                      onClick: () => handleApprove(item.id),
                    }
                  : undefined,
                [TProviderState.INACTIVATED].includes(item.state)
                  ? {
                      key: "show",
                      label: i18n["Mở kinh doanh"],
                      icon: <FaStoreAlt size={13} />,
                      onClick: () => handleUpdateStatus({ id: item.id, state: 2 }),
                    }
                  : undefined,
                [TProviderState.ACTIVATED].includes(item.state)
                  ? {
                      key: "hide",
                      label: i18n["Ngừng kinh doanh"],
                      icon: <FaStoreAltSlash size={13} />,
                      onClick: () => handleUpdateStatus({ id: item.id, state: 3 }),
                    }
                  : undefined,
                [
                  TProviderState.PENDING,
                  TProviderState.ACTIVATED,
                  TProviderState.INACTIVATED,
                  TProviderState.HIDDEN,
                  TProviderState.BLOCKED,
                ].includes(item.state)
                  ? {
                      key: "delete",
                      label: i18n["Xóa cửa hàng"],
                      danger: true,
                      icon: <MdOutlineDelete size={16} />,
                      onClick: () => handleConfirmAdminDelete(item.id, item.name),
                    }
                  : undefined,
              ].filter((i) => !!i) as any[],
            }}
          >
            <CurrentStateActionBtn type="button">
              <ProviderState state={item.state} className="tag" bordered />
              <BsThreeDots size={20} className="dots-icon" />
            </CurrentStateActionBtn>
          </Dropdown>
        );
      },
    },
  };
};
const PopoverContentStyled = styled.div``;

export default useStoreColumns;

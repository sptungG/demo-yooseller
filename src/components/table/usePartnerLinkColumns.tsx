import { Dropdown, Flex, Image, Tag, Typography } from "antd";
import type { ColumnGroupType, ColumnType } from "antd/es/table";
import { useRouter } from "next/router";
import { BiEdit } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { MdLink, MdOutlineDelete } from "react-icons/md";

import {
  useDeletePartnerLinksMutation,
  useUpdateStatusPartnerLinksMutation,
} from "@/redux/query/pageprivate.query";
import { TEPartnerLinkStatus, TPartnerLink } from "@/types/pageprivate.types";
import { FaCheck } from "react-icons/fa";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useModalDangerConfirm from "src/hooks/useModalDangerConfirm";
import Link from "../next/Link";
import { CurrentStateActionBtn } from "./StyledTable";

type TRes = Record<string, ColumnGroupType<TPartnerLink> | ColumnType<TPartnerLink>>;

const usePartnerLinkColumns = (): TRes => {
  const { i18n } = useChangeLocale();
  const { message } = useApp();
  const {
    query: { storeId },
  } = useRouter();

  const [deleteMutate] = useDeletePartnerLinksMutation();
  const { handleConfirm } = useModalDangerConfirm({
    onOk: (id) => {
      deleteMutate({ id })
        .unwrap()
        .then(() => {
          message.success(i18n["Xóa liên kết thành công"]);
        })
        .catch(() => {
          message.error(i18n["Đã có lỗi xảy ra khi xóa liên kết"]);
        });
    },
  });

  return {
    imageUrl: {
      title: i18n["Hình ảnh"],
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (text, item) => <Image width={120} src={item.imageUrl} />,
    },
    nameCombined: {
      title: i18n["Tên liên kết"],
      dataIndex: "name",
      key: "name",
      render: (text, item) => {
        return (
          <Flex vertical>
            <Typography.Text strong>{item.name}</Typography.Text>
            <Flex gap={4} align="center">
              <MdLink size={14} />
              <Typography.Text>{item.link}</Typography.Text>
            </Flex>
          </Flex>
        );
      },
    },
    stt: {
      title: i18n["STT"],
      dataIndex: "stt",
      key: "stt",
      width: 240,
      render: (text, item) => {
        return <Typography.Text strong>{item.stt}</Typography.Text>;
      },
    },
    actionsStatus: {
      title: <Typography.Text type="secondary">{i18n["Hành động"]}</Typography.Text>,
      dataIndex: "id",
      key: "actions",
      width: 190,
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
                  key: "edit",
                  label: (
                    <Link href={`/supplier/store/${storeId}/partnerlink/${item.id}/edit`}>
                      {i18n["Sửa liên kết"]}
                    </Link>
                  ),
                  icon: <BiEdit size={16} />,
                },
                {
                  key: "delete",
                  label: i18n["Xóa liên kết"],
                  danger: true,
                  icon: <MdOutlineDelete size={16} />,
                  onClick: () => handleConfirm(item.id, item.name),
                },
              ].filter((i) => !!i) as any[],
            }}
          >
            <CurrentStateActionBtn type="button">
              <Tag
                className="tag"
                bordered
                style={{ paddingTop: 5 }}
                {...{ children: i18n["Hành động"] }}
              />
              <BsThreeDots size={20} className="dots-icon" />
            </CurrentStateActionBtn>
          </Dropdown>
        );
      },
    },
  };
};
export const usePartnerLinkFarmColumns = (): TRes => {
  const { i18n } = useChangeLocale();
  const { message } = useApp();
  const {
    query: { farmId },
  } = useRouter();

  const [deleteMutate] = useDeletePartnerLinksMutation();
  const [updateStatus] = useUpdateStatusPartnerLinksMutation();
  const { handleConfirm } = useModalDangerConfirm({
    onOk: (id) => {
      deleteMutate({ id })
        .unwrap()
        .then(() => {
          message.success(i18n["Xóa liên kết thành công"]);
        })
        .catch(() => {
          message.error(i18n["Đã có lỗi xảy ra khi xóa liên kết"]);
        });
    },
  });
  const { handleConfirm: handleConfirmApprove } = useModalDangerConfirm({
    onOk: (id) => {
      updateStatus({ id, status: TEPartnerLinkStatus.Approved })
        .unwrap()
        .then(() => {
          message.success(i18n["Phê duyệt thành công"]);
        })
        .catch(() => {
          message.error(i18n["Đã có lỗi xảy ra khi phê duyệt"]);
        });
    },
  });

  const { handleConfirm: handleConfirmPending } = useModalDangerConfirm({
    onOk: (id) => {
      updateStatus({ id, status: TEPartnerLinkStatus.Pendding })
        .unwrap()
        .then(() => {
          message.success(i18n["Hủy duyệt thành công"]);
        })
        .catch(() => {
          message.error(i18n["Đã có lỗi xảy ra khi hủy duyệt"]);
        });
    },
  });

  return {
    imageUrl: {
      title: i18n["Hình ảnh"],
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (text, item) => <Image width={120} src={item.imageUrl} />,
    },
    nameCombined: {
      title: i18n["Tên liên kết"],
      dataIndex: "name",
      key: "name",
      render: (text, item) => {
        return (
          <Flex vertical>
            <Typography.Text strong>{item.name}</Typography.Text>
            <Flex gap={4} align="center">
              <MdLink size={14} />
              <Typography.Text>{item.link}</Typography.Text>
            </Flex>
          </Flex>
        );
      },
    },
    stt: {
      title: i18n["STT"],
      dataIndex: "stt",
      key: "stt",
      width: 240,
      render: (text, item) => {
        return <Typography.Text strong>{item.stt}</Typography.Text>;
      },
    },
    actionsStatus: {
      title: <Typography.Text type="secondary">{i18n["Hành động"]}</Typography.Text>,
      dataIndex: "id",
      key: "actions",
      width: 190,
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
                  key: "edit",
                  label: (
                    <Link href={`/supplier/store/${farmId}/partnerlink/${item.id}/edit`}>
                      {i18n["Sửa liên kết"]}
                    </Link>
                  ),
                  icon: <BiEdit size={16} />,
                },
                item.status === TEPartnerLinkStatus.Pendding
                  ? {
                      key: "approve",
                      label: i18n["Phê duyệt"],
                      icon: <FaCheck size={16} />,
                      onClick: () =>
                        handleConfirmApprove(item.id, item.name, i18n["Phê duyệt"].toLowerCase()),
                    }
                  : undefined,
                item.status === TEPartnerLinkStatus.Approved
                  ? {
                      key: "reject",
                      label: i18n["Hủy duyệt"],
                      danger: true,
                      icon: <FaTimes size={16} />,
                      onClick: () =>
                        handleConfirmPending(item.id, item.name, i18n["Hủy duyệt"].toLowerCase()),
                    }
                  : undefined,
                {
                  key: "delete",
                  label: i18n["Xóa liên kết"],
                  danger: true,
                  icon: <MdOutlineDelete size={16} />,
                  onClick: () => handleConfirm(item.id, item.name),
                },
              ].filter((i) => !!i) as any[],
            }}
          >
            <CurrentStateActionBtn type="button">
              <Tag
                className="tag"
                bordered
                style={{ paddingTop: 5 }}
                color={item.status == 1 ? "warning" : "success"}
                {...{ children: item.status == 1 ? i18n["Chờ duyệt"] : i18n["Đã duyệt"] }}
              />
              <BsThreeDots size={20} className="dots-icon" />
            </CurrentStateActionBtn>
          </Dropdown>
        );
      },
    },
  };
};

export default usePartnerLinkColumns;

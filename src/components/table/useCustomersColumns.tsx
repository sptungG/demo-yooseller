import { Dropdown, Flex, Tag, Typography } from "antd";
import type { ColumnGroupType, ColumnType } from "antd/es/table";
import { useRouter } from "next/router";
import { BsThreeDots } from "react-icons/bs";
import { MdLocalPhone, MdOutlineDelete, MdOutlineMail } from "react-icons/md";

import { formatDate } from "@/utils/utils-date";
import Link from "next/link";
import { BiEdit } from "react-icons/bi";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useModalDangerConfirm from "src/hooks/useModalDangerConfirm";
import { useDeleteCustomersMutation } from "src/redux/query/customers.query";
import { TCustomersItem } from "src/types/customers.types";
import Avatar from "../avatar/Avatar";
import { CurrentStateActionBtn } from "./StyledTable";

type TRes = Record<string, ColumnGroupType<TCustomersItem> | ColumnType<TCustomersItem>>;

const useCustomersColumns = (): TRes => {
  const { i18n } = useChangeLocale();
  const { message } = useApp();
  const {
    query: { storeId },
  } = useRouter();

  const [deleteMutate] = useDeleteCustomersMutation();
  const { handleConfirm } = useModalDangerConfirm({
    onOk: (id) => {
      deleteMutate({ id })
        .unwrap()
        .then(() => {
          message.success(i18n["Xóa khách hàng thành công"]);
        })
        .catch(() => {
          message.error(i18n["Đã có lỗi xảy ra khi xóa khách hàng"]);
        });
    },
  });

  return {
    nameCombined: {
      title: i18n["Khách hàng"],
      dataIndex: "fullName",
      key: "fullName",
      render: (text, item) => (
        <Flex gap={8}>
          <Avatar shape="square" size={60}>
            <b style={{ fontSize: 30, fontWeight: "600" }}>{item.fullName?.[0]}</b>
          </Avatar>
          <Flex vertical flex="1 1 auto" style={{ minWidth: 0 }}>
            <Typography.Text strong type="success">
              {item.fullName}
            </Typography.Text>
            <Flex gap={4} align="center">
              <MdLocalPhone size={14} style={{ color: "#339fd9" }} />
              <Typography.Text>{item.phoneNumber}</Typography.Text>
              {item.emailAddress && (
                <>
                  <MdOutlineMail size={14} style={{ color: "#339fd9" }} />
                  <Typography.Text>{item.emailAddress}</Typography.Text>
                </>
              )}
            </Flex>
            <Typography.Text type="secondary">{item.homeAddress}</Typography.Text>
          </Flex>
        </Flex>
      ),
    },
    gender: {
      title: i18n["Giới tính"],
      dataIndex: "gender",
      key: "gender",
      width: 120,
      render: (text, item) => {
        return <Typography.Text>{item.gender}</Typography.Text>;
      },
    },
    dateOfBirth: {
      title: i18n["Ngày sinh"],
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      width: 150,
      render: (text, item) => {
        return (
          <Typography.Text>{item.dateOfBirth ? formatDate(item.dateOfBirth) : ""}</Typography.Text>
        );
      },
    },

    points: {
      title: i18n["Điểm"],
      dataIndex: "totalPoints",
      key: "totalPoints",
      width: 150,
      render: (text, item) => {
        return (
          <Flex vertical flex="1 1 auto" style={{ minWidth: 0 }}>
            <Typography.Text type="success">
              {i18n["Đã sử dụng"]}: {item.usedPoints}
            </Typography.Text>
            <Typography.Text type="danger">
              {i18n["Chưa sử dụng"]}: {item.unusedPoints}
            </Typography.Text>
            <Typography.Text>
              {i18n["Tổng điểm"]}: {item.totalPoints}
            </Typography.Text>
          </Flex>
        );
      },
    },
    creationTime: {
      title: i18n["Ngày tạo"],
      dataIndex: "creationTime",
      key: "creationTime",
      width: 150,
      render: (text, item) => {
        return (
          <Typography.Text>
            {item.creationTime ? formatDate(item.creationTime) : ""}
          </Typography.Text>
        );
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
                    <Link href={`/supplier/store/${storeId}/customers/${item.id}/edit`}>
                      {i18n["Sửa khách hàng"]}
                    </Link>
                  ),
                  icon: <BiEdit size={16} />,
                },
                {
                  key: "delete",
                  label: i18n["Xóa khách hàng"],
                  danger: true,
                  icon: <MdOutlineDelete size={16} />,
                  onClick: () => handleConfirm(item.id, item.fullName),
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

export const useCustomersFarmColumns = (): TRes => {
  const { i18n } = useChangeLocale();
  const { message } = useApp();
  const {
    query: { farmId },
  } = useRouter();

  const [deleteMutate] = useDeleteCustomersMutation();
  const { handleConfirm } = useModalDangerConfirm({
    onOk: (id) => {
      deleteMutate({ id })
        .unwrap()
        .then(() => {
          message.success(i18n["Xóa khách hàng thành công"]);
        })
        .catch(() => {
          message.error(i18n["Đã có lỗi xảy ra khi xóa khách hàng"]);
        });
    },
  });

  return {
    nameCombined: {
      title: i18n["Khách hàng"],
      dataIndex: "fullName",
      key: "fullName",
      render: (text, item) => (
        <Flex gap={8}>
          <Avatar shape="square" size={60}>
            <b style={{ fontSize: 30, fontWeight: "600" }}>{item.fullName?.[0]}</b>
          </Avatar>
          <Flex vertical flex="1 1 auto" style={{ minWidth: 0 }}>
            <Typography.Text strong type="success">
              {item.fullName}
            </Typography.Text>
            <Flex gap={4} align="center">
              <MdLocalPhone size={14} style={{ color: "#339fd9" }} />
              <Typography.Text>{item.phoneNumber}</Typography.Text>
              {item.emailAddress && (
                <>
                  <MdOutlineMail size={14} style={{ color: "#339fd9" }} />
                  <Typography.Text>{item.emailAddress}</Typography.Text>
                </>
              )}
            </Flex>
            <Typography.Text type="secondary">{item.homeAddress}</Typography.Text>
          </Flex>
        </Flex>
      ),
    },
    gender: {
      title: i18n["Giới tính"],
      dataIndex: "gender",
      key: "gender",
      width: 120,
      render: (text, item) => {
        return <Typography.Text>{item.gender}</Typography.Text>;
      },
    },
    dateOfBirth: {
      title: i18n["Ngày sinh"],
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      width: 150,
      render: (text, item) => {
        return (
          <Typography.Text>{item.dateOfBirth ? formatDate(item.dateOfBirth) : ""}</Typography.Text>
        );
      },
    },

    points: {
      title: i18n["Điểm"],
      dataIndex: "totalPoints",
      key: "totalPoints",
      width: 150,
      render: (text, item) => {
        return (
          <Flex vertical flex="1 1 auto" style={{ minWidth: 0 }}>
            <Typography.Text type="success">
              {i18n["Đã sử dụng"]}: {item.usedPoints}
            </Typography.Text>
            <Typography.Text type="danger">
              {i18n["Chưa sử dụng"]}: {item.unusedPoints}
            </Typography.Text>
            <Typography.Text>
              {i18n["Tổng điểm"]}: {item.totalPoints}
            </Typography.Text>
          </Flex>
        );
      },
    },
    creationTime: {
      title: i18n["Ngày tạo"],
      dataIndex: "creationTime",
      key: "creationTime",
      width: 150,
      render: (text, item) => {
        return (
          <Typography.Text>
            {item.creationTime ? formatDate(item.creationTime) : ""}
          </Typography.Text>
        );
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
                    <Link href={`/supplier/farm/${farmId}/customers/${item.id}/edit`}>
                      {i18n["Sửa khách hàng"]}
                    </Link>
                  ),
                  icon: <BiEdit size={16} />,
                },
                {
                  key: "delete",
                  label: i18n["Xóa khách hàng"],
                  danger: true,
                  icon: <MdOutlineDelete size={16} />,
                  onClick: () => handleConfirm(item.id, item.fullName),
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
export default useCustomersColumns;

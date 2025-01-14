import { Badge, Dropdown, Flex, Switch, Tag, Typography } from "antd";
import type { ColumnGroupType, ColumnType } from "antd/es/table";
import { useRouter } from "next/router";
import { BiEdit } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { MdLocalPhone, MdOutlineDelete } from "react-icons/md";

import { FcGoogle } from "react-icons/fc";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useModalDangerConfirm from "src/hooks/useModalDangerConfirm";
import { useDeleteProviderAddressesMutation } from "src/redux/query/addresses.query";
import { TProviderAddressesItem } from "src/types/addresses.type";
import Avatar from "../avatar/Avatar";
import Link from "../next/Link";
import { CurrentStateActionBtn } from "./StyledTable";

type TRes = Record<
  string,
  ColumnGroupType<TProviderAddressesItem> | ColumnType<TProviderAddressesItem>
>;

const useProviceAddressesColumns = (): TRes => {
  const { i18n } = useChangeLocale();
  const { message } = useApp();
  const {
    query: { storeId },
  } = useRouter();

  const [deleteMutate] = useDeleteProviderAddressesMutation();
  const { handleConfirm } = useModalDangerConfirm({
    onOk: (id) => {
      deleteMutate({ id })
        .unwrap()
        .then(() => {
          message.success(i18n["Xóa địa chỉ thành công"]);
        })
        .catch(() => {
          message.error(i18n["Đã có lỗi xảy ra khi xóa địa chỉ"]);
        });
    },
  });

  return {
    nameCombined: {
      title: i18n["Người liên hệ"],
      dataIndex: "name",
      key: "name",
      render: (text, item) => (
        <Flex gap={8} align="center">
          <Badge color="green" count={item.default ? "Mặc định" : 0} dot offset={[0, 44]}>
            <Avatar shape="square" size={44}>
              {item.name?.[0] || "---"}
            </Avatar>
          </Badge>
          <Flex vertical>
            <Typography.Text strong>{item.name}</Typography.Text>
            <Flex gap={4} align="center">
              <MdLocalPhone size={14} />
              <Typography.Text>{item.phoneNumber}</Typography.Text>
            </Flex>
          </Flex>
        </Flex>
      ),
    },
    addressDetail: {
      title: i18n["Địa chỉ chi tiết"],
      dataIndex: "addressDetail",
      key: "addressDetail",
      width: 240,
      render: (text, item) => {
        const addressDetail = `${!!item?.wardName ? item.wardName + ", " : ""}${
          !!item?.districtName ? item.districtName + ", " : ""
        }${!!item?.provinceName ? item.provinceName : ""}`;
        return (
          <Flex vertical style={{ maxWidth: "100%" }}>
            <Typography.Text ellipsis type="secondary" title={item.detail}>
              {item.detail}
            </Typography.Text>
            <Typography.Text ellipsis title={addressDetail}>
              {addressDetail}
            </Typography.Text>
          </Flex>
        );
      },
    },
    pickUp: {
      title: (
        <Typography.Paragraph style={{ fontSize: 12, lineHeight: 1.1, margin: 0 }}>
          {i18n["Địa chỉ nhận hàng"]}
        </Typography.Paragraph>
      ),
      dataIndex: "pickUp",
      key: "pickUp",
      width: 94,
      render: (text, item) => {
        return <Switch disabled defaultChecked={item.pickUp} />;
      },
    },
    returnAddress: {
      title: (
        <Typography.Paragraph style={{ fontSize: 12, lineHeight: 1.1, margin: 0 }}>
          {i18n["Địa chỉ trả hàng"]}
        </Typography.Paragraph>
      ),
      dataIndex: "returnAddress",
      key: "returnAddress",
      width: 90,
      render: (text, item) => {
        return <Switch disabled defaultChecked={item.return} />;
      },
    },
    latLong: {
      title: i18n["Vĩ độ/Kinh độ"],
      dataIndex: "latLong",
      key: "latLong",
      width: 160,
      render: (text, item) => {
        return (
          <Flex vertical align="flex-start">
            <Flex style={{ maxWidth: "100%" }}>
              <Typography.Text ellipsis>{item.latitude}</Typography.Text>,
              <Typography.Text ellipsis>{item.longitude}</Typography.Text>
            </Flex>
            <Flex align="center" gap={2}>
              <Typography.Link
                ellipsis
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.google.com/maps/search/?api=1&query=${
                  item.latitude + "," + item.longitude || "21.010157968391244,105.78869991247372"
                }`}
                style={{ fontSize: 13 }}
              >
                Xem trên GoogleMaps
              </Typography.Link>
              <FcGoogle />
            </Flex>
          </Flex>
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
                // {
                //   key: "view",
                //   label: (
                //     <Link href={`/supplier/farm/${farmId}/addresses/${item.id}`}>
                //       {i18n["Xem địa chỉ"]}
                //     </Link>
                //   ),
                //   icon: <BiShowAlt size={17} />,
                // },

                {
                  key: "edit",
                  label: (
                    <Link href={`/supplier/store/${storeId}/addresses/${item.id}/edit`}>
                      {i18n["Sửa địa chỉ"]}
                    </Link>
                  ),
                  icon: <BiEdit size={16} />,
                },
                {
                  key: "delete",
                  label: i18n["Xóa địa chỉ"],
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

export const useProviceAddressesFarmColumns = (): TRes => {
  const { i18n } = useChangeLocale();
  const { message } = useApp();
  const {
    query: { farmId },
  } = useRouter();

  const [deleteMutate] = useDeleteProviderAddressesMutation();
  const { handleConfirm } = useModalDangerConfirm({
    onOk: (id) => {
      deleteMutate({ id })
        .unwrap()
        .then(() => {
          message.success(i18n["Xóa địa chỉ thành công"]);
        })
        .catch(() => {
          message.error(i18n["Đã có lỗi xảy ra khi xóa địa chỉ"]);
        });
    },
  });

  return {
    nameCombined: {
      title: i18n["Người liên hệ"],
      dataIndex: "name",
      key: "name",
      render: (text, item) => (
        <Flex gap={8} align="center">
          <Badge color="green" count={item.default ? "Mặc định" : 0} dot offset={[0, 44]}>
            <Avatar shape="square" size={44}>
              {item.name?.[0] || "---"}
            </Avatar>
          </Badge>
          <Flex vertical>
            <Typography.Text strong>{item.name}</Typography.Text>
            <Flex gap={4} align="center">
              <MdLocalPhone size={14} />
              <Typography.Text>{item.phoneNumber}</Typography.Text>
            </Flex>
          </Flex>
        </Flex>
      ),
    },
    addressDetail: {
      title: i18n["Địa chỉ chi tiết"],
      dataIndex: "addressDetail",
      key: "addressDetail",
      width: 240,
      render: (text, item) => {
        const addressDetail = `${!!item?.wardName ? item.wardName + ", " : ""}${
          !!item?.districtName ? item.districtName + ", " : ""
        }${!!item?.provinceName ? item.provinceName : ""}`;
        return (
          <Flex vertical style={{ maxWidth: 240 }}>
            <Typography.Text ellipsis type="secondary" title={item.detail}>
              {item.detail}
            </Typography.Text>
            <Typography.Text ellipsis title={addressDetail}>
              {addressDetail}
            </Typography.Text>
          </Flex>
        );
      },
    },
    pickUp: {
      title: (
        <Typography.Paragraph style={{ fontSize: 12, lineHeight: 1.1, margin: 0 }}>
          {i18n["Địa chỉ nhận hàng"]}
        </Typography.Paragraph>
      ),
      dataIndex: "pickUp",
      key: "pickUp",
      width: 94,
      render: (text, item) => {
        return <Switch disabled defaultChecked={item.pickUp} />;
      },
    },
    returnAddress: {
      title: (
        <Typography.Paragraph style={{ fontSize: 12, lineHeight: 1.1, margin: 0 }}>
          {i18n["Địa chỉ trả hàng"]}
        </Typography.Paragraph>
      ),
      dataIndex: "returnAddress",
      key: "returnAddress",
      width: 90,
      render: (text, item) => {
        return <Switch disabled defaultChecked={item.return} />;
      },
    },
    latLong: {
      title: i18n["Vĩ độ/Kinh độ"],
      dataIndex: "latLong",
      key: "latLong",
      width: 160,
      render: (text, item) => {
        return (
          <Flex vertical align="flex-start">
            <Flex style={{ maxWidth: "100%" }}>
              <Typography.Text ellipsis>{item.latitude}</Typography.Text>,
              <Typography.Text ellipsis>{item.longitude}</Typography.Text>
            </Flex>
            <Flex align="center" gap={2}>
              <Typography.Link
                ellipsis
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.google.com/maps/search/?api=1&query=${
                  item.latitude + "," + item.longitude || "21.010157968391244,105.78869991247372"
                }`}
                style={{ fontSize: 13 }}
              >
                Xem trên GoogleMaps
              </Typography.Link>
              <FcGoogle />
            </Flex>
          </Flex>
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
                // {
                //   key: "view",
                //   label: (
                //     <Link href={`/supplier/farm/${farmId}/addresses/${item.id}`}>
                //       {i18n["Xem địa chỉ"]}
                //     </Link>
                //   ),
                //   icon: <BiShowAlt size={17} />,
                // },

                {
                  key: "edit",
                  label: (
                    <Link href={`/supplier/farm/${farmId}/addresses/${item.id}/edit`}>
                      {i18n["Sửa địa chỉ"]}
                    </Link>
                  ),
                  icon: <BiEdit size={16} />,
                },
                {
                  key: "delete",
                  label: i18n["Xóa địa chỉ"],
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

export default useProviceAddressesColumns;

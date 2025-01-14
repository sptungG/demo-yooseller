import { useDeleteAmenitiesComboMutation } from "@/redux/query/amenity.query";
import { TAmenitiesCombo } from "@/types/amenity.types";
import { formatNumber } from "@/utils/utils";
import { useTheme } from "@emotion/react";
import { Avatar, Dropdown, Flex, Typography } from "antd";
import type { ColumnGroupType, ColumnType } from "antd/es/table";
import { rgba } from "emotion-rgba";
import { useRouter } from "next/router";
import { useId } from "react";
import { BiEdit } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useModalDangerConfirm from "src/hooks/useModalDangerConfirm";
import Link from "../next/Link";
import { CurrentStateActionBtn, ItemNameCombined4 } from "./StyledTable";

type TRes = Record<string, ColumnGroupType<TAmenitiesCombo> | ColumnType<TAmenitiesCombo>>;

const useAmenitiesComboColumns = (): TRes => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { message } = useApp();
  const {
    query: { storeId },
  } = useRouter();
  const { generatedColors } = useTheme();

  const [deleteMutate, { isLoading: isLoadingDeleteItem }] = useDeleteAmenitiesComboMutation();
  const { handleConfirm } = useModalDangerConfirm({
    onOk: (id) => {
      deleteMutate({ id })
        .unwrap()
        .then((data) => {
          if (data.success === true) {
            message.success(i18n["Xóa combo thành công"]);
          } else {
            message.error(i18n["Đã có lỗi xảy ra khi xóa combo"]);
          }
        })
        .catch((err) => {
          message.error(i18n["Đã có lỗi xảy ra khi xóa combo"]);
        });
    },
  });

  return {
    name: {
      title: i18n["Tên combo"],
      dataIndex: "name",
      key: "name",
      render: (text, item) => <Typography.Text ellipsis>{item.name}</Typography.Text>,
    },

    nameCombined1: {
      title: i18n["Tên combo"],
      dataIndex: "name",
      key: "name",
      width: 160,
      render: (text, item) => {
        return (
          <ItemNameCombined4>
            <Flex gap={8}>
              <Avatar
                size={64}
                shape="square"
                style={{
                  backgroundColor: rgba(generatedColors[5], 0.2),
                  color: generatedColors[5],
                  flexShrink: 0,
                }}
                src={item?.avatarUrl}
              />
              <Flex vertical>
                <Typography.Title
                  level={5}
                  ellipsis
                  style={{ maxWidth: "100%", lineHeight: 1.2, margin: 0 }}
                >
                  {item.name}
                </Typography.Title>
                <div
                  className="desc-wrapper"
                  dangerouslySetInnerHTML={{
                    __html: item?.description,
                  }}
                ></div>
              </Flex>
            </Flex>
          </ItemNameCombined4>
        );
      },
    },

    originPrice: {
      title: i18n["Giá gốc"],
      dataIndex: "originPrice",
      key: "originPrice",
      render: (text, item) => {
        return (
          <Typography.Text ellipsis>
            {`${formatNumber(item.originPrice)}₫` || "---"}
          </Typography.Text>
        );
      },
    },

    totalPrice: {
      title: i18n["Giá combo"],
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text, item) => {
        return (
          <Typography.Text ellipsis>{`${formatNumber(item.totalPrice)}₫` || "---"}</Typography.Text>
        );
      },
    },

    deposit: {
      title: i18n["Đặt cọc"],
      dataIndex: "deposit",
      key: "deposit",
      render: (text, item) => {
        return (
          <Typography.Text ellipsis>{`${formatNumber(item.deposit)}₫` || "---"}</Typography.Text>
        );
      },
    },

    stock: {
      title: i18n["Số lượng"],
      dataIndex: "stock",
      key: "stock",
      width: 160,
      render: (text, item) => (
        <Typography.Text style={{ opacity: !!item.stock ? 1 : 0.5 }}>
          {item.stock || "---"}
        </Typography.Text>
      ),
    },

    actionsState: {
      title: "",
      dataIndex: "id",
      key: "actionsState",
      width: 180,
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
                    <Link
                      href={`/supplier/store/${item.providerId}/amenities/combo/${item.id}/edit`}
                    >
                      {i18n["Sửa combo"]}
                    </Link>
                  ),
                  icon: <BiEdit size={16} />,
                },
                { key: "divider01", type: "divider" },

                {
                  key: "delete",
                  label: i18n["Xóa combo"],
                  danger: true,
                  icon: <MdOutlineDelete size={16} />,
                  onClick: () => handleConfirm(item.id, item.name),
                },
              ].filter((i) => !!i) as any[],
            }}
          >
            <CurrentStateActionBtn type="button">
              <BsThreeDots size={20} className="dots-icon" />
            </CurrentStateActionBtn>
          </Dropdown>
        );
      },
    },
  };
};
export default useAmenitiesComboColumns;

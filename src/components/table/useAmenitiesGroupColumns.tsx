import { useDeleteAmenitiesGroupMutation } from "@/redux/query/amenity.query";
import { TAmenitiesGroup } from "@/types/amenity.types";
import { Dropdown, Typography } from "antd";
import type { ColumnGroupType, ColumnType } from "antd/es/table";
import { useRouter } from "next/router";
import { useId } from "react";
import { BiEdit } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useModalDangerConfirm from "src/hooks/useModalDangerConfirm";
import Link from "../next/Link";
import { CurrentStateActionBtn } from "./StyledTable";

type TRes = Record<string, ColumnGroupType<TAmenitiesGroup> | ColumnType<TAmenitiesGroup>>;

const useAmenitiesGroupColumns = (): TRes => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { message } = useApp();
  const {
    query: { storeId },
  } = useRouter();

  const [deleteMutate, { isLoading: isLoadingDeleteItem }] = useDeleteAmenitiesGroupMutation();
  const { handleConfirm } = useModalDangerConfirm({
    onOk: (id) => {
      deleteMutate({ id })
        .unwrap()
        .then((data) => {
          if (data.success === true) {
            message.success(i18n["Xóa nhóm dịch vụ thành công"]);
          } else {
            message.error(i18n["Đã có lỗi xảy ra khi xóa nhóm dịch vụ"]);
          }
        })
        .catch((err) => {
          message.error(i18n["Đã có lỗi xảy ra khi xóa nhóm dịch vụ"]);
        });
    },
  });

  return {
    name: {
      title: i18n["Tên nhóm dịch vụ"],
      dataIndex: "name",
      key: "name",
      render: (text, item) => <Typography.Text ellipsis>{item.name}</Typography.Text>,
    },

    description: {
      title: i18n["Mô tả"],
      dataIndex: "description",
      key: "description",
      render: (text, item) => <Typography.Text ellipsis>{item.description}</Typography.Text>,
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
                      href={`/supplier/store/${item.providerId}/amenities/group/${item.id}/edit`}
                    >
                      {i18n["Sửa nhóm"]}
                    </Link>
                  ),
                  icon: <BiEdit size={16} />,
                },
                { key: "divider01", type: "divider" },

                {
                  key: "delete",
                  label: i18n["Xóa nhóm"],
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
export default useAmenitiesGroupColumns;

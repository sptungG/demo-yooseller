import { useCreation } from "ahooks";
import { Avatar, Dropdown, Typography } from "antd";
import type { ColumnGroupType, ColumnType } from "antd/es/table";
import { useRouter } from "next/router";
import { BiEdit, BiShowAlt } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";

import { dateFormatVoucher1, formatDate } from "@/utils/utils-date";
import { CSSProperties } from "react";
import { FaRegStopCircle } from "react-icons/fa";
import { MdOutlineNotStarted, MdVisibility } from "react-icons/md";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useModalDangerConfirm from "src/hooks/useModalDangerConfirm";
import {
  useDeleteEcofarmPackageActivityMutation,
  useUpdateStatusEcofarmPackageActivityMutation,
} from "src/redux/query/farm.query";
import {
  TEEcoFarmPackageActivityStatus,
  TPackageActivity,
  TPackageStatus,
} from "src/types/farm.types";
import { sorterByWords } from "src/utils/utils";
import EcofarmActivityStatus from "../card/EcofarmActivityStatus";
import Link from "../next/Link";
import { CurrentStateActionBtn, ItemNameCombined4, NameWithViewIcon } from "./StyledTable";

type TRes = Record<string, ColumnGroupType<TPackageActivity> | ColumnType<TPackageActivity>>;

const useActivityFarmColumns = (): TRes => {
  const { i18n } = useChangeLocale();
  const { message } = useApp();
  const {
    query: { farmId },
  } = useRouter();

  const [deleteMutate] = useDeleteEcofarmPackageActivityMutation();
  const [updateStatusMutate] = useUpdateStatusEcofarmPackageActivityMutation();
  const { handleConfirm } = useModalDangerConfirm({
    onOk: (id) => {
      deleteMutate({ id })
        .unwrap()
        .then(() => {
          message.success(i18n["Xóa hoạt động thành công"]);
        })
        .catch(() => {
          message.error(i18n["Đã có lỗi xảy ra khi xóa hoạt động"]);
        });
    },
  });
  const startActivity = (id: number) => {
    updateStatusMutate({ id, status: TEEcoFarmPackageActivityStatus.ACTIVATED })
      .unwrap()
      .then(() => {
        message.success(i18n["Bắt đầu sớm hoạt động thành công"]);
      })
      .catch(() => {
        message.error(i18n["Đã có lỗi xảy ra khi bắt đầu sớm hoạt động"]);
      });
  };
  const endActivity = (id: number) => {
    updateStatusMutate({ id, status: TEEcoFarmPackageActivityStatus.COMPLETED })
      .unwrap()
      .then(() => {
        message.success(i18n["Kết thúc sớm hoạt động thành công"]);
      })
      .catch(() => {
        message.error(i18n["Đã có lỗi xảy ra khi kết thúc sớm hoạt động"]);
      });
  };

  const statusStyle = (status: TEEcoFarmPackageActivityStatus): CSSProperties => ({
    opacity: [
      TEEcoFarmPackageActivityStatus.ONGOING,
      TEEcoFarmPackageActivityStatus.ACTIVATED,
    ].includes(status)
      ? 1
      : 0.45,
  });
  const res: TRes = useCreation(
    () => ({
      nameCombined: {
        title: i18n["Hoạt động"],
        dataIndex: "name",
        key: "name",
        render: (text, item) => (
          <ItemNameCombined4 style={{ ...statusStyle(item.status) }}>
            <Avatar
              className="image-wrapper"
              shape="square"
              size={64}
              src={String(item.imageUrlList[0])}
            />
            <div className="container" style={{ alignSelf: "center", maxWidth: 240 }}>
              <NameWithViewIcon>
                <Link
                  href={`/supplier/farm/${farmId}/activity/${item.id}`}
                  passHref
                  className="name"
                >
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
            </div>
          </ItemNameCombined4>
        ),
        sorter: (a, b) => sorterByWords("name")(a, b),
      },
      ecofarmPackage: {
        title: i18n["Gói farming"],
        dataIndex: "ecofarmPackageId",
        key: "ecofarmPackageId",
        width: 200,
        render: (text, item) => (
          <ItemNameCombined4>
            <div className="container">
              <Link
                href={`/supplier/farm/${farmId}/package/${item.ecofarmPackageId}`}
                passHref
                className="name"
              >
                {item.ecofarmPackageInfo.name}
              </Link>
              <div
                className="desc-wrapper"
                dangerouslySetInnerHTML={{
                  __html: item.ecofarmPackageInfo.description,
                }}
              ></div>

              {/* <div className="price-wrapper">
                <Typography.Text ellipsis type="success" style={{ fontSize: 14 }}>
                  {item.ecoFarmPackage.pricePerShare === item.ecoFarmPackage.packagePrice
                    ? `${formatNumber(item.ecoFarmPackage.pricePerShare)}₫`
                    : `${formatNumber(item.ecoFarmPackage.pricePerShare)}₫ ~ ${formatNumber(
                        item.ecoFarmPackage.packagePrice,
                      )}₫`}
                </Typography.Text>
              </div> */}
            </div>
          </ItemNameCombined4>
        ),
      },
      time: {
        title: i18n["Thời gian"],
        dataIndex: "dateStart",
        key: "dateStart",
        width: 100,
        render: (text, item) => (
          <Typography.Text ellipsis>
            {formatDate(item.dateStart, dateFormatVoucher1)}
            {" - "}
            <br />
            {formatDate(item.dateExpect, dateFormatVoucher1)}
          </Typography.Text>
        ),
      },

      actionsStatus: {
        title: <Typography.Text type="secondary">{i18n["Trạng thái"]}</Typography.Text>,
        dataIndex: "id",
        key: "actions",
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
                    label: (
                      <Link href={`/supplier/farm/${farmId}/activity/${item.id}`}>
                        {i18n["Xem hoạt động"]}
                      </Link>
                    ),
                    icon: <BiShowAlt size={17} />,
                  },

                  [TEEcoFarmPackageActivityStatus.ONGOING].includes(item.status) &&
                  (!item.ecofarmPackageInfo ||
                    item.ecofarmPackageInfo.status == TPackageStatus.ONGOING ||
                    item.ecofarmPackageInfo.status == TPackageStatus.ACTIVATED)
                    ? {
                        key: "edit",
                        label: (
                          <Link href={`/supplier/farm/${farmId}/activity/${item.id}/edit`}>
                            {i18n["Sửa hoạt động"]}
                          </Link>
                        ),
                        icon: <BiEdit size={16} />,
                      }
                    : undefined,
                  [TEEcoFarmPackageActivityStatus.ONGOING].includes(item.status)
                    ? {
                        key: "start",
                        label: i18n["Bắt đầu sớm"],
                        icon: <MdOutlineNotStarted size={13} />,
                        onClick: () => startActivity(item.id),
                      }
                    : undefined,
                  [TEEcoFarmPackageActivityStatus.ACTIVATED].includes(item.status)
                    ? {
                        key: "end",
                        label: i18n["Kết thúc sớm"],
                        icon: <FaRegStopCircle size={13} />,
                        onClick: () => endActivity(item.id),
                      }
                    : undefined,
                  [TEEcoFarmPackageActivityStatus.ONGOING].includes(item.status)
                    ? {
                        key: "delete",
                        label: i18n["Xóa hoạt động"],
                        danger: true,
                        icon: <MdOutlineDelete size={16} />,
                        onClick: () => handleConfirm(item.id, item.name),
                      }
                    : undefined,
                ].filter((i) => !!i) as any[],
              }}
            >
              <CurrentStateActionBtn type="button">
                <EcofarmActivityStatus state={item.status} className="tag" bordered />
                <BsThreeDots size={20} className="dots-icon" />
              </CurrentStateActionBtn>
            </Dropdown>
          );
        },
      },
    }),
    [i18n],
  );
  return res;
};
export default useActivityFarmColumns;

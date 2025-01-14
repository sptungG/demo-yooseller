import styled from "@emotion/styled";
import { Dropdown, Empty, Popover, Typography } from "antd";
import type { ColumnGroupType, ColumnType } from "antd/es/table";
import { useRouter } from "next/router";
import { CSSProperties, useId } from "react";
import { BiEdit, BiShowAlt } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaInfo, FaStoreAlt, FaStoreAltSlash } from "react-icons/fa";
import {
  MdOutlineDelete,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
  MdStarRate,
  MdVisibility,
} from "react-icons/md";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useModalDangerConfirm from "src/hooks/useModalDangerConfirm";
import {
  useDeleteItemForEcoFarmMutation,
  useUpdateItemStatusForEcoFarmMutation,
} from "src/redux/query/farm.query";
import { TItemStatus, TItemsItem, TPackageStatus } from "src/types/farm.types";
import { formatNumber, sorterByWords } from "src/utils/utils";
import Avatar from "../avatar/Avatar";
import EcofarmItemStatus from "../card/EcofarmItemStatus";
import Link from "../next/Link";
import Tag from "../tag/Tag";
import SmItemModelTableStyled from "./SmItemModelTable";
import {
  CurrentStateActionBtn,
  ItemNameCombined4,
  ItemRateView,
  ItemStock,
  NameWithViewIcon,
} from "./StyledTable";
import useItemModelColumns from "./useItemModelColumns";

type TRes = Record<string, ColumnGroupType<TItemsItem> | ColumnType<TItemsItem>>;

const useItemsFarmColumns = (): TRes => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { message } = useApp();
  const {
    query: { farmId },
  } = useRouter();
  const { nameCombined1, sku, sales, stock, currentPrice, originalPrice } = useItemModelColumns({});
  const [updateStatus] = useUpdateItemStatusForEcoFarmMutation();
  const [deleteMutate] = useDeleteItemForEcoFarmMutation();
  const { handleConfirm } = useModalDangerConfirm({
    onOk: (id) => {
      deleteMutate({ id })
        .unwrap()
        .then(() => {
          message.success(i18n["Xóa sản phẩm thành công"]);
        })
        .catch(() => {
          message.error(i18n["Đã có lỗi xảy ra khi xóa sản phẩm"]);
        });
    },
  });
  const handleShowItem = (id?: number) => {
    if (!!id)
      updateStatus({ id, status: TItemStatus.ACTIVATED })
        .unwrap()
        .then(() => {
          message.success(i18n["Hiện sản phẩm thành công"]);
        })
        .catch(() => {
          message.error(i18n["Đã có lỗi xảy ra khi hiện sản phẩm"]);
        });
  };

  const handleHiddenItem = (id?: number) => {
    if (!!id)
      updateStatus({ id, status: TItemStatus.HIDDEN })
        .unwrap()
        .then(() => {
          message.warning(i18n["Ẩn sản phẩm thành công"]);
        })
        .catch(() => {
          message.error(i18n["Đã có lỗi xảy ra khi ẩn sản phẩm"]);
        });
  };

  const handleStopItem = (id?: number) => {
    if (!!id)
      updateStatus({ id, status: TItemStatus.INACTIVED })
        .unwrap()
        .then(() => {
          message.warning(i18n["Ngừng kinh doanh sản phẩm thành công"]);
        })
        .catch(() => {
          message.error(i18n["Đã có lỗi xảy ra khi ngừng kinh doanh sản phẩm"]);
        });
  };

  const handleOpenItem = (id?: number) => {
    if (!!id)
      updateStatus({ id, status: TItemStatus.ACTIVATED })
        .unwrap()
        .then(() => {
          message.warning(i18n["Mở kinh doanh sản phẩm thành công"]);
        })
        .catch(() => {
          message.error(i18n["Đã có lỗi xảy ra khi mở kinh doanh sản phẩm"]);
        });
  };

  const statusStyle = (status: TItemStatus): CSSProperties => ({
    opacity: [TItemStatus.PENDING, TItemStatus.ACTIVATED].includes(status) ? 1 : 0.45,
  });

  return {
    nameCombined: {
      title: i18n["Sản phẩm"],
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
              <Link href={`/supplier/farm/${farmId}/item/${item.id}`} passHref className="name">
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
            <div className="price-wrapper">
              <Typography.Text ellipsis type="success" style={{ fontSize: 14 }}>
                {item.minPrice === item.maxPrice
                  ? `${formatNumber(item.minPrice)}₫`
                  : `${formatNumber(item.minPrice)}₫ ~ ${formatNumber(item.maxPrice)}₫`}
              </Typography.Text>
            </div>
          </div>
        </ItemNameCombined4>
      ),
      sorter: (a, b) => sorterByWords("name")(a, b),
    },
    ratePoint: {
      title: " ",
      dataIndex: "ratePoint",
      key: "ratePoint",
      width: 140,
      render: (text, item) => (
        <ItemRateView>
          <Tag color={!!item.ratePoint ? "gold" : "default"} bordered={false} icon={<MdStarRate />}>
            {item.ratePoint || "0"}
          </Tag>
          <Tag color={"default"} bordered={false} icon={<MdVisibility />}>
            {formatNumber(item.viewCount) || "0"}
          </Tag>
        </ItemRateView>
      ),
    },
    sku: {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      width: 160,
      render: (text, item) => (
        <Typography.Text ellipsis type="secondary">
          {item.sku || "__"}
        </Typography.Text>
      ),
    },
    sales: {
      title: i18n["Đã bán"],
      dataIndex: "sales",
      key: "sales",
      width: 120,
      render: (text, item) => (
        <Typography.Text ellipsis strong={!!item.sales} type="secondary">
          {formatNumber(item.sales)}
        </Typography.Text>
      ),
      sorter: (a, b) => a.sales - b.sales,
    },
    stock: {
      title: i18n["Kho hàng"],
      dataIndex: "stock",
      key: "stock",
      width: 160,
      sorter: (a, b) => a.stock - b.stock,
      render: (text, item) => (
        <ItemStock>
          <Typography.Text ellipsis strong type="secondary">
            {formatNumber(item.stock)}
          </Typography.Text>
          <Popover
            placement="bottomRight"
            arrow={false}
            overlayInnerStyle={{ padding: 0 }}
            content={
              <PopoverContentStyled>
                {!!item?.modelList?.length ? (
                  <SmItemModelTableStyled
                    showSorterTooltip={false}
                    size="small"
                    columns={[nameCombined1, sku, sales, stock, currentPrice, originalPrice] as any}
                    dataSource={item.modelList}
                    pagination={false}
                    rowKey={(item: any) => item.id + uid}
                  />
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    imageStyle={{ height: 32 }}
                    style={{ padding: 0, margin: "2px 0 -8px 0" }}
                    description={false}
                  />
                )}
              </PopoverContentStyled>
            }
          >
            <Avatar size={24} icon={<FaInfo />} className="info" />
          </Popover>
        </ItemStock>
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
                    <Link href={`/supplier/farm/${farmId}/item/${item.id}`}>
                      {i18n["Xem sản phẩm"]}
                    </Link>
                  ),
                  icon: <BiShowAlt size={17} />,
                },
                !item.ecofarmPackageInfo ||
                item.ecofarmPackageInfo.status == TPackageStatus.ONGOING ||
                item.ecofarmPackageInfo.status == TPackageStatus.ACTIVATED
                  ? {
                      key: "edit",
                      label: (
                        <Link href={`/supplier/farm/${farmId}/item/${item.id}/edit`}>
                          {i18n["Sửa sản phẩm"]}
                        </Link>
                      ),
                      icon: <BiEdit size={16} />,
                    }
                  : undefined,
                { key: "divider01", type: "divider" },
                [TItemStatus.HIDDEN].includes(item.status)
                  ? {
                      key: "show",
                      label: i18n["Hiện sản phẩm"],
                      icon: <MdOutlineVisibility size={16} />,
                      onClick: () => handleShowItem(item.id),
                    }
                  : undefined,
                [TItemStatus.ACTIVATED].includes(item.status)
                  ? {
                      key: "hide",
                      label: i18n["Ẩn sản phẩm"],
                      icon: <MdOutlineVisibilityOff size={16} />,
                      onClick: () => handleHiddenItem(item.id),
                    }
                  : undefined,
                [TItemStatus.INACTIVED].includes(item.status)
                  ? {
                      key: "open",
                      label: i18n["Mở kinh doanh"],
                      icon: <FaStoreAlt size={13} />,
                      onClick: () => handleOpenItem(item.id),
                    }
                  : undefined,
                [TItemStatus.ACTIVATED].includes(item.status)
                  ? {
                      key: "stop",
                      label: i18n["Ngừng kinh doanh"],
                      icon: <FaStoreAltSlash size={13} />,
                      onClick: () => handleStopItem(item.id),
                    }
                  : undefined,
                [
                  TItemStatus.PENDING,
                  TItemStatus.ACTIVATED,
                  TItemStatus.BANNED,
                  TItemStatus.HIDDEN,
                ].includes(item.status)
                  ? {
                      key: "delete",
                      label: i18n["Xóa sản phẩm"],
                      danger: true,
                      icon: <MdOutlineDelete size={16} />,
                      onClick: () => handleConfirm(item.id, item.name),
                    }
                  : undefined,
              ].filter((i) => !!i) as any[],
            }}
          >
            <CurrentStateActionBtn type="button">
              <EcofarmItemStatus state={item.status} className="tag" bordered />
              <BsThreeDots size={20} className="dots-icon" />
            </CurrentStateActionBtn>
          </Dropdown>
        );
      },
    },
    status: {
      title: <Typography.Text type="secondary">{i18n["Trạng thái"]}</Typography.Text>,
      dataIndex: "id",
      key: "actions",
      width: 160,
      render: (text, item) => {
        return <EcofarmItemStatus state={item.status} className="tag" bordered />;
      },
    },
    phoneNumber: {
      title: i18n["Số điện thoại"],
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 160,
      render: (text, item) => {
        const data = JSON.parse(item.properties);
        return (
          <div className="pricer">
            <Typography.Text ellipsis type="success" style={{ fontSize: 14 }}>
              {data.phoneNumber}
            </Typography.Text>
          </div>
        );
      },
    },
    address: {
      title: i18n["Địa chỉ"],
      dataIndex: "address",
      key: "address",
      width: 160,
      render: (text, item) => {
        const data = JSON.parse(item.properties);
        return (
          <div className="pricer">
            <Typography.Text ellipsis type="success" style={{ fontSize: 14 }}>
              {data.address}
            </Typography.Text>
          </div>
        );
      },
    },
  };
};
const PopoverContentStyled = styled.div``;
export default useItemsFarmColumns;

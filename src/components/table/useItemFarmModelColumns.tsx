import styled from "@emotion/styled";
import { useCreation } from "ahooks";
import { Typography } from "antd";
import { ColumnGroupType, ColumnType } from "antd/es/table";
import { useId } from "react";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import { formatNumber, sorterByWords } from "src/utils/utils";
import Avatar from "../avatar/Avatar";

type TuseStoreColumnsProps = {};

type TRes = Record<string, ColumnGroupType<any> | ColumnType<any>>;

const useItemFarmModelColumns = ({}: TuseStoreColumnsProps): TRes => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { message } = useApp();

  const res: TRes = useCreation(
    () => ({
      nameCombined1: {
        title: i18n["Sản phẩm"],
        dataIndex: "name",
        key: "name",
        ellipsis: true,
        render: (text, item) => (
          <ItemModelDetailWrapper>
            <Avatar
              shape="square"
              className="avatar-wrapper"
              src={item.imageUrl}
              size={44}
            ></Avatar>
            <div className="name-wrapper">
              <Typography.Paragraph ellipsis={{ rows: 2 }} strong className="name">
                {item.name}
              </Typography.Paragraph>
            </div>
          </ItemModelDetailWrapper>
        ),
        sorter: (a, b) => sorterByWords("name")(a, b),
      },
      nameCombined2: {
        title: i18n["Sản phẩm"],
        dataIndex: "name",
        key: "name",
        ellipsis: true,
        render: (text, item) => (
          <ItemModelDetailWrapper>
            <Avatar src={item.imageUrl} shape="square" className="avatar-wrapper" size={44}>
              {item.name}
            </Avatar>
            <div className="name-wrapper">
              <Typography.Text ellipsis strong className="name">
                {item.name}
              </Typography.Text>
              <Typography.Text ellipsis className="itemName">
                {item.itemName}
              </Typography.Text>
            </div>
          </ItemModelDetailWrapper>
        ),
        sorter: (a, b) => sorterByWords("name")(a, b),
      },
      sku: {
        title: "SKU",
        dataIndex: "sku",
        key: "sku",
        ellipsis: true,
        width: 90,
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
        ellipsis: true,
        width: 80,
        render: (text, item) => (
          <Typography.Text ellipsis type="secondary" strong>
            {formatNumber(item.sales)}
          </Typography.Text>
        ),
        sorter: (a, b) => a.stock - b.stock,
      },
      stock: {
        title: i18n["Kho"],
        dataIndex: "stock",
        key: "stock",
        ellipsis: true,
        width: 60,
        render: (text, item) => (
          <Typography.Text ellipsis type="secondary" strong>
            {formatNumber(item.stock)}
          </Typography.Text>
        ),
        sorter: (a, b) => a.stock - b.stock,
      },
      quantity: {
        title: i18n["Số lượng"],
        dataIndex: "quantity",
        key: "quantity",
        ellipsis: true,
        width: 94,
        render: (text, item) => (
          <Typography.Text ellipsis type="secondary" strong>
            {formatNumber(item.quantity)}
          </Typography.Text>
        ),
        sorter: (a, b) => a.quantity - b.quantity,
      },
      currentPrice: {
        title: i18n["Giá bán"],
        dataIndex: "currentPrice",
        key: "currentPrice",
        ellipsis: true,
        width: 112,
        render: (text, item) => (
          <Typography.Text ellipsis type="success">
            {`${formatNumber(item.currentPrice)}₫`}
          </Typography.Text>
        ),
        sorter: (a, b) => a.currentPrice - b.currentPrice,
      },
      originalPrice: {
        title: i18n["Giá ban đầu"],
        dataIndex: "originalPrice",
        key: "originalPrice",
        ellipsis: true,
        width: 112,
        render: (text, item) => (
          <Typography.Text ellipsis type="secondary">
            {`${formatNumber(item.originalPrice)}₫`}
          </Typography.Text>
        ),
        sorter: (a, b) => a.originalPrice - b.originalPrice,
      },
    }),
    [i18n],
  );
  return res;
};

const ItemModelDetailWrapper = styled.div`
  display: flex;
  .avatar-wrapper {
    flex-shrink: 0;
  }
  .name-wrapper {
    flex: 1 1 auto;
    min-width: 0px;
    margin-left: 8px;
    display: flex;
    flex-direction: column;
    .name {
      margin: 0;
      font-size: 16px;
    }
    .ant-typography {
      line-height: 1.25;
    }
  }
  .avatar-quantity {
    position: relative;
    .quantity-wrapper {
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 2px 4px;
      background-color: #d9d9d9;
      border-radius: 0 4px 0 4px;
      font-size: 13px;
      max-width: calc(100% - 8px);
      overflow: hidden;
      line-height: 1.1;
    }
  }
`;

export default useItemFarmModelColumns;

import Link from "@/components/next/Link";
import {
  useGetOrdersCountEcoFarmQuery,
  useGetRegisterCountEcoFarmQuery,
} from "@/redux/query/farm.query";
import { useGetOrdersCountQuery } from "@/redux/query/order.query";
import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/query";
import { Card, CardProps, Divider, Space, Statistic, Typography } from "antd";

type TTodoListProps = CardProps & { storeId?: number };

const TodoList = ({ storeId, ...props }: TTodoListProps) => {
  const { data: getOrdersCountRes } = useGetOrdersCountQuery(
    storeId ? { providerId: storeId } : skipToken,
    {
      refetchOnMountOrArgChange: true,
      pollingInterval: 30000,
    },
  );
  const ordersCountData = getOrdersCountRes?.data;

  return (
    <StyledWrapper className="statistic-card" title={"Danh sách cần làm"} {...props}>
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        Những việc bạn sẽ phải làm
      </Typography.Text>
      <Space
        className="statistic-list"
        split={<Divider type="vertical" />}
        style={{ margin: "4px 0 4px" }}
        size={0}
      >
        <Link
          href={`/supplier/store/${storeId}/order?formId=21&orderBy=1&maxResultCount=10&sortBy=2`}
          className="statistic-item"
        >
          <Statistic title={"Chờ xác nhận"} value={ordersCountData?.toPay || 0} />
        </Link>
        <Link
          href={`/supplier/store/${storeId}/order?formId=22&orderBy=1&maxResultCount=10&sortBy=2`}
          className="statistic-item"
        >
          <Statistic title={"Chờ lấy hàng"} value={ordersCountData?.toShip || 0} />
        </Link>
        <Link
          href={`/supplier/store/${storeId}/order?formId=23&orderBy=1&maxResultCount=10&sortBy=2`}
          className="statistic-item"
        >
          <Statistic title={"Đã xử lý"} value={ordersCountData?.shipping || 0} />
        </Link>
        <Link
          href={`/supplier/store/${storeId}/order?formId=25&orderBy=1&maxResultCount=10&sortBy=2`}
          className="statistic-item"
        >
          <Statistic title={"Đơn hủy"} value={ordersCountData?.cancelled || 0} />
        </Link>
      </Space>

      <Space className="statistic-list" split={<Divider type="vertical" />} size={0}>
        <Link
          href={`/supplier/store/${storeId}/order?formId=26&orderBy=1&maxResultCount=10&sortBy=2`}
          className="statistic-item"
        >
          <Statistic
            title={"Trả hàng/ Hoàn tiền chờ xử lý"}
            value={ordersCountData?.returnRefund || 0}
          />
        </Link>
        <Link
          href={`/supplier/store/${storeId}/item?formId=14&orderBy=2&maxResultCount=10&sortBy=2`}
          className="statistic-item"
        >
          <Statistic title={"Sản phẩm bị tạm khóa"} value={ordersCountData?.itemBlocked || 0} />
        </Link>
        <Link
          href={`/supplier/store/${storeId}/item?formId=12&orderBy=2&maxResultCount=10&sortBy=2`}
          className="statistic-item"
        >
          <Statistic title={"Sản phẩm hết hàng"} value={ordersCountData?.itemSoldOut || 0} />
        </Link>
        <div className="statistic-item"></div>
      </Space>
    </StyledWrapper>
  );
};

export const TodoListFarm = ({ storeId, ...props }: TTodoListProps) => {
  const { data: getOrdersCountRes } = useGetOrdersCountEcoFarmQuery(
    storeId ? { providerId: storeId } : skipToken,
    {
      refetchOnMountOrArgChange: true,
      pollingInterval: 30000,
    },
  );
  const ordersCountData = getOrdersCountRes?.data;
  const { data: getRegisterCountRes } = useGetRegisterCountEcoFarmQuery(
    storeId ? { providerId: storeId } : skipToken,
    {
      refetchOnMountOrArgChange: true,
      pollingInterval: 30000,
    },
  );
  const registerCountData = getRegisterCountRes?.data;

  return (
    <StyledWrapper className="statistic-card" title={"Danh sách cần làm"} {...props}>
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        Những việc bạn sẽ phải làm
      </Typography.Text>

      <Space
        className="statistic-list"
        split={<Divider type="vertical" />}
        style={{ margin: "4px 0 4px" }}
        size={0}
      >
        <Link href={`/supplier/farm/${storeId}/order?formId=21`} className="statistic-item">
          <Statistic title={"Chờ xác nhận"} value={ordersCountData?.toPay || 0} />
        </Link>
        <Link href={`/supplier/farm/${storeId}/order?formId=22`} className="statistic-item">
          <Statistic title={"Chờ lấy hàng"} value={ordersCountData?.toShip || 0} />
        </Link>
        <Link href={`/supplier/farm/${storeId}/order?formId=23`} className="statistic-item">
          <Statistic title={"Đang giao hàng"} value={ordersCountData?.shipping || 0} />
        </Link>
        <Link href={`/supplier/farm/${storeId}/order?formId=25`} className="statistic-item">
          <Statistic title={"Đơn hủy"} value={ordersCountData?.cancelled || 0} />
        </Link>
        <Link href={`/supplier/farm/${storeId}/order?formId=26`} className="statistic-item">
          <Statistic
            title={"Trả hàng/ Hoàn tiền chờ xử lý"}
            value={ordersCountData?.returnRefund || 0}
          />
        </Link>
      </Space>
      <Space className="statistic-list" split={<Divider type="vertical" />} size={0}>
        <Link href={`/supplier/farm/${storeId}/item?formId=12`} className="statistic-item">
          <Statistic title={"Sản phẩm hết hàng"} value={ordersCountData?.itemSoldOut || 0} />
        </Link>
        <Link href={`/supplier/farm/${storeId}/item?formId=14`} className="statistic-item">
          <Statistic title={"Sản phẩm bị tạm khóa"} value={ordersCountData?.itemBlocked || 0} />
        </Link>
        <Link href={`/supplier/farm/${storeId}/register?formId=1`} className="statistic-item">
          <Statistic title={"Đăng ký gói Chờ duyệt"} value={registerCountData?.pending || 0} />
        </Link>
        <Link href={`/supplier/farm/${storeId}/register?formId=2`} className="statistic-item">
          <Statistic title={"Đăng ký gói đang đầu tư"} value={registerCountData?.investing || 0} />
        </Link>
        <Link href={`/supplier/farm/${storeId}/register?formId=4`} className="statistic-item">
          <Statistic title={"Đăng ký gói đã hủy"} value={registerCountData?.cancelled || 0} />
        </Link>
      </Space>
    </StyledWrapper>
  );
};

const StyledWrapper = styled(Card)`
  & .statistic-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    & .ant-space-item {
      width: 100%;
      flex-grow: 1;
      height: 100%;
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 8px;
      }
    }
    & .statistic-item {
      display: flex;
      padding: 0 8px;
      height: 100%;
      & .ant-statistic {
        display: flex;
        flex-direction: column-reverse;
      }

      & .ant-statistic-title {
        font-size: 11px;
        line-height: 1.1;
      }
    }
  }
`;

export default TodoList;

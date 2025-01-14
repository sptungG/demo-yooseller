import DualAxesChart from "@/components/charts/DualAxesChart";
import VariantDatePickerForm from "@/components/picker/VariantDatePickerForm";
import useChangeLocale from "@/hooks/useChangeLocale";
import { EcoFarmOrders } from "@/redux/query/farm.query";
import { useGetStatisticOrdersQuery } from "@/redux/query/order.query";
import { TOrderStatisticFilter } from "@/types/order.types";
import { dayjs } from "@/utils/utils-date";
import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/query";
import { Card, CardProps, Empty, Typography } from "antd";
import { useState } from "react";

type TStatisticCardProps = CardProps & { storeId?: number };

export const StatisticCard = ({ storeId, ...props }: TStatisticCardProps) => {
  const { i18n } = useChangeLocale();
  const [gSelectedRange, setGSelectedRange] = useState<string[]>(
    Array(12)
      .fill(null)
      .map((_, index) => dayjs().month(index).format("MM-YYYY")),
  );
  const [filterStatisticOrdersStoreData, setFilterStatisticOrdersStoreData] =
    useState<TOrderStatisticFilter>({
      type: 1,
      year: dayjs().get("year"),
      formId: 2,
    });
  const {
    data: getStatisticOrdersRes,
    isFetching: getStatisticOrdersFetching,
    isError: getStatisticOrdersError,
  } = useGetStatisticOrdersQuery(
    storeId ? { ...filterStatisticOrdersStoreData, providerId: storeId } : skipToken,
    { refetchOnMountOrArgChange: true, pollingInterval: 300000 },
  );
  const listCountData = getStatisticOrdersRes?.data.listCount || [];
  const listRevenueData = getStatisticOrdersRes?.data.listRevenue || [];
  const mappedData = gSelectedRange.map((item, index) => ({
    time: item,
    count: listCountData?.[index] || 0,
    revenue: listRevenueData?.[index] || 0,
  }));
  return (
    <StyledWrapper
      className="div1"
      title={i18n["Phân Tích Bán Hàng"]}
      loading={getStatisticOrdersFetching}
      extra={
        <VariantDatePickerForm
          pickerProps={{ placement: "bottomRight" }}
          rangeProps={{ placement: "bottomRight" }}
          variant="borderless"
          onChangeDate={(date) => {
            setFilterStatisticOrdersStoreData({
              formId: 2,
              type: 5,
              day: date.get("date"),
              month: date.get("month") + 1,
              year: date.get("year"),
            });
            setGSelectedRange(
              Array(24)
                .fill(null)
                .map((_, index) => date.startOf("day").hour(index).format("HH:mm")),
            );
          }}
          onChangeYear={(date) => {
            setFilterStatisticOrdersStoreData({ formId: 2, type: 1, year: date.get("year") });
            setGSelectedRange(
              Array(12)
                .fill(null)
                .map((_, index) => date.month(index).format("MM-YYYY")),
            );
          }}
          onChangeMonth={(date) => {
            setFilterStatisticOrdersStoreData({
              formId: 2,
              type: 3,
              month: date.get("month") + 1,
              year: date.get("year"),
            });
            setGSelectedRange(
              Array(date.daysInMonth())
                .fill(null)
                .map((_, index) => date.date(index + 1).format("DD-MM-YYYY")),
            );
          }}
          onChangeRangeDate={([dateForm, dateTo]) => {
            setFilterStatisticOrdersStoreData({
              formId: 2,
              type: 4,
              dateFrom: dateForm.startOf("day").format("MM/DD/YYYY"),
              dateTo: dateTo.startOf("day").format("MM/DD/YYYY"),
            });
            setGSelectedRange(
              Array(dateTo.startOf("day").diff(dateForm.startOf("day"), "day") + 1)
                .fill(null)
                .map((_, index) => dateForm.startOf("day").add(index, "day"))
                .map((item) => item.format("DD-MM-YYYY")),
            );
          }}
        />
      }
      {...props}
    >
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        Tổng quan dữ liệu của shop đối với đơn hàng đã xác nhận
      </Typography.Text>
      {getStatisticOrdersError ? (
        <Empty
          className="list-empty"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          imageStyle={{ height: 144 }}
          description={false}
        />
      ) : (
        <DualAxesChart data={mappedData} xField={"time"} yField={["count", "revenue"]} />
      )}
    </StyledWrapper>
  );
};

export const StatisticCardFarm = ({ storeId, ...props }: TStatisticCardProps) => {
  const { i18n } = useChangeLocale();
  const [gSelectedRange, setGSelectedRange] = useState<string[]>(
    Array(12)
      .fill(null)
      .map((_, index) => dayjs().month(index).format("MM-YYYY")),
  );
  const [filterStatisticOrdersStoreData, setFilterStatisticOrdersStoreData] =
    useState<TOrderStatisticFilter>({
      type: 1,
      year: dayjs().get("year"),
      //formId: 2,
    });
  const {
    data: getStatisticOrdersRes,
    isFetching: getStatisticOrdersFetching,
    isError: getStatisticOrdersError,
  } = EcoFarmOrders.useGetStatisticOrdersQuery(
    storeId ? { ...filterStatisticOrdersStoreData, providerId: storeId } : skipToken,
    { refetchOnMountOrArgChange: true, pollingInterval: 300000 },
  );
  const listCountData = getStatisticOrdersRes?.data.listCount || [];
  const listRevenueData = getStatisticOrdersRes?.data.listRevenue || [];
  const mappedData = gSelectedRange.map((item, index) => ({
    time: item,
    count: listCountData?.[index] || 0,
    revenue: listRevenueData?.[index] || 0,
  }));
  return (
    <StyledWrapper
      className="div1"
      title={i18n["Phân Tích Bán Hàng"]}
      loading={getStatisticOrdersFetching}
      extra={
        <VariantDatePickerForm
          pickerProps={{ placement: "bottomRight" }}
          rangeProps={{ placement: "bottomRight" }}
          variant="borderless"
          onChangeDate={(date) => {
            setFilterStatisticOrdersStoreData({
              //formId: 2,
              type: 5,
              day: date.get("date"),
              month: date.get("month") + 1,
              year: date.get("year"),
            });
            setGSelectedRange(
              Array(24)
                .fill(null)
                .map((_, index) => date.startOf("day").hour(index).format("HH:mm")),
            );
          }}
          onChangeYear={(date) => {
            setFilterStatisticOrdersStoreData({
              //formId: 2,
              type: 1,
              year: date.get("year"),
            });
            setGSelectedRange(
              Array(12)
                .fill(null)
                .map((_, index) => date.month(index).format("MM-YYYY")),
            );
          }}
          onChangeMonth={(date) => {
            setFilterStatisticOrdersStoreData({
              //formId: 2,
              type: 3,
              month: date.get("month") + 1,
              year: date.get("year"),
            });
            setGSelectedRange(
              Array(date.daysInMonth())
                .fill(null)
                .map((_, index) => date.date(index + 1).format("DD-MM-YYYY")),
            );
          }}
          onChangeRangeDate={([dateForm, dateTo]) => {
            setFilterStatisticOrdersStoreData({
              //formId: 2,
              type: 4,
              dateFrom: dateForm.startOf("day").format("MM/DD/YYYY"),
              dateTo: dateTo.startOf("day").format("MM/DD/YYYY"),
            });
            setGSelectedRange(
              Array(dateTo.startOf("day").diff(dateForm.startOf("day"), "day") + 1)
                .fill(null)
                .map((_, index) => dateForm.startOf("day").add(index, "day"))
                .map((item) => item.format("DD-MM-YYYY")),
            );
          }}
        />
      }
      {...props}
    >
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        Tổng quan dữ liệu của shop đối với đơn hàng đã xác nhận
      </Typography.Text>
      {getStatisticOrdersError ? (
        <Empty
          className="list-empty"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          imageStyle={{ height: 144 }}
          description={false}
        />
      ) : (
        <DualAxesChart data={mappedData} xField={"time"} yField={["count", "revenue"]} />
      )}
    </StyledWrapper>
  );
};

const StyledWrapper = styled(Card)``;

export default StatisticCard;

import Button from "@/components/button/Button";
import FilterSearchInput from "@/components/field/FilterSearchInput";
import VariantDatePickerForm from "@/components/picker/VariantDatePickerForm";
import Container from "@/components/shared/Container";
import Pagination from "@/components/shared/Pagination";
import ProviderType from "@/components/tag/ProviderType";
import Tag from "@/components/tag/Tag";
import useChangeLocale from "@/hooks/useChangeLocale";
import useGetProviderTypes from "@/hooks/useGetProviderTypes";
import {
  useGetAllProvidersEcofarmByPartnerQuery,
  useGetStatisticSomeProvidersQuery,
} from "@/redux/query/farm.query";
import { TProviderEcofarmFilter } from "@/types/farm.types";
import { TStatisticSomeProvidersFilter } from "@/types/order.types";
import { TProviderState } from "@/types/provider.types";
import { formatNumber } from "@/utils/utils";
import { dayjs } from "@/utils/utils-date";
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/query";
import { useDebounce } from "ahooks";
import { Avatar, Empty, Flex, Popover, Typography } from "antd";
import { rgba } from "emotion-rgba";
import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { BsArrowRight, BsSliders } from "react-icons/bs";
import { MdStarRate } from "react-icons/md";

type TFarmListProps = {
  selectedStore?: number;
  onClickCard?: (v?: number) => void;
  actionsHeader?: React.ReactNode;
};

const FarmList = ({ selectedStore, onClickCard, actionsHeader }: TFarmListProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { colorPrimary, generatedColors } = useTheme();

  const { mappedTypeStore } = useGetProviderTypes();
  const { mappedTypes } = useGetProviderTypes();
  const [listWrapper, setListWrapper] = useState<any>(null);
  const statusStyle = (status: TProviderState): React.CSSProperties => ({
    opacity: [TProviderState.PENDING, TProviderState.ACTIVATED].includes(status) ? 1 : 0.45,
  });

  const [filterData, setFilterData] = useState<TProviderEcofarmFilter>({
    formId: 20,
    maxResultCount: 10,
    sortBy: 2,
    orderBy: 1,
  });
  const debouncedFilterData = useDebounce(filterData, { wait: 500 });
  const { data, isFetching: isDataProvidersLoading } = useGetAllProvidersEcofarmByPartnerQuery(
    debouncedFilterData,
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const storeList = data?.data || [];
  const storeListTotal = data?.totalRecords;
  const storeListIds = storeList.map((s) => s.id);

  const [filterStatisticOrdersData, setFilterStatisticOrdersData] =
    useState<TStatisticSomeProvidersFilter>({
      type: 1,
      year: dayjs().year(),
      formId: 2,
    });
  const { data: getStatisticSomeProvidersRes } = useGetStatisticSomeProvidersQuery(
    !!storeListIds.length
      ? { listProviderId: storeListIds, ...filterStatisticOrdersData }
      : skipToken,
    { refetchOnMountOrArgChange: true },
  );
  const storeListStatisticTotalCount = Object.values(
    getStatisticSomeProvidersRes?.data.listCount || {},
  ).reduce((prev, curr) => curr + prev, 0);
  const storeListStatisticTotalRevenue = Object.values(
    getStatisticSomeProvidersRes?.data.listRevenue || {},
  ).reduce((prev, curr) => curr + prev, 0);

  return (
    <StyledWrapper>
      <div className="header-wrapper">
        <Flex style={{ padding: "8px 8px 0" }} gap={8}>
          <FilterSearchInput
            size="large"
            variant="borderless"
            placeholder={i18n["Tìm kiếm trang trại"]}
            value={filterData.keyword}
            style={{ backgroundColor: "rgba(0,0,0,0.05)" }}
            onChange={(e) => setFilterData({ ...filterData, keyword: e.target.value })}
          />
        </Flex>
        {actionsHeader}
      </div>

      <Flex align="center" style={{ padding: "6px 8px 8px", opacity: 0.8 }} gap={8}>
        <Tag
          bordered={false}
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            lineHeight: 1.12,
            padding: "2px 4px",
          }}
          icon={"Tổng doanh số:"}
        >
          <b style={{ color: "blue" }}>{`${formatNumber(storeListStatisticTotalCount)}`}</b>
        </Tag>
        <Tag
          bordered={false}
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            lineHeight: 1.12,
            padding: "2px 4px",
          }}
          icon={"Tổng doanh thu:"}
        >
          <b style={{ color: "green" }}>{`${formatNumber(storeListStatisticTotalRevenue)}₫`}</b>
        </Tag>
        <Popover
          arrow={false}
          placement="bottomRight"
          trigger={["click"]}
          overlayInnerStyle={{ padding: 0 }}
          content={
            <VariantDatePickerForm
              variant="borderless"
              onChangeDate={(date) =>
                setFilterStatisticOrdersData({
                  formId: 2,
                  type: 5,
                  day: date.get("date"),
                  month: date.get("month") + 1,
                  year: date.get("year"),
                })
              }
              onChangeYear={(date) =>
                setFilterStatisticOrdersData({ formId: 2, type: 1, year: date.get("year") })
              }
              onChangeMonth={(date) =>
                setFilterStatisticOrdersData({
                  formId: 2,
                  type: 3,
                  month: date.get("month") + 1,
                  year: date.get("year"),
                })
              }
              onChangeRangeDate={([dateForm, dateTo]) =>
                setFilterStatisticOrdersData({
                  formId: 2,
                  type: 4,
                  dateFrom: dateForm.startOf("day").format("MM/DD/YYYY"),
                  dateTo: dateTo.startOf("day").format("MM/DD/YYYY"),
                })
              }
            />
          }
        >
          <Button
            size="small"
            style={{ flexShrink: 0, margin: "0 0 0 auto" }}
            type="text"
            icon={<BsSliders size={16} />}
          ></Button>
        </Popover>
      </Flex>

      {!!storeList.length ? (
        <Flex vertical>
          {storeList.map((item, index) => {
            const statisticCount = getStatisticSomeProvidersRes?.data.listCount?.[item.id] || 0;
            const statisticRevenue = getStatisticSomeProvidersRes?.data.listRevenue?.[item.id] || 0;
            return (
              <StyledCard
                key={uid + item.id + item.name + "farm"}
                onClick={() => onClickCard?.(item.id)}
                className={`status${item.state} ${selectedStore === item.id ? "active" : ""}`}
              >
                <Flex>
                  <Avatar
                    shape="square"
                    size={48}
                    src={item.imageUrls?.[0]}
                    className="image-wrapper"
                  >
                    {item.name[0]}
                  </Avatar>
                  <Flex vertical align="stretch" flex="1 1 auto" style={{ minWidth: 0 }}>
                    <Flex justify="space-between" align="flex-start">
                      <Flex vertical align="flex-start" style={{ maxWidth: 180, marginTop: -4 }}>
                        <Link href={`/supplier/farm/${item.id}`}>
                          <Typography.Text
                            ellipsis
                            strong
                            style={{ fontSize: 16, color: "inherit", maxWidth: 180 }}
                          >
                            {item.name}
                          </Typography.Text>
                        </Link>
                        <ProviderType
                          groupType={mappedTypes(item.groupType)}
                          type={mappedTypes(item.type)}
                        />
                      </Flex>
                      {selectedStore === item.id ? (
                        <Typography.Text
                          style={{
                            fontSize: 12,
                            color: colorPrimary,
                            textDecoration: "underline",
                          }}
                        >
                          Đang xem
                        </Typography.Text>
                      ) : (
                        <Button
                          shape="circle"
                          style={{ padding: 0 }}
                          type="text"
                          icon={<BsArrowRight size={16} />}
                          bgColor={"rgba(0,0,0,0.02)"}
                        ></Button>
                      )}
                    </Flex>
                  </Flex>
                </Flex>
                <Flex justify="space-between" align="flex-end">
                  <div className="rate-wrapper" style={{ marginTop: 2 }}>
                    <Tag
                      color={!!item?.ratePoint ? "gold" : "default"}
                      bordered={false}
                      icon={<MdStarRate />}
                      style={{ background: "transparent", padding: 0, marginTop: -1 }}
                    >
                      {item.ratePoint || "0"}
                    </Tag>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      <span style={{ margin: 2 }}>•</span>
                      <span style={{ fontWeight: 600 }}>{item.countRate || "0"}</span>{" "}
                      {i18n["Đánh giá"].toLowerCase()}
                    </Typography.Text>
                    {/* <Divider type="vertical" style={{ height: 18 }} /> */}
                    {/* <div className="icons-info-wrapper" style={{ opacity: 0.6 }}>
                        {!!item.phoneNumber && <BsPersonLinesFill size={14} />}
                        {!!item.workTime && <BsCalendarWeekFill size={14} />}
                      </div> */}
                  </div>
                  <div className="statistics-wrapper">
                    <div
                      className="tag-wrapper"
                      style={{ flexDirection: statisticRevenue > 100 ? "column" : "row" }}
                    >
                      <Typography.Text
                        type="secondary"
                        ellipsis
                        style={{
                          fontSize: 10,
                          marginRight: statisticRevenue > 100 ? 0 : 2,
                        }}
                      >
                        {i18n["Doanh số"]}:
                      </Typography.Text>
                      <Typography.Text
                        type="secondary"
                        strong
                        ellipsis
                        style={{
                          color: statisticCount < 1 ? undefined : "#0958d9",
                          fontSize: 12,
                        }}
                      >
                        {`${formatNumber(statisticCount)}`}
                      </Typography.Text>
                    </div>

                    <div
                      className="tag-wrapper"
                      style={{ flexDirection: statisticRevenue > 100 ? "column" : "row" }}
                    >
                      <Typography.Text
                        type="secondary"
                        ellipsis
                        style={{
                          fontSize: 10,
                          marginRight: statisticRevenue > 100 ? 0 : 2,
                        }}
                      >
                        {i18n["Doanh thu"]}:
                      </Typography.Text>
                      <Typography.Text
                        type="secondary"
                        strong
                        ellipsis
                        style={{
                          color: statisticRevenue < 1 ? undefined : "#389e0d",
                          fontSize: 12,
                        }}
                      >
                        {`${formatNumber(statisticRevenue)}₫`}
                      </Typography.Text>
                    </div>
                  </div>
                  <div className="bg-image-wrapper">
                    {item.groupType === 100 && (
                      <Image src={"/images/farm-bg-02-transformed.png"} alt="" fill />
                    )}
                    {item.groupType === 101 && (
                      <Image src={"/images/farm-bg-03-transformed.png"} alt="" fill />
                    )}
                  </div>
                </Flex>
              </StyledCard>
            );
          })}
        </Flex>
      ) : (
        <div className="list-empty">
          <Empty
            className="empty"
            imageStyle={{ height: 144 }}
            description={
              <Typography.Text ellipsis type="secondary">
                {i18n["Không tìm thấy trang trại phù hợp"]}
              </Typography.Text>
            }
          />
        </div>
      )}

      <div className="footer-wrapper">
        {!!storeListTotal && (
          <Pagination
            showLessItems
            showSizeChanger={false}
            total={storeListTotal}
            pageSizeOptions={[10, 20, 50, 100]}
            defaultPageSize={10}
            hideOnSinglePage
            onChange={(current, pageSize) => {
              setFilterData({
                ...filterData,
                skipCount: pageSize * (current > 0 ? current - 1 : 0),
                maxResultCount: pageSize,
              });
            }}
          />
        )}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled(Container)`
  flex: 1 1 auto;
  min-height: 0px;
  position: relative;
  display: flex;
  flex-direction: column;
  & > .header-wrapper {
    display: flex;
    flex-direction: column;
    & > .filter-wrapper {
      height: 48px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      background-color: rgba(0, 0, 0, 0.01);
    }
  }
  & > .list-empty {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    flex: 1 1 auto;
    min-height: 0px;
    padding: 24px 0;
  }
  & > .list {
    display: flex;
    flex-direction: column;
    padding: 0;
  }
  & > .footer-wrapper {
    margin-top: auto;
    padding: 8px 8px;
  }
`;

const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 8px;
  cursor: pointer;
  position: relative;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  & .image-wrapper {
    flex-shrink: 0;
    margin-right: 8px;
  }
  & .detail-desc {
    opacity: 0.6;
    color: rgba(0, 0, 0, 0.45);
    line-height: 1;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    p {
      margin: 0;
    }
  }
  & .statistics-wrapper {
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
    .tag-wrapper {
      display: flex;
      align-items: flex-end;
    }
    .ant-tag {
      justify-content: flex-end;
      align-self: flex-end;
    }
  }
  & .rate-wrapper {
    display: flex;
    align-items: center;
    margin-top: auto;
    .icons-info-wrapper {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      .ant-avatar {
        display: inline-flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  & .bg-image-wrapper {
    position: absolute;
    bottom: 8px;
    left: 8px;
    top: 8px;
    right: 8px;
    z-index: 0;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
    z-index: -1;
    img {
      object-fit: cover;
      object-position: bottom center;
    }
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    & .bg-image-wrapper {
      opacity: 0.2;
      visibility: visible;
    }
  }
  &.active {
    background-color: ${({ theme }) => rgba(theme.generatedColors[1], 0.15)};
    border: 1px solid ${({ theme }) => theme.colorPrimary};
    & .bg-image-wrapper {
      opacity: 0.2;
      visibility: visible;
      z-index: -1;
    }
  }
  &.status5 {
    opacity: 0.5;
  }
`;

export default FarmList;

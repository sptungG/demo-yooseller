import Avatar from "@/components/avatar/Avatar";
import FilterSearchInput from "@/components/field/FilterSearchInput";
import UpdateAmenitiesBookingState from "@/components/field/UpdateAmenitiesBookingState";
import StoreFilterPopover from "@/components/popover/StoreFilterPopover";
import Pagination from "@/components/shared/Pagination";
import AmenityTableStyled from "@/components/table/AmenityTable";
import useAmenitiesBookingColumns from "@/components/table/useAmenitiesBookingColumns";
import useGetProvider from "@/hooks/useGetProvider";
import { useGetAllAmenitiesBookingQuery } from "@/redux/query/amenity.query";
import { TAmenitiesBooking } from "@/types/amenity.types";
import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/query";
import { useCreation, useDebounce } from "ahooks";
import { Affix, Empty, Form, Typography, theme } from "antd";
import { parseAsInteger, useQueryStates } from "next-usequerystate";
import { useRouter } from "next/router";
import { useId, useState } from "react";
import { MdOutlineStore } from "react-icons/md";
import Card from "src/components/card/Card";
import withAuth from "src/components/hoc/withAuth";
import BreadcrumbHeader from "src/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "src/components/layout/SiderHeaderLayout";
import StyledPage, {
  cssFilterWrapper,
  cssFooterWrapper,
  cssListWrapper,
} from "src/components/layout/StyledPage";
import useChangeLocale from "src/hooks/useChangeLocale";

const defaultFilter = {
  providerId: parseAsInteger,
  skipCount: parseAsInteger,
  maxResultCount: parseAsInteger.withDefault(10),
  sortBy: parseAsInteger,
  state: parseAsInteger,
  bookingStateFormId: parseAsInteger.withDefault(0),
};

const Page = () => {
  const uid = useId();
  const {
    replace,
    query: { storeId },
  } = useRouter();
  const {
    token: { colorBgBase },
  } = theme.useToken();
  const { i18n } = useChangeLocale();
  const [form] = Form.useForm();
  const { gSelectedProvider } = useGetProvider({});

  const [filterData, setFilterData] = useQueryStates(defaultFilter);
  const [internalFilterData, setInternalFilterData] = useState({ keyword: "" });
  const debouncedFilterData = useDebounce(internalFilterData, { wait: 500 });

  const { data: getAllAmenitiesBookingRes } = useGetAllAmenitiesBookingQuery(
    !!gSelectedProvider?.id
      ? {
          ...debouncedFilterData,
          ...filterData,
          providerId: gSelectedProvider?.id,
        }
      : skipToken,
    {
      refetchOnMountOrArgChange: true,
      pollingInterval: 60000,
    },
  );

  const amenitiesBookingListData = getAllAmenitiesBookingRes?.data || [];
  const amenitiesBookingListTotal = getAllAmenitiesBookingRes?.totalRecords;
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [selectedBookingState, setSelectedBookingState] =
    useState<
      Pick<
        TAmenitiesBooking,
        | "id"
        | "items"
        | "bookingCode"
        | "name"
        | "phoneNumber"
        | "email"
        | "description"
        | "checkIn"
        | "checkOut"
        | "totalPrice"
        | "state"
        | "totalDepist"
        | "recipientAddress"
      >
    >();

  const amenitiesBookingColumns = useAmenitiesBookingColumns({
    onClickUpdateState: (foundBooking) => {
      if (!foundBooking) return;
      setSelectedBookingState({
        id: foundBooking.id,
        items: foundBooking.items,
        bookingCode: foundBooking.bookingCode,
        name: foundBooking.name,
        phoneNumber: foundBooking.phoneNumber,
        email: foundBooking.email,
        description: foundBooking.description,
        checkIn: foundBooking.checkIn,
        checkOut: foundBooking.checkOut,
        totalPrice: foundBooking.totalPrice,
        state: foundBooking.state,
        totalDepist: foundBooking.totalDepist,
        recipientAddress: foundBooking.recipientAddress,
      });
    },
  });
  const mappedAmenitiesBookingColumns = useCreation(() => {
    const { codeCombined1, name, items, totalPrice, totalDepist, actionsState } =
      amenitiesBookingColumns;
    return [
      { ...codeCombined1, width: 300 },
      { ...name, width: 140, ellipsis: true },
      { ...items, width: 240, ellipsis: true },
      { ...totalPrice, align: "right", width: 140, ellipsis: true },
      { ...totalDepist, align: "right", width: 140, ellipsis: true },
      { ...actionsState, align: "right", width: 180, ellipsis: true },
    ];
  }, [gSelectedProvider, amenitiesBookingColumns]);

  const handleSubmitFilter = ({ keyword, ...formData }: any) => {
    setInternalFilterData({ keyword });
    setFilterData({
      ...formData,
      providerId: gSelectedProvider?.id,
    });
  };

  return (
    <SiderHeaderLayout
      headerLeft={
        <BreadcrumbHeader
          items={[
            { "/supplier/store": <MdOutlineStore size={26} /> },
            {
              [`/supplier/store/${storeId}`]: (
                <Avatar
                  shape="square"
                  key={String(gSelectedProvider?.id) + uid}
                  src={gSelectedProvider?.imageUrls[0]}
                  size={26}
                />
              ),
            },
          ]}
          current={i18n["Đơn hàng dịch vụ"]}
        />
      }
    >
      <PageWrapper>
        <Form
          className="form-wrapper"
          id={uid}
          form={form}
          onFinish={handleSubmitFilter}
          onValuesChange={(changedValues, values) => {
            const { keyword, ...rest } = values as any;
            setInternalFilterData({ keyword });
            setFilterData({ ...filterData, ...rest });
          }}
        >
          <Card
            className="list-wrapper"
            title={
              <Typography.Title level={2} className="title" style={{ margin: 0 }}>
                {i18n["Đơn hàng dịch vụ"]}
              </Typography.Title>
            }
            tabList={[
              { key: "0", tab: i18n["Tất cả"] },
              { key: "1", tab: i18n["Đã yêu cầu"] },
              { key: "2", tab: i18n["Đang xử lý"] },
              { key: "3", tab: i18n["Đã hoàn thành"] },
              { key: "4", tab: i18n["Đã hủy"] },
              { key: "5", tab: i18n["Đã đánh giá"] },
            ]}
            tabProps={{ size: "middle", tabBarGutter: 16 }}
            activeTabKey={
              !!filterData?.bookingStateFormId ? String(filterData.bookingStateFormId) : "0"
            }
            onTabChange={(key) => {
              form.setFieldValue("bookingStateFormId", +key);
              setFilterData({ ...filterData, bookingStateFormId: +key });
            }}
          >
            <div className="header-wrapper">
              <div className="filters-wrapper">
                <StoreFilterPopover formId={uid} width={424}>
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={false} />
                </StoreFilterPopover>
                <Form.Item name="keyword" noStyle>
                  <FilterSearchInput placeholder={i18n["Tìm kiếm đơn hàng"]} />
                </Form.Item>
              </div>
            </div>

            {amenitiesBookingListData?.length ? (
              <AmenityTableStyled
                showSorterTooltip={false}
                pagination={false}
                size="large"
                dataSource={amenitiesBookingListData}
                columns={mappedAmenitiesBookingColumns as any[]}
                rowSelection={{
                  columnWidth: 32,
                  selectedRowKeys: selectedItems,
                  onChange: (selectedRowKeys, selectedRows) => {
                    setSelectedItems(selectedRowKeys as any[]);
                  },
                }}
                rowKey={(item: any) => item.id}
                scroll={{ x: "100%" }}
              />
            ) : (
              <Empty
                className="list-empty"
                imageStyle={{ height: 144 }}
                description={
                  <Typography.Text ellipsis type="secondary">
                    {i18n["Không có đơn hàng dịch vụ nào"]}
                  </Typography.Text>
                }
              />
            )}

            <Affix offsetBottom={0.001}>
              <div className="footer" style={{ backgroundColor: colorBgBase }}>
                <div className="selected-wrapper">
                  {i18n["Đã chọn"]} <span>{selectedItems.length}</span>{" "}
                  {i18n["Đơn hàng"].toLowerCase()}
                </div>
                {!!amenitiesBookingListTotal && (
                  <Pagination
                    showSizeChanger
                    total={amenitiesBookingListTotal}
                    showTotal={(total, range) =>
                      `${i18n["Hiển thị"]} ${range[0]} - ${range[1]} ${i18n["trong"]} ${total}`
                    }
                    pageSizeOptions={[10, 20, 50, 100]}
                    defaultPageSize={10}
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
            </Affix>
          </Card>
        </Form>

        {!!selectedBookingState && (
          <UpdateAmenitiesBookingState
            item={selectedBookingState}
            open={!!selectedBookingState}
            onClose={() => setSelectedBookingState(undefined)}
          />
        )}
      </PageWrapper>
    </SiderHeaderLayout>
  );
};

const PageWrapper = styled(StyledPage)`
  padding: 12px;
  .title-wrapper {
    display: flex;
    flex-wrap: nowrap;
    margin-bottom: 24px;
    & > .title {
      margin-bottom: 0;
    }
    & > span {
      align-self: center;
      margin-left: 12px;
      margin-right: 4px;
    }
  }
  .list-wrapper {
    ${cssListWrapper}
    .filters-wrapper {
      ${cssFilterWrapper}
    }
    .grid.list-container {
      --f-columns: 4;
      --f-gap-x: 16px;
      --f-gap-y: 16px;
      padding: 16px;
      display: flex;
      flex-wrap: wrap;
      margin-left: calc(-1 * var(--f-gap-x));
      margin-bottom: calc(-1 * var(--f-gap-y));
      &.col-3 {
        --f-columns: 3;
      }
      & > * {
        margin-left: var(--f-gap-x);
        margin-bottom: var(--f-gap-y);
        width: calc((100% / var(--f-columns) - var(--f-gap-x)));
      }
    }
    .list.list-container {
      display: flex;
      flex-direction: column;
      padding: 0;
    }
    .list-header {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      font-weight: 600;
      border-bottom: 1px solid rgba(5, 5, 5, 0.06);
      margin-top: 1px;
      .div0 {
        flex: 0 0 32px;
      }
    }
    .ant-affix .list-header {
      padding: 16px 16px;
      margin-top: 0;
    }
    .footer {
      ${cssFooterWrapper}
      padding: 16px;
      border: none;
      .selected-wrapper {
        & > span {
          font-weight: 600;
        }
      }
      .ant-pagination {
        margin-left: auto;
      }
    }
  }
`;

export default withAuth(Page);

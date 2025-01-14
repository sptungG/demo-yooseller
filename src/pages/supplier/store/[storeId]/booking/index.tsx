import styled from "@emotion/styled";
import { useCreation, useDebounce, useIsomorphicLayoutEffect, useSafeState } from "ahooks";
import { Affix, Checkbox, Divider, Empty, Form, Segmented, Select, Typography, theme } from "antd";
import { useRouter } from "next/router";
import { useId, useState } from "react";
import { MdGridView, MdOutlineStore, MdViewList } from "react-icons/md";
import Avatar from "src/components/avatar/Avatar";
import BookingCard from "src/components/card/BookingCard";
import Card from "src/components/card/Card";
import FilterSearchInput from "src/components/field/FilterSearchInput";
import InputPriceRange from "src/components/field/InputPriceRange";
import UpdateBookingState from "src/components/field/UpdateBookingState";
import withAuth from "src/components/hoc/withAuth";
import BreadcrumbHeader from "src/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "src/components/layout/SiderHeaderLayout";
import StyledPage, {
  cssFilterWrapper,
  cssFooterWrapper,
  cssListWrapper,
} from "src/components/layout/StyledPage";
import RangePicker from "src/components/picker/RangePicker";
import StoreFilterPopover from "src/components/popover/StoreFilterPopover";
import Pagination from "src/components/shared/Pagination";
import BookingTableStyled from "src/components/table/BookingTable";
import useBookingColumns from "src/components/table/useBookingColumns";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProvider from "src/hooks/useGetProvider";
import { useGetAllBookingsByPartnerQuery } from "src/redux/query/booking.query";
import { TBookingsFilter } from "src/types/booking.types";
import { dayjs } from "src/utils/utils-date";

const Page = () => {
  const uid = useId();
  const {
    replace,
    query: { storeId },
  } = useRouter();
  const { i18n } = useChangeLocale();
  const {
    token: { colorTextPlaceholder, colorTextSecondary, colorBgBase },
  } = theme.useToken();
  const [form] = Form.useForm();

  const { gSelectedProvider, gTypeProvider } = useGetProvider({});

  const [filterData, setFilterData] = useSafeState<TBookingsFilter>({
    formId: 20,
    orderBy: 1,
    maxResultCount: 10,
  });
  const debouncedFilterData = useDebounce(
    { ...filterData, providerId: gSelectedProvider?.id },
    { wait: 500 },
  );
  const [currentPage, setCurrentPage] = useSafeState(1);
  const [selectedItems, setSelectedItems] = useSafeState<number[]>([]);
  const [selectedUpdateStateItem, setSelectedUpdateStateItem] = useSafeState<number>();
  const [viewMode, setViewMode] = useState<string | number>("list");

  const { data, error } = useGetAllBookingsByPartnerQuery(debouncedFilterData, {
    refetchOnMountOrArgChange: true,
  });
  const bookingsData = data?.result.data || [];
  const bookingListTotal = data?.result.totalRecords;

  const Columns = useBookingColumns({
    onClickUpdateState: (bid) => {
      if (!bid) return;
      setSelectedUpdateStateItem(bid);
    },
  });
  const mappedBookingColumns = useCreation(() => {
    const {
      codeCombined2,
      recipientAddress,
      price2,
      actions,
      description,
      checkIn,
      bookingItemList,
    } = Columns;
    if (gSelectedProvider?.groupType === 2) return [];
    if (gTypeProvider === 3)
      return [
        codeCombined2,
        recipientAddress,
        checkIn,
        { ...description, width: 180 },
        { ...actions, title: <></> },
      ];
    return [
      codeCombined2,
      price2,
      recipientAddress,
      checkIn,
      { ...description, width: 180 },
      { ...actions, title: <></> },
    ];
  }, [gSelectedProvider, gTypeProvider, Columns]);

  const handleSubmitFilter = ({ rangeDate, ...formData }: any) => {
    if (!!rangeDate?.length) {
      const dateFrom = dayjs(rangeDate[0]).toISOString();
      const dateTo = dayjs(rangeDate[1]).toISOString();
      setFilterData({ ...formData, dateFrom, dateTo });
    } else {
      setFilterData(formData);
    }
  };

  useIsomorphicLayoutEffect(() => {
    if (gSelectedProvider?.groupType === 2) {
      replace("/");
    }
  }, [gSelectedProvider?.groupType]);

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
          current={i18n["Tất cả Dịch vụ"]}
        />
      }
    >
      <PageWrapper>
        <Form
          id={uid}
          form={form}
          onFinish={handleSubmitFilter}
          initialValues={{ formId: 20, orderBy: 1 }}
          onValuesChange={(changedValues, values) => {
            const { search, orderBy, formId } = values as any;
            setFilterData({ ...filterData, search, orderBy, formId });
          }}
        >
          <Card
            className="list-wrapper"
            title={
              <Typography.Title level={2} style={{ margin: 0 }}>
                {i18n["Tất cả Dịch vụ"]}
              </Typography.Title>
            }
            tabList={[
              { key: "20", tab: i18n["Tất cả"] },
              { key: "21", tab: i18n["Chờ duyệt"] },
              { key: "22", tab: i18n["Đã duyệt"] },
              { key: "23", tab: i18n["Đã hoàn thành"] },
              { key: "24", tab: i18n["Yêu cầu hủy"] },
              { key: "241", tab: i18n["Hủy - Đã phản hồi"] },
              { key: "242", tab: i18n["Đã hủy"] },
              { key: "25", tab: i18n["Hoàn tiền"] },
              { key: "251", tab: i18n["Yêu cầu hoàn tiền"] },
              { key: "252", tab: i18n["Hoàn tiền - Đã duyệt yêu cầu"] },
              { key: "253", tab: i18n["Đã hoàn tiền"] },
            ]}
            tabProps={{ size: "middle", tabBarGutter: 16 }}
            activeTabKey={!!filterData?.formId ? String(filterData.formId) : "20"}
            onTabChange={(key) => {
              form.setFieldValue("formId", +key);
              setFilterData({ ...filterData, formId: +key });
            }}
          >
            <div className="header-wrapper">
              <div className="filters-wrapper">
                <StoreFilterPopover formId={uid} width={424}>
                  <Form.Item
                    colon={false}
                    label={i18n["Khoảng giá"]}
                    labelCol={{ span: 8 }}
                    labelAlign="left"
                    help=""
                  >
                    <InputPriceRange
                      minFormProps={{ name: "minPrice", placeholder: i18n["Từ"] }}
                      maxFormProps={{ name: "maxPrice", placeholder: i18n["Đến"] }}
                    />
                  </Form.Item>
                  {/* <Form.Item
                      name="tenantId"
                      label="Tenant"
                      labelCol={{ span: 8 }}
                      labelAlign="left"
                    >
                      <TenantIdSelect placeholder={i18n["Chọn khu chung cư, căn hộ"]} />
                    </Form.Item> */}
                  <Form.Item
                    label={i18n["Khoảng ngày"]}
                    labelCol={{ span: 8 }}
                    labelAlign="left"
                    name="rangeDate"
                    help=""
                  >
                    <RangePicker
                      inputReadOnly
                      disabledDate={(current) => current > dayjs()}
                      placeholder={[i18n["Từ"], i18n["Đến"]]}
                    />
                  </Form.Item>
                </StoreFilterPopover>
                <Form.Item name="search" noStyle>
                  <FilterSearchInput placeholder={i18n["Tìm kiếm dịch vụ"]} />
                </Form.Item>
              </div>
              <div className="right-wrapper">
                <Form.Item name="formId" help="" noStyle hidden>
                  <Select
                    listHeight={200}
                    placement="bottomRight"
                    variant="borderless"
                    popupMatchSelectWidth={224}
                    placeholder={i18n["Khác"]}
                    options={[
                      { value: 20, label: i18n["Tất cả"] },
                      { value: 21, label: i18n["Mới - chờ duyệt"] },
                      { value: 22, label: i18n["Đã duyệt"] },
                      { value: 23, label: i18n["Đã hoàn thành"] },
                      { value: 24, label: i18n["Hủy - Chờ duyệt"] },
                      { value: 241, label: i18n["Hủy - Đã phản hồi"] },
                      { value: 242, label: i18n["Đã hủy"] },
                      { value: 25, label: i18n["Hoàn tiền"] },
                      { value: 251, label: i18n["Yêu cầu hoàn tiền"] },
                      { value: 252, label: i18n["Hoàn tiền - Đã duyệt yêu cầu"] },
                      { value: 253, label: i18n["Đã hoàn tiền"] },
                    ]}
                  />
                </Form.Item>
                <Divider type="vertical" style={{ margin: 0 }} />
                <Form.Item name="orderBy" help="" noStyle>
                  <Select
                    allowClear
                    listHeight={200}
                    placement="bottomRight"
                    variant="borderless"
                    popupMatchSelectWidth={200}
                    placeholder={i18n["Sắp xếp"]}
                    options={[
                      { value: 1, label: i18n["Mới nhất"] },
                      { value: 2, label: i18n["Cũ nhất"] },
                      { value: 3, label: i18n["Giá tăng dần"] },
                      { value: 4, label: i18n["Giá giảm dần"] },
                    ]}
                  />
                </Form.Item>
                <Divider type="vertical" style={{ margin: "0 10px 0 0" }} />
                <Segmented
                  value={viewMode}
                  onChange={(v) => {
                    setViewMode(v);
                  }}
                  options={[
                    {
                      value: "list",
                      icon: <MdViewList size={16} />,
                    },
                    {
                      value: "grid",
                      icon: <MdGridView size={16} />,
                    },
                  ]}
                />
              </div>
            </div>
            {bookingsData.length > 0 ? (
              viewMode === "list" ? (
                <BookingTableStyled
                  showSorterTooltip={false}
                  columns={mappedBookingColumns as any[]}
                  dataSource={bookingsData}
                  pagination={false}
                  size="large"
                  rowSelection={{
                    columnWidth: 32,
                    onChange: (selectedRowKeys, selectedRows) => {
                      setSelectedItems(selectedRowKeys as any[]);
                    },
                  }}
                  rowKey={(item: any) => item.id}
                  scroll={{ x: true }}
                />
              ) : (
                <>
                  <Affix offsetTop={0.001}>
                    <div
                      className="list-header"
                      style={{ color: colorTextSecondary, backgroundColor: colorBgBase }}
                    >
                      <div className="div0">
                        <Checkbox
                          indeterminate={
                            selectedItems.length > 0 && selectedItems.length < bookingsData.length
                          }
                          checked={
                            selectedItems.length > 0 && selectedItems.length === bookingsData.length
                          }
                          onChange={(e) => {
                            setSelectedItems(
                              e.target.checked ? bookingsData.map(({ id }) => id) : [],
                            );
                          }}
                        />
                      </div>
                      <div className="div1">{i18n["Dịch vụ"]}</div>
                    </div>
                  </Affix>
                  <Checkbox.Group
                    className="list-container grid"
                    value={selectedItems}
                    onChange={(values) => {
                      setSelectedItems(values as number[]);
                    }}
                  >
                    {bookingsData.map((item, index) => (
                      <BookingCard
                        key={uid + index}
                        checked={selectedItems.includes(item.id)}
                        onClickUpdateAddress={(id) => {}}
                        onClickUpdateState={(id) => {
                          setSelectedUpdateStateItem(item.id);
                        }}
                        {...item}
                      />
                    ))}
                  </Checkbox.Group>
                </>
              )
            ) : (
              <Empty
                className="list-empty"
                imageStyle={{ height: 144 }}
                description={
                  <Typography.Text ellipsis type="secondary">
                    {!debouncedFilterData.providerId
                      ? i18n["Hãy chọn gian hàng trước"]
                      : i18n["Không tìm thấy dịch vụ phù hợp"]}
                  </Typography.Text>
                }
              />
            )}
            <Affix offsetBottom={0.001}>
              <div className="footer" style={{ backgroundColor: colorBgBase }}>
                <div className="selected-wrapper">
                  {i18n["Đã chọn"]} <span>{selectedItems.length}</span>{" "}
                  {i18n["Dịch vụ"].toLowerCase()}
                </div>
                {!!bookingListTotal && (
                  <Pagination
                    showSizeChanger
                    total={bookingListTotal}
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
        {!!selectedUpdateStateItem && (
          <UpdateBookingState
            id={selectedUpdateStateItem}
            open={!!selectedUpdateStateItem}
            onClose={() => setSelectedUpdateStateItem(undefined)}
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
      & > * {
        margin-left: var(--f-gap-x);
        margin-bottom: var(--f-gap-y);
        width: calc((100% / var(--f-columns) - var(--f-gap-x)));
      }
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

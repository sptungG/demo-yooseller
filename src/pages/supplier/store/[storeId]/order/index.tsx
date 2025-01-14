import SortBySelect from "@/components/field/SortBySelect";
import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/query";
import { useCreation, useDebounce } from "ahooks";
import { Affix, Divider, Empty, Flex, Form, Select, Typography, theme } from "antd";
import { parseAsInteger, useQueryState, useQueryStates } from "next-usequerystate";
import { useRouter } from "next/router";
import { useId, useState } from "react";
import { MdOutlineStore } from "react-icons/md";
import Avatar from "src/components/avatar/Avatar";
import Card from "src/components/card/Card";
import FilterSearchInput from "src/components/field/FilterSearchInput";
import InputPriceRange from "src/components/field/InputPriceRange";
import UpdateOrderState from "src/components/field/UpdateOrderState";
import withAuth from "src/components/hoc/withAuth";
import BreadcrumbHeader from "src/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "src/components/layout/SiderHeaderLayout";
import StyledPage, {
  cssFilterWrapper,
  cssFooterWrapper,
  cssListWrapper,
} from "src/components/layout/StyledPage";
import StoreFilterPopover from "src/components/popover/StoreFilterPopover";
import Pagination from "src/components/shared/Pagination";
import OrderTableStyled from "src/components/table/OrderTable";
import useOrderColumns from "src/components/table/useOrderColumns";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProvider from "src/hooks/useGetProvider";
import { useGetAllOrdersByPartnerQuery, useGetOrderByIdQuery } from "src/redux/query/order.query";
import { TOrder } from "src/types/order.types";

const defaultFilter = {
  providerId: parseAsInteger,
  formId: parseAsInteger.withDefault(20),
  orderBy: parseAsInteger.withDefault(1),
  skipCount: parseAsInteger,
  maxResultCount: parseAsInteger.withDefault(10),
  sortBy: parseAsInteger.withDefault(2),
};

const Page = () => {
  const uid = useId();
  const {
    replace,
    query: { storeId },
  } = useRouter();
  const { i18n, locale } = useChangeLocale();
  const { message } = useApp();
  const [form] = Form.useForm();
  const {
    token: { colorTextPlaceholder, colorTextSecondary, colorBgBase },
  } = theme.useToken();

  const { gSelectedProvider } = useGetProvider({});
  const [filterData, setFilterData] = useQueryStates(defaultFilter);
  const [internalFilterData, setInternalFilterData] = useState({ keyword: "" });
  const [orderId, setOrderId] = useQueryState("sid", parseAsInteger);
  const { data: dataRes } = useGetOrderByIdQuery(
    { id: orderId as number },
    { refetchOnMountOrArgChange: true },
  );
  const item = dataRes?.data;
  const debouncedFilterData = useDebounce(internalFilterData, { wait: 500 });
  const { data, isFetching, error } = useGetAllOrdersByPartnerQuery(
    gSelectedProvider?.id
      ? { ...debouncedFilterData, ...filterData, providerId: gSelectedProvider?.id }
      : skipToken,
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const orderListData = data?.data || [];
  const orderListTotal = data?.totalRecords || 0;
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [selectedOrderState, setSelectedOrderState] =
    useState<
      Pick<
        TOrder,
        | "id"
        | "orderCode"
        | "trackingInfo"
        | "state"
        | "paymentMethod"
        | "orderItemList"
        | "totalPrice"
        | "recipientAddress"
        | "description"
      >
    >();

  const Columns = useOrderColumns({
    onClickUpdateState: (foundOrder) => {
      if (!foundOrder) return;
      setSelectedOrderState({
        id: foundOrder.id,
        orderCode: foundOrder.orderCode,
        state: foundOrder.state,
        trackingInfo: foundOrder.trackingInfo,
        paymentMethod: foundOrder.paymentMethod,
        orderItemList: foundOrder.orderItemList,
        totalPrice: foundOrder.totalPrice,
        recipientAddress: foundOrder.recipientAddress,
        description: foundOrder.description,
      });
    },
  });
  const mappedOrderColumns = useCreation(() => {
    const { codeCombined2, orderItemList, recipientAddress, trackingInfo, price2, actions } =
      Columns;
    if (gSelectedProvider?.groupType === 2)
      return [
        { ...codeCombined2, ellipsis: true },
        { ...price2, title: <></> },
        recipientAddress,
        { ...orderItemList, align: "right" },
        trackingInfo,
        { ...actions, title: <></>, fixed: "right" },
      ];
    return [];
  }, [gSelectedProvider, Columns]);

  const handleSubmitFilter = ({ keyword, ...formData }: any) => {
    setInternalFilterData({ keyword });
    setFilterData({
      ...formData,
      providerId: gSelectedProvider?.id,
      isItemBooking: gSelectedProvider?.groupType !== 2,
    });
  };

  // useIsomorphicLayoutEffect(() => {
  //   if (gSelectedProvider?.groupType !== 2) {
  //     replace("/");
  //   }
  // }, [gSelectedProvider?.groupType]);

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
          current={i18n["Tất cả đơn hàng"]}
        />
      }
    >
      <PageWrapper>
        <Form
          id={uid}
          form={form}
          onFinish={handleSubmitFilter}
          initialValues={{ formId: 20, orderBy: 1, sortBy: 2, keyword: "" }}
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
                {i18n["Tất cả đơn hàng"]}
              </Typography.Title>
            }
            extra={<></>}
            tabList={[
              { key: "20", tab: i18n["Tất cả"] },
              { key: "21", tab: i18n["Chờ duyệt"] },
              { key: "22", tab: i18n["Chờ giao hàng"] },
              { key: "23", tab: i18n["Đang giao hàng"] },
              { key: "24", tab: i18n["Đã hoàn thành"] },
              { key: "25", tab: i18n["Hủy"] },
              { key: "26", tab: i18n["Hoàn đơn"] },
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
                  </Form.Item> */}
                </StoreFilterPopover>
                <Form.Item name="keyword" noStyle>
                  <FilterSearchInput placeholder={i18n["Tìm kiếm đơn hàng"]} />
                </Form.Item>
              </div>
              <Flex className="right-wrapper" align="center" justify="flex-end">
                <Divider type="vertical" style={{ margin: 0 }} />
                <Form.Item name="orderBy" help="" noStyle>
                  <Select
                    listHeight={200}
                    placement="bottomRight"
                    variant="borderless"
                    popupMatchSelectWidth={200}
                    placeholder={i18n["Sắp xếp"]}
                    options={[
                      { value: 1, label: i18n["Thời gian tạo"] },
                      { value: 2, label: i18n["Tổng giá"] },
                    ]}
                  />
                </Form.Item>
                <Form.Item name="sortBy" help="" noStyle>
                  <SortBySelect style={{ marginLeft: -6 }} />
                </Form.Item>
              </Flex>
            </div>
            {orderListData.length > 0 && !!mappedOrderColumns.length ? (
              <OrderTableStyled
                loading={isFetching}
                showSorterTooltip={false}
                columns={mappedOrderColumns as any[]}
                dataSource={orderListData}
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
              <Empty
                className="list-empty"
                imageStyle={{ height: 144 }}
                description={
                  <Typography.Text ellipsis type="secondary">
                    {!gSelectedProvider?.id
                      ? i18n["Hãy chọn gian hàng trước"]
                      : i18n["Không tìm thấy đơn hàng phù hợp"]}
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
                {!!orderListTotal && (
                  <Pagination
                    showSizeChanger
                    total={orderListTotal}
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
        {!!selectedOrderState && (
          <UpdateOrderState
            open={!!selectedOrderState}
            item={selectedOrderState}
            onClose={() => {
              setSelectedOrderState(undefined);
            }}
          />
        )}
        {!!orderId && item && (
          <UpdateOrderState
            //open={!!selectedOrderState}
            open={!!orderId}
            // item={selectedOrderState}
            item={{
              id: item.id,
              orderCode: item.orderCode,
              state: item.state,
              trackingInfo: item.trackingInfo,
              paymentMethod: item.paymentMethod,
              orderItemList: item.orderItemList,
              totalPrice: item.totalPrice,
              recipientAddress: item.recipientAddress,
              description: item.description,
            }}
            onClose={() => {
              //setSelectedOrderState(undefined);
              setOrderId(null);
            }}
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

import SortBySelect from "@/components/field/SortBySelect";
import { EcofarmSvg } from "@/components/icons";
import { formatNumber } from "@/utils/utils";
import styled from "@emotion/styled";
import { useCreation, useDebounce } from "ahooks";
import { Affix, Divider, Empty, Flex, Form, Select, Slider, Typography, theme } from "antd";
import { parseAsInteger, parseAsString, useQueryState, useQueryStates } from "next-usequerystate";
import { useRouter } from "next/router";
import { useId, useState } from "react";
import Avatar from "src/components/avatar/Avatar";
import Card from "src/components/card/Card";
import FilterSearchInput from "src/components/field/FilterSearchInput";
import UpdateOrderStateFarm from "src/components/field/UpdateOrderStateFarm";
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
import OrderTableStyled from "src/components/table/OrderTable";
import useOrderFarmColumns from "src/components/table/useOrderFarmColumns";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProviderFarm from "src/hooks/useGetProviderFarm";
import {
  useGetOrdersEcofarmByIdEcoFarmQuery,
  useGetOrdersListByPartnerEcoFarmQuery,
} from "src/redux/query/farm.query";
import { TEOrderFormIdPartner, TOrdersDetail } from "src/types/farm.types";
import { dayjs } from "src/utils/utils-date";

const Page = () => {
  const uid = useId();
  const {
    query: { farmId },
  } = useRouter();
  const { i18n } = useChangeLocale();
  const [form] = Form.useForm();
  const {
    token: { colorBgBase },
  } = theme.useToken();

  const { gSelectedProvider } = useGetProviderFarm();
  const defaultFilter = {
    providerId: parseAsInteger,
    formId: parseAsInteger.withDefault(20),
    orderBy: parseAsInteger.withDefault(1),
    skipCount: parseAsInteger,
    maxResultCount: parseAsInteger.withDefault(10),
    sortBy: parseAsInteger.withDefault(1),
    minPrice: parseAsInteger,
    maxPrice: parseAsInteger,
    keyword: parseAsString,
  };
  const [filterData, setFilterData] = useQueryStates(defaultFilter);
  const debouncedFilterData = useDebounce(
    { ...filterData, providerId: gSelectedProvider?.id },
    { wait: 500 },
  );
  const { data } = useGetOrdersListByPartnerEcoFarmQuery(debouncedFilterData, {
    refetchOnMountOrArgChange: true,
    skip: !debouncedFilterData?.providerId,
  });
  const orderListData = data?.data || [];
  const orderListTotal = data?.totalRecords || 0;
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [orderId, setOrderId] = useQueryState("sid", parseAsInteger);
  const { data: dataRes } = useGetOrdersEcofarmByIdEcoFarmQuery(
    { id: orderId as number },
    { refetchOnMountOrArgChange: true },
  );
  const item = dataRes?.data;
  const [selectedOrderState, setSelectedOrderState] =
    useState<
      Pick<
        TOrdersDetail,
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

  const Columns = useOrderFarmColumns({
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
    return [
      codeCombined2,
      { ...price2, title: <></> },
      recipientAddress,
      { ...orderItemList, align: "right" },
      trackingInfo,
      { ...actions, title: <></> },
    ];
  }, [gSelectedProvider, Columns]);

  const handleSubmitFilter = ({ rangeDate, ...formData }: any) => {
    if (!!rangeDate?.length) {
      const dateFrom = dayjs(rangeDate[0]).toISOString();
      const dateTo = dayjs(rangeDate[1]).toISOString();
      setFilterData({ ...formData, dateFrom, dateTo });
    } else {
      setFilterData(formData);
    }
  };

  return (
    <SiderHeaderLayout
      headerLeft={
        <BreadcrumbHeader
          items={[
            { "/supplier/farm": <EcofarmSvg width={26} /> },
            {
              [`/supplier/farm/${farmId}`]: (
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
          initialValues={filterData}
          onValuesChange={(changedValues, values) => {
            const { keyword, orderBy, formId, sortBy } = values as any;
            setFilterData({ ...filterData, keyword, orderBy, formId, sortBy });
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
              { key: TEOrderFormIdPartner.PARTNER_ALL.toString(), tab: i18n["Tất cả"] },
              { key: TEOrderFormIdPartner.PARTNER_TO_PAY.toString(), tab: i18n["Chờ duyệt"] },
              { key: TEOrderFormIdPartner.PARTNER_TO_SHIP.toString(), tab: i18n["Chờ lấy hàng"] },
              {
                key: TEOrderFormIdPartner.PARTNER_SHIPPING.toString(),
                tab: i18n["Đang giao hàng"],
              },
              {
                key: TEOrderFormIdPartner.PARTNER_COMPLETED.toString(),
                tab: i18n["Đã hoàn thành"],
              },
              { key: TEOrderFormIdPartner.PARTNER_CANCELLATION.toString(), tab: i18n["Hủy"] },
              { key: TEOrderFormIdPartner.PARTNER_RETURN_REFUND.toString(), tab: i18n["Hoàn đơn"] },
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
                  >
                    <Slider
                      onChange={(value) => {
                        setFilterData({
                          ...filterData,
                          minPrice: value[0] * 1000000,
                          maxPrice: value[1] * 1000000,
                        });
                        form.setFieldValue("minPrice", value[0] * 1000000);
                        form.setFieldValue("maxPrice", value[1] * 1000000);
                      }}
                      range
                      defaultValue={[0, 100]}
                      max={100}
                      min={0}
                    />
                    <Form.Item name="minPrice" help="" noStyle hidden={true}></Form.Item>
                    <Form.Item name="maxPrice" help="" noStyle hidden={true}></Form.Item>
                    <div style={{ textAlign: "center" }}>
                      Từ <b>{formatNumber(filterData.minPrice || 0)}</b> {" đến "}
                      <b>{formatNumber(filterData.maxPrice || 0)}</b> (vnđ)
                    </div>
                  </Form.Item>
                  {/* <Form.Item
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
                <Form.Item name="keyword" noStyle>
                  <FilterSearchInput placeholder={i18n["Tìm kiếm đơn hàng"]} />
                </Form.Item>
              </div>
              <Flex className="right-wrapper" align="center" justify="flex-end">
                <Form.Item name="formId" help="" noStyle hidden>
                  <Select
                    listHeight={200}
                    placement="bottomRight"
                    variant="borderless"
                    popupMatchSelectWidth={224}
                    placeholder={i18n["Khác"]}
                    options={[
                      // { value: 20, label: i18n["Tất cả"] },
                      // { value: 21, label: i18n["Đợi duyệt"] },
                      // { value: 22, label: i18n["Đợi giao hàng"] },
                      // { value: 221, label: i18n["Đang giao hàng"] },
                      // { value: 222, label: i18n["Đã giao hàng"] },
                      // { value: 23, label: i18n["Đang giao hàng"] },
                      // { value: 24, label: i18n["Đã hoàn thành"] },
                      // { value: 25, label: i18n["Hủy"] },
                      // { value: 251, label: i18n["Yêu cầu hủy"] },
                      // { value: 252, label: i18n["Đã hủy"] },
                      // { value: 26, label: i18n["Hoàn đơn"] },
                      // { value: 261, label: i18n["Yêu cầu hoàn đơn"] },
                      // { value: 262, label: i18n["Hoàn đơn"] },
                      // { value: 263, label: i18n["Đã duyệt hoàn đơn"] },
                      // { value: 264, label: i18n["Đã hoàn đơn"] },
                      { value: TEOrderFormIdPartner.PARTNER_ALL.toString(), label: i18n["Tất cả"] },
                      {
                        value: TEOrderFormIdPartner.PARTNER_TO_PAY.toString(),
                        label: i18n["Chờ duyệt"],
                      },
                      {
                        value: TEOrderFormIdPartner.PARTNER_TO_SHIP.toString(),
                        label: i18n["Chờ giao hàng"],
                      },
                      {
                        value: TEOrderFormIdPartner.PARTNER_SHIPPING.toString(),
                        label: i18n["Đang giao hàng"],
                      },
                      {
                        value: TEOrderFormIdPartner.PARTNER_COMPLETED.toString(),
                        label: i18n["Đã hoàn thành"],
                      },
                      {
                        value: TEOrderFormIdPartner.PARTNER_CANCELLATION.toString(),
                        label: i18n["Hủy"],
                      },
                      {
                        value: TEOrderFormIdPartner.PARTNER_RETURN_REFUND.toString(),
                        label: i18n["Hoàn đơn"],
                      },
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
                      { value: 1, label: i18n["Ngày tạo"] },
                      { value: 2, label: i18n["Giá đơn hàng"] },
                    ]}
                  />
                </Form.Item>
                <Divider type="vertical" style={{ margin: "0 10px 0 0" }} />
                <Form.Item name="sortBy" help="" noStyle>
                  <SortBySelect style={{ marginLeft: -6 }} />
                </Form.Item>
              </Flex>
            </div>
            {orderListData.length > 0 && !!mappedOrderColumns.length ? (
              <OrderTableStyled
                showSorterTooltip={false}
                columns={mappedOrderColumns as any[]}
                dataSource={orderListData}
                pagination={false}
                size="large"
                rowSelection={{
                  columnWidth: 32,
                  onChange: (selectedRowKeys) => {
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
                    {!debouncedFilterData.providerId
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
                      `${i18n["Hiển thị"]} ${1} - ${range[1]} ${i18n["trong"]} ${total}`
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
          <UpdateOrderStateFarm
            open={!!selectedOrderState}
            item={selectedOrderState}
            onClose={() => {
              setSelectedOrderState(undefined);
            }}
          />
        )}
        {!!orderId && item && (
          <UpdateOrderStateFarm
            open={!!orderId}
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

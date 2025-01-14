import SortBySelect from "@/components/field/SortBySelect";
import { EcofarmSvg } from "@/components/icons";
import { formatNumber, vietnameseSlug } from "@/utils/utils";
import styled from "@emotion/styled";
import { useDebounce } from "ahooks";
import { Affix, Divider, Empty, Flex, Form, Select, Slider, Typography, theme } from "antd";
import { parseAsInteger, parseAsString, useQueryState, useQueryStates } from "next-usequerystate";
import { useRouter } from "next/router";
import { useId, useState } from "react";
import Avatar from "src/components/avatar/Avatar";
import Card from "src/components/card/Card";
import FilterSearchInput from "src/components/field/FilterSearchInput";
import UpdateRegisterStateFarm from "src/components/field/UpdateRegisterStateFarm";
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

import useRegisterPackageFarmColumns from "src/components/table/useRegisterPackageFarmColumns";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProviderFarm from "src/hooks/useGetProviderFarm";
import {
  useGetListEcofarmPackageByPartnerQuery,
  useGetListEcofarmRegisterByPartnerQuery,
} from "src/redux/query/farm.query";
import { TPackageFilter, TRegisterStatus } from "src/types/farm.types";
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
    formId: parseAsInteger.withDefault(0),
    orderBy: parseAsInteger.withDefault(1),
    skipCount: parseAsInteger,
    maxResultCount: parseAsInteger.withDefault(10),
    sortBy: parseAsInteger.withDefault(1),
    minPrice: parseAsInteger,
    maxPrice: parseAsInteger,
    ecofarmType: parseAsInteger,
    keyword: parseAsString,
  };
  const [filterData, setFilterData] = useQueryStates(defaultFilter);
  const debouncedFilterData = useDebounce(
    { ...filterData, providerId: gSelectedProvider?.id },
    { wait: 500 },
  );
  const { data } = useGetListEcofarmRegisterByPartnerQuery(debouncedFilterData, {
    refetchOnMountOrArgChange: true,
    skip: !debouncedFilterData?.providerId,
  });
  const orderListData = data?.data || [];
  const orderListTotal = data?.totalRecords || 0;
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [registerId, setregisterId] = useQueryState("sid", parseAsInteger);
  const [filterDataPackage] = useState<TPackageFilter>({});
  const debouncedFilterPackageData = useDebounce(
    {
      ...filterDataPackage,
      maxResultCount: 1000,
      providerId: gSelectedProvider?.id,
    },
    { wait: 500 },
  );
  const { data: resPackage } = useGetListEcofarmPackageByPartnerQuery(debouncedFilterPackageData, {
    refetchOnMountOrArgChange: true,
    skip: !debouncedFilterPackageData?.providerId,
  });
  const dataPackage = resPackage?.data || [];
  const { nameCombined, ecofarmPackage, actionsStatus, ecofarmType, totalPrice } =
    useRegisterPackageFarmColumns({
      onClickUpdateStatus: (id) => {
        if (!id) return;
        setregisterId(id);
      },
    });
  const mappedOrderColumns = [
    ecofarmPackage,
    nameCombined,
    { ...ecofarmType, width: 160, align: "right" },
    { ...totalPrice, width: 160, align: "right" },
    { ...actionsStatus, width: 220, align: "right", fixed: "right" },
  ];

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
          current={i18n["Tất cả đăng ký gói"]}
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
            const { keyword, orderBy, formId, sortBy, ecofarmType } = values as any;
            setFilterData({ ...filterData, keyword, orderBy, formId, sortBy, ecofarmType });
          }}
        >
          <Card
            className="list-wrapper"
            title={
              <Typography.Title level={2} className="title" style={{ margin: 0 }}>
                {i18n["Tất cả đăng ký gói"]}
              </Typography.Title>
            }
            extra={<></>}
            tabList={[
              { key: "", tab: i18n["Tất cả"] },
              { key: TRegisterStatus.PENDING_APPROVAL.toString(), tab: i18n["Chờ duyệt"] },
              { key: TRegisterStatus.INVESTING.toString(), tab: i18n["Đang đầu tư"] },
              { key: TRegisterStatus.COMPLETED.toString(), tab: i18n["Hoàn thành"] },
              { key: TRegisterStatus.CANCELLED.toString(), tab: i18n["Đã hủy"] },
            ]}
            tabProps={{ size: "middle", tabBarGutter: 16 }}
            activeTabKey={!!filterData?.formId ? String(filterData.formId) : ""}
            onTabChange={(key) => {
              form.setFieldValue("formId", +key);
              setFilterData({ ...filterData, formId: +key });
            }}
          >
            <div className="header-wrapper">
              <div className="filters-wrapper">
                <StoreFilterPopover formId={uid} width={424}>
                  <Form.Item label={i18n["Gói dịch vụ farming"]} name="ecofarmPackageId">
                    <Select
                      allowClear
                      options={dataPackage?.map((item: any) => ({
                        value: item.id,
                        label: item.name,
                      }))}
                      placeholder={i18n["Chọn"]}
                      showSearch
                      filterOption={(input, option) =>
                        vietnameseSlug(String(option?.label || ""), " ").indexOf(
                          vietnameseSlug(input, " "),
                        ) >= 0
                      }
                      onClear={() => {
                        form.setFieldValue("ecofarmPackageId", undefined);
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    labelCol={{ span: 8 }}
                    labelAlign="left"
                    colon={false}
                    help=""
                    label={i18n["Hình thức mua"]}
                    name="ecofarmType"
                  >
                    <Select
                      //style={{ width: 265 }}
                      allowClear
                      options={[
                        {
                          value: 1,
                          label: i18n["Combo gói"],
                        },
                        {
                          value: 2,
                          label: i18n["Theo suất"],
                        },
                      ]}
                      placeholder={i18n["Chọn"]}
                      showSearch
                      filterOption={(input, option) =>
                        vietnameseSlug(String(option?.label || ""), " ").indexOf(
                          vietnameseSlug(input, " "),
                        ) >= 0
                      }
                      onClear={() => {
                        form.setFieldValue("ecofarmType", undefined);
                      }}
                    />
                  </Form.Item>
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
                  <FilterSearchInput placeholder={i18n["Tìm kiếm gói đăng ký"]} />
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
                      { value: "", label: i18n["Tất cả"] },
                      { value: TRegisterStatus.PENDING_APPROVAL, label: i18n["Chờ duyệt"] },
                      { value: TRegisterStatus.INVESTING, label: i18n["Đang đầu tư"] },
                      { value: TRegisterStatus.COMPLETED, label: i18n["Hoàn thành"] },
                      { value: TRegisterStatus.CANCELLED, label: i18n["Đã hủy"] },
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
                      { value: 2, label: i18n["Giá tiền"] },
                    ]}
                  />
                </Form.Item>
                <Divider type="vertical" style={{ margin: 0 }} />
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
                      : i18n["Không tìm thấy người đăng ký phù hợp"]}
                  </Typography.Text>
                }
              />
            )}
            <Affix offsetBottom={0.001}>
              <div className="footer" style={{ backgroundColor: colorBgBase }}>
                <div className="selected-wrapper">
                  {i18n["Đã chọn"]} <span>{selectedItems.length}</span>
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
        {!!registerId && (
          <UpdateRegisterStateFarm
            open={!!registerId}
            id={registerId}
            onClose={() => {
              setregisterId(null);
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

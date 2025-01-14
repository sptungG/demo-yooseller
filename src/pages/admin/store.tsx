import styled from "@emotion/styled";
import { useCreation, useDebounce } from "ahooks";
import { Affix, Divider, Empty, Form, Rate, Select, Typography, theme } from "antd";
import { useId, useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import Button from "src/components/button/Button";
import Card from "src/components/card/Card";
import FilterSearchInput from "src/components/field/FilterSearchInput";
import GroupTypeCombinedSelect from "src/components/field/GroupTypeCombinedSelect";
import withAdmin from "src/components/hoc/withAdmin";
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
import StoreTableStyled from "src/components/table/StoreTable";
import useStoreColumns from "src/components/table/useStoreColumns";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useGetAllProvidersByAdminQuery } from "src/redux/query/admin.query";
import { TProvidersFilter } from "src/types/provider.types";
import { dayjs } from "src/utils/utils-date";

const Page = () => {
  const [form] = Form.useForm();
  const uid = useId();
  const {
    token: { colorTextPlaceholder, colorTextSecondary, colorBgBase },
  } = theme.useToken();
  const { message } = useApp();
  const { i18n } = useChangeLocale();

  const [filterData, setFilterData] = useState<TProvidersFilter>({
    formId: 10,
    maxResultCount: 10,
    orderBy: 5,
  });
  const debouncedFilterData = useDebounce(filterData, { wait: 500 });
  const { data } = useGetAllProvidersByAdminQuery(debouncedFilterData, {
    refetchOnMountOrArgChange: true,
  });
  const storeList = data?.data || [];
  const storeListTotal = data?.totalRecords;

  const Columns = useStoreColumns({});
  const mappedStoreColumns = useCreation(() => {
    const { nameCombined4, type, others, adminActionsState } = Columns;
    return [
      { ...nameCombined4, width: 400 },
      { ...type, align: "left" },
      others,
      adminActionsState,
    ];
  }, [Columns]);

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
      hideSider
      hideProviderSelect
      headerLeft={<BreadcrumbHeader current={i18n["Tất cả cửa hàng"]} />}
    >
      <PageWrapper>
        <Form
          id={uid}
          form={form}
          onFinish={handleSubmitFilter}
          initialValues={{ formId: 20, orderBy: 5 }}
          onValuesChange={(changedValues, values) => {
            const { keyword, orderBy, formId } = changedValues as any;
            if (changedValues.hasOwnProperty("keyword")) setFilterData({ ...filterData, keyword });
            if (changedValues.hasOwnProperty("formId")) setFilterData({ ...filterData, formId });
            if (changedValues.hasOwnProperty("orderBy")) setFilterData({ ...filterData, orderBy });
          }}
        >
          <Card
            className={"list-wrapper"}
            title={
              <Typography.Title level={2} style={{ margin: 0 }}>
                {i18n["Tất cả cửa hàng"]}
              </Typography.Title>
            }
            extra={
              <Button type="primary" icon={<BsPlusLg />} href="/supplier/store/create">
                {i18n["Tạo cửa hàng"]}
              </Button>
            }
            tabList={[
              { key: "10", tab: i18n["Tất cả"] },
              { key: "11", tab: i18n["Chờ duyệt"] },
              { key: "12", tab: i18n["Đang hoạt động"] },
              { key: "13", tab: i18n["Ngừng kinh doanh"] },
              { key: "14", tab: i18n["Đã ẩn"] },
              { key: "15", tab: i18n["Đã chặn"] },
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
                <StoreFilterPopover formId={uid} width={460}>
                  <Form.Item
                    name="minRatePoint"
                    label={i18n["Đánh giá"]}
                    labelCol={{ span: 8 }}
                    labelAlign="left"
                  >
                    <Rate />
                  </Form.Item>

                  <GroupTypeCombinedSelect
                    groupTypeFormProps={{
                      rules: [{ type: "number" }],
                      labelCol: { span: 8 },
                      labelAlign: "left",
                      help: "",
                    }}
                    typeFormProps={{
                      rules: [{ type: "number" }],
                      labelCol: { span: 8 },
                      labelAlign: "left",
                      help: "",
                    }}
                  />

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
                      style={{ width: "100%" }}
                      inputReadOnly
                      disabledDate={(current) => current > dayjs()}
                      placeholder={[i18n["Từ"], i18n["Đến"]]}
                    />
                  </Form.Item>
                </StoreFilterPopover>
                <Form.Item noStyle name="keyword">
                  <FilterSearchInput placeholder={i18n["Tìm kiếm cửa hàng"]} />
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
                      { value: 21, label: i18n["Đang hoạt động"] },
                      { value: 22, label: i18n["Hết hàng"] },
                      { value: 23, label: i18n["Chờ duyệt"] },
                      { value: 24, label: i18n["Vi phạm"] },
                      { value: 25, label: i18n["Đã ẩn"] },
                    ]}
                  />
                </Form.Item>
                <Divider type="vertical" style={{ margin: 0 }} />
                <Form.Item name="orderBy" help="" noStyle>
                  <Select
                    allowClear
                    placement="bottomRight"
                    variant="borderless"
                    popupMatchSelectWidth={224}
                    placeholder={i18n["Sắp xếp"]}
                    options={[
                      { value: 1, label: i18n["Khoảng cách tăng dần"] },
                      { value: 2, label: i18n["Khoảng cách giảm dần"] },
                      { value: 3, label: i18n["Đánh giá tăng dần (1 → 5)"] },
                      { value: 4, label: i18n["Đánh giá giảm dần (5 → 1)"] },
                      { value: 5, label: i18n["Ngày tạo mới nhất"] },
                      { value: 6, label: i18n["Ngày tạo cũ nhất"] },
                    ]}
                  />
                </Form.Item>
              </div>
            </div>
            {storeList.length > 0 ? (
              <StoreTableStyled
                showSorterTooltip={false}
                columns={mappedStoreColumns as any[]}
                dataSource={storeList}
                pagination={false}
                size="large"
                rowKey={(item: any) => item.id}
                scroll={{ x: true }}
              />
            ) : (
              <Empty
                className="list-empty"
                imageStyle={{ height: 144 }}
                description={
                  <Typography.Text ellipsis type="secondary">
                    {i18n["Không tìm thấy cửa hàng phù hợp"]}
                  </Typography.Text>
                }
              />
            )}
            <Affix offsetBottom={0.001}>
              <div className="footer" style={{ backgroundColor: colorBgBase }}>
                {!!storeListTotal && (
                  <Pagination
                    showSizeChanger
                    total={storeListTotal}
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
      </PageWrapper>
    </SiderHeaderLayout>
  );
};

const PageWrapper = styled(StyledPage)`
  padding: 12px 12px;
  margin: 0 auto;
  max-width: 1440px;
  width: 100%;
  .list-wrapper {
    ${cssListWrapper}
    .filters-wrapper {
      ${cssFilterWrapper}
    }
    .list-header {
      display: flex;
      align-items: center;
      padding: 16px 16px 0 16px;
      .div1 {
        flex: 0 0 416px;
      }
      & > div:not(:first-of-type) {
        padding: 0 16px;
      }
      .div3 {
        margin-left: auto;
      }
      .div4 {
        flex: 0 0 148px;
      }
    }
    .footer {
      ${cssFooterWrapper}
      padding: 16px;
      border: none;
      .ant-pagination {
        margin-left: auto;
      }
    }
  }

  .list.list-wrapper {
    .list-container > div:not(:last-of-type) {
      border-bottom: 1px solid rgba(5, 5, 5, 0.06);
    }
  }
  .grid.list-wrapper {
    .list-container {
      --f-columns: 4;
      --f-gap-x: 12px;
      --f-gap-y: 12px;
      padding: 0 16px 16px;
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
  }
`;

export default withAdmin(Page);

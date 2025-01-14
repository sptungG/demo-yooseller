import SortBySelect from "@/components/field/SortBySelect";
import { EcofarmSvg } from "@/components/icons";
import { formatNumber, vietnameseSlug } from "@/utils/utils";
import styled from "@emotion/styled";
import { useCreation, useDebounce } from "ahooks";
import {
  Affix,
  Divider,
  Empty,
  Flex,
  Form,
  Modal,
  Rate,
  Select,
  Slider,
  Typography,
  theme,
} from "antd";
import { parseAsInteger, parseAsString, useQueryStates } from "next-usequerystate";
import { useRouter } from "next/router";
import { useId, useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { MdOutlineFileDownload } from "react-icons/md";
import Avatar from "src/components/avatar/Avatar";
import Button from "src/components/button/Button";
import Card from "src/components/card/Card";
import { CategorySelectDrawerFarm } from "src/components/field/CategorySelectDrawer";
import FilterSearchInput from "src/components/field/FilterSearchInput";
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
import ItemTableStyled from "src/components/table/ItemTable";
import useItemsFarmColumns from "src/components/table/useItemsFarmColumns";

import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProviderFarm from "src/hooks/useGetProviderFarm";
import {
  useGetAllItemsByPartnerForEcoFarmQuery,
  useGetListEcofarmPackageByPartnerQuery,
} from "src/redux/query/farm.query";
import { TItemStatus, TPackageFilter } from "src/types/farm.types";

const Page = () => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [form] = Form.useForm();
  const {
    token: { colorBgBase },
  } = theme.useToken();
  const {
    query: { farmId },
  } = useRouter();
  const { gSelectedProvider } = useGetProviderFarm();
  const defaultFilter = {
    providerId: parseAsInteger,
    formId: parseAsInteger.withDefault(10),
    orderBy: parseAsInteger.withDefault(1),
    skipCount: parseAsInteger,
    maxResultCount: parseAsInteger.withDefault(10),
    sortBy: parseAsInteger.withDefault(1),
    minPrice: parseAsInteger.withDefault(0),
    maxPrice: parseAsInteger.withDefault(100000000),
    keyword: parseAsString,
    categoryId: parseAsInteger,
    ecofarmPackageId: parseAsInteger,
  };
  const [filterData, setFilterData] = useQueryStates(defaultFilter);
  const debouncedFilterData = useDebounce(
    {
      ...filterData,
      providerId: gSelectedProvider?.id,
    },
    { wait: 500 },
  );
  const { data } = useGetAllItemsByPartnerForEcoFarmQuery(debouncedFilterData, {
    refetchOnMountOrArgChange: true,
    skip: !debouncedFilterData?.providerId,
  });
  const itemListData = data?.data || [];
  const itemListTotal = data?.totalRecords;

  const Columns = useItemsFarmColumns();
  const mappedColumns = useCreation(() => {
    const { nameCombined, actionsStatus, ratePoint, sku, sales, stock } = Columns;
    return [{ ...nameCombined, sorter: undefined }, ratePoint, sku, sales, stock, actionsStatus];
  }, [gSelectedProvider, Columns]);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
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
  const handleSubmitFilter = (formData: any) => {
    setFilterData(formData);
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
          current={i18n["Tất cả sản phẩm"]}
        />
      }
    >
      <PageWrapper>
        <Form
          className="form-wrapper"
          id={uid}
          form={form}
          onFinish={handleSubmitFilter}
          initialValues={filterData}
          onValuesChange={(changedValues, values) => {
            const {
              keyword,
              orderBy,
              categoryId,
              formId,
              sortBy,
              minPrice,
              maxPrice,
              ecofarmPackageId,
            } = values as any;
            setFilterData({
              ...filterData,
              keyword,
              orderBy,
              categoryId,
              formId,
              sortBy,
              minPrice,
              maxPrice,
              ecofarmPackageId,
            });
          }}
        >
          <Card
            className="list-wrapper"
            title={
              <Typography.Title level={2} className="title" style={{ margin: 0 }}>
                {i18n["Tất cả sản phẩm"]}
              </Typography.Title>
            }
            extra={
              <>
                <Button icon={<MdOutlineFileDownload />} onClick={() => setIsImportModalOpen(true)}>
                  {i18n["Nhập danh sách"]}
                </Button>
                <Divider type="vertical" />
                <Button
                  type="primary"
                  icon={<BsPlusLg />}
                  href={`/supplier/farm/${farmId}/item/create`}
                >
                  {i18n["Thêm sản phẩm"]}
                </Button>
              </>
            }
            tabList={[
              { key: "10", tab: i18n["Tất cả"] },
              { key: "13", tab: i18n["Đang chờ duyệt"] },
              { key: "11", tab: i18n["Còn hàng"] },
              { key: "12", tab: i18n["Hết hàng"] },
              { key: "14", tab: i18n["Vi phạm"] },
              { key: "15", tab: i18n["Đã ẩn"] },
              { key: "16", tab: i18n["Ngừng hoạt động"] },
            ]}
            tabProps={{ size: "middle", tabBarGutter: 16 }}
            activeTabKey={!!filterData?.formId ? String(filterData.formId) : "10"}
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
                    name="rating"
                    label={i18n["Đánh giá"]}
                    labelCol={{ span: 8 }}
                    labelAlign="left"
                  >
                    <Rate />
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
                  {/* <Form.Item
                      name="tenantId"
                      label="Tenant"
                      labelCol={{ span: 8 }}
                      labelAlign="left"
                    >
                      <TenantIdSelect placeholder={i18n["Chọn khu chung cư, căn hộ"]} />
                    </Form.Item> */}
                </StoreFilterPopover>
                <Form.Item name="keyword" noStyle>
                  <FilterSearchInput placeholder={i18n["Tìm kiếm sản phẩm"]} />
                </Form.Item>
              </div>
              <Flex className="right-wrapper" align="center" justify="flex-end">
                <Form.Item
                  name="formId"
                  help=""
                  noStyle
                  hidden={![14, 141, 142, 143].includes(filterData.formId || -1)}
                >
                  <Select
                    listHeight={200}
                    placement="bottomRight"
                    variant="borderless"
                    popupMatchSelectWidth={224}
                    placeholder={i18n["Khác"]}
                    options={[
                      { value: 14, label: i18n["Vi phạm"] },
                      { value: 141, label: i18n["Vi phạm - đã tạm khóa"] },
                      { value: 142, label: i18n["Vi phạm - hạn chế hiển thị"] },
                      { value: 143, label: i18n["Vi phạm - đã xóa bởi admin"] },
                    ]}
                  />
                </Form.Item>
                <Divider type="vertical" style={{ margin: 0 }} />
                <Form.Item name="orderBy" help="" noStyle>
                  <Select
                    listHeight={200}
                    placement="bottomRight"
                    variant="borderless"
                    popupMatchSelectWidth={200}
                    placeholder={i18n["Sắp xếp"]}
                    options={[
                      { value: 1, label: i18n["Phổ biến"] },
                      { value: 2, label: i18n["Thời gian"] },
                      { value: 3, label: i18n["Bán chạy"] },
                      { value: 4, label: i18n["Giá thấp nhất"] },
                      { value: 5, label: i18n["Giá cao nhất"] },
                      { value: 6, label: i18n["Tồn kho"] },
                      { value: 7, label: i18n["Sao đánh giá"] },
                    ]}
                  />
                </Form.Item>
                <Divider type="vertical" style={{ margin: "0 10px 0 0" }} />
                <Form.Item name="sortBy" help="" noStyle>
                  <SortBySelect style={{ marginLeft: -6 }} />
                </Form.Item>
                <Divider type="vertical" style={{ margin: "0 10px 0 0" }} />
                <Form.Item name="categoryId" noStyle>
                  <CategorySelectDrawerFarm businessType={gSelectedProvider?.type} />
                </Form.Item>
              </Flex>
            </div>
            {itemListData.length > 0 && !!debouncedFilterData.providerId ? (
              <ItemTableStyled
                showSorterTooltip={false}
                columns={mappedColumns as any[]}
                dataSource={itemListData}
                pagination={false}
                size="large"
                rowSelection={{
                  columnWidth: 32,
                  onChange: (selectedRowKeys) => {
                    setSelectedItems(selectedRowKeys as any[]);
                  },
                  getCheckboxProps: (item: any) => ({
                    disabled:
                      [10].includes(filterData?.formId || 10) &&
                      ![TItemStatus.PENDING, TItemStatus.ACTIVATED].includes(item.status),
                  }),
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
                      : i18n["Không tìm thấy sản phẩm phù hợp"]}
                  </Typography.Text>
                }
              />
            )}

            <Affix offsetBottom={0.001}>
              <div className="footer" style={{ backgroundColor: colorBgBase }}>
                <div className="selected-wrapper">
                  {i18n["Đã chọn"]} <span>{selectedItems.length}</span>{" "}
                  {i18n["Sản phẩm"].toLowerCase()}
                </div>
                {!!itemListTotal && (
                  <Pagination
                    showSizeChanger
                    total={itemListTotal}
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
        <Modal
          open={isImportModalOpen}
          onCancel={() => setIsImportModalOpen(false)}
          title={"Nhập danh sách"}
        ></Modal>
      </PageWrapper>
    </SiderHeaderLayout>
  );
};

const PageWrapper = styled(StyledPage)`
  padding: 12px 12px;
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
  & > .form-wrapper {
  }
  .list-wrapper {
    ${cssListWrapper}
    .filters-wrapper {
      ${cssFilterWrapper}
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
    .list.list-container {
      display: block;
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
        width: calc((100% / var(--f-columns)) - var(--f-gap-x));
      }
    }
    .footer {
      ${cssFooterWrapper}
      border-top: none;
      padding: 16px 16px;
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

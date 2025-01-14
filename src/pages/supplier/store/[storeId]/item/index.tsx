import SortBySelect from "@/components/field/SortBySelect";
import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/query";
import { useCreation, useDebounce } from "ahooks";
import { Affix, Divider, Empty, Flex, Form, Modal, Select, Typography, theme } from "antd";
import { parseAsBoolean, parseAsInteger, useQueryStates } from "next-usequerystate";
import { useRouter } from "next/router";
import { useId, useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { MdOutlineFileDownload, MdOutlineStore } from "react-icons/md";
import Avatar from "src/components/avatar/Avatar";
import Button from "src/components/button/Button";
import Card from "src/components/card/Card";
import CategorySelectDrawer from "src/components/field/CategorySelectDrawer";
import FilterSearchInput from "src/components/field/FilterSearchInput";
import InputPriceRange from "src/components/field/InputPriceRange";
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
import useItemColumns from "src/components/table/useItemColumns";

import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProvider from "src/hooks/useGetProvider";
import { useGetAllItemsByPartnerQuery } from "src/redux/query/item.query";
import { TItemStatus } from "src/types/item.types";

const defaultFilter = {
  providerId: parseAsInteger,
  formId: parseAsInteger.withDefault(10),
  orderBy: parseAsInteger.withDefault(2),
  categoryId: parseAsInteger,
  minPrice: parseAsInteger,
  maxPrice: parseAsInteger,
  minStock: parseAsInteger,
  maxStock: parseAsInteger,
  minSales: parseAsInteger,
  maxSales: parseAsInteger,
  rating: parseAsInteger,
  ecofarmPackageId: parseAsInteger,
  skipCount: parseAsInteger,
  maxResultCount: parseAsInteger.withDefault(10),
  sortBy: parseAsInteger.withDefault(2),
  isItemBooking: parseAsBoolean,
};

const Page = () => {
  const uid = useId();
  const { i18n, locale } = useChangeLocale();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const { message } = useApp();
  const [form] = Form.useForm();
  const {
    token: { colorTextPlaceholder, colorTextSecondary, colorBgBase },
  } = theme.useToken();
  const {
    query: { storeId },
  } = useRouter();
  const { gSelectedProvider } = useGetProvider({});

  const [filterData, setFilterData] = useQueryStates(defaultFilter);
  const [internalFilterData, setInternalFilterData] = useState({ keyword: "" });
  const debouncedFilterData = useDebounce(internalFilterData, { wait: 500 });
  const { data, refetch } = useGetAllItemsByPartnerQuery(
    !!gSelectedProvider?.id
      ? {
          ...debouncedFilterData,
          ...filterData,
          providerId: gSelectedProvider?.id,
          isItemBooking: gSelectedProvider?.groupType !== 2,
        }
      : skipToken,
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const itemListData = data?.data || [];
  const itemListTotal = data?.totalRecords;

  const ItemColumns = useItemColumns({});
  const mappedItemColumns = useCreation(() => {
    const {
      nameCombined3,
      nameCombined4,
      nameCombined5,
      price2,
      price3,
      rateViewCount,
      sku,
      sales,
      stock,
      actionsStatus,
      properties24,
      pitchtype,
      address,
      phoneNumber,
    } = ItemColumns;
    if (gSelectedProvider?.groupType === 2)
      return [
        { ...nameCombined4, sorter: undefined, width: 400 },
        rateViewCount,
        sku,
        sales,
        stock,
        { ...actionsStatus, width: 180, fixed: "right" },
      ];
    if (gSelectedProvider?.groupType === 24)
      return [
        { ...nameCombined3, title: i18n["Dịch vụ"], width: 320, ellipsis: true },
        price2,
        rateViewCount,
        { ...properties24, width: 360 },
        { ...actionsStatus, fixed: "right" },
      ];
    if (gSelectedProvider?.groupType === 25)
      return [
        nameCombined3,
        rateViewCount,
        address,
        price3,
        phoneNumber,
        { ...actionsStatus, fixed: "right" },
      ];
    return [
      { ...nameCombined4, sorter: undefined, width: 320 },
      rateViewCount,
      stock,
      actionsStatus,
    ];
  }, [gSelectedProvider, ItemColumns]);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleSubmitFilter = ({ keyword, ...formData }: any) => {
    setInternalFilterData({ keyword });
    setFilterData({
      ...formData,
      providerId: gSelectedProvider?.id,
      isItemBooking: gSelectedProvider?.groupType !== 2,
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
          initialValues={{
            formId: 10,
            orderBy: 2,
            categoryId: null,
            minPrice: null,
            maxPrice: null,
            minStock: null,
            maxStock: null,
            minSales: null,
            maxSales: null,
            rating: null,
            ecofarmPackageId: null,
            keyword: "",
            sortBy: 2,
            isItemBooking: null,
          }}
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
                  href={`/supplier/store/${storeId}/item/create`}
                >
                  {i18n["Thêm sản phẩm"]}
                </Button>
              </>
            }
            tabList={[
              { key: "10", tab: i18n["Tất cả"] },
              { key: "13", tab: i18n["Chờ duyệt"] },
              { key: "11", tab: i18n["Còn hàng"] },
              { key: "12", tab: i18n["Hết hàng"] },
              { key: "15", tab: i18n["Đã ẩn"] },
              { key: "16", tab: i18n["Ngừng kinh doanh"] },
              { key: "14", tab: i18n["Vi phạm"] },
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
                      { value: 2, label: i18n["Thời gian tạo"] },
                      { value: 3, label: i18n["Bán chạy"] },
                      { value: 4, label: i18n["Giá thấp nhất"] },
                      { value: 5, label: i18n["Giá cao nhất"] },
                      { value: 6, label: i18n["Tồn kho"] },
                      { value: 7, label: i18n["Đánh giá"] },
                    ]}
                  />
                </Form.Item>
                <Form.Item name="sortBy" help="" noStyle>
                  <SortBySelect style={{ marginLeft: -6 }} />
                </Form.Item>
                <Divider type="vertical" style={{ margin: "0 10px 0 0" }} />
                <Form.Item name="categoryId" noStyle>
                  <CategorySelectDrawer businessType={gSelectedProvider?.type} />
                </Form.Item>
              </Flex>
            </div>
            {itemListData.length > 0 && !!gSelectedProvider?.id ? (
              <ItemTableStyled
                showSorterTooltip={false}
                columns={mappedItemColumns as any[]}
                dataSource={itemListData}
                pagination={false}
                size="large"
                rowSelection={{
                  columnWidth: 32,
                  onChange: (selectedRowKeys, selectedRows) => {
                    setSelectedItems(selectedRowKeys as any[]);
                  },
                  getCheckboxProps: (item: any) => ({
                    disabled:
                      [10].includes(filterData?.formId || 10) &&
                      ![TItemStatus.PENDING, TItemStatus.ACTIVATED].includes(item.status),
                  }),
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
                    {!gSelectedProvider?.id
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

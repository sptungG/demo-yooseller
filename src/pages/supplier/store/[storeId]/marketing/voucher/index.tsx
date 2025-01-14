import Avatar from "@/components/avatar/Avatar";
import Button from "@/components/button/Button";
import FilterSearchInput from "@/components/field/FilterSearchInput";
import SortBySelect from "@/components/field/SortBySelect";
import StoreFilterPopover from "@/components/popover/StoreFilterPopover";
import Pagination from "@/components/shared/Pagination";
import VoucherTableStyled from "@/components/table/VoucherTable";
import useVoucherColumns from "@/components/table/useVoucherColumns";
import useGetProvider from "@/hooks/useGetProvider";
import { useGetAllVouchersQuery } from "@/redux/query/voucher.query";
import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/query";
import { useCreation, useDebounce } from "ahooks";
import { Affix, Divider, Empty, Flex, Form, Select, Typography, theme } from "antd";
import { parseAsInteger, useQueryStates } from "next-usequerystate";
import { useRouter } from "next/router";
import { useId, useState } from "react";
import { BsPlusLg } from "react-icons/bs";
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
  const {
    token: { colorBgBase },
  } = theme.useToken();
  const { i18n, locale } = useChangeLocale();
  const [form] = Form.useForm();
  const { gSelectedProvider } = useGetProvider({});

  const [filterData, setFilterData] = useQueryStates(defaultFilter);
  const [internalFilterData, setInternalFilterData] = useState({ keyword: "" });
  const debouncedFilterData = useDebounce(internalFilterData, { wait: 500 });
  const { data: getAllVouchersRes } = useGetAllVouchersQuery(
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
  const voucherListData = getAllVouchersRes?.data || [];
  const voucherListTotal = getAllVouchersRes?.totalRecords;
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const VoucherColumns = useVoucherColumns({});
  const mappedVoucherColumns = useCreation(() => {
    const {
      nameCombined1,
      minBasketPrice,
      discountAmount,
      quantity,
      currentUsage,
      datetime,
      actionsState,
    } = VoucherColumns;
    return [
      { ...nameCombined1, width: 300 },
      { ...discountAmount, align: "right" },
      { ...minBasketPrice, align: "right", width: 120, ellipsis: true },
      { ...quantity, align: "right", width: 100, ellipsis: true },
      { ...currentUsage, align: "right", width: 120, ellipsis: true },
      { ...datetime, align: "right", width: 180, ellipsis: true },
      { ...actionsState, align: "right", width: 200, fixed: "right" },
    ];
  }, [gSelectedProvider, VoucherColumns]);

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
          current={i18n["Mã giảm giá"]}
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
            formId: 20,
            orderBy: 1,
            keyword: "",
            sortBy: 2,
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
                {i18n["Mã giảm giá"]}
              </Typography.Title>
            }
            extra={
              <Button
                type="primary"
                icon={<BsPlusLg />}
                href={`/supplier/store/${storeId}/marketing/voucher/create`}
              >
                {i18n["Tạo khuyến mãi"]}
              </Button>
            }
            tabList={[
              { key: "20", tab: i18n["Tất cả"] },
              { key: "21", tab: i18n["Sắp diễn ra"] },
              { key: "22", tab: i18n["Đang diễn ra"] },
              { key: "23", tab: i18n["Đã kết thúc"] },
            ]}
            tabProps={{ size: "middle", tabBarGutter: 16 }}
            onTabChange={(key) => {
              form.setFieldValue("formId", +key);
              setFilterData({ ...filterData, formId: +key });
            }}
          >
            <div className="header-wrapper">
              <div className="filters-wrapper">
                <StoreFilterPopover formId={uid} width={424}>
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={false} />
                </StoreFilterPopover>
                <Form.Item name="keyword" noStyle>
                  <FilterSearchInput placeholder={i18n["Tìm kiếm mã giảm giá"]} />
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
                      { value: 2, label: i18n["Mã giảm giá (A → Z)"] },
                      { value: 3, label: i18n["Số lượng"] },
                      { value: 4, label: i18n["Mức giảm"] },
                      { value: 5, label: i18n["Ngày bắt đầu"] },
                      { value: 6, label: i18n["Ngày kết thúc"] },
                    ]}
                  />
                </Form.Item>
                <Form.Item name="sortBy" help="" noStyle>
                  <SortBySelect style={{ marginLeft: -6 }} />
                </Form.Item>
              </Flex>
            </div>

            {voucherListData?.length ? (
              <VoucherTableStyled
                showSorterTooltip={false}
                pagination={false}
                size="large"
                dataSource={voucherListData}
                columns={mappedVoucherColumns as any[]}
                rowSelection={{
                  columnWidth: 32,
                  selectedRowKeys: selectedItems,
                  onChange: (selectedRowKeys, selectedRows) => {
                    setSelectedItems(selectedRowKeys as any[]);
                  },
                  // getCheckboxProps: (item: any) => {},
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
                    {i18n["Không có mã giảm giá nào"]}
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
                {!!voucherListTotal && (
                  <Pagination
                    showSizeChanger
                    total={voucherListTotal}
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

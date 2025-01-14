import SortBySelect from "@/components/field/SortBySelect";
import { EcofarmSvg } from "@/components/icons";
import { TEVoucherForm, TEVoucherOrderBy, TVoucherFilter } from "@/types/farm.types";
import styled from "@emotion/styled";
import { useCreation, useDebounce } from "ahooks";
import { Affix, Divider, Empty, Flex, Form, Modal, Select, Typography, theme } from "antd";
import { useRouter } from "next/router";
import { useId, useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { MdOutlineFileDownload } from "react-icons/md";
import Avatar from "src/components/avatar/Avatar";
import Button from "src/components/button/Button";
import Card from "src/components/card/Card";
import FilterSearchInput from "src/components/field/FilterSearchInput";
import withAuth from "src/components/hoc/withAuth";
import BreadcrumbHeader from "src/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "src/components/layout/SiderHeaderLayout";
import StyledPage, {
  cssFilterWrapper,
  cssFooterWrapper,
  cssListWrapper,
} from "src/components/layout/StyledPage";
// import StoreFilterPopover from "src/components/popover/StoreFilterPopover";
import Pagination from "src/components/shared/Pagination";
import ItemTableStyled from "src/components/table/ItemTable";
import useFarmVoucherColumns from "src/components/table/useFarmVoucherColumns";

import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProviderFarm from "src/hooks/useGetProviderFarm";
import { useGetAllVouchersByPartnerQuery } from "src/redux/query/farm.query";

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

  const [filterData, setFilterData] = useState<TVoucherFilter>({
    formId: TEVoucherForm.ALL,
    orderBy: 1,
    sortBy: 1,
  });
  const debouncedFilterData = useDebounce(
    {
      ...filterData,
      providerId: gSelectedProvider?.id,
    },
    { wait: 500 },
  );
  const { data } = useGetAllVouchersByPartnerQuery(debouncedFilterData, {
    refetchOnMountOrArgChange: true,
    skip: !debouncedFilterData?.providerId,
  });
  const itemListData = data?.data || [];
  const itemListTotal = data?.totalRecords;

  const Columns = useFarmVoucherColumns();
  const mappedColumns = useCreation(() => {
    const { nameCombined, actionsStatus, typeCode, discount, quantity, currentUsage, time } =
      Columns;
    return [
      { ...nameCombined, sorter: undefined },
      typeCode,
      discount,
      quantity,
      currentUsage,
      time,
      actionsStatus,
    ];
  }, [gSelectedProvider, Columns]);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

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
          current={i18n["Tất cả Voucher"]}
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
            const { keyword, orderBy, formId, sortBy } = values as any;
            setFilterData({
              ...filterData,
              keyword,
              orderBy,
              formId,
              sortBy,
            });
          }}
        >
          <Card
            className="list-wrapper"
            title={
              <Typography.Title level={2} className="title" style={{ margin: 0 }}>
                {i18n["Tất cả Voucher"]}
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
                  href={`/supplier/farm/${farmId}/voucher/create`}
                >
                  {i18n["Thêm Voucher"]}
                </Button>
              </>
            }
            tabList={[
              { key: TEVoucherForm.ALL.toString(), tab: i18n["Tất cả"] },
              { key: TEVoucherForm.ON_GOING.toString(), tab: i18n["Sắp diễn ra"] },
              { key: TEVoucherForm.UPCOMING.toString(), tab: i18n["Đang diễn ra"] },
              { key: TEVoucherForm.EXPIRED.toString(), tab: i18n["Hết hạn"] },
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
                {/* <StoreFilterPopover formId={uid} width={424}></StoreFilterPopover> */}
                <Form.Item name="keyword" noStyle>
                  <FilterSearchInput placeholder={i18n["Tìm kiếm Voucher"]} />
                </Form.Item>
              </div>
              <Flex className="right-wrapper" align="center" justify="flex-end">
                <Form.Item name="formId" help="" noStyle hidden={true}>
                  <Select
                    listHeight={200}
                    placement="bottomRight"
                    variant="borderless"
                    popupMatchSelectWidth={224}
                    placeholder={i18n["Khác"]}
                    options={[
                      { value: TEVoucherForm.ALL.toString(), label: i18n["Tất cả"] },
                      { value: TEVoucherForm.ON_GOING.toString(), label: i18n["Sắp diễn ra"] },
                      { value: TEVoucherForm.UPCOMING.toString(), label: i18n["Đang diễn ra"] },
                      { value: TEVoucherForm.EXPIRED.toString(), label: i18n["Hết hạn"] },
                    ]}
                  />
                </Form.Item>
                <Form.Item name="orderBy" help="" noStyle>
                  <Select
                    listHeight={200}
                    placement="bottomRight"
                    variant="borderless"
                    popupMatchSelectWidth={200}
                    placeholder={i18n["Sắp xếp"]}
                    options={[
                      { value: TEVoucherOrderBy.Id, label: i18n["Ngày tạo"] },
                      { value: TEVoucherOrderBy.VoucherCode, label: i18n["Mã Voucher"] },
                      { value: TEVoucherOrderBy.Quantity, label: i18n["Số lượng voucher"] },
                      {
                        value: TEVoucherOrderBy.DiscountAmount,
                        label: i18n["Mức giảm"],
                      },
                      { value: TEVoucherOrderBy.DateStart, label: i18n["Thời điểm bắt đầu"] },
                      { value: TEVoucherOrderBy.DateEnd, label: i18n["Thời điểm kết thúc"] },
                    ]}
                  />
                </Form.Item>
                <Divider type="vertical" style={{ margin: "0 10px 0 0" }} />
                <Form.Item name="sortBy" help="" noStyle>
                  <SortBySelect style={{ marginLeft: -6 }} />
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
                  // getCheckboxProps: (item: any) => ({
                  //   disabled:
                  //     [10].includes(filterData?.formId || 10) &&
                  //     ![TItemStatus.PENDING, TItemStatus.ACTIVATED].includes(item.status),
                  // }),
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
                      : i18n["Không tìm thấy Voucher phù hợp"]}
                  </Typography.Text>
                }
              />
            )}

            <Affix offsetBottom={0.001} target={() => container}>
              <div className="footer" style={{ backgroundColor: colorBgBase }}>
                <div className="selected-wrapper">
                  {i18n["Đã chọn"]} <span>{selectedItems.length}</span>{" "}
                  {i18n["Voucher"].toLowerCase()}
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

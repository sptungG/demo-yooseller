import SortBySelect from "@/components/field/SortBySelect";
import { EcofarmSvg } from "@/components/icons";
import { TEProviderAddressOrderBy, TProviderAddressesFilter } from "@/types/addresses.type";
import { vietnameseSlug } from "@/utils/utils";
import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/query";
import { useCreation, useDebounce } from "ahooks";
import { Affix, Divider, Empty, Flex, Form, Modal, Select, Typography, theme } from "antd";
import dayjs from "dayjs";
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
import StoreFilterPopover from "src/components/popover/StoreFilterPopover";
import Pagination from "src/components/shared/Pagination";
import ItemTableStyled from "src/components/table/ItemTable";
import { useProviceAddressesFarmColumns } from "src/components/table/useProviceAddressesColumns";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProviderFarm from "src/hooks/useGetProviderFarm";
import { useGetListProviderAddressesQuery } from "src/redux/query/addresses.query";

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

  const [filterData, setFilterData] = useState<TProviderAddressesFilter>({
    orderBy: 1,
    sortBy: 2,
  });
  const debouncedFilterData = useDebounce(
    {
      ...filterData,
      providerId: gSelectedProvider?.id,
    },
    { wait: 500 },
  );
  const { data } = useGetListProviderAddressesQuery(
    !!debouncedFilterData?.providerId ? debouncedFilterData : skipToken,
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const itemListData = data?.data || [];
  const itemListTotal = data?.totalRecords;

  const Columns = useProviceAddressesFarmColumns();
  const mappedColumns = useCreation(() => {
    const { nameCombined, addressDetail, actionsStatus, pickUp, returnAddress, latLong } = Columns;
    return [
      { ...nameCombined, width: 220, ellipsis: true },
      addressDetail,
      { ...pickUp, align: "right", width: 132, ellipsis: true },
      { ...returnAddress, align: "right", width: 120, ellipsis: true },
      { ...latLong, ellipsis: true, align: "left", width: 240 },
      { ...actionsStatus, fixed: "right", width: 220 },
    ];
  }, [gSelectedProvider, Columns]);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleSubmitFilter = ({ rangeDateStart, rangeDateExpect, ...formData }: any) => {
    let dateStartFrom = undefined;
    let dateStartTo = undefined;
    let dateExpectFrom = undefined;
    let dateExpectTo = undefined;
    if (!!rangeDateStart?.length) {
      dateStartFrom = dayjs(rangeDateStart[0]).toISOString();
      dateStartTo = dayjs(rangeDateStart[1]).toISOString();
    }
    if (!!rangeDateExpect?.length) {
      dateExpectFrom = dayjs(rangeDateStart[0]).toISOString();
      dateExpectTo = dayjs(rangeDateStart[1]).toISOString();
    }
    setFilterData({ ...formData, dateStartFrom, dateStartTo, dateExpectFrom, dateExpectTo });
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
          current={i18n["Tất cả địa chỉ"]}
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
            const { keyword, orderBy, sortBy } = values as any;
            setFilterData({
              ...filterData,
              keyword,
              orderBy,
              sortBy,
            });
          }}
        >
          <Card
            className="list-wrapper"
            title={
              <Typography.Title level={2} className="title" style={{ margin: 0 }}>
                {i18n["Tất cả địa chỉ"]}
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
                  href={`/supplier/farm/${farmId}/addresses/create`}
                >
                  {i18n["Thêm địa chỉ"]}
                </Button>
              </>
            }
          >
            <div className="header-wrapper">
              <div className="filters-wrapper">
                <StoreFilterPopover formId={uid} width={424}>
                  <Form.Item label={i18n["Địa chỉ mặc định"]} name="default">
                    <Select
                      allowClear
                      options={[
                        { value: true, label: i18n["Mặc định"] },
                        { value: false, label: i18n["Không mặc định"] },
                      ]}
                      placeholder={i18n["Chọn"]}
                      showSearch
                      filterOption={(input, option) =>
                        vietnameseSlug(String(option?.label || ""), " ").indexOf(
                          vietnameseSlug(input, " "),
                        ) >= 0
                      }
                      onClear={() => {
                        form.setFieldValue("default", undefined);
                      }}
                    />
                  </Form.Item>
                  <Form.Item label={i18n["Là địa chỉ nhận hàng"]} name="pickUp">
                    <Select
                      allowClear
                      options={[
                        { value: true, label: i18n["Có"] },
                        { value: false, label: i18n["Không"] },
                      ]}
                      placeholder={i18n["Chọn"]}
                      showSearch
                      filterOption={(input, option) =>
                        vietnameseSlug(String(option?.label || ""), " ").indexOf(
                          vietnameseSlug(input, " "),
                        ) >= 0
                      }
                      onClear={() => {
                        form.setFieldValue("pickUp", undefined);
                      }}
                    />
                  </Form.Item>
                  <Form.Item label={i18n["Là địa chỉ trả hàng"]} name="return">
                    <Select
                      allowClear
                      options={[
                        { value: true, label: i18n["Có"] },
                        { value: false, label: i18n["Không"] },
                      ]}
                      placeholder={i18n["Chọn"]}
                      showSearch
                      filterOption={(input, option) =>
                        vietnameseSlug(String(option?.label || ""), " ").indexOf(
                          vietnameseSlug(input, " "),
                        ) >= 0
                      }
                      onClear={() => {
                        form.setFieldValue("return", undefined);
                      }}
                    />
                  </Form.Item>
                </StoreFilterPopover>
                <Form.Item name="keyword" noStyle>
                  <FilterSearchInput placeholder={i18n["Tìm kiếm địa chỉ"]} />
                </Form.Item>
              </div>
              <Flex className="right-wrapper" align="center" justify="flex-end">
                <Form.Item name="orderBy" help="" noStyle>
                  <Select
                    listHeight={200}
                    placement="bottomRight"
                    variant="borderless"
                    popupMatchSelectWidth={200}
                    placeholder={i18n["Sắp xếp"]}
                    options={[
                      { value: TEProviderAddressOrderBy.Id, label: i18n["Thời gian"] },
                      { value: TEProviderAddressOrderBy.ProvinceCode, label: i18n["Mã tỉnh"] },
                      { value: TEProviderAddressOrderBy.DistrictCode, label: i18n["Mã huyện"] },
                      { value: TEProviderAddressOrderBy.WardCode, label: i18n["Mã xã"] },
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
                      ? i18n["Hãy chọn trang trại trước"]
                      : i18n["Không tìm thấy địa chỉ phù hợp"]}
                  </Typography.Text>
                }
              />
            )}

            <Affix offsetBottom={0.001}>
              <div className="footer" style={{ backgroundColor: colorBgBase }}>
                <div className="selected-wrapper">
                  {i18n["Đã chọn"]} <span>{selectedItems.length}</span>{" "}
                  {i18n["Địa chỉ"].toLowerCase()}
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

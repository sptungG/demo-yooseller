import SortBySelect from "@/components/field/SortBySelect";
import { EcofarmSvg } from "@/components/icons";
import RangePicker from "@/components/picker/RangePicker";
import { TPackageActivitiesFilter, TPackageFilter } from "@/types/farm.types";
import { vietnameseSlug } from "@/utils/utils";
import styled from "@emotion/styled";
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
import useActivityFarmColumns from "src/components/table/useActivityFarmColumns";

import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProviderFarm from "src/hooks/useGetProviderFarm";
import {
  useGetListEcofarmPackageActivitiesQuery,
  useGetListEcofarmPackageByPartnerQuery,
} from "src/redux/query/farm.query";

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

  const [filterData, setFilterData] = useState<TPackageActivitiesFilter>({
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
  const { data } = useGetListEcofarmPackageActivitiesQuery(debouncedFilterData, {
    refetchOnMountOrArgChange: true,
    skip: !debouncedFilterData?.providerId,
  });
  const itemListData = data?.data || [];
  const itemListTotal = data?.totalRecords;
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
  const Columns = useActivityFarmColumns();
  const mappedColumns = useCreation(() => {
    const { nameCombined, ecofarmPackage, actionsStatus, time } = Columns;
    return [{ ...nameCombined, sorter: undefined }, ecofarmPackage, time, actionsStatus];
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
          current={i18n["Tất cả hoạt động"]}
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
            const { keyword, orderBy, sortBy, ecofarmPackageId } = values as any;
            setFilterData({
              ...filterData,
              keyword,
              orderBy,
              sortBy,
              ecofarmPackageId,
            });
          }}
        >
          <Card
            className="list-wrapper"
            title={
              <Typography.Title level={2} className="title" style={{ margin: 0 }}>
                {i18n["Tất cả hoạt động"]}
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
                  href={`/supplier/farm/${farmId}/activity/create`}
                >
                  {i18n["Thêm hoạt động"]}
                </Button>
              </>
            }
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
                    label={i18n["Ngày bắt đầu"]}
                    labelCol={{ span: 8 }}
                    labelAlign="left"
                    name="rangeDateStart"
                    help=""
                  >
                    <RangePicker
                      inputReadOnly
                      //disabledDate={(current) => current > dayjs()}
                      placeholder={[i18n["Từ"], i18n["Đến"]]}
                    />
                  </Form.Item>
                  <Form.Item
                    label={i18n["Ngày diễn ra"]}
                    labelCol={{ span: 8 }}
                    labelAlign="left"
                    name="rangeDateExpect"
                    help=""
                  >
                    <RangePicker
                      inputReadOnly
                      //disabledDate={(current) => current > dayjs()}
                      placeholder={[i18n["Từ"], i18n["Đến"]]}
                    />
                  </Form.Item>
                </StoreFilterPopover>
                <Form.Item name="keyword" noStyle>
                  <FilterSearchInput placeholder={i18n["Tìm kiếm hoạt động"]} />
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
                    options={[{ value: 1, label: i18n["Thời gian"] }]}
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
                      ? i18n["Hãy chọn gian hàng trước"]
                      : i18n["Không tìm thấy hoạt động phù hợp"]}
                  </Typography.Text>
                }
              />
            )}

            <Affix offsetBottom={0.001}>
              <div className="footer" style={{ backgroundColor: colorBgBase }}>
                <div className="selected-wrapper">
                  {i18n["Đã chọn"]} <span>{selectedItems.length}</span>{" "}
                  {i18n["Hoạt động"].toLowerCase()}
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

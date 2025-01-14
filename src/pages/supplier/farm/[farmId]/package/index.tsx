import FormAddressSelects from "@/components/field/FormAddressSelects";
import InputPriceRange from "@/components/field/InputPriceRange";
import SortBySelect from "@/components/field/SortBySelect";
import { EcofarmSvg } from "@/components/icons";
import PackageIdModal from "@/components/modal/PackageIdModal";
import Pagination from "@/components/shared/Pagination";
import ItemTableStyled from "@/components/table/ItemTable";
import usePackageColumns from "@/components/table/usePackageColumns";
import { TEEcoFarmPackageFormId, TPackageStatus } from "@/types/farm.types";
import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/query";
import { useDebounce } from "ahooks";
import { Affix, Divider, Empty, Flex, Form, Modal, Rate, Select, Typography, theme } from "antd";
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from "next-usequerystate";
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
import FarmFilterPopover from "src/components/popover/FarmFilterPopover";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProviderFarm from "src/hooks/useGetProviderFarm";
import { useGetListEcofarmPackageByPartnerQuery } from "src/redux/query/farm.query";

const defaultFilter = {
  providerId: parseAsInteger,
  formId: parseAsInteger.withDefault(0),
  orderBy: parseAsInteger.withDefault(6),
  minPrice: parseAsInteger,
  maxPrice: parseAsInteger,
  provinceCodes: parseAsArrayOf(parseAsString),
  skipCount: parseAsInteger,
  maxResultCount: parseAsInteger.withDefault(10),
  sortBy: parseAsInteger.withDefault(2),
};

const Page = () => {
  const uid = useId();
  const [form] = Form.useForm();
  const {
    query: { farmId },
  } = useRouter();
  const { i18n } = useChangeLocale();
  const {
    token: { colorBgBase },
  } = theme.useToken();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [packageIdModal, setPackageIdModal] = useState<number>();
  const { gSelectedProvider } = useGetProviderFarm();

  const [filterData, setFilterData] = useQueryStates(defaultFilter);
  const [internalFilterData, setInternalFilterData] = useState({ keyword: "" });
  const debouncedFilterData = useDebounce(internalFilterData, { wait: 500 });
  const { data, isFetching } = useGetListEcofarmPackageByPartnerQuery(
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
  const packageListData = data?.data || [];
  const packageListTotal = data?.totalRecords;

  const {
    nameCombined,
    actionsStatus,
    datetime,
    numberSharesSold,
    pricePerShare,
    packagePrice,
    registerList,
  } = usePackageColumns({
    onOpenPackageModal: ({ id }) => setPackageIdModal(id),
  });
  const mappedColumns = [
    { ...nameCombined, width: 250, fixed: "left", ellipsis: true },
    { ...registerList, align: "right", width: 150, ellipsis: true },
    { ...pricePerShare, align: "right", width: 140, ellipsis: true },
    { ...packagePrice, align: "right", width: 140, ellipsis: true },
    { ...numberSharesSold, align: "right", width: 140, ellipsis: true },
    { ...datetime, align: "right", width: 170, ellipsis: true },
    ,
    { ...actionsStatus, align: "right", width: 220, fixed: "right" },
  ];

  const handleSubmitFilter = ({ keyword, provinceCodes, ...formData }: any) => {
    setInternalFilterData({ keyword });
    setFilterData({
      ...formData,
      provinceCodes: provinceCodes?.filter((c: any) => !!c) || null,
      providerId: gSelectedProvider?.id,
    });
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
          current={i18n["Gói dịch vụ farming"]}
        />
      }
    >
      <PageWrapper style={{ flexDirection: "column", padding: 15 }}>
        <Form
          className="form-wrapper"
          id={uid}
          form={form}
          onFinish={handleSubmitFilter}
          initialValues={{
            type: null,
            formId: 0,
            rating: null,
            orderBy: 6,
            minPrice: null,
            maxPrice: null,
            provinceCodes: null,
            keyword: "",
            sortBy: 2,
          }}
          onValuesChange={(changedValues, values) => {
            const { keyword, minPrice, maxPrice, provinceCodes, ...rest } = values as any;
            setInternalFilterData({ keyword });
            setFilterData({
              ...filterData,
              provinceCodes: provinceCodes?.filter((c: any) => !!c) || null,
              ...rest,
            });
          }}
        >
          <Card
            className="list-wrapper"
            title={
              <Typography.Title level={2} className="title" style={{ margin: 0 }}>
                {i18n["Tất cả gói dịch vụ farming"]}
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
                  href={`/supplier/farm/${farmId}/package/create`}
                >
                  {`${i18n["Thêm"]} ${i18n["Gói dịch vụ farming"].toLowerCase()}`}
                </Button>
              </>
            }
            tabList={[
              { key: "0", tab: i18n["Tất cả"] },
              { key: "1", tab: i18n["Sắp diễn ra"] },
              { key: "2", tab: i18n["Đang diễn ra"] },
              { key: "3", tab: i18n["Đã hoàn thành/kết thúc"] },
              { key: "4", tab: i18n["Đã đóng/hủy"] },
            ]}
            tabProps={{ size: "middle", tabBarGutter: 16 }}
            activeTabKey={!!filterData?.formId ? String(filterData.formId) : "0"}
            onTabChange={(key) => {
              form.setFieldValue("formId", +key);
              setFilterData({ ...filterData, formId: +key });
            }}
          >
            <div className="header-wrapper">
              <div className="filters-wrapper">
                <FarmFilterPopover formId={uid} width={640}>
                  <Form.Item
                    name="rating"
                    label={i18n["Đánh giá"]}
                    labelCol={{ span: 4 }}
                    labelAlign="left"
                  >
                    <Rate />
                  </Form.Item>
                  <Form.Item
                    label={i18n["Khoảng giá"]}
                    labelCol={{ span: 4 }}
                    labelAlign="left"
                    help=""
                  >
                    <div className="" style={{ maxWidth: 340 }}>
                      <InputPriceRange
                        minFormProps={{ name: "minPrice", placeholder: i18n["Từ"] }}
                        maxFormProps={{ name: "maxPrice", placeholder: i18n["Đến"] }}
                      />
                    </div>
                  </Form.Item>
                  <Form.Item
                    label={i18n["Điạ chỉ"]}
                    labelCol={{ span: 4 }}
                    labelAlign="left"
                    help=""
                  >
                    <FormAddressSelects
                      size="middle"
                      provinceFormProps={{ name: ["provinceCodes", 0] }}
                      districtFormProps={{ name: ["provinceCodes", 1] }}
                      wardFormProps={{ name: ["provinceCodes", 2] }}
                    />
                  </Form.Item>
                </FarmFilterPopover>
                <Form.Item name="keyword" noStyle>
                  <FilterSearchInput placeholder={i18n["Tìm kiếm gói farming"]} />
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
                      { value: TEEcoFarmPackageFormId.GET_ALL.toString(), label: i18n["Tất cả"] },
                      {
                        value: TEEcoFarmPackageFormId.GET_ONGOING.toString(),
                        label: i18n["Sắp diễn ra"],
                      },
                      {
                        value: TEEcoFarmPackageFormId.GET_ACTIVATED.toString(),
                        label: i18n["Đang đầu tư"],
                      },
                      {
                        value: TEEcoFarmPackageFormId.GET_COMPLETED.toString(),
                        label: i18n["Đã kết thúc"],
                      },
                      {
                        value: TEEcoFarmPackageFormId.GET_CLOSED.toString(),
                        label: i18n["Đã đóng"],
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item name="orderBy" help="" noStyle>
                  <Select
                    listHeight={200}
                    placement="bottomRight"
                    variant="borderless"
                    popupMatchSelectWidth={false}
                    placeholder={i18n["Sắp xếp"]}
                    options={[
                      { value: 1, label: i18n["Tên gói farming (A → Z)"] },
                      { value: 2, label: i18n["Khoảng thời gian (tháng) diễn ra"] },
                      { value: 3, label: i18n["Tổng giá tiền gói farming"] },
                      { value: 4, label: i18n["Số lượt đánh giá"] },
                      { value: 5, label: i18n["Điểm đánh giá"] },
                      { value: 6, label: i18n["Thời gian tạo"] },
                    ]}
                  />
                </Form.Item>
                <Form.Item name="sortBy" help="" noStyle>
                  <SortBySelect style={{ marginLeft: -6 }} />
                </Form.Item>
              </Flex>
            </div>
            {packageListData.length > 0 && !!gSelectedProvider?.id ? (
              <ItemTableStyled
                showSorterTooltip={false}
                columns={mappedColumns as any[]}
                dataSource={packageListData}
                pagination={false}
                size="large"
                loading={isFetching}
                rowSelection={{
                  columnWidth: 32,
                  onChange: (selectedRowKeys) => {
                    setSelectedItems(selectedRowKeys as any[]);
                  },
                  getCheckboxProps: (item: any) => ({
                    disabled:
                      ["0"].includes(String(filterData?.formId)) &&
                      [TPackageStatus.CLOSED].includes(item.status),
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
                      : i18n["Không tìm thấy gói farming phù hợp"]}
                  </Typography.Text>
                }
              />
            )}

            <Affix offsetBottom={0.001}>
              <div className="footer" style={{ backgroundColor: colorBgBase }}>
                <div className="selected-wrapper">
                  {i18n["Đã chọn"]} <span>{selectedItems.length}</span> {i18n["Gói"].toLowerCase()}
                </div>
                {!!packageListTotal && (
                  <Pagination
                    showSizeChanger
                    total={packageListTotal}
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

        {packageIdModal && (
          <PackageIdModal
            providerId={gSelectedProvider?.id}
            packageId={packageIdModal}
            open={!!packageIdModal}
            onCancel={() => setPackageIdModal(undefined)}
          />
        )}
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

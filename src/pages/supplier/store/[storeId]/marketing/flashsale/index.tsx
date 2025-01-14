import Avatar from "@/components/avatar/Avatar";
import Button from "@/components/button/Button";
import Card from "@/components/card/Card";
import SortBySelect from "@/components/field/SortBySelect";
import BreadcrumbHeader from "@/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "@/components/layout/SiderHeaderLayout";
import StyledPage, {
  cssFilterWrapper,
  cssFooterWrapper,
  cssListWrapper,
} from "@/components/layout/StyledPage";
import CreateFlashSale from "@/components/modal/CreateFlashSale";
import RangePicker from "@/components/picker/RangePicker";
import Pagination from "@/components/shared/Pagination";
import ItemTableStyled from "@/components/table/ItemTable";
import useFlashSaleColumns from "@/components/table/useFlashSaleColumns";
import useChangeLocale from "@/hooks/useChangeLocale";
import useGetProvider from "@/hooks/useGetProvider";
import { flashSaleApi } from "@/redux/query/flashSale.query";
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/query";
import { useDebounce } from "ahooks";
import { Affix, Divider, Empty, Flex, Form, Select, Space, Typography } from "antd";
import { parseAsInteger, parseAsString, useQueryStates } from "next-usequerystate";
import { useRouter } from "next/router";
import { useId, useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { MdOutlineStore } from "react-icons/md";

type TPageProps = {};

const defaultFilter = {
  dateStart: parseAsString,
  dateEnd: parseAsString,
  providerId: parseAsInteger,
  formId: parseAsInteger.withDefault(0),
  orderBy: parseAsInteger.withDefault(1),
  skipCount: parseAsInteger,
  maxResultCount: parseAsInteger.withDefault(10),
  sortBy: parseAsInteger.withDefault(2),
};

const Page = ({}: TPageProps) => {
  const uid = useId();
  const {
    replace,
    query: { storeId },
  } = useRouter();
  const { generatedColors } = useTheme();
  const { i18n, locale } = useChangeLocale();
  const [form] = Form.useForm();
  const { gSelectedProvider } = useGetProvider({});

  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);

  const [filterData, setFilterData] = useQueryStates(defaultFilter);
  const [internalFilterData, setInternalFilterData] = useState({ keyword: "" });
  const debouncedFilterData = useDebounce(internalFilterData, { wait: 500 });
  const { data: getFlashSaleByPartnerRes } = flashSaleApi.useGetListByPartnerQuery(
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
  const flashSaleListData = getFlashSaleByPartnerRes?.data || [];
  const flashSaleListTotal = getFlashSaleByPartnerRes?.totalRecords;
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  console.log("Page ~ flashSaleListData:", flashSaleListData);

  const { dateRange, itemModels01 } = useFlashSaleColumns({ storeId: gSelectedProvider?.id });
  const mappedFlashSaleColumns = [
    { ...dateRange, align: "left", width: 180, ellipsis: true },
    { ...itemModels01, align: "left", width: 180, ellipsis: true },
  ];

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
          current={i18n["FlashSale của Shop"]}
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
            formId: 0,
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
                {i18n["FlashSale của Shop"]}
              </Typography.Title>
            }
            extra={
              <Button type="primary" icon={<BsPlusLg />} onClick={() => setIsOpenCreate(true)}>
                {i18n["Tạo"]}
              </Button>
            }
            tabList={[
              { key: "0", tab: i18n["Tất cả"] },
              { key: "1", tab: i18n["Sắp diễn ra | Đang diễn ra"] },
              { key: "2", tab: i18n["Đã kết thúc"] },
            ]}
            tabProps={{ size: "middle", tabBarGutter: 16 }}
            onTabChange={(key) => {
              form.setFieldValue("formId", +key);
              setFilterData({ ...filterData, formId: +key });
            }}
          >
            <div className="header-wrapper">
              <div className="filters-wrapper">
                <Space.Compact>
                  <Button type="primary">Khung giờ</Button>
                  <Form.Item name="rangeDate" noStyle>
                    <RangePicker />
                  </Form.Item>
                </Space.Compact>
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

            {flashSaleListData?.length ? (
              <ItemTableStyled
                showSorterTooltip={false}
                pagination={false}
                size="large"
                dataSource={flashSaleListData}
                columns={mappedFlashSaleColumns as any[]}
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
                    {i18n["Không có FlashSale của Shop nào"]}
                  </Typography.Text>
                }
              />
            )}

            <Affix offsetBottom={0.001}>
              <div className="footer" style={{ backgroundColor: "#fff" }}>
                <div className="selected-wrapper">
                  {i18n["Đã chọn"]} <span>{selectedItems.length}</span>
                </div>
                {!!flashSaleListTotal && (
                  <Pagination
                    showSizeChanger
                    total={flashSaleListTotal}
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
        {gSelectedProvider?.id && (
          <CreateFlashSale
            providerId={gSelectedProvider?.id}
            open={isOpenCreate}
            onClose={() => setIsOpenCreate(false)}
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

export default Page;

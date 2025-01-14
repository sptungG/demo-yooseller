import SortBySelect from "@/components/field/SortBySelect";
import { EcofarmSvg } from "@/components/icons";
import { usePartnerLinkFarmColumns } from "@/components/table/usePartnerLinkColumns";
import { useGetListPartnerLinksQuery } from "@/redux/query/pageprivate.query";
import { TEPartnerLinkOrderBy, TPartnerLinkFilter } from "@/types/pageprivate.types";
import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/query";
import { useCreation, useDebounce } from "ahooks";
import { Affix, Divider, Empty, Flex, Form, Select, Typography, theme } from "antd";
import { useRouter } from "next/router";
import { useId, useState } from "react";
import { BsPlusLg } from "react-icons/bs";
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
import Pagination from "src/components/shared/Pagination";
import ItemTableStyled from "src/components/table/ItemTable";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProviderFarm from "src/hooks/useGetProviderFarm";

const Page = () => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const [form] = Form.useForm();
  const {
    token: { colorBgBase },
  } = theme.useToken();
  const {
    query: { farmId },
  } = useRouter();
  const { gSelectedProvider } = useGetProviderFarm();

  const [filterData, setFilterData] = useState<TPartnerLinkFilter>({
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
  const { data } = useGetListPartnerLinksQuery(
    !!debouncedFilterData?.providerId ? debouncedFilterData : skipToken,
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const itemListData = data?.data || [];
  const itemListTotal = data?.totalRecords;

  const Columns = usePartnerLinkFarmColumns();
  const mappedColumns = useCreation(() => {
    const { nameCombined, stt, actionsStatus, imageUrl } = Columns;
    return [
      { ...stt, width: 50, align: "center" },
      { ...imageUrl, width: 100, ellipsis: true },
      { ...nameCombined },
      { ...actionsStatus, fixed: "right", width: 220 },
    ];
  }, [gSelectedProvider, Columns]);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleSubmitFilter = ({ ...formData }: any) => {
    setFilterData({ ...formData });
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
          current={i18n["Liên kết hình ảnh"]}
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
            const { keyword, orderBy, sortBy, status } = values as any;
            setFilterData({
              ...filterData,
              keyword,
              orderBy,
              sortBy,
              status,
            });
          }}
        >
          <Card
            className="list-wrapper"
            title={
              <Typography.Title level={2} className="title" style={{ margin: 0 }}>
                {i18n["Tất cả liên kết hình ảnh"]}
              </Typography.Title>
            }
            extra={
              <>
                <Button
                  type="primary"
                  icon={<BsPlusLg />}
                  href={`/supplier/farm/${farmId}/partnerlink/create`}
                >
                  {i18n["Thêm liên kết"]}
                </Button>
              </>
            }
            tabList={[
              { key: "", tab: i18n["Tất cả"] },
              { key: "1", tab: i18n["Chờ duyệt"] },
              { key: "2", tab: i18n["Đã duyệt"] },
            ]}
            tabProps={{ size: "middle", tabBarGutter: 16 }}
            activeTabKey={!!filterData?.status ? String(filterData.status) : ""}
            onTabChange={(key) => {
              form.setFieldValue("status", +key);
              setFilterData({ ...filterData, status: +key });
            }}
          >
            <div className="header-wrapper">
              <div className="filters-wrapper">
                <Form.Item name="keyword" noStyle>
                  <FilterSearchInput placeholder={i18n["Tìm kiếm liên kết"]} />
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
                      { value: TEPartnerLinkOrderBy.Id, label: i18n["Thời gian"] },
                      { value: TEPartnerLinkOrderBy.STT, label: i18n["STT"] },
                      { value: TEPartnerLinkOrderBy.Status, label: i18n["Trạng thái"] },
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
                      : i18n["Không tìm thấy liên kết phù hợp"]}
                  </Typography.Text>
                }
              />
            )}

            <Affix offsetBottom={0.001}>
              <div className="footer" style={{ backgroundColor: colorBgBase }}>
                <div className="selected-wrapper">
                  {i18n["Đã chọn"]} <span>{selectedItems.length}</span>{" "}
                  {i18n["Liên kết"].toLowerCase()}
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

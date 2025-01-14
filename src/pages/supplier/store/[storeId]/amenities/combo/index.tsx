import Avatar from "@/components/avatar/Avatar";
import Button from "@/components/button/Button";
import FilterSearchInput from "@/components/field/FilterSearchInput";
import StoreFilterPopover from "@/components/popover/StoreFilterPopover";
import Pagination from "@/components/shared/Pagination";
import AmenityTableStyled from "@/components/table/AmenityTable";
import useAmenitiesComboColumns from "@/components/table/useAmenitiesComboColumns";
import useGetProvider from "@/hooks/useGetProvider";
import { useGetAllAmenitiesCombosQuery } from "@/redux/query/amenity.query";
import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/query";
import { useCreation, useDebounce } from "ahooks";
import { Affix, Empty, Form, Typography, theme } from "antd";
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
  skipCount: parseAsInteger,
  maxResultCount: parseAsInteger.withDefault(10),
  sortBy: parseAsInteger,
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
  const { i18n } = useChangeLocale();
  const [form] = Form.useForm();
  const { gSelectedProvider } = useGetProvider({});

  const [filterData, setFilterData] = useQueryStates(defaultFilter);
  const [internalFilterData, setInternalFilterData] = useState({ keyword: "" });
  const debouncedFilterData = useDebounce(internalFilterData, { wait: 500 });
  const { data: getAllAmenitiesCombosRes } = useGetAllAmenitiesCombosQuery(
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

  const amenitiesComboListData = getAllAmenitiesCombosRes?.data || [];
  const amenitiesComboListTotal = getAllAmenitiesCombosRes?.totalRecords;
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const amenitiesComboColumns = useAmenitiesComboColumns();
  const mappedAmenitiesComboColumns = useCreation(() => {
    const { nameCombined1, originPrice, totalPrice, deposit, stock, actionsState } =
      amenitiesComboColumns;
    return [
      { ...nameCombined1, width: 300 },
      { ...originPrice, align: "right", width: 140, ellipsis: true },
      { ...totalPrice, align: "right", width: 140, ellipsis: true },
      { ...deposit, align: "right", width: 140, ellipsis: true },
      { ...stock, align: "right", width: 120, ellipsis: true },
      { ...actionsState, align: "right", width: 100, ellipsis: true },
    ];
  }, [gSelectedProvider, amenitiesComboColumns]);

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
          current={i18n["Combo dịch vụ"]}
        />
      }
    >
      <PageWrapper>
        <Form
          className="form-wrapper"
          id={uid}
          form={form}
          onFinish={handleSubmitFilter}
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
                {i18n["Combo dịch vụ"]}
              </Typography.Title>
            }
            extra={
              <Button
                type="primary"
                icon={<BsPlusLg />}
                href={`/supplier/store/${storeId}/amenities/combo/create`}
              >
                {i18n["Thêm combo"]}
              </Button>
            }
            tabList={[{ key: "", tab: i18n["Tất cả"] }]}
            tabProps={{ size: "middle", tabBarGutter: 16 }}
          >
            <div className="header-wrapper">
              <div className="filters-wrapper">
                <StoreFilterPopover formId={uid} width={424}>
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={false} />
                </StoreFilterPopover>
                <Form.Item name="keyword" noStyle>
                  <FilterSearchInput placeholder={i18n["Tìm kiếm combo"]} />
                </Form.Item>
              </div>
            </div>

            {amenitiesComboListData?.length ? (
              <AmenityTableStyled
                showSorterTooltip={false}
                pagination={false}
                size="large"
                dataSource={amenitiesComboListData}
                columns={mappedAmenitiesComboColumns as any[]}
                rowSelection={{
                  columnWidth: 32,
                  selectedRowKeys: selectedItems,
                  onChange: (selectedRowKeys, selectedRows) => {
                    setSelectedItems(selectedRowKeys as any[]);
                  },
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
                    {i18n["Không có combo dịch vụ nào"]}
                  </Typography.Text>
                }
              />
            )}

            <Affix offsetBottom={0.001}>
              <div className="footer" style={{ backgroundColor: colorBgBase }}>
                <div className="selected-wrapper">
                  {i18n["Đã chọn"]} <span>{selectedItems.length}</span>{" "}
                  {i18n["Combo"].toLowerCase()}
                </div>
                {!!amenitiesComboListTotal && (
                  <Pagination
                    showSizeChanger
                    total={amenitiesComboListTotal}
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
        width: calc((100% / var(--f-columns) - var(--f-gap-x)));
      }
    }
    .list.list-container {
      display: flex;
      flex-direction: column;
      padding: 0;
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

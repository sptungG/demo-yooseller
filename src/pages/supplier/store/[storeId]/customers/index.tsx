import SortBySelect from "@/components/field/SortBySelect";
import { TCustomersFilter, TECustomersOrderBy, TECustomersSearchBy } from "@/types/customers.types";
import styled from "@emotion/styled";
import { useCreation, useDebounce } from "ahooks";
import { Affix, Divider, Empty, Flex, Form, Modal, Select, Typography, theme } from "antd";
import { useRouter } from "next/router";
import { useId, useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { MdOutlineFileDownload, MdOutlineStore } from "react-icons/md";
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
import useCustomersColumns from "src/components/table/useCustomersColumns";

import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProvider from "src/hooks/useGetProvider";
import { useGetListCustomersQuery } from "src/redux/query/customers.query";

const Page = () => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [form] = Form.useForm();
  const formtuKhoa = Form.useWatch("tuKhoa", form);
  const formfieldSearch = Form.useWatch("fieldSearch", form);
  const {
    token: { colorBgBase },
  } = theme.useToken();
  const {
    query: { storeId },
  } = useRouter();
  const { gSelectedProvider } = useGetProvider({});

  const [filterData, setFilterData] = useState<TCustomersFilter>({
    orderBy: 1,
    sortBy: 1,
    phoneNumber: "",
    fieldSearch: 1,
    tuKhoa: "",
  });
  const debouncedFilterData = useDebounce(
    {
      ...filterData,
      providerId: gSelectedProvider?.id,
    },
    { wait: 500 },
  );
  const { data } = useGetListCustomersQuery(debouncedFilterData, {
    refetchOnMountOrArgChange: true,
    skip: !debouncedFilterData?.providerId,
  });
  const itemListData = data?.data || [];
  const itemListTotal = data?.totalRecords;

  const Columns = useCustomersColumns();
  const mappedColumns = useCreation(() => {
    const { nameCombined, gender, dateOfBirth, points, actionsStatus } = Columns;
    return [
      { ...nameCombined, sorter: undefined },
      { ...gender, align: "center" },
      { ...dateOfBirth, align: "center" },
      { ...points, align: "center" },
      //{ ...creationTime, align: "center" },
      actionsStatus,
    ];
  }, [gSelectedProvider, Columns]);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleSubmitFilter = ({ ...formData }: any) => {
    let { keyword, phoneNumber, tuKhoa } = formData;
    if (formfieldSearch == TECustomersSearchBy.SoDienThoai) {
      keyword = "";
      phoneNumber = tuKhoa;
    } else if (formfieldSearch == TECustomersSearchBy.keyword) {
      keyword = tuKhoa;
      phoneNumber = "";
    } else {
      keyword = "";
      phoneNumber = "";
    }
    setFilterData({ ...formData, keyword, phoneNumber });
  };
  console.log("formtuKhoa", formtuKhoa);
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
          current={i18n["Tất cả khách hàng"]}
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
            const { keyword, orderBy, sortBy, fieldSearch, tuKhoa, phoneNumber } = values as any;
            setFilterData({
              ...filterData,
              keyword,
              orderBy,
              sortBy,
              fieldSearch,
              tuKhoa,
              phoneNumber,
            });
          }}
        >
          <Card
            className="list-wrapper"
            title={
              <Typography.Title level={2} className="title" style={{ margin: 0 }}>
                {i18n["Tất cả khách hàng"]}
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
                  href={`/supplier/store/${storeId}/customers/create`}
                >
                  {i18n["Thêm khách hàng"]}
                </Button>
              </>
            }
          >
            <div className="header-wrapper">
              <div className="filters-wrapper">
                <Flex justify="flex-start" align="flex-start">
                  <Form.Item name="fieldSearch" help="">
                    <Select
                      className="searchQuick"
                      options={[
                        { value: TECustomersSearchBy.SoDienThoai, label: i18n["Số điện thoại"] },
                        //{ value: TECustomersSearchBy.keyword, label: i18n["Tên khách hàng"] },
                      ]}
                      onChange={(value) => {
                        if (value == TECustomersSearchBy.SoDienThoai) {
                          setFilterData({
                            ...filterData,
                            keyword: "",
                            fieldSearch: value,
                            phoneNumber: formtuKhoa,
                          });
                        } else if (value == TECustomersSearchBy.keyword) {
                          setFilterData({
                            ...filterData,
                            phoneNumber: "",
                            fieldSearch: value,
                            keyword: formtuKhoa,
                          });
                        } else {
                          setFilterData({
                            ...filterData,
                            phoneNumber: "",
                            fieldSearch: value,
                            keyword: "",
                          });
                        }
                      }}
                    />
                  </Form.Item>
                  <Form.Item name="tuKhoa" noStyle>
                    <FilterSearchInput placeholder={i18n["Tìm kiếm khách hàng"]} />
                  </Form.Item>
                </Flex>
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
                      { value: TECustomersOrderBy.Id, label: i18n["Thời gian"] },
                      // { value: TECustomersOrderBy.ProvinceCode, label: i18n["Mã tỉnh"] },
                      // { value: TECustomersOrderBy.DistrictCode, label: i18n["Mã huyện"] },
                      // { value: TECustomersOrderBy.WardCode, label: i18n["Mã xã"] },
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
                      : i18n["Không tìm thấy khách hàng phù hợp"]}
                  </Typography.Text>
                }
              />
            )}

            <Affix offsetBottom={0.001}>
              <div className="footer" style={{ backgroundColor: colorBgBase }}>
                <div className="selected-wrapper">
                  {i18n["Đã chọn"]} <span>{selectedItems.length}</span>{" "}
                  {i18n["Khách hàng"].toLowerCase()}
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
  .searchQuick .ant-select-selector {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    height: 33px;
    background: #339fd9;
    color: white;
    width: 150px;
    font-size: 14px;
  }
`;
export default withAuth(Page);

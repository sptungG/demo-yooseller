import SortBySelect from "@/components/field/SortBySelect";
import styled from "@emotion/styled";
import { useCreation, useDebounce } from "ahooks";
import { Affix, Divider, Empty, Flex, Form, Select, Typography, theme } from "antd";
import { parseAsInteger, useQueryStates } from "next-usequerystate";
import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import Button from "src/components/button/Button";
import Card from "src/components/card/Card";
import FilterSearchInput from "src/components/field/FilterSearchInput";
import GroupTypeCombinedSelect from "src/components/field/GroupTypeCombinedSelect";
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
import StoreTableStyled from "src/components/table/StoreTable";
import useStoreColumns from "src/components/table/useStoreColumns";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useGetAllProvidersByPartnerQuery } from "src/redux/query/provider.query";

const defaultFilter = {
  type: parseAsInteger,
  groupType: parseAsInteger,
  formId: parseAsInteger.withDefault(20),
  orderBy: parseAsInteger.withDefault(1),
  skipCount: parseAsInteger,
  maxResultCount: parseAsInteger.withDefault(10),
  sortBy: parseAsInteger.withDefault(2),
};

const Page = () => {
  const [form] = Form.useForm();
  const uid = useId();
  const {
    token: { colorBgBase },
  } = theme.useToken();
  const { message } = useApp();
  const { i18n } = useChangeLocale();

  const [filterData, setFilterData] = useQueryStates(defaultFilter);
  const [internalFilterData, setInternalFilterData] = useState({ keyword: "" });
  const debouncedFilterData = useDebounce(internalFilterData, { wait: 500 });
  const { data } = useGetAllProvidersByPartnerQuery(
    { ...debouncedFilterData, ...filterData },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const storeList = data?.data || [];
  const storeListTotal = data?.totalRecords;

  const Columns = useStoreColumns({});
  const mappedStoreColumns = useCreation(() => {
    const { nameCombined4, type, others, actionsState } = Columns;
    return [
      { ...nameCombined4, width: 400 },
      { ...type, align: "left" },
      { ...others, align: "right", ellipsis: true },
      { ...actionsState, width: 220, fixed: "right" },
    ];
  }, [Columns]);

  const handleSubmitFilter = ({ keyword, ...formData }: any) => {
    setInternalFilterData({ keyword });
    setFilterData(formData);
  };

  return (
    <SiderHeaderLayout
      hideSider
      headerLeft={<BreadcrumbHeader current={i18n["Tất cả cửa hàng"]} />}
    >
      <PageWrapper>
        <Form
          id={uid}
          form={form}
          onFinish={handleSubmitFilter}
          initialValues={{
            formId: 20,
            orderBy: 1,
            sortBy: 2,
            type: null,
            groupType: null,
            skipCount: null,
            maxResultCount: null,
            keyword: "",
          }}
          onValuesChange={(changedValues, values) => {
            const { keyword, ...rest } = values as any;
            setInternalFilterData({ keyword });
            setFilterData({ ...filterData, ...rest });
          }}
        >
          <Card
            className={"list-wrapper"}
            title={
              <Typography.Title level={2} style={{ margin: 0 }}>
                {i18n["Tất cả cửa hàng"]}
              </Typography.Title>
            }
            extra={
              <Flex align="center">
                <Button type="primary" icon={<BsPlusLg />} href="/supplier/store/create">
                  {i18n["Tạo cửa hàng"]}
                </Button>
                <Divider type="vertical" style={{ margin: "0 12px", height: 24 }} />
                <Link className="link-to-farm" href={"/supplier/farm/list"}>
                  <div className="container">
                    <Typography.Text strong style={{ color: "#fff" }}>
                      Đi đến <u>trang trại</u>
                    </Typography.Text>
                  </div>
                  <Image
                    src={"/images/farm-bg-05.png"}
                    alt=""
                    fill
                    className="bg-img"
                    style={{ objectFit: "cover", objectPosition: "bottom" }}
                  />
                </Link>
              </Flex>
            }
            tabList={[
              { key: "20", tab: i18n["Tất cả"] },
              { key: "21", tab: i18n["Chờ duyệt"] },
              { key: "22", tab: i18n["Đang hoạt động"] },
              { key: "23", tab: i18n["Ngừng kinh doanh"] },
              { key: "24", tab: i18n["Đã ẩn"] },
              { key: "25", tab: i18n["Vi phạm"] },
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
                <StoreFilterPopover formId={uid} width={460}>
                  <GroupTypeCombinedSelect
                    groupTypeFormProps={{
                      rules: [{ type: "number" }],
                      labelCol: { span: 8 },
                      labelAlign: "left",
                      help: "",
                    }}
                    typeFormProps={{
                      rules: [{ type: "number" }],
                      labelCol: { span: 8 },
                      labelAlign: "left",
                      help: "",
                    }}
                  />
                </StoreFilterPopover>
                <Form.Item noStyle name="keyword">
                  <FilterSearchInput placeholder={i18n["Tìm kiếm cửa hàng"]} />
                </Form.Item>
              </div>
              <Flex className="right-wrapper" align="center" justify="flex-end">
                <Divider type="vertical" style={{ margin: 0 }} />
                <Form.Item name="orderBy" help="" noStyle>
                  <Select
                    placement="bottomRight"
                    variant="borderless"
                    popupMatchSelectWidth={224}
                    listHeight={180}
                    placeholder={i18n["Sắp xếp"]}
                    options={[
                      { value: 1, label: i18n["Thời gian tạo"] },
                      { value: 2, label: i18n["Tên"] },
                      { value: 3, label: i18n["Đánh giá"] },
                      { value: 4, label: i18n["Lượt đánh giá"] },
                      { value: 5, label: i18n["Khoảng cách địa lý"] },
                    ]}
                  />
                </Form.Item>
                <Form.Item name="sortBy" help="" noStyle>
                  <SortBySelect style={{ marginLeft: -6 }} />
                </Form.Item>
              </Flex>
            </div>
            {storeList.length > 0 ? (
              <StoreTableStyled
                showSorterTooltip={false}
                columns={mappedStoreColumns as any[]}
                dataSource={storeList}
                pagination={false}
                size="large"
                rowKey={(item: any) => item.id}
                scroll={{ x: "100%" }}
              />
            ) : (
              <Empty
                className="list-empty"
                imageStyle={{ height: 144 }}
                description={
                  <Typography.Text ellipsis type="secondary">
                    {i18n["Không tìm thấy cửa hàng phù hợp"]}
                  </Typography.Text>
                }
              />
            )}
            <Affix offsetBottom={0.001} style={{ marginTop: "auto" }}>
              <div className="footer" style={{ backgroundColor: colorBgBase }}>
                {!!storeListTotal && (
                  <Pagination
                    showSizeChanger
                    total={storeListTotal}
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
  margin: 0 auto;
  max-width: 1440px;
  width: 100%;
  flex: 1 1 auto;
  min-height: 0;
  .list-wrapper {
    ${cssListWrapper}
    .filters-wrapper {
      ${cssFilterWrapper}
    }
    .list-header {
      display: flex;
      align-items: center;
      padding: 16px 16px 0 16px;
      .div1 {
        flex: 0 0 416px;
      }
      & > div:not(:first-of-type) {
        padding: 0 16px;
      }
      .div3 {
        margin-left: auto;
      }
      .div4 {
        flex: 0 0 148px;
      }
    }
    .footer {
      ${cssFooterWrapper}
      margin-top: auto;
      padding: 16px;
      border: none;
      .ant-pagination {
        margin-left: auto;
      }
    }
  }

  & .link-to-farm {
    height: 32px;
    width: 150px;
    border-radius: 8px;
    z-index: 100;
    position: relative;
    overflow: hidden;
    & > .container {
      border-radius: 8px;
      padding: 6px 8px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      white-space: nowrap;
      background-color: rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(0.5px);
    }
    & > img {
      border-radius: 8px;
      z-index: -1;
    }
    &:hover {
      & > img {
        transform: scale(1.2);
      }
    }
  }

  & > form {
    height: 100%;
  }
  & .list-wrapper {
    height: 100%;
    & > .ant-card-body {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
    }
  }
  & .list-empty {
    flex: 1 1 auto;
    min-height: 0;
  }
`;

export default withAuth(Page, false);

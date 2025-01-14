import SortBySelect from "@/components/field/SortBySelect";
import { FarmFilterPopover } from "@/components/popover/StoreFilterPopover";
import StoreTableStyled from "@/components/table/StoreTable";
import { useGetAllProvidersEcofarmByPartnerQuery } from "@/redux/query/farm.query";
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { useCreation, useDebounce } from "ahooks";
import { Affix, Divider, Empty, Flex, Form, Select, Typography, theme } from "antd";
import { parseAsInteger, useQueryStates } from "next-usequerystate";
import { useId, useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { MdOutlineStore } from "react-icons/md";
import Button from "src/components/button/Button";
import Card from "src/components/card/Card";
import FilterSearchInput from "src/components/field/FilterSearchInput";
import { GroupTypeCombinedSelectFarm } from "src/components/field/GroupTypeCombinedSelect";
import withAuth from "src/components/hoc/withAuth";
import BreadcrumbHeader from "src/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "src/components/layout/SiderHeaderLayout";
import StyledPage, {
  cssFilterWrapper,
  cssFooterWrapper,
  cssListWrapper,
} from "src/components/layout/StyledPage";
import Pagination from "src/components/shared/Pagination";
import useFarmColumns from "src/components/table/useFarmColumns";
import useChangeLocale from "src/hooks/useChangeLocale";

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
  const { generatedColors } = useTheme();

  const { i18n } = useChangeLocale();

  const [filterData, setFilterData] = useQueryStates(defaultFilter);
  const [internalFilterData, setInternalFilterData] = useState({ keyword: "" });
  const debouncedFilterData = useDebounce(internalFilterData, { wait: 500 });
  const { data } = useGetAllProvidersEcofarmByPartnerQuery(
    { ...debouncedFilterData, ...filterData },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const farmList = data?.data || [];
  const farmListTotal = data?.totalRecords;

  const Columns = useFarmColumns({});
  const mappedFarmColumns = useCreation(() => {
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
      headerLeft={<BreadcrumbHeader current={i18n["Tất cả trang trại"]} />}
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
                {i18n["Tất cả trang trại"]}
              </Typography.Title>
            }
            extra={
              <Flex align="center">
                <Button type="primary" icon={<BsPlusLg />} href="/supplier/farm/create">
                  {i18n["Thêm mới trang trại"]}
                </Button>
                <Divider type="vertical" style={{ margin: "0 12px", height: 24 }} />
                <Button
                  type="link"
                  style={{
                    width: 150,
                    backgroundColor: generatedColors[0],
                    fontWeight: 500,
                    border: `1px solid ${generatedColors[2]}`,
                  }}
                  href="/supplier/store"
                  icon={<MdOutlineStore size={18} />}
                >
                  {"Đi đến cửa hàng"}
                </Button>
              </Flex>
            }
            tabList={[
              { key: "20", tab: i18n["Tất cả"] },
              { key: "21", tab: i18n["Chờ duyệt"] },
              { key: "22", tab: i18n["Đang hoạt động"] },
              { key: "23", tab: i18n["Không hoạt động"] },
              { key: "24", tab: i18n["Đã ẩn"] },
              { key: "25", tab: i18n["Đã khóa"] },
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
                <FarmFilterPopover formId={uid} width={460}>
                  <GroupTypeCombinedSelectFarm
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
                    type={2}
                  />
                </FarmFilterPopover>
                <Form.Item noStyle name="keyword">
                  <FilterSearchInput placeholder={i18n["Tìm kiếm trang trại"]} />
                </Form.Item>
              </div>
              <Flex className="right-wrapper" align="center" justify="flex-end">
                <Form.Item name="formId" help="" noStyle hidden>
                  <Select
                    listHeight={200}
                    placement="bottomRight"
                    variant="borderless"
                    popupMatchSelectWidth={224}
                    placeholder={i18n["Khác"]}
                    options={[
                      { value: 20, label: i18n["Tất cả"] },
                      { value: 21, label: i18n["Đang hoạt động"] },
                      { value: 22, label: i18n["Hết hàng"] },
                      { value: 23, label: i18n["Chờ duyệt"] },
                      { value: 24, label: i18n["Vi phạm"] },
                      { value: 25, label: i18n["Đã ẩn"] },
                    ]}
                  />
                </Form.Item>
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
            {farmList.length > 0 ? (
              <StoreTableStyled
                showSorterTooltip={false}
                columns={mappedFarmColumns as any[]}
                dataSource={farmList}
                pagination={false}
                size="large"
                rowKey={(item: any) => item.id}
                scroll={{ x: true }}
              />
            ) : (
              <Empty
                className="list-empty"
                imageStyle={{ height: 144 }}
                description={
                  <Typography.Text ellipsis type="secondary">
                    {i18n["Không tìm thấy trang trại phù hợp"]}
                  </Typography.Text>
                }
              />
            )}
            <Affix offsetBottom={0.001} style={{ marginTop: "auto" }}>
              <div className="footer" style={{ backgroundColor: colorBgBase }}>
                {!!farmListTotal && (
                  <Pagination
                    showSizeChanger
                    total={farmListTotal}
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

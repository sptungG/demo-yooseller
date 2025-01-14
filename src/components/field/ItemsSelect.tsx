import useChangeLocale from "@/hooks/useChangeLocale";
import { useGetAllItemsByPartnerQuery } from "@/redux/query/item.query";
import { useGetProviderByIdQuery } from "@/redux/query/provider.query";
import { TItemsFilter } from "@/types/item.types";
import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/query";
import { TableProps } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { useState } from "react";
import { cssFooterWrapper } from "../layout/StyledPage";
import Pagination from "../shared/Pagination";
import ItemTableStyled from "../table/ItemTable";
import useItemColumns from "../table/useItemColumns";

type TItemsSelectProps = {
  value?: number[];
  onChange?: (v?: number[]) => void;
  onChangeFull?: TableRowSelection<any>["onChange"];
  providerId?: number;
  rowSelection?: Omit<TableRowSelection<any>, "selectedRowKeys" | "onChange">;
  tableProps?: Pick<TableProps<any>, "scroll" | "style">;
  footerStyle?: React.CSSProperties;
  style?: React.CSSProperties;
};

const ItemsSelect = ({
  value,
  onChange,
  providerId,
  rowSelection,
  tableProps,
  onChangeFull,
  footerStyle,
  style,
}: TItemsSelectProps) => {
  const { i18n } = useChangeLocale();
  const { data: getProviderByIdRes, isLoading } = useGetProviderByIdQuery(
    providerId ? { id: providerId } : skipToken,
    { refetchOnMountOrArgChange: true },
  );
  const gSelectedProvider = getProviderByIdRes?.data;

  const [filterData, setFilterData] = useState<TItemsFilter>({
    formId: 10,
    orderBy: 2,
    maxResultCount: 10,
  });
  const { data: getAllItemsByPartnerRes } = useGetAllItemsByPartnerQuery(
    gSelectedProvider?.id
      ? {
          providerId: gSelectedProvider?.id,
          isItemBooking: gSelectedProvider?.groupType !== 2,
          ...filterData,
        }
      : skipToken,
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const itemListTotal = getAllItemsByPartnerRes?.totalRecords || 0;

  const {
    nameCombined3,
    nameCombined4,
    nameCombined5,
    price2,
    price3,
    rateViewCount,
    sku,
    sales,
    stock,
    actionsStatus,
    properties24,
    pitchtype,
    address,
    phoneNumber,
  } = useItemColumns({});
  const columns = [
    {
      ...nameCombined4,
      sorter: undefined,
      width: 400,
      title: `${i18n["Sản phẩm"]} x${itemListTotal}`,
    },
    { ...rateViewCount, ellipsis: true },
    { ...sku, width: 120 },
    { ...sales, width: 120 },
    { ...stock, width: 120 },
  ];

  return (
    <>
      <ItemTableStyled
        scroll={{ x: "100%", y: 390 }}
        rowSelection={{
          type: "checkbox",
          onChange: (selectedRowKeys, selectedRows, info) => {
            onChange?.(selectedRowKeys as any[]);
            onChangeFull?.(selectedRowKeys, selectedRows, info);
          },
          preserveSelectedRowKeys: true,
          selectedRowKeys: value,
          ...rowSelection,
        }}
        rowKey={(record) => record.id}
        columns={columns as any[]}
        dataSource={getAllItemsByPartnerRes?.data || []}
        pagination={false}
        {...tableProps}
      />
      <FooterStyled className="footer" style={{ backgroundColor: "#fff", ...footerStyle }}>
        <div className="selected-wrapper">
          {i18n["Đã chọn"]} <span>{value?.length}</span> {i18n["Sản phẩm"].toLowerCase()}
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
      </FooterStyled>
    </>
  );
};

const FooterStyled = styled.div`
  ${cssFooterWrapper}
  border-top: none;
  margin-top: auto;
  padding: 16px 16px;
  .selected-wrapper {
    & > span {
      font-weight: 600;
    }
  }
  .ant-pagination {
    margin-left: auto;
  }
`;

export default ItemsSelect;

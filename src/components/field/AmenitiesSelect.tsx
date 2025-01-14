import useChangeLocale from "@/hooks/useChangeLocale";
import { useGetAllAmenitiesItemsQuery } from "@/redux/query/amenity.query";
import { useGetProviderByIdQuery } from "@/redux/query/provider.query";
import { TAmenitiesFilter } from "@/types/amenity.types";
import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/query";
import { Form } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { TableRowSelection } from "antd/es/table/interface";
import { useState } from "react";
import { cssFooterWrapper } from "../layout/StyledPage";
import Pagination from "../shared/Pagination";
import AmenityTableStyled from "../table/AmenityTable";
import useAmenityColumns from "../table/useAmenityColumns";

type TAmenitiesSelectProps = {
  value?: number[];
  onChange?: (v?: number[]) => void;
  providerId?: number;
  rowSelection?: Omit<TableRowSelection<any>, "selectedRowKeys" | "onChange">;
};

const AmenitiesSelect = ({ value, onChange, providerId, rowSelection }: TAmenitiesSelectProps) => {
  const { i18n } = useChangeLocale();
  const { data: getProviderByIdRes, isLoading } = useGetProviderByIdQuery(
    providerId ? { id: providerId } : skipToken,
    { refetchOnMountOrArgChange: true },
  );
  const gSelectedProvider = getProviderByIdRes?.data;

  const [filterData, setFilterData] = useState<TAmenitiesFilter>({
    maxResultCount: 10,
  });
  const { data: getAllAmenitiesItemsRes } = useGetAllAmenitiesItemsQuery(
    gSelectedProvider?.id
      ? {
          ...filterData,
          providerId: gSelectedProvider?.id,
        }
      : skipToken,
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const amenityListTotal = getAllAmenitiesItemsRes?.totalRecords || 0;

  const { nameCombined1, price, stock } = useAmenityColumns({});
  const columns = [
    {
      ...nameCombined1,
      sorter: undefined,
      width: 300,
      title: `${i18n["Dịch vụ"]} x${amenityListTotal}`,
    },
    { ...price, ellipsis: true },
    { ...stock, width: 120 },
  ];

  const form = Form.useFormInstance();
  let originPrice = 0;

  return (
    <StyledWrapper>
      <AmenityTableStyled
        scroll={{ x: "100%", y: 360 }}
        rowSelection={{
          type: "checkbox",
          onChange: (selectedRowKeys, selectedRows: AnyObject[], info) => {
            onChange?.(selectedRowKeys as any[]);
            selectedRows?.map((item) => (originPrice += item?.price));
            form.setFieldValue("originPrice", originPrice);
          },
          selectedRowKeys: value,
          ...rowSelection,
        }}
        rowKey={(record) => record.id}
        columns={columns as any[]}
        dataSource={getAllAmenitiesItemsRes?.data || []}
        pagination={false}
      />
      <div className="footer" style={{ backgroundColor: "#fff" }}>
        <div className="selected-wrapper">
          {i18n["Đã chọn"]} <span>{value?.length}</span> {i18n["Sản phẩm"].toLowerCase()}
        </div>
        {!!amenityListTotal && (
          <Pagination
            showSizeChanger
            total={amenityListTotal}
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
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 480px;
  & > .footer {
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
  }
`;

export default AmenitiesSelect;

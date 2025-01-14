import ItemTableStyled from "@/components/table/ItemTable";
import useItemsFarmColumns from "@/components/table/useItemsFarmColumns";
import useGetProviderFarm from "@/hooks/useGetProviderFarm";
import {
  useGetAllItemsByPartnerForEcoFarmQuery,
  useGetEcofarmPackageByIdQuery,
} from "@/redux/query/farm.query";
import { TItemsFilter } from "@/types/farm.types";
import { css } from "@emotion/react";
import { useCreation, useDebounce } from "ahooks";
import { Affix, Empty, Pagination, Typography, theme } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import { cssAddItemModel } from "src/components/shared/ItemStyled";
import useChangeLocale from "src/hooks/useChangeLocale";

type TItemsListProps = { id?: string };

const ItemsList = ({}: TItemsListProps) => {
  const { i18n } = useChangeLocale();
  const {
    query: { packageId },
  } = useRouter();
  const {
    token: { colorBgBase },
  } = theme.useToken();

  const { gSelectedProvider } = useGetProviderFarm();

  const { data: resPackage } = useGetEcofarmPackageByIdQuery(
    { id: +(packageId as string) },
    { refetchOnMountOrArgChange: true, skip: !packageId },
  );
  const dataPackage = resPackage?.data;
  const [filterData, setFilterData] = useState<TItemsFilter>({
    orderBy: 1,
    sortBy: 1,
    maxResultCount: 10,
  });
  const debouncedFilterData = useDebounce(
    {
      ...filterData,
      providerId: gSelectedProvider?.id,
      ecofarmPackageId: dataPackage?.id,
    },
    { wait: 500 },
  );
  const { data } = useGetAllItemsByPartnerForEcoFarmQuery(debouncedFilterData, {
    refetchOnMountOrArgChange: true,
    skip: !debouncedFilterData?.providerId && !debouncedFilterData?.ecofarmPackageId,
  });
  const listData = data?.data || [];
  const totalRows = data?.totalRecords;
  const Columns = useItemsFarmColumns();

  const mappedColumns = useCreation(() => {
    const { nameCombined, actionsStatus, ratePoint, sku, sales, stock } = Columns;
    return [{ ...nameCombined, sorter: undefined }, ratePoint, sku, sales, stock, actionsStatus];
    //return [nameCombined, actionsStatus];
  }, [Columns]);
  //   const handleSubmitFilter = (formData: any) => {
  //     setFilterData(formData);
  //   };
  return (
    <>
      {listData.length > 0 &&
      !!debouncedFilterData.providerId &&
      !!debouncedFilterData.ecofarmPackageId ? (
        <ItemTableStyled
          showSorterTooltip={false}
          columns={mappedColumns as any[]}
          dataSource={listData}
          pagination={false}
          size="large"
          //   rowSelection={{
          //     columnWidth: 32,
          //     onChange: (selectedRowKeys) => {
          //       setSelectedItems(selectedRowKeys as any[]);
          //     },
          //     getCheckboxProps: (item: any) => ({
          //       disabled:
          //         [1].includes(filterData?.formId || 1) &&
          //         ![TPackageStatus.INSESTING, TPackageStatus.CLOSED].includes(item.status),
          //     }),
          //   }}
          rowKey={(item: any) => item.id}
          scroll={{ x: true }}
        />
      ) : (
        <Empty
          className="list-empty"
          imageStyle={{ height: 144 }}
          description={
            <Typography.Text ellipsis type="secondary">
              {i18n["Không tìm thấy sản phẩm phù hợp"]}
            </Typography.Text>
          }
        />
      )}
      <Affix offsetBottom={0.001}>
        <div
          className="footer"
          style={{
            backgroundColor: colorBgBase,
            display: "flex",
            justifyContent: "flex-end",
            padding: 15,
          }}
        >
          {!!totalRows && (
            <Pagination
              showSizeChanger
              total={totalRows}
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
    </>
  );
};

export const cssItemsList = css`
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
  gap: 12px;
  position: relative;
  & > .left-wrapper {
    flex: 1 1 auto;
    min-width: 0px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  & .right-wrapper-Affix {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    transform: translateX(-100%);
    @media screen and (max-width: 1200px) {
      display: none;
    }
  }
  .ant-form-item-control-input-content .quill {
    .ql-toolbar {
      border-radius: 8px 8px 0 0;
    }
    .ql-container {
      border-radius: 0 0 8px 8px;
    }
  }
  .ant-form-item-label .ant-typography-secondary {
    margin-left: 8px;
  }
  .add-itemmodel-wrapper {
    margin-bottom: 24px;
    .container {
      ${cssAddItemModel}
    }
  }
`;

export default ItemsList;

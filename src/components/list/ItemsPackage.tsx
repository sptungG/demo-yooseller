import useChangeLocale from "@/hooks/useChangeLocale";
import { useGetAllItemsByPartnerForEcoFarmQuery } from "@/redux/query/farm.query";
import styled from "@emotion/styled";
import { Empty, Flex, Typography } from "antd";
import { useId, useState } from "react";
import Pagination from "../shared/Pagination";
import ItemTableStyled from "../table/ItemTable";
import useItemsFarmColumns from "../table/useItemsFarmColumns";

type TItemsPackageProps = { packageId?: number; providerId?: number };

const ItemsPackage = ({ packageId, providerId }: TItemsPackageProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const [filterData, setFilterData] = useState({
    ecofarmPackageId: packageId,
    providerId,
    formId: 10,
    orderBy: 2,
    sortBy: 2,
    skipCount: 0,
    maxResultCount: 10,
  });
  const { data: getListEcofarmRegistersRes } = useGetAllItemsByPartnerForEcoFarmQuery(filterData, {
    refetchOnMountOrArgChange: true,
  });
  const listRegister = getListEcofarmRegistersRes?.data || [];
  const totalRegister = getListEcofarmRegistersRes?.totalRecords || 0;

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const { nameCombined, actionsStatus, ratePoint, sku, sales, stock } = useItemsFarmColumns();
  const mappedColumns = [
    { ...nameCombined, width: 320 },
    { ...ratePoint, width: 120, align: "right", ellipsis: true },
    { ...sales, width: 100, align: "right", ellipsis: true },
    { ...stock, width: 120, align: "right", ellipsis: true },
    { ...actionsStatus, width: 200, align: "right", ellipsis: true, fixed: "right" },
  ];

  return (
    <StyledWrapper vertical>
      {listRegister.length ? (
        <ItemTableStyled
          showSorterTooltip={false}
          columns={mappedColumns as any[]}
          dataSource={listRegister}
          pagination={false}
          size="large"
          rowKey={(item: any) => item.id}
          scroll={{ x: "100%" }}
        />
      ) : (
        <Empty
          style={{ marginTop: "auto" }}
          imageStyle={{ height: 144 }}
          description={
            <Typography.Text ellipsis type="secondary">
              {i18n["Không tìm thấy người đăng ký phù hợp"]}
            </Typography.Text>
          }
        />
      )}
      <Flex
        className="footer"
        justify="space-between"
        align="center"
        style={{ height: 72, backgroundColor: "#fff", padding: "0 0 0 16px" }}
      >
        <div className="selected-wrapper">
          {i18n["Đã chọn"]} <b>{selectedItems.length}</b>
        </div>
        {!!totalRegister && (
          <Pagination
            hideOnSinglePage
            showSizeChanger
            total={totalRegister}
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
      </Flex>
    </StyledWrapper>
  );
};

const StyledWrapper = styled(Flex)`
  min-height: calc(100dvh - 306px);
  &.empty {
  }
  & .footer {
    margin-top: auto;
    position: sticky;
    bottom: 0;
    left: 0;
    z-index: 100;
  }
`;

export default ItemsPackage;

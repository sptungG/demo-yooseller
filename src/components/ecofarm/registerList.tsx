import UpdateRegisterStateFarm from "@/components/field/UpdateRegisterStateFarm";
import ItemTableStyled from "@/components/table/ItemTable";
import useRegisterPackageFarmColumns from "@/components/table/useRegisterPackageFarmColumns";
import useGetProviderFarm from "@/hooks/useGetProviderFarm";
import {
  useGetEcofarmPackageByIdQuery,
  useGetListEcofarmRegisterByPartnerQuery,
} from "@/redux/query/farm.query";
import { TRegisterFilter } from "@/types/farm.types";
import { css } from "@emotion/react";
import { useCreation, useDebounce } from "ahooks";
import { Affix, Empty, Pagination, Typography, theme } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import { cssAddItemModel } from "src/components/shared/ItemStyled";
import useChangeLocale from "src/hooks/useChangeLocale";

type TRegisterListProps = { id?: string; target?: () => any };

const RegisterList = ({}: TRegisterListProps) => {
  const { i18n } = useChangeLocale();
  const {
    query: { packageId },
  } = useRouter();
  const {
    token: { colorBgBase },
  } = theme.useToken();
  const [registerId, setregisterId] = useState<any>(null);
  const [container] = useState<HTMLDivElement | null>(null);
  const { gSelectedProvider } = useGetProviderFarm();

  const { data: resPackage } = useGetEcofarmPackageByIdQuery(
    { id: +(packageId as string) },
    { refetchOnMountOrArgChange: true, skip: !packageId },
  );
  const dataPackage = resPackage?.data;
  const [filterData, setFilterData] = useState<TRegisterFilter>({
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
  const { data } = useGetListEcofarmRegisterByPartnerQuery(debouncedFilterData, {
    refetchOnMountOrArgChange: true,
    skip: !debouncedFilterData?.providerId && !debouncedFilterData?.ecofarmPackageId,
  });
  const listData = data?.data || [];
  const totalRows = data?.totalRecords;

  const Columns = useRegisterPackageFarmColumns({
    onClickUpdateStatus: (id) => {
      if (!id) return;
      setregisterId(id);
    },
  });

  const mappedColumns = useCreation(() => {
    const { nameCombined, actionsStatus, ecofarmType, totalPrice } = Columns;
    return [
      nameCombined,
      { ...ecofarmType, width: 160, align: "right" },
      { ...totalPrice, width: 160, align: "right" },
      { ...actionsStatus, width: 220, align: "right", fixed: "right" },
    ];
    // return [nameCombined, creationTime, ecofarmType, totalPrice, actionsStatus];
  }, [Columns]);
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
          rowKey={(item: any) => item.id}
          scroll={{ x: true }}
        />
      ) : (
        <Empty
          className="list-empty"
          imageStyle={{ height: 144 }}
          description={
            <Typography.Text ellipsis type="secondary">
              {i18n["Không tìm thấy người đăng ký phù hợp"]}
            </Typography.Text>
          }
        />
      )}
      <Affix offsetBottom={0.001} target={() => container}>
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
      {!!registerId && (
        <UpdateRegisterStateFarm
          open={!!registerId}
          id={registerId}
          onClose={() => {
            setregisterId(null);
          }}
        />
      )}
    </>
  );
};

export const cssRegisterList = css`
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

export default RegisterList;

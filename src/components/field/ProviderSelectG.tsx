import styled from "@emotion/styled";
import { useDebounce, useSafeState } from "ahooks";
import { Divider, Select, SelectProps, Tabs, Typography } from "antd";
import { useRouter } from "next/router";
import { CSSProperties, memo, useEffect, useState } from "react";
import { MdOutlineAddBusiness } from "react-icons/md";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProviderFarmTypes from "src/hooks/useGetProviderFarmTypes";
import useGetProviderTypes from "src/hooks/useGetProviderTypes";
import { useGetAllProvidersEcofarmByPartnerQuery } from "src/redux/query/farm.query";
import { useGetAllProvidersByPartnerQuery } from "src/redux/query/provider.query";
import { TProviderEcoFarmState, TProviderEcofarmFilter } from "src/types/farm.types";
import { TProviderState, TProvidersFilter } from "src/types/provider.types";
import Button from "../button/Button";
import Image from "../next/Image";
import { SelectItemStyled } from "../shared/ItemStyled";
import ProviderType from "../tag/ProviderType";

type TProviderSelectGProps = SelectProps & {
  imageSize?: number;
  styleItem?: CSSProperties;
  type?: string;
};

function ProviderSelectG({ imageSize = 32, styleItem, ...props }: TProviderSelectGProps) {
  const {
    replace,
    query: { storeId, farmId },
  } = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>("STORE");

  const [filterData, setFilterData] = useSafeState<TProvidersFilter>({
    formId: 20,
    maxResultCount: 100,
  });
  const debouncedFilterData = useDebounce(filterData, { wait: 500 });
  const { data: getAllProvidersRes, isFetching: isDataProvidersLoading } =
    useGetAllProvidersByPartnerQuery(debouncedFilterData, {
      refetchOnMountOrArgChange: true,
    });
  const dataList = getAllProvidersRes?.data || [];
  const dataListTotal = getAllProvidersRes?.totalRecords || 0;

  const [filterDataFarm, setFilterDataFarm] = useSafeState<TProviderEcofarmFilter>({
    formId: 20,
    maxResultCount: 100,
  });
  const debouncedFilterDataFarm = useDebounce(filterDataFarm, { wait: 500 });
  const { data: getAllProvidersEcofarmRes, isFetching: isDataFarmProvidersLoading } =
    useGetAllProvidersEcofarmByPartnerQuery(debouncedFilterDataFarm, {
      refetchOnMountOrArgChange: true,
    });
  const dataFarmList = getAllProvidersEcofarmRes?.data || [];
  const dataFarmListTotal = getAllProvidersEcofarmRes?.totalRecords || 0;

  const { i18n } = useChangeLocale();
  const { mappedTypes } = useGetProviderTypes();
  const statusStyle = (status: TProviderState): CSSProperties => ({
    opacity: [TProviderState.PENDING, TProviderState.ACTIVATED].includes(status) ? 1 : 0.45,
  });

  const { mappedFarmTypes } = useGetProviderFarmTypes();
  const statusStyleFarm = (status: TProviderEcoFarmState): CSSProperties => ({
    opacity: [TProviderEcoFarmState.PENDING, TProviderEcoFarmState.ACTIVATED].includes(status)
      ? 1
      : 0.45,
  });

  useEffect(() => {
    if (!!farmId) setSelectedTab("FARM");
    if (!!storeId) setSelectedTab("STORE");
  }, [farmId, storeId]);

  return (
    <Select
      open={open}
      onDropdownVisibleChange={setOpen}
      defaultActiveFirstOption
      loading={!!farmId ? isDataFarmProvidersLoading : isDataProvidersLoading}
      options={
        selectedTab == "FARM"
          ? dataFarmList.map((item: any) => ({
              label: (
                <SelectItemStyled style={{ ...styleItem, ...statusStyleFarm(item.state) }}>
                  <Image
                    src={item.imageUrls[0]}
                    alt={String(item.id)}
                    width={imageSize}
                    height={imageSize}
                    className="select-image"
                  />
                  <div className="name-wrapper">
                    <Typography.Text className="name" ellipsis>
                      {item.name}
                    </Typography.Text>
                  </div>
                  <div className="type-wrapper">
                    <ProviderType
                      groupType={mappedFarmTypes(item.groupType)}
                      type={mappedFarmTypes(item.type)}
                    />
                  </div>
                </SelectItemStyled>
              ),
              value: item.id,
            }))
          : dataList.map((item: any) => ({
              label: (
                <SelectItemStyled style={{ ...styleItem, ...statusStyle(item.state) }}>
                  <Image
                    src={item.imageUrls[0]}
                    alt={String(item.id)}
                    width={imageSize}
                    height={imageSize}
                    className="select-image"
                  />
                  <div className="name-wrapper">
                    <Typography.Text className="name" ellipsis>
                      {item.name}
                    </Typography.Text>
                  </div>
                  <div className="type-wrapper">
                    <ProviderType
                      groupType={mappedTypes(item.groupType)}
                      type={mappedTypes(item.type)}
                    />
                  </div>
                </SelectItemStyled>
              ),
              value: item.id,
            }))
      }
      listHeight={400}
      showSearch
      filterOption={false}
      onSearch={(v) =>
        selectedTab === "FARM"
          ? setFilterDataFarm({ ...filterDataFarm, keyword: v })
          : setFilterData({ ...filterData, keyword: v })
      }
      value={+(selectedTab === "FARM" ? (farmId as string) : (storeId as string)) || undefined}
      onSelect={(v) => {
        selectedTab === "FARM" ? replace(`/supplier/farm/${v}`) : replace(`/supplier/store/${v}`);
      }}
      placeholder={
        open
          ? selectedTab === "FARM"
            ? i18n["Chọn trang trại"]
            : i18n["Chọn cửa hàng"]
          : "Chọn cửa hàng hoặc trang trại"
      }
      dropdownRender={(menu) => (
        <StyledContent>
          <Tabs
            size="small"
            activeKey={selectedTab}
            onChange={setSelectedTab}
            items={[
              { label: "Cửa hàng", key: "STORE" },
              { label: "Trang trại", key: "FARM" },
            ]}
            tabBarGutter={12}
            style={{ marginTop: -2 }}
            tabBarStyle={{ margin: "0 0 4px", padding: "0 4px" }}
          ></Tabs>
          {menu}
          {!!dataListTotal && (
            <>
              <Divider plain style={{ margin: "4px 0 4px" }} />
              <div className="footer-wrapper">
                <Button
                  href={selectedTab === "FARM" ? "/supplier/farm/create" : "/supplier/store/create"}
                  type="primary"
                  icon={<MdOutlineAddBusiness size={22} style={{ marginLeft: 3 }} />}
                  style={{ padding: 4 }}
                >
                  {selectedTab === "FARM" ? i18n["Thêm trang trại"] : i18n["Thêm cửa hàng"]}
                </Button>
                {/* <Pagination
                  total={storeListTotal}
                  showSizeChanger={false}
                  defaultPageSize={8}
                  showLessItems
                  onChange={(current, pageSize) => {
                    setFilterData({
                      ...filterData,
                      skipCount: pageSize * (current > 0 ? current - 1 : 0),
                      maxResultCount: pageSize,
                    });
                  }}
                /> */}
              </div>
            </>
          )}
        </StyledContent>
      )}
      {...props}
    />
  );
}

const StyledContent = styled.div`
  & .ant-select-item {
    padding: 5px 10px 5px 5px;
  }
  & .footer-wrapper {
    padding: 0 0 4px 4px;
    display: flex;
    gap: 8px;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    .ant-pagination {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width: 352px;
      flex-shrink: 0;
    }
    .ant-pagination.ant-pagination-simple .ant-pagination-simple-pager input {
      border: none !important;
    }
  }
`;

export default memo(ProviderSelectG);

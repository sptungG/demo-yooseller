import styled from "@emotion/styled";
import { useDebounce, useSafeState } from "ahooks";
import { Divider, Pagination, Select, SelectProps } from "antd";
import { CSSProperties, memo } from "react";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProviderTypes from "src/hooks/useGetProviderTypes";
import { useGetAllProvidersByPartnerQuery } from "src/redux/query/provider.query";
import { TProvidersFilter } from "src/types/provider.types";
import Image from "../next/Image";
import { SelectItemStyled } from "../shared/ItemStyled";
import Tag from "../tag/Tag";

type TProviderSelectProps = SelectProps & {
  imageSize?: number;
  isShowType?: boolean;
  styleItem?: CSSProperties;
};

function ProviderSelect({ imageSize = 32, isShowType, styleItem, ...props }: TProviderSelectProps) {
  const [filterData, setFilterData] = useSafeState<TProvidersFilter>({
    formId: 20,
    maxResultCount: 10,
  });
  const debouncedFilterData = useDebounce(filterData, { wait: 500 });
  const { data, isFetching: isDataProvidersLoading } = useGetAllProvidersByPartnerQuery(
    debouncedFilterData,
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const storeList = data?.data || [];
  const storeListTotal = data?.totalRecords;

  const { i18n } = useChangeLocale();
  const { mappedTypes } = useGetProviderTypes();

  return (
    <Select
      loading={isDataProvidersLoading}
      options={storeList.map(({ id, name, imageUrls, groupType, type }) => ({
        label: (
          <SelectItemStyled style={styleItem}>
            <Image
              src={imageUrls[0]}
              alt={String(id)}
              width={imageSize}
              height={imageSize}
              className="select-image"
            />
            <div className="name-wrapper">{name}</div>
            {!!isShowType && (
              <div className="type-wrapper">
                <Tag bordered={false}>
                  {mappedTypes(groupType)} / {mappedTypes(type)}
                </Tag>
              </div>
            )}
          </SelectItemStyled>
        ),
        value: id,
      }))}
      allowClear
      showSearch
      filterOption={false}
      onSearch={(v) => setFilterData({ ...filterData, keyword: v })}
      placeholder={i18n["Chọn khu chung cư, căn hộ"]}
      dropdownRender={(menu) => (
        <>
          {menu}
          {!!storeListTotal && (
            <>
              <Divider plain style={{ margin: "8px 0" }} />
              <FooterSelectWrapper>
                <Pagination
                  showSizeChanger={false}
                  total={storeListTotal}
                  showTotal={(total, range) =>
                    `${i18n["Hiển thị"]} ${range[0]} - ${range[1]} ${i18n["trong"]} ${total}`
                  }
                  pageSizeOptions={[10, 20, 50, 100]}
                  defaultPageSize={10}
                  hideOnSinglePage
                  showLessItems
                  onChange={(current, pageSize) => {
                    setFilterData({
                      ...filterData,
                      skipCount: pageSize * (current > 0 ? current - 1 : 0),
                      maxResultCount: pageSize,
                    });
                  }}
                />
              </FooterSelectWrapper>
            </>
          )}
        </>
      )}
      {...props}
    />
  );
}
const FooterSelectWrapper = styled.div`
  padding: 0 4px 4px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export default memo(ProviderSelect);

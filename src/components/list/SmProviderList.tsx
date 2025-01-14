import styled from "@emotion/styled";
import { useDebounce, useSafeState, useSize } from "ahooks";
import { Empty, Pagination, Typography, theme } from "antd";
import { useRouter } from "next/router";
import VirtualList from "rc-virtual-list";
import { useId, useRef } from "react";
import FilterSearchInput from "src/components/field/FilterSearchInput";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProvider from "src/hooks/useGetProvider";
import useGetProviderTypes from "src/hooks/useGetProviderTypes";
import { useGetAllProvidersByPartnerQuery } from "src/redux/query/provider.query";
import { useAppDispatch } from "src/redux/store";
import { TProvidersFilter } from "src/types/provider.types";
import Avatar from "../avatar/Avatar";
import Tag from "../tag/Tag";

type TSmProviderListProps = {};

const SmProviderList = ({}: TSmProviderListProps) => {
  const uid = useId();
  const {
    token: { colorBgBase },
  } = theme.useToken();
  const { i18n } = useChangeLocale();
  const {
    replace,
    query: { storeId },
  } = useRouter();
  const { gSelectedProvider } = useGetProvider({});

  const dispatch = useAppDispatch();

  const [filterData, setFilterData] = useSafeState<TProvidersFilter>({
    formId: 20,
    maxResultCount: 10,
  });
  const debouncedFilterData = useDebounce(filterData, { wait: 500 });
  const { data } = useGetAllProvidersByPartnerQuery(debouncedFilterData, {
    refetchOnMountOrArgChange: true,
  });
  const storeList = data?.data || [];
  const storeListTotal = data?.totalRecords;
  const { mappedTypes } = useGetProviderTypes();

  const containerRef = useRef<HTMLDivElement>(null);
  const containerSize = useSize(containerRef);

  return (
    <SmProviderListStyled>
      <div className="list-header">
        <FilterSearchInput
          size="large"
          value={filterData.keyword}
          onChange={(e) => setFilterData({ ...filterData, keyword: e.target.value })}
        />
      </div>
      {storeList.length > 0 ? (
        <div className="list-wrapper" ref={containerRef}>
          <VirtualList
            data={storeList}
            height={containerSize?.height || 400}
            itemHeight={73}
            itemKey="id"
          >
            {(item, index) => (
              <div
                className={`item-wrapper ${gSelectedProvider?.id === item.id ? "active" : ""}`}
                key={uid + index}
                onClick={() => {
                  replace(`/supplier/store/${item.id}`);
                }}
              >
                <div className="left-wrapper">
                  <Avatar src={item.imageUrls?.[0]} size={64}></Avatar>
                </div>
                <div className="right-wrapper">
                  <Typography.Text strong className="name">
                    {item.name}
                  </Typography.Text>
                  <div className="detail-type">
                    <Tag bordered={false}>{`${mappedTypes(item.groupType)}${
                      !!item.type ? " / " + mappedTypes(item.type) : ""
                    }`}</Tag>
                  </div>
                </div>
              </div>
            )}
          </VirtualList>
        </div>
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
      <div className="footer" style={{ backgroundColor: colorBgBase }}>
        {!!storeListTotal && (
          <Pagination
            total={storeListTotal}
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
    </SmProviderListStyled>
  );
};
const SmProviderListStyled = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  .list-header {
    margin-bottom: 12px;
  }
  .footer {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .list-wrapper {
    flex: 1 1 auto;
    min-height: 0px;
  }
  .item-wrapper {
    overflow: hidden;
    padding: 8px;
    display: flex;
    cursor: pointer;
    & > .left-wrapper {
      margin-right: 12px;
    }
    & > .right-wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
    &:not(:last-of-type) {
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    &.active {
      background-color: ${({ theme }) => theme.generatedColors[0]};
      .ant-avatar-circle {
        background-color: ${({ theme }) => theme.generatedColors[2]} !important;
      }
      .name {
        color: ${({ theme }) => theme.colorPrimary};
        text-decoration: underline;
      }
    }
  }
`;

export default SmProviderList;

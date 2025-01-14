import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { useDebounce, useSafeState } from "ahooks";
import { Affix, Typography } from "antd";
import { rgba } from "emotion-rgba";
import { useRouter } from "next/router";
import { useId } from "react";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { MdStarRate } from "react-icons/md";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProvider from "src/hooks/useGetProvider";
import useGetProviderTypes from "src/hooks/useGetProviderTypes";
import { useGetAllProvidersByPartnerQuery } from "src/redux/query/provider.query";
import { TProvidersFilter } from "src/types/provider.types";
import Button from "../button/Button";
import Card from "../card/Card";
import FilterSearchInput from "../field/FilterSearchInput";
import Image from "../next/Image";
import Pagination from "../shared/Pagination";
import Tag from "../tag/Tag";

type TSelectProviderGListProps = {};

const SelectProviderGList = ({}: TSelectProviderGListProps) => {
  const uid = useId();
  const {
    replace,
    query: { storeId },
  } = useRouter();
  const { gSelectedProvider } = useGetProvider({});

  const { colorPrimary } = useTheme();

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
    <SelectProviderGListStyled
      title={
        <FilterSearchInput
          placeholder={i18n["Tìm kiếm cửa hàng"]}
          value={filterData.keyword}
          onChange={(e) => setFilterData({ ...filterData, keyword: e.target.value })}
        />
      }
      extra={
        <Button href={"/supplier/store/create"} ghost type="primary">
          {i18n["Thêm cửa hàng"]}
        </Button>
      }
    >
      <Typography.Title level={4} type="secondary" style={{ padding: "8px 12px 0" }}>
        Chọn <u>cửa hàng</u>:
      </Typography.Title>
      <div className="list-wrapper">
        {storeList.map((item, index) => (
          <div
            className={`item-wrapper ${
              (gSelectedProvider?.id || -1) === item.id ? "selected" : ""
            }`}
            key={uid + "provider" + index}
            onClick={() => {
              replace(`/supplier/store/${item.id}`);
            }}
          >
            <Image className="image" src={item.imageUrls[0]} alt=""></Image>
            <BsFillCheckCircleFill className="check-icon" size={24} color={colorPrimary} />
            <div className="detail-wrapper">
              <div className="name-wrapper">
                <Typography.Text strong className="detail-name" ellipsis>
                  {item.name}
                </Typography.Text>
              </div>
              <div
                className="detail-desc"
                dangerouslySetInnerHTML={{ __html: item.description }}
              ></div>
              <div className="rate-wrapper">
                <Tag
                  color={!!item?.ratePoint ? "gold" : "default"}
                  bordered={false}
                  icon={<MdStarRate />}
                >
                  {item.ratePoint || "0"}
                </Tag>
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  <span style={{ margin: 2 }}>•</span>
                  <span style={{ fontWeight: 600 }}>{item.countRate}</span>{" "}
                  {i18n["Đánh giá"].toLowerCase()}
                </Typography.Text>
              </div>
            </div>
            <div className="detail-type">
              <Tag bordered={false}>{`${mappedTypes(item.groupType)}${
                !!item.type ? " / " + mappedTypes(item.type) : ""
              }`}</Tag>
            </div>
          </div>
        ))}
      </div>
      <Affix offsetBottom={0.01}>
        <div className="footer-wrapper">
          {!!storeListTotal && (
            <Pagination
              total={storeListTotal}
              pageSizeOptions={[10, 20, 50, 100]}
              defaultPageSize={10}
              hideOnSinglePage
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
    </SelectProviderGListStyled>
  );
};
const SelectProviderGListStyled = styled(Card)`
  max-width: 1200px;
  margin: 24px auto;
  .ant-card-head {
    padding: 0 12px;
    .ant-card-extra {
      margin-left: 12px;
    }
  }
  .ant-card-body {
    padding: 0;
  }
  .list-wrapper {
    --f-columns: 4;
    --f-gap: 12px;
    display: flex;
    flex-wrap: wrap;
    margin-left: calc(-1 * var(--f-gap));
    margin-bottom: calc(-1 * var(--f-gap));
    padding: 0 12px;
    & > * {
      margin-left: var(--f-gap);
      margin-bottom: var(--f-gap);
      width: calc((100% / var(--f-columns) - var(--f-gap)));
    }
  }
  .item-wrapper {
    padding: 12px;
    border-radius: 6px;
    background-color: rgba(0, 0, 0, 0.05);
    position: relative;
    display: flex;
    flex-direction: column;
    border: 1px solid transparent;
    cursor: pointer;
    .ant-image {
      width: 100%;
      height: 160px;
      background-color: rgba(0, 0, 0, 0.05);
      flex-shrink: 0;
      .image {
        border-radius: 3px;
        height: 160px;
        object-fit: cover;
      }
    }
    .detail-wrapper {
      margin-top: 4px;
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0px;
    }
    .name-wrapper {
      display: flex;
      align-items: center;
    }
    .check-icon {
      position: absolute;
      bottom: 12px;
      right: 12px;
      display: none;
    }
    .detail-name {
      font-size: 18px;
    }
    .detail-desc {
      opacity: 0.45;
      line-height: 1;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-word;
    }
    .rate-wrapper {
      margin-top: auto;
      display: flex;
      align-items: center;
    }
    .detail-type {
      position: absolute;
      top: 16px;
      right: 16px;
      .ant-tag {
        background-color: rgba(238, 238, 238, 0.8);
        backdrop-filter: blur(1px);
      }
    }
    &:hover {
      background-color: rgba(0, 0, 0, 0.15);
      .ant-image {
        overflow: hidden;
        .image {
          transform: scale(1.1);
        }
      }
      .detail-name {
        text-decoration: underline;
      }
    }
    &.selected {
      background-color: ${({ theme }) => rgba(theme.generatedColors[9], 0.1)};
      .check-icon {
        display: block;
      }
      .detail-name {
        text-decoration: underline;
      }
    }
  }
  .footer-wrapper {
    background-color: #fff;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    padding: 12px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
`;

export default SelectProviderGList;

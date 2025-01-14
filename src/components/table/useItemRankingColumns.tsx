import useChangeLocale from "@/hooks/useChangeLocale";
import { TRankingItem } from "@/types/order.types";
import { formatNumber } from "@/utils/utils";
import styled from "@emotion/styled";
import { Flex, Typography } from "antd";
import { ColumnGroupType, ColumnType } from "antd/es/table";
import Link from "next/link";
import { useId } from "react";
import Avatar from "../avatar/Avatar";
import { Rank2Icon, Rank3Icon, RankStarIcon } from "../icons";

type TuseItemRankingColumnsProps = {};

type TRes = Record<string, ColumnGroupType<TRankingItem> | ColumnType<TRankingItem>>;

const useItemRankingColumns = ({}: TuseItemRankingColumnsProps): TRes => {
  const uid = useId();

  const { i18n } = useChangeLocale();
  return {
    rankingNameCombined: {
      title: i18n["Sản phẩm"],
      dataIndex: "itemDto",
      key: "itemDto",
      render: (text, record, index) => {
        const itemData = (JSON.parse(record.itemDto) || {}) as any;
        return (
          <StyledRankingNameCombined>
            <div className="avatar-wrapper">
              <Avatar
                key={"ImageUrlList" + index}
                size={60}
                shape="square"
                src={itemData?.ImageUrlList?.[0]}
              >
                {itemData?.Name?.[0]}
              </Avatar>
              <div className={`avatar-badge rank${index + 1}`}>
                {index > 2 && <div className={`rank-text rank${index + 1}`}>{`#${index + 1}`}</div>}
                <div className="rank-icon">
                  {index === 0 && <RankStarIcon width={28} height={28} />}
                  {index === 1 && <Rank2Icon width={26} height={26} />}
                  {index === 2 && <Rank3Icon width={26} height={26} />}
                </div>
              </div>
            </div>
            <Flex vertical justify="center" style={{ margin: "0 0 0 8px", maxWidth: 200 }}>
              <Link href={"/"}>
                <Typography.Text strong className="name" ellipsis>
                  {itemData?.Name || "---"}
                </Typography.Text>
              </Link>
              <div className="price-wrapper">
                <Typography.Text ellipsis type="success">
                  {itemData?.MinPrice === itemData?.MaxPrice
                    ? `${formatNumber(itemData?.MinPrice || 0)}₫`
                    : `${formatNumber(itemData?.MinPrice || 0)}₫ ~ ${formatNumber(
                        itemData?.MaxPrice || 0,
                      )}₫`}
                </Typography.Text>
              </div>
            </Flex>
          </StyledRankingNameCombined>
        );
      },
    },

    sales: {
      title: "Doanh thu",
      dataIndex: "sales",
      key: "sales",
      render: (text, record, index) => {
        return (
          <StyledSales>
            <Typography.Text ellipsis type="secondary">
              Doanh thu
            </Typography.Text>
            <Typography.Text ellipsis strong type="success" className="sales">{`${formatNumber(
              record?.sales || 0,
            )}₫`}</Typography.Text>
          </StyledSales>
        );
      },
    },

    count: {
      title: "Đã bán",
      dataIndex: "count",
      key: "count",
      render: (text, record, index) => {
        return (
          <StyledSales>
            <Typography.Text ellipsis type="secondary">
              Đã bán
            </Typography.Text>
            <Typography.Text ellipsis strong underline type="warning" className="count">
              {formatNumber(record?.count || 0) || "0"}
            </Typography.Text>
          </StyledSales>
        );
      },
    },
  };
};

const StyledRankingNameCombined = styled.div`
  --box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02),
    0 2px 4px 0 rgba(0, 0, 0, 0.02);
  display: flex;
  & .avatar-wrapper {
    position: relative;
    & .avatar-badge {
      position: absolute;
      bottom: -4px;
      right: -4px;
      background-color: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      padding: 2px;
      box-shadow: var(--box-shadow);
      backdrop-filter: blur(4px);
      &.rank1 {
      }
    }
    & .rank-text {
      background-color: rgba(0, 0, 0, 0.05);
      width: 26px;
      height: 26px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      &.rank1 {
        color: #fa8c16;
        background-color: #fff7e6;
      }
      &.rank2,
      &.rank3 {
        color: #597ef7;
        background-color: #f0f5ff;
      }
    }
    & .rank-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      overflow: hidden;
    }
  }
  & .name {
    margin: 0;
    color: inherit;
    font-size: 15px;
    &:hover {
      text-decoration: underline;
    }
  }
  & .desc {
    opacity: 0.45;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    margin: 0;
    p {
      margin: 0;
    }
  }
  & .price-wrapper {
    font-size: 14px;
  }
`;

const StyledSales = styled.div`
  display: flex;
  flex-direction: column;
`;

export default useItemRankingColumns;

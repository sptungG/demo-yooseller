import styled from "@emotion/styled";
import { Skeleton, Typography } from "antd";
import { TRankingItem } from "src/types/order.types";
import { formatNumber } from "src/utils/utils";
import Avatar, { AvatarGroup } from "../avatar/Avatar";
import { Rank2Icon, Rank3Icon, RankStarIcon } from "../icons";

type TItemRankingCardProps = { index: number } & TRankingItem;

const ItemRankingCard = ({ index, ...item }: TItemRankingCardProps) => {
  const itemData = JSON.parse(item.itemDto) as any;
  return (
    <ItemRankingCardStyled>
      <div className="title-wrapper">
        <div className={`rank-text rank${index + 1}`}>#{index + 1}</div>
        <div className="rank-icon">
          {index === 0 && <RankStarIcon width={28} height={28} />}
          {index === 1 && <Rank2Icon width={24} height={24} />}
          {index === 2 && <Rank3Icon width={24} height={24} />}
        </div>
      </div>
      <div className="detail-wrapper">
        <div className="image-wrapper">
          {!!itemData ? (
            <AvatarGroup maxCount={1}>
              {(itemData.ImageUrlList as any[]).map((url, index) => (
                <Avatar key={"ImageUrlList" + index} size={64} shape="square" src={url} />
              ))}
            </AvatarGroup>
          ) : (
            <Avatar size={64} shape="square" src={"string"} />
          )}
        </div>
        {!!itemData ? (
          <>
            <div className="name-wrapper">
              <Typography.Text strong className="name" ellipsis>
                {itemData?.Name || ""}
              </Typography.Text>
              <div
                className="desc"
                dangerouslySetInnerHTML={{ __html: itemData?.Description || "" }}
              ></div>
              <div className="price-wrapper">
                <Typography.Text ellipsis type="success">
                  {itemData.MinPrice === itemData.MaxPrice
                    ? `${formatNumber(itemData.MinPrice)}₫`
                    : `${formatNumber(itemData.MinPrice)}₫ ~ ${formatNumber(itemData.MaxPrice)}₫`}
                </Typography.Text>
              </div>
            </div>
          </>
        ) : (
          <div className="name-wrapper empty">
            <Skeleton.Input size="small" block />
            <Skeleton.Input size="small" block />
          </div>
        )}
      </div>
      <div className="bottom-wrapper">
        <div className="sales-wrapper">
          <Typography.Text ellipsis type="secondary">
            Doanh thu
          </Typography.Text>
          <Typography.Text ellipsis strong type="success" className="sales">{`${formatNumber(
            item?.sales || 0,
          )}₫`}</Typography.Text>
        </div>
        <div className="count-wrapper">
          <Typography.Text ellipsis type="secondary">
            Đã bán
          </Typography.Text>
          <Typography.Text ellipsis strong underline type="warning" className="count">
            {formatNumber(item?.count || 0) || "0"}
          </Typography.Text>
        </div>
      </div>
    </ItemRankingCardStyled>
  );
};
const ItemRankingCardStyled = styled.div`
  --box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02),
    0 2px 4px 0 rgba(0, 0, 0, 0.02);
  display: inline-flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 8px;
  border-radius: 8px;
  box-shadow: var(--box-shadow);
  .title-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    .rank-text {
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
    .rank-icon {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .detail-wrapper {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }
  .bottom-wrapper {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    display: flex;
  }

  .image-wrapper {
    position: relative;
    height: 64px;
    width: 64px;
    .ant-image,
    .detail-image {
      border-radius: 6px;
      width: 64px;
      height: 64px;
    }
    & .ant-avatar-group > span.ant-avatar.ant-avatar-circle {
      position: absolute;
      bottom: 4px;
      right: 4px;
    }
  }
  .name-wrapper {
    margin-left: 8px;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-width: 0px;
    &.empty {
      gap: 8px;
      margin-bottom: 14px;
    }
  }
  .desc {
    opacity: 0.45;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    p {
      margin: 0;
    }
  }
  .price-wrapper {
    font-size: 14px;
    opacity: 0.5;
  }
  .rate-wrapper {
    display: flex;
    align-items: center;
    gap: 2px;
    & .ant-tag {
      line-height: 0;
      gap: 4px;
      padding: 2px 6px;
    }
    & .ant-typography {
      font-size: 13px;
    }
  }
  .sales-wrapper,
  .count-wrapper {
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;
    min-width: 0px;
    & > .ant-typography-secondary {
      opacity: 0.5;
    }
    & > .ant-typography {
      line-height: 1.1;
    }
  }
  .sales-wrapper {
    align-items: flex-start;
  }
  .count-wrapper {
    margin-left: auto;
    align-items: flex-end;
  }
`;

export default ItemRankingCard;

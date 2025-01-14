import styled from "@emotion/styled";
import { Divider, Typography } from "antd";
import Image from "next/image";
import { useId } from "react";
import { BsCalendarWeekFill, BsPersonLinesFill } from "react-icons/bs";
import { MdStarRate } from "react-icons/md";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProviderTypes from "src/hooks/useGetProviderTypes";
import { TProvider, TProviderState } from "src/types/provider.types";
import { formatNumber } from "src/utils/utils";
import Avatar from "../avatar/Avatar";
import Link from "../next/Link";
import ProviderType from "../tag/ProviderType";
import Tag from "../tag/Tag";

type TStoreCardProps = { statistic?: { count: number; revenue: number } } & TProvider;

function StoreCard({ statistic, ...item }: TStoreCardProps) {
  const { i18n } = useChangeLocale();
  const uid = useId();
  const { mappedTypes } = useGetProviderTypes();
  const statusStyle = (status: TProviderState): React.CSSProperties => ({
    opacity: [TProviderState.PENDING, TProviderState.ACTIVATED].includes(status) ? 1 : 0.45,
  });
  const isFarm = item.groupType >= 100;

  return (
    <StoreCardWrapper
      className={`item-wrapper`}
      href={isFarm ? `/supplier/farm/${item.id}` : `/supplier/store/${item.id}`}
      style={{ ...statusStyle(item.state) }}
    >
      <div className="image-wrapper">
        <Avatar
          className="image"
          shape="square"
          src={item.imageUrls[0]}
          alt=""
          key={uid + "providerImage"}
          size={120}
        ></Avatar>
      </div>
      <div className="detail-wrapper">
        <div className="name-wrapper">
          <Typography.Text strong className="name" ellipsis style={{ maxWidth: 320 }}>
            {item.name}
          </Typography.Text>
          <ProviderType groupType={mappedTypes(item.groupType)} type={mappedTypes(item.type)} />
        </div>
        <div className="detail-desc" dangerouslySetInnerHTML={{ __html: item.description }}></div>
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
            <span style={{ fontWeight: 600 }}>{item.countRate || "0"}</span>{" "}
            {i18n["Đánh giá"].toLowerCase()}
          </Typography.Text>
          <Divider type="vertical" style={{ height: 18 }} />
          <div className="icons-info-wrapper">
            {!!item.phoneNumber && <Avatar icon={<BsPersonLinesFill />} size={22} />}
            {!!item.workTime && <Avatar icon={<BsCalendarWeekFill />} size={22} />}
          </div>
        </div>
        <div className="bg-image-wrapper">
          {item.groupType === 100 && (
            <Image src={"/images/farm-bg-02-transformed.png"} alt="" fill />
          )}
          {item.groupType === 101 && (
            <Image src={"/images/farm-bg-03-transformed.png"} alt="" fill />
          )}
        </div>
      </div>
      <div className="detail-type"></div>
      {!!statistic && (
        <div className="statistics-wrapper">
          <div className="tag-wrapper" style={statistic.count < 1 ? { flexDirection: "row" } : {}}>
            <Typography.Text
              type="secondary"
              style={{ fontSize: 12, color: "#0958d9", marginRight: 2 }}
            >
              {i18n["Doanh số"]}:
            </Typography.Text>
            <Tag bordered={false} color={statistic.count < 1 ? "default" : "blue"}>
              {`${formatNumber(statistic.count)}`}
            </Tag>
          </div>
          <div
            className="tag-wrapper"
            style={statistic.revenue < 1000 ? { flexDirection: "row" } : {}}
          >
            <Typography.Text
              type="secondary"
              style={{ fontSize: 12, color: "#389e0d", marginRight: 2 }}
            >
              {i18n["Doanh thu"]}:
            </Typography.Text>
            <Tag bordered={false} color={statistic.revenue < 1000 ? "default" : "green"}>
              {`${formatNumber(statistic.revenue)}₫`}
            </Tag>
          </div>
        </div>
      )}
    </StoreCardWrapper>
  );
}

const StoreCardWrapper = styled(Link)`
  display: flex;
  padding: 8px 8px;
  border-radius: 6px;
  position: relative;
  height: fit-content;
  .image-wrapper {
    position: relative;
    margin-right: 12px;
    flex-shrink: 0;
    height: fit-content;
    .image {
    }
  }
  .detail-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-width: 0px;
    z-index: 0;
    position: relative;
    overflow: hidden;
    border-radius: 4px;
    & > * {
      z-index: 1;
    }
  }
  .name-wrapper {
    display: flex;
    align-items: flex-start;
    margin-bottom: 6px;
    .name {
      font-size: 16px;
      margin-right: 12px;
    }
    .ant-tag {
      margin-left: auto;
      flex: 0 0 auto;
      min-width: 0px;
    }
  }
  .detail-desc {
    color: rgba(0, 0, 0, 0.45);
    line-height: 1;
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
  .rate-wrapper {
    display: flex;
    align-items: center;
    margin-top: auto;
    .icons-info-wrapper {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      .ant-avatar {
        display: inline-flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .detail-type {
    position: absolute;
    top: 8px;
    right: 8px;
  }
  & > .statistics-wrapper {
    position: absolute;
    bottom: 8px;
    right: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    .tag-wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .ant-tag {
      justify-content: flex-end;
      align-self: flex-end;
    }
  }
  & .bg-image-wrapper {
    position: absolute;
    bottom: -2px;
    right: -2px;
    height: 100%;
    width: 220px;
    z-index: 0;
    opacity: 0.2;
    img {
      border-radius: 0 0 8px 8px;
    }
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    .name {
      text-decoration: underline;
      color: ${({ theme }) => theme.colorPrimary};
    }
    .detail-type {
    }
    .image-wrapper {
      img {
        transform: scale(1.5);
      }
    }
  }
`;

export default StoreCard;

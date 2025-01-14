import styled from "@emotion/styled";
import { Badge, Dropdown, Empty, Popover, Typography } from "antd";
import { useId, useMemo } from "react";
import { BiEdit } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaInfo } from "react-icons/fa";
import { MdOutlineDelete, MdOutlineVisibility, MdStarRate, MdVisibility } from "react-icons/md";
import useChangeLocale from "src/hooks/useChangeLocale";
import { TItem, TItemStatus } from "src/types/item.types";
import { formatNumber } from "src/utils/utils";
import Avatar, { AvatarGroup } from "../avatar/Avatar";
import Button from "../button/Button";
import Image from "../next/Image";
import Link from "../next/Link";
import Tag from "../tag/Tag";

export type TItemCard = Pick<
  TItem,
  | "id"
  | "name"
  | "imageUrlList"
  | "minPrice"
  | "maxPrice"
  | "condition"
  | "status"
  | "description"
  | "modelList"
  | "tierVariationList"
  | "sku"
  | "stock"
  | "ratePoint"
  | "countRate"
  | "sales"
  | "viewCount"
  | "properties"
  | "providerId"
>;

type TItemCardProps = TItemCard & {
  loading?: boolean;
  checked?: boolean;
  hideCheckbox?: boolean;
  isBookingItem?: boolean;
  imageHeight?: number;
  onClickDelete?: (id?: TItem["id"]) => void;
  extraMedItem?: (properties: any) => React.ReactNode;
};

const ItemCard = ({
  loading,
  hideCheckbox,
  isBookingItem = false,
  checked = false,
  onClickDelete,
  extraMedItem,
  imageHeight = 240,
  ...item
}: TItemCardProps) => {
  const uid = useId();
  const { i18n, locale } = useChangeLocale();

  const mappedStatus = useMemo(() => {
    if (item.status === TItemStatus.HIDDEN) return "default";
    if (item.status === TItemStatus.BANNED) return "error";
    return undefined;
  }, [item.status]);
  return (
    <ItemCardStyled className={`item-wrapper ${checked ? "checked" : ""} ${mappedStatus || ""}`}>
      <div className="image-link">
        <Image src={item.imageUrlList[0]} alt={uid + item.id} style={{ height: imageHeight }} />
      </div>
      <div className="main-wrapper">
        <div className="top-wrapper">
          <div className="name-wrapper">
            <Link
              href={`/supplier/store/${item.providerId}/item/${item.id}`}
              passHref
              className="name"
            >
              {item.name}
            </Link>
            <MdVisibility className="view-icon" size={16} />
          </div>
          <div
            className="desc-wrapper"
            dangerouslySetInnerHTML={{ __html: item.description }}
          ></div>
        </div>
        <div className="main">
          <div className="left-wrapper">
            {!!item?.properties &&
              typeof extraMedItem === "function" &&
              extraMedItem(JSON.parse(item.properties))}
            <div className="footer-wrapper">
              <div className="top-wrapper">
                <div className="rate-wrapper">
                  <Tag
                    color={!!item.ratePoint ? "gold" : "default"}
                    bordered={false}
                    icon={<MdStarRate />}
                  >
                    {item.ratePoint || "0"}
                  </Tag>
                </div>
                <div className="view-wrapper">
                  <Tag icon={<MdVisibility style={{ marginRight: 4 }} />} bordered={false}>
                    {formatNumber(item.viewCount)}
                  </Tag>
                </div>
              </div>
              <div className="price-wrapper">
                {item.minPrice === item.maxPrice ? (
                  <Typography.Text
                    ellipsis
                    type="success"
                    style={{ fontSize: 16 }}
                  >{`${formatNumber(item.maxPrice)}₫`}</Typography.Text>
                ) : (
                  <>
                    <Typography.Paragraph
                      ellipsis
                      type="success"
                      style={{ fontSize: 15, margin: "1.4px 0", lineHeight: 1 }}
                    >
                      {`${formatNumber(item.minPrice)}₫ ~`}
                    </Typography.Paragraph>
                    <Typography.Paragraph
                      ellipsis
                      type="success"
                      style={{ fontSize: 15, margin: 0, lineHeight: 1 }}
                    >
                      {`${formatNumber(item.maxPrice)}₫`}
                    </Typography.Paragraph>
                  </>
                )}
              </div>
            </div>
          </div>
          {!isBookingItem && (
            <div className="right-wrapper">
              <div className="top-wrapper">
                <div className="sales-wrapper">
                  <span className="label" style={{ fontSize: 12 }}>
                    {i18n["Đã bán"]}
                  </span>
                  <Typography.Text ellipsis strong type="secondary">
                    {formatNumber(item.sales)}
                  </Typography.Text>
                </div>
                <div className="stock-wrapper">
                  <span className="label" style={{ fontSize: 12 }}>
                    {i18n["Kho hàng"]}
                  </span>
                  <Typography.Text strong ellipsis mark={!item.stock}>
                    {item.stock || 0}
                  </Typography.Text>
                </div>
              </div>
              {!!item.modelList.length && (
                <div className="model-wrapper">
                  <AvatarGroup size={36} className="model-list" maxCount={1}>
                    {item.modelList.map(({ id, name, imageUrl, stock }) => (
                      <Avatar key={id} src={imageUrl}>
                        {name[0]}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                  <Popover
                    placement="topRight"
                    arrow={{ pointAtCenter: true }}
                    content={
                      <PopoverContentStyled>
                        {!!item?.modelList?.length ? (
                          item.modelList.map(({ id, name, stock, originalPrice, currentPrice }) => (
                            <div className="item-wrapper" key={uid + "Popover" + id}>
                              <div className="stock-wrapper">{stock}</div>
                              <Typography.Text ellipsis type="secondary" style={{ marginLeft: 8 }}>
                                {`${formatNumber(originalPrice)}₫`}
                              </Typography.Text>
                              <Typography.Text ellipsis type="success" style={{ marginLeft: 8 }}>
                                {`${formatNumber(currentPrice)}₫`}
                              </Typography.Text>
                              <div className="name-wrapper">{name}</div>
                            </div>
                          ))
                        ) : (
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            imageStyle={{ height: 32 }}
                            style={{ padding: 0, margin: "2px 0 -8px 0" }}
                            description={false}
                          />
                        )}
                      </PopoverContentStyled>
                    }
                  >
                    <Avatar size={24} icon={<FaInfo />} className="info" />
                  </Popover>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="actions-wrapper">
        <Dropdown
          placement="bottomRight"
          trigger={["click"]}
          mouseEnterDelay={0.01}
          mouseLeaveDelay={0.01}
          menu={{
            items: [
              {
                key: "view",
                label: (
                  <Link href={`/supplier/store/${item.providerId}/item/${item.id}`}>
                    {i18n["Xem sản phẩm"]}
                  </Link>
                ),
                icon: <MdOutlineVisibility size={16} />,
              },
              {
                key: "edit",
                label: (
                  <Link href={`/supplier/store/${item.providerId}/item/${item.id}/edit`}>
                    {i18n["Sửa sản phẩm"]}
                  </Link>
                ),
                icon: <BiEdit size={16} />,
              },
              { key: "divider01", type: "divider" },
              {
                key: "delete",
                label: i18n["Xóa sản phẩm"],
                danger: true,
                icon: <MdOutlineDelete size={16} />,
                onClick: () => onClickDelete?.(item.id),
              },
            ],
          }}
        >
          <Badge status={mappedStatus} dot={!!mappedStatus}>
            <Button
              className={`btn-action ${locale}`}
              type="text"
              style={{
                height: 24,
                color: "#fff",
                backgroundColor: "rgba(0,0,0,0.1)",
                backdropFilter: "blur(2px)",
              }}
              icon={<BsThreeDots size={32} />}
            ></Button>
          </Badge>
        </Dropdown>
      </div>
    </ItemCardStyled>
  );
};
const ItemCardStyled = styled.div`
  --box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02),
    0 2px 4px 0 rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 6px;
  box-shadow: var(--box-shadow);
  .image-link {
    position: relative;
    & > .ant-image {
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.05);
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      border-top: 1px solid rgba(0, 0, 0, 0.05);
      border-radius: 6px 6px 0 0;
      & > .ant-image-img {
        border-radius: 6px 6px 0 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .main-wrapper {
    padding: 10px 12px 12px;
    border-radius: 0 0 6px 6px;
    .main {
      display: flex;
      flex-wrap: nowrap;
      & > .left-wrapper {
        flex: 1 1 auto;
        min-width: 0px;
        display: flex;
        flex-direction: column;
        .footer-wrapper {
          margin-top: auto;
          padding-top: 8px;
          .top-wrapper {
            display: flex;
            align-items: flex-start;
            flex-direction: column;
          }
        }
      }
      & > .right-wrapper {
        flex: 0 0 auto;
        min-width: 0px;
        display: flex;
        flex-direction: column;
        align-self: flex-end;
        .top-wrapper {
          display: flex;
          flex-direction: column;
          align-self: flex-end;
        }
      }
    }
  }
  .name-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    width: fit-content;
    .name {
      flex: 1 1 auto;
      min-width: 0px;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      word-break: break-word;
      font-size: 16px;
      font-weight: 600;
      line-height: 1.1;
    }
    .view-icon {
      display: none;
      color: ${({ theme }) => theme.colorPrimary};
      position: absolute;
      top: 50%;
      right: 0;
      transform: translate(calc(100% + 8px), -50%);
    }
    &:hover {
      .ant-typography {
        text-decoration: underline;
      }
      .view-icon {
        display: block;
      }
    }
  }
  .desc-wrapper {
    opacity: 0.45;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    user-select: none;
    pointer-events: none;
    & p {
      margin: 0;
    }
  }
  &.error,
  &.default {
    .image-wrapper,
    .name-wrapper,
    .desc-wrapper,
    .price-wrapper {
      opacity: 0.5;
    }
  }
  .sku-wrapper {
    display: flex;
    flex-wrap: nowrap;
    .label {
      color: rgba(0, 0, 0, 0.6);
      margin-right: 2px;
    }
  }
  .rate-wrapper,
  .view-wrapper {
    .ant-tag {
      line-height: normal;
      & > svg {
        margin-right: 2px;
        opacity: 0.5;
      }
    }
  }
  .rate-wrapper {
    margin-right: 8px;
    padding-right: 8px;
  }
  .price-wrapper {
  }
  .sales-wrapper,
  .stock-wrapper {
    display: flex;
    flex-wrap: nowrap;
    color: rgba(0, 0, 0, 0.45);
    & span:last-of-type {
      margin-left: auto;
      padding-left: 6px;
    }
    & .label {
      margin-left: 6px;
      text-align: right;
      width: 60px;
      white-space: nowrap;
    }
  }
  .model-wrapper {
    display: flex;
    align-items: center;
    margin-left: auto;
    margin-top: 2px;
    height: 40px;
    .ant-avatar {
      border-color: #eee;
    }
    .info {
      margin-left: -4px;
    }
  }
  .actions-wrapper {
    position: absolute;
    top: 12px;
    right: 12px;
  }
  &:hover {
  }
  &.checked {
    .checkbox-wrapper {
      background-color: ${({ theme }) => theme.generatedColors[1]};
      border: 1px solid ${({ theme }) => theme.colorPrimary};
    }
    .name-wrapper .ant-typography {
      color: ${({ theme }) => theme.colorPrimary};
    }
  }
`;
const PopoverContentStyled = styled.div`
  .item-wrapper {
    display: flex;
    align-items: center;
    .stock-wrapper {
      width: fit-content;
      min-width: 16px;
      text-align: right;
      font-weight: 600;
    }
    .name-wrapper {
      margin-left: 8px;
    }
  }
`;
export default ItemCard;

import styled from "@emotion/styled";
import { useCreation, useSafeState } from "ahooks";
import { Dropdown, MenuProps, Skeleton, Typography } from "antd";
import { useRouter } from "next/router";
import { useId } from "react";
import { BsFileEarmarkTextFill, BsPersonFill, BsThreeDots } from "react-icons/bs";
import { MdVisibility } from "react-icons/md";
import { TMessage } from "src/types/chat.types";
import { formatNumber } from "src/utils/utils";
import { formatDate } from "src/utils/utils-date";
import Avatar, { AvatarGroup } from "../avatar/Avatar";
import Button from "../button/Button";
import Image from "../next/Image";

type TChatMsgItemProps = {
  sentProfile?: { url?: string } | null;
  showTime?: boolean;
  hideProfile?: boolean;
  options?: MenuProps["items"];
} & Pick<TMessage, "id" | "message" | "typeMessage" | "side" | "creationTime">;

const ChatMsgItem = ({
  sentProfile,
  showTime,
  hideProfile,
  options,
  ...item
}: TChatMsgItemProps) => {
  const uid = useId();
  const {
    query: { storeId },
  } = useRouter();
  const [showCreatedTime, setShowCreatedTime] = useSafeState(false);
  const internalShowTime = !!sentProfile || showCreatedTime;

  const renderMessage = useCreation(() => {
    if (item.typeMessage === 2)
      return <Image src={item.message} alt={String(item.id)} preview width={300} />;
    if (item.typeMessage === 4 && !!item.message)
      return (
        <a className="file" href={item.message} target="_blank" referrerPolicy="no-referrer">
          <div className="left-wrapper">
            <BsFileEarmarkTextFill size={16} />
          </div>
          <div className="right-wrapper">{`[${item.message.substring(
            item.message.lastIndexOf("/"),
          )}]`}</div>
        </a>
      );
    if (item.typeMessage === 8) {
      const itemData = JSON.parse(item.message) as any;
      return (
        <div className="product-msg">
          <div className="image-wrapper">
            {!!itemData ? (
              <AvatarGroup maxCount={1}>
                {(itemData.imageUrlList as any[]).map((url, index) => (
                  <Avatar
                    key={uid + String(itemData.id) + "ImageUrlList" + index}
                    size={68}
                    shape="square"
                    src={url}
                  />
                ))}
              </AvatarGroup>
            ) : (
              <Avatar size={68} shape="square" src={"string"} />
            )}
          </div>
          {!!itemData ? (
            <>
              <div className="right-wrapper">
                <div className="name-wrapper">
                  <Typography.Link
                    href={`/supplier/store/${storeId}/item/${itemData.id}`}
                    strong
                    className="name"
                    ellipsis
                    style={{ maxWidth: 160 }}
                    target="_blank"
                  >
                    {itemData?.name || ""}
                  </Typography.Link>
                  <MdVisibility className="view-icon" size={16} />
                </div>
                <div
                  className="desc"
                  dangerouslySetInnerHTML={{ __html: itemData?.description || "" }}
                ></div>
                <div className="price-wrapper">
                  <Typography.Text ellipsis type="success">
                    {`${formatNumber(itemData.modelList[0].currentPrice)}₫`}
                  </Typography.Text>
                  <Typography.Text
                    ellipsis
                    type="secondary"
                    style={{ marginLeft: 8, fontSize: 12 }}
                    delete
                  >
                    {`${formatNumber(itemData.modelList[0].originalPrice)}₫`}
                  </Typography.Text>
                </div>
              </div>
            </>
          ) : (
            <div className="right-wrapper empty">
              <Skeleton.Input size="small" block />
              <Skeleton.Input size="small" block />
            </div>
          )}
        </div>
      );
    }
    return item.message;
  }, [item]);

  return (
    <ChatMsgStyled
      className={item.side === 1 ? "owner" : ""}
      style={{ paddingBottom: showTime || internalShowTime ? 24 : 4 }}
    >
      {!hideProfile && (
        <div className="chat-msg-profile">
          {!!sentProfile ? (
            <Avatar
              className="chat-msg-img"
              icon={<BsPersonFill />}
              src={sentProfile?.url}
              size={40}
            />
          ) : (
            <div className="chat-msg-img" style={{ width: 40, height: 40 }}></div>
          )}
          {internalShowTime && (
            <div className="chat-msg-date">
              Đã gửi lúc {formatDate(item.creationTime, "DD-MM-YY HH:mm")}
            </div>
          )}
        </div>
      )}
      <div
        className="chat-msg-text"
        onClick={(e) => {
          setShowCreatedTime(!showCreatedTime);
        }}
        style={{ margin: !!hideProfile ? 0 : item.side === 1 ? "0 8px 0 0" : "0 0 0 8px" }}
      >
        {renderMessage}
        {!!options && (
          <div className="actions-wrapper">
            <Dropdown
              menu={{ items: options }}
              trigger={["click"]}
              arrow={false}
              destroyPopupOnHide
              mouseEnterDelay={0.01}
              mouseLeaveDelay={0.01}
              placement={item.side === 1 ? "bottomRight" : "bottomRight"}
            >
              <Button
                type="text"
                shape="circle"
                icon={<BsThreeDots size={20} color="#707386" />}
              ></Button>
            </Dropdown>
          </div>
        )}
      </div>
      {hideProfile && (showTime || internalShowTime) && (
        <div className="chat-msg-date-bottom">
          Đã gửi lúc {formatDate(item.creationTime, "DD-MM-YY HH:mm")}
        </div>
      )}
    </ChatMsgStyled>
  );
};
const ChatMsgStyled = styled.div`
  --chat-text-bg: #f1f2f8;
  --theme-color: ${({ theme }) => theme.colorPrimary};
  --chat-text-color: #707386;
  display: flex;
  padding: 0 16px;
  position: relative;
  .chat-msg-profile {
    flex-shrink: 0;
    margin-top: auto;
    margin-bottom: -16px;
    position: relative;
  }
  .chat-msg-date {
    position: absolute;
    left: calc(100% + 8px);
    bottom: -2px;
    font-size: 12px;
    color: var(--chat-text-color);
    white-space: nowrap;
  }
  .chat-msg-date-bottom {
    position: absolute;
    left: 16px;
    bottom: 4px;
    font-size: 12px;
    color: var(--chat-text-color);
    white-space: nowrap;
  }
  .file {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    cursor: pointer;
    color: #fff;
    .left-wrapper {
      margin-right: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .right-wrapper {
      text-decoration: underline;
    }
  }
  .product-msg {
    display: flex;
    .image-wrapper {
      position: relative;
      height: 68px;
      width: 68px;
      .ant-image,
      .detail-image {
        border-radius: 6px;
        width: 68px;
        height: 68px;
      }
      & .ant-avatar-group > span.ant-avatar.ant-avatar-circle {
        position: absolute;
        bottom: 4px;
        right: 4px;
      }
    }
    .right-wrapper {
      margin-left: 12px;
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-width: 0px;
      &.empty {
        gap: 8px;
      }
    }
    .name-wrapper {
      display: flex;
      align-items: center;
      position: relative;
      width: fit-content;
      cursor: pointer;
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
        color: ${({ theme }) => theme.colorPrimary};
        margin: 0;
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
    .desc {
      opacity: 0.45;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-word;
      & p {
        margin: 0;
      }
    }
    .price-wrapper {
      margin-top: auto;
      font-size: 14px;
    }
  }
  .chat-msg-text {
    max-width: 70%;
    margin-left: 8px;
    background-color: var(--chat-text-bg);
    padding: 16px;
    border-radius: 16px 16px 16px 0;
    line-height: 1.5;
    font-size: 14px;
    user-select: none;
    pointer-events: none;
    position: relative;
    color: var(--chat-text-color);
    z-index: 0;
    & > .ant-typography {
      color: currentColor;
      margin-bottom: 0;
      .ant-typography-expand {
        color: ${({ theme }) => theme.generatedColors[8]};
        text-decoration: underline;
      }
    }
  }
  .chat-msg-text + .chat-msg-text {
    margin-top: 10px;
  }

  &.owner {
    flex-direction: row-reverse;
  }
  &.owner .chat-msg-text {
    margin-left: 0;
    margin-right: 8px;
    align-items: flex-end;
    background-color: var(--theme-color);
    color: #fff;
    border-radius: 16px 16px 0 16px;
  }
  &.owner .chat-msg-date {
    left: auto;
    right: calc(100% + 8px);
  }
  &.owner .chat-msg-date-bottom {
    left: auto;
    right: 16px;
  }

  .chat-msg-text img {
    max-width: 300px;
    max-height: 300px;
    width: 100%;
  }
  .actions-wrapper {
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
    width: fit-content;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(calc(100% + 4px), -50%);
    z-index: 1;
  }
  &.owner .actions-wrapper {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(calc(-100% - 4px), -50%);
  }
  &:hover {
    .actions-wrapper {
      opacity: 1;
      visibility: visible;
    }
  }
`;

export default ChatMsgItem;

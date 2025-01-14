import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { useCreation } from "ahooks";
import { Badge, Typography } from "antd";
import { rgba } from "emotion-rgba";
import { BsPersonFill } from "react-icons/bs";
import { TCustomer } from "src/types/chat.types";
import { dayjs, formatDate } from "src/utils/utils-date";
import Avatar from "../avatar/Avatar";

type TChatConversationItemProps = {
  active?: boolean;
  onClick?: () => void;
} & Pick<
  TCustomer,
  "isOnline" | "friendName" | "lastMessage" | "unreadMessageCount" | "friendImageUrl"
>;

const ChatConversationItem = ({ onClick, active, ...item }: TChatConversationItemProps) => {
  const { generatedColors } = useTheme();
  const typeMessage = item.lastMessage?.typeMessage;
  const previewMessage = useCreation(() => {
    const typeMessage = item.lastMessage?.typeMessage;
    if (typeMessage === 8) return `[Sản phẩm]`;
    if (typeMessage === 4) return `[Tệp tin]`;
    if (typeMessage === 2) return `[Hình ảnh]`;
    return item.lastMessage.message;
  }, [item]);
  return (
    <ChatConversationItemStyled className={active ? "active" : undefined} onClick={onClick}>
      <Badge dot={item.isOnline} status="success" offset={[-8, 42]}>
        <Avatar size={50} icon={<BsPersonFill size={24} />} src={item.friendImageUrl}></Avatar>
      </Badge>
      <div className="detail-wrapper">
        <div className="name-wrapper">
          <Typography.Text strong ellipsis className="msg-username">
            {item.friendName}
          </Typography.Text>
          <Typography.Text type="secondary" ellipsis className="msg-date">
            {dayjs(item.lastMessage.creationTime).isBefore(dayjs().startOf("day"))
              ? formatDate(item.lastMessage.creationTime, "DD-MM-YY")
              : formatDate(item.lastMessage.creationTime, "HH:mm")}
          </Typography.Text>
        </div>
        <div className="content-wrapper">
          <Typography.Text
            type="secondary"
            strong={!!item.unreadMessageCount}
            ellipsis
            className="msg-message"
          >
            {previewMessage}
          </Typography.Text>
          {!!item.unreadMessageCount && (
            <Badge count={item.unreadMessageCount} overflowCount={9} color={generatedColors[6]} />
          )}
        </div>
      </div>
    </ChatConversationItemStyled>
  );
};
const ChatConversationItemStyled = styled.div`
  --msg-hover-bg: rgba(229, 229, 229, 0.35);
  --active-conversation-bg: ${({ theme }) => `linear-gradient(
    to right,
    ${rgba(theme.generatedColors[2], 0.5)} 0%,
    transparent 100%
  )`};
  --theme-color: ${({ theme }) => theme.colorPrimary};
  --theme-bg-color: #fff;
  --msg-date: #c0c7d2;
  display: flex;
  align-items: center;
  padding: 18px 24px 20px 16px;
  cursor: pointer;
  transition: 0.2s;
  position: relative;
  user-select: none;
  pointer-events: none;
  border-left: 4px solid transparent;
  &:hover {
    background-color: var(--msg-hover-bg);
  }
  &.active {
    background: var(--active-conversation-bg);
    border-left: 4px solid var(--theme-color);
  }
  .detail-wrapper {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    width: 100%;
    .name-wrapper {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;
      gap: 3px;
    }
    .msg-username {
      font-size: 16px;
      margin-bottom: auto;
    }
    .msg-date {
      flex-shrink: 0;
      font-size: 11px;
    }
    .content-wrapper {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      gap: 3px;
    }
  }
`;

export default ChatConversationItem;

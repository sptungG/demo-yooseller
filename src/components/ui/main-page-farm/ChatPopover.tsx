import Button from "@/components/button/Button";
import MessageLayout from "@/components/layout/MessageLayout";
import Container from "@/components/shared/Container";
import useChangeLocale from "@/hooks/useChangeLocale";
import { useGetCountMessageUnreadUserQuery } from "@/redux/query/chat.query";
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Badge, Flex, Popover, Typography } from "antd";
import { useState } from "react";
import { HiChatAlt2 } from "react-icons/hi";
import { TbChevronDown } from "react-icons/tb";

type TChatPopoverProps = { storeId?: number };

function ChatPopover({ storeId }: TChatPopoverProps) {
  const { colorPrimary } = useTheme();
  const { i18n } = useChangeLocale();
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const { data: getCountMessageUnreadUserRes } = useGetCountMessageUnreadUserQuery(
    {},
    { refetchOnMountOrArgChange: true, refetchOnFocus: true },
  );
  const getCountMessageUnreadUser = getCountMessageUnreadUserRes?.result.data || 0;

  return (
    <Popover
      placement="topRight"
      trigger={["click"]}
      content={
        <Container suppressScrollX style={{ maxHeight: "calc(100dvh - 64px)" }}>
          <MessageLayout storeId={storeId} />
        </Container>
      }
      overlayInnerStyle={{ padding: 0 }}
      arrow={false}
      open={chatOpen}
      onOpenChange={setChatOpen}
      overlayStyle={{ bottom: 8, borderRadius: 8 }}
      title={
        <ChatTitleStyled>
          <div className="left-wrapper">
            <Typography.Text style={{ fontSize: 18, color: colorPrimary }}>Chat</Typography.Text>
            {!!getCountMessageUnreadUser ? (
              <Typography.Text style={{ fontSize: 12, marginLeft: 4, color: colorPrimary }}>
                {`(${getCountMessageUnreadUser})`}
              </Typography.Text>
            ) : (
              <></>
            )}
          </div>
          <div className="right-wrapper">
            <Button
              size="small"
              type="text"
              icon={<TbChevronDown />}
              onClick={() => setChatOpen(false)}
              bgColor="rgba(0,0,0,0.05)"
            >
              {i18n["Thu gọn"]}
            </Button>
          </div>
        </ChatTitleStyled>
      }
    >
      <StyledContainer>
        <div className="chat-trigger-icon">
          <HiChatAlt2 size={26} />
        </div>
        <Flex align="center" gap={8} style={{ flex: "1 1 auto", minWidth: 0 }}>
          <Typography.Title
            level={5}
            ellipsis
            style={{ maxWidth: "100%", lineHeight: 1.1, margin: 0 }}
            className="chat-trigger-title"
          >
            Chat
          </Typography.Title>

          <Badge
            count={getCountMessageUnreadUser}
            showZero
            color={getCountMessageUnreadUser ? undefined : "rgba(0,0,0,0.2)"}
            styles={{ root: { marginLeft: "auto" } }}
          />
        </Flex>
      </StyledContainer>
    </Popover>
  );
}

const StyledContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  height: 48px;
  padding: 0 8px;
  position: sticky;
  bottom: 0px;
  right: 8px;
  width: 320px;
  border: 1px solid ${({ theme }) => theme.colorPrimary};
  & .chat-trigger-icon {
    margin-right: 8px;
    opacity: 0.45;
    color: ${({ theme }) => theme.colorPrimary};
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
  }
  & .chat-trigger-title {
    color: ${({ theme }) => theme.colorPrimary};
  }
`;

const ChatTitleStyled = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: -8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  & > .left-wrapper {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
  }
  & > .right-wrapper {
    padding: 16px;
    margin-left: auto;
    display: flex;
    align-items: center;
  }
`;

export default ChatPopover;

import styled from "@emotion/styled";
import { useSafeState } from "ahooks";
import { Badge, Divider, Form, Input, Typography, theme } from "antd";
import { useEffect, useId, useState } from "react";
import { BsFileEarmarkText, BsPersonFill } from "react-icons/bs";
import { IoIosPaperPlane } from "react-icons/io";
import { MdOutlineDelete, MdOutlineImage } from "react-icons/md";
import { TbPaperclip, TbTrash } from "react-icons/tb";
import Avatar from "src/components/avatar/Avatar";
import Button from "src/components/button/Button";
import UploadFile from "src/components/field/UploadFile";
import StyledPage from "src/components/layout/StyledPage";
import ChatConversationItem from "src/components/shared/ChatConversationItem";
import ChatMsgItem from "src/components/shared/ChatMsgItem";
import ImageItem from "src/components/shared/ImageItem";
import Pagination from "src/components/shared/Pagination";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProvider from "src/hooks/useGetProvider";
import {
  useGetBusinessChatMessagesQuery,
  useGetUserFriendshipChatsQuery,
} from "src/redux/query/chat.query";
import { useUploadFileMutation } from "src/redux/query/file.query";
import { useUploadImageMutation } from "src/redux/query/image.query";
import { useAppDispatch, useAppSelector } from "src/redux/store";
import { TCustomer, TMessage } from "src/types/chat.types";
import { returnFileSize, toBase64 } from "src/utils/utils";
import { dayjs, isSameTime } from "src/utils/utils-date";
import Spin from "../loader/Spin";
import Container from "../shared/Container";

type TMessageLayoutProps = { storeId?: number };

const MessageLayout = ({ storeId }: TMessageLayoutProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { message } = useApp();
  const {
    token: { colorTextPlaceholder, colorPrimary },
  } = theme.useToken();
  const [form] = Form.useForm();
  const { gSelectedProvider } = useGetProvider({ id: storeId });

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const encryptedAccessToken = useAppSelector((s) => s.auth.encryptedAccessToken);
  const dispatch = useAppDispatch();
  const [selectedCustomer, setSelectedCustomer] = useSafeState<TCustomer | undefined>(undefined);
  useEffect(() => {
    setSelectedCustomer(undefined);
    return () => {
      setSelectedCustomer(undefined);
    };
  }, [gSelectedProvider]);

  const [selectedImageFileUrl, setSelectedImageFileUrl] = useSafeState<string>();
  const [uploadImageMutate, { isLoading: isLoadingUploadImage }] = useUploadImageMutation();

  const fileWatch = Form.useWatch("fileUpload", form);
  const [uploadFileMutate, { isLoading: isLoadingUploadFile }] = useUploadFileMutation();

  const { data: getUserFriendshipChatsRes, refetch: refetchUserFriendshipChats } =
    useGetUserFriendshipChatsQuery(
      {
        providerId: gSelectedProvider?.id,
      },
      { skip: !gSelectedProvider?.id },
    );
  const conversationList = getUserFriendshipChatsRes?.result.data || [];

  const [chatListFilter, setChatListFilter] = useSafeState<{ maxResultCount: number }>({
    maxResultCount: 10,
  });
  const { data: getChatMessagesRes, refetch: refetchGetChatMessages } =
    useGetBusinessChatMessagesQuery(
      {
        userId: selectedCustomer?.friendUserId || undefined,
        tenantId: selectedCustomer?.tenantId || undefined,
        providerId: selectedCustomer?.providerId || undefined,
        ...chatListFilter,
      },
      { skip: !selectedCustomer, refetchOnMountOrArgChange: true },
    );
  const chatMessageList = getChatMessagesRes?.result.data || [];
  const chatMessageTotal = getChatMessagesRes?.result.totalRecords || 0;
  const [chatMsgListRef, setChatMsgListRef] = useSafeState<HTMLDivElement | null>(null);
  const [chatWrapperRef, setChatWrapperRef] = useSafeState<HTMLDivElement | null>(null);
  const [chatMsgLastRef, setChatMsgLastRef] = useSafeState<HTMLDivElement | null>(null);

  const showAvatar = (item: TMessage, index: number) => {
    if (!isSameTime(item?.creationTime, chatMessageList?.[index + 1]?.creationTime, "day"))
      return isSameTime(
        item?.creationTime,
        dayjs(item?.creationTime).endOf("day").toISOString(),
        "day",
      );
    return item.side !== chatMessageList?.[index + 1].side;
  };

  const hubConnection = useAppSelector((s) => s.chat.hubSignalR);

  const scrollToLast = (chatMsgLastRef: HTMLDivElement | null) => {
    if (!!chatMsgLastRef) {
      chatMsgLastRef.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!!chatMsgLastRef) {
      chatMsgLastRef.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedCustomer, getChatMessagesRes, chatMsgLastRef]);

  const handleSendMsg = (formData: any) => {
    const { message, imageFileUpload, fileUpload } = formData;
    const sentMsg = {
      userTenantId: selectedCustomer?.friendTenantId,
      messageRepliedId: null,
      userId: selectedCustomer?.friendUserId,
      providerId: selectedCustomer?.providerId,
      userImageUrl: selectedCustomer?.friendImageUrl,
      message: undefined,
      typeMessage: 1,
    };
    if (!!imageFileUpload) {
      handleUploadImage(imageFileUpload)
        .then((res) => {
          hubConnection
            ?.invoke("ProviderSendMessageUser", { ...sentMsg, message: res, typeMessage: 2 })
            .then((res: any) => {
              console.log("done send", res);
            })
            .catch((err: any) => console.error(i18n["Lỗi gửi tin nhắn đến cửa hàng"], err));
        })
        .catch((err) => {});
    }
    if (!!fileUpload) {
      handleUploadFile(fileUpload)
        .then((res) => {
          hubConnection
            ?.invoke("ProviderSendMessageUser", {
              ...sentMsg,
              message: res,
              typeMessage: 4,
            })
            .then((res: any) => {
              console.log("done send", res);
            })
            .catch((err: any) => console.error(i18n["Lỗi gửi tin nhắn đến cửa hàng"], err));
        })
        .catch((err) => {});
    }
    if (!!message) {
      hubConnection
        ?.invoke("ProviderSendMessageUser", { ...sentMsg, message, typeMessage: 1 })
        .then((res: any) => {
          console.log("done send", res);
        })
        .catch((err: any) => console.error(i18n["Lỗi gửi tin nhắn đến cửa hàng"], err));
    }

    form.resetFields();
  };

  const handleDeleteMsg = (sendMessageData: TMessage) => {
    hubConnection
      ?.invoke("DeleteChatMessageBusiness", sendMessageData)
      .then((res: any) => {
        console.log("[done delete mess store]", res);
      })
      .catch((err: any) => {
        console.error(err);
        message.error(i18n["Thu hồi tin nhắn thất bại"]);
      });
  };

  const handleUploadImage = async (selectedImageFile: File) => {
    if (!selectedImageFileUrl) return;
    try {
      const imageUrlRes = await uploadImageMutate({ file: selectedImageFile as any }).unwrap();
      message.success(i18n["Tải ảnh lên thành công"]);
      return imageUrlRes.result.data;
    } catch (err) {
      message.error(i18n["Đã có lỗi xảy ra khi tải ảnh lên"]);
      return;
    } finally {
      URL.revokeObjectURL(selectedImageFileUrl);
      setSelectedImageFileUrl(undefined);
    }
  };

  const handleUploadFile = async (selectedFile: File) => {
    try {
      const uri = await toBase64(selectedFile);
      const fileUrlRes = await uploadFileMutate({ file: selectedFile }).unwrap();
      message.success(i18n["Tải file lên thành công"]);
      return fileUrlRes.result.data;
    } catch (err) {
      message.error(i18n["Đã có lỗi xảy ra khi tải file lên"]);
      return;
    } finally {
      form.setFieldValue("fileUpload", undefined);
    }
  };
  return (
    <PageWrapper>
      <Container className="conversation-wrapper">
        {conversationList.map((item, index) => (
          <ChatConversationItem
            key={uid + "conversation" + item.id + index}
            active={selectedCustomer?.id === item.id}
            onClick={() => {
              setSelectedCustomer(item);
              setChatListFilter({ maxResultCount: 10 });
            }}
            {...item}
          />
        ))}
      </Container>
      <Container
        className="chat-wrapper"
        style={{ display: !!selectedCustomer ? "flex" : "none" }}
        key={uid + String(gSelectedProvider?.id) + selectedCustomer?.id + "chat-wrapper"}
        ref={setChatWrapperRef}
      >
        <div className="header-wrapper">
          <div className="name-wrapper">
            <Badge dot={selectedCustomer?.isOnline} status="success" offset={[-8, 40]}>
              <Avatar
                size={44}
                icon={<BsPersonFill size={24} />}
                src={selectedCustomer?.friendImageUrl}
              />
            </Badge>
            <Typography.Text strong ellipsis className="title">
              {selectedCustomer?.friendName}
            </Typography.Text>
          </div>
        </div>
        {chatMessageTotal > chatListFilter.maxResultCount && (
          <div className="see-more-actions">
            <Divider plain style={{ margin: "0 0 8px" }}>
              <Pagination
                showLessItems
                showSizeChanger={false}
                total={chatMessageTotal}
                defaultPageSize={10}
                defaultCurrent={1}
                onChange={(current, pageSize) => {
                  const quotient = Math.floor(chatMessageTotal / pageSize);
                  const remainder = chatMessageTotal % pageSize;
                  setChatListFilter({
                    ...chatListFilter,
                    maxResultCount:
                      pageSize * (current > quotient ? quotient : current) +
                      (current > quotient ? remainder : 0),
                  });
                }}
              />
            </Divider>
          </div>
        )}
        <div className="main-wrapper" ref={setChatMsgListRef}>
          {chatMessageList.map((item, index) => (
            <ChatMsgItem
              key={uid + "ChatMsgItem" + selectedCustomer?.id + index}
              showTime={showAvatar(item, index)}
              hideProfile={true}
              options={[
                {
                  key: "delete",
                  label: item.side === 1 ? i18n["Thu hồi"] : i18n["Xóa ở phía bạn"],
                  danger: true,
                  icon: <MdOutlineDelete size={16} />,
                  onClick: () => handleDeleteMsg(item),
                },
              ]}
              {...item}
            />
          ))}
        </div>
        <div className="footer-wrapper">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSendMsg}
            initialValues={{
              imageFileUpload: undefined,
              fileUpload: undefined,
            }}
            onValuesChange={(changedValues: any, values: any) => {
              const { imageFileUpload, fileUpload } = changedValues;
              if (!!imageFileUpload) {
                setSelectedImageFileUrl(URL.createObjectURL(imageFileUpload));
                form.setFieldValue("fileUpload", undefined);
              }
              if (!!fileUpload) {
                form.setFieldValue("imageFileUpload", undefined);
              }
            }}
          >
            <Form.Item name="imageFileUpload" noStyle>
              <UploadFile className="upload-image-wrapper" accept="image/gif,image/jpeg,image/png">
                <MdOutlineImage size={24} className="icon" />
              </UploadFile>
            </Form.Item>
            <Form.Item name="fileUpload" noStyle>
              <UploadFile className="upload-file-wrapper" accept="*">
                <TbPaperclip size={24} className="icon" />
              </UploadFile>
            </Form.Item>
            <div className="input-wrapper">
              {(!!selectedImageFileUrl || !!fileWatch) && (
                <div className="selected-image-wrapper">
                  <Spin spinning={isLoadingUploadImage}>
                    {!!selectedImageFileUrl && (
                      <ImageItem
                        width={120}
                        src={selectedImageFileUrl}
                        onClickRemove={(src) => {
                          URL.revokeObjectURL(selectedImageFileUrl);
                          setSelectedImageFileUrl(undefined);
                        }}
                      />
                    )}
                  </Spin>
                  <Spin spinning={isLoadingUploadFile}>
                    {!!fileWatch && (
                      <div className="selected-file">
                        <div className="icon-wrapper">
                          <BsFileEarmarkText size={32} color={colorTextPlaceholder} />
                        </div>
                        <div className="detail-wrapper">
                          <Typography.Paragraph
                            ellipsis={{ rows: 2, suffix: (fileWatch.name as string).split(".")[1] }}
                            strong
                            style={{ maxWidth: 174, margin: 0 }}
                          >
                            {(fileWatch.name as string).split(".")[0]}
                          </Typography.Paragraph>
                          <Typography.Text ellipsis type="secondary">
                            {returnFileSize(fileWatch.size)}
                          </Typography.Text>
                        </div>
                        <div className="actions-wrapper">
                          <Button
                            danger
                            ghost
                            size="small"
                            type="dashed"
                            shape="circle"
                            onClick={() => {
                              form.setFieldValue("fileUpload", undefined);
                            }}
                            icon={<TbTrash size={16} />}
                          ></Button>
                        </div>
                      </div>
                    )}
                  </Spin>
                </div>
              )}
              <Form.Item name="message" noStyle>
                <Input
                  autoComplete="off"
                  variant="borderless"
                  placeholder={`${i18n["Nhập tin nhắn của bạn"]}...`}
                  className="input-message"
                  size="large"
                />
              </Form.Item>
              <Button type="text" size="large" htmlType="submit" className="button-send">
                <IoIosPaperPlane
                  size={24}
                  className="icon-sent"
                  color={!!selectedImageFileUrl || !!fileWatch ? colorPrimary : undefined}
                />
              </Button>
            </div>
          </Form>
        </div>
        <div key={uid + selectedCustomer?.id + "ChatMsgItemLast"} ref={setChatMsgLastRef}></div>
      </Container>
      {!selectedCustomer && (
        <div className="start-wrapper">
          <div className="header-wrapper">
            <Typography.Text className="title">
              {i18n["Chào mừng đến với"]} <b>{i18n["Trò chuyện"]}</b>
            </Typography.Text>
            <Typography.Paragraph className="subtitle" type="secondary">
              {i18n["Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng"]}{" "}
              <b>{i18n["các gian hàng"]}</b> {i18n["được tối ưu hoá cho máy tính của bạn"]}.
            </Typography.Paragraph>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};
const PageWrapper = styled(StyledPage)`
  --border-color: #eef2f4;
  --theme-color: ${({ theme }) => theme.colorPrimary};
  --chat-header-bg: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 96%,
    rgba(255, 255, 255, 0) 100%
  );
  --overlay-bg: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, #eee 65%, #eee 100%);
  --input-bg: #f8f8fa;
  --settings-icon-color: #c1c7cd;
  --settings-icon-hover: #9fa7ac;
  --msg-date: #c0c7d2;
  --detail-font-color: #919ca2;
  padding: 0;
  width: 100%;
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  flex-direction: row;
  height: 600px;
  z-index: 0;
  overflow: hidden;
  background-color: #fff;
  margin-left: 0px;
  & > .conversation-wrapper {
    border-right: 1px solid rgba(0, 0, 0, 0.05);
    border-left: 1px solid rgba(0, 0, 0, 0.05);
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    width: 280px;
    flex-shrink: 0;
    .actions-wrapper {
      position: sticky;
      bottom: 0;
      margin-top: auto;
      flex-shrink: 0;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 8px;
      height: 48px;
      &::before {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        height: 100%;
        width: 340px;
        background: var(--overlay-bg);
      }
    }
  }

  & > .chat-wrapper {
    margin-top: 2px;
    flex: 1 1 auto;
    min-width: 520px;
    max-width: 520px;
    display: flex;
    flex-direction: column;
    overflow: auto;
    & > .header-wrapper {
      display: flex;
      position: sticky;
      top: 0;
      left: 0;
      z-index: 2;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      background: var(--chat-header-bg);
      height: 64px;
      min-height: 64px;
      flex: 0 0 64px;
      & .title {
        font-size: 20px;
      }
      & > .name-wrapper {
        display: flex;
        align-items: flex-start;
        column-gap: 8px;
      }
    }
    & > .see-more-actions {
      width: 100%;
      padding: 0 24px;
    }
    .main-wrapper {
      flex: 1 1 auto;
    }
    .footer-wrapper {
      margin-top: auto;
      justify-self: flex-end;
      position: sticky;
      bottom: 0;
      left: 0;
      width: 100%;
      .ant-form {
        border-top: 1px solid var(--border-color);
        display: flex;
        padding: 12px 16px 12px 16px;
        align-items: center;
        background-color: #fff;
        width: 100%;
        overflow-x: hidden;
      }
      .input-wrapper {
        position: relative;
        flex: 1 1 auto;
        max-width: 100%;
        margin: 0 0 0 12px;
        flex-shrink: 0;
        background-color: var(--input-bg);
        border-radius: 6px;
        .button-send {
          position: absolute;
          right: 8px;
          bottom: 8px;
          color: var(--settings-icon-color);
          padding: 0;
          height: 24px;
          background-color: transparent;
          &:hover {
            color: ${({ theme }) => theme.colorPrimary};
          }
        }
        .input-message {
          font-size: 16px;
          width: 100%;
          padding-right: 36px;
          &:focus::placeholder {
            color: ${({ theme }) => theme.colorPrimary};
          }
        }
        &:focus-within {
          .button-send {
            color: ${({ theme }) => theme.colorPrimary};
          }
        }
      }
      .ant-form {
        .icon {
          color: var(--settings-icon-color);
          flex-shrink: 0;
          cursor: pointer;
          &:hover {
            color: var(--settings-icon-hover);
          }
        }
        .upload-image-wrapper,
        .upload-file-wrapper {
          align-self: flex-end;
          height: 24px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .upload-image-wrapper {
          margin-right: 12px;
        }
        .selected-image-wrapper {
          display: flex;
          align-items: flex-start;
          flex-wrap: nowrap;
          gap: 12px;
          padding: 11px 11px 10px 11px;
          border-bottom: 1px solid rgba(193, 199, 205, 0.5);
          .image-wrapper {
            width: 140px;
            height: 120px;
          }
          .selected-file {
            display: flex;
            flex-wrap: nowrap;
            background-color: #fff;
            padding: 8px;
            border-radius: 8px;
            .icon-wrapper {
              margin-right: 8px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .detail-wrapper {
              display: flex;
              flex-direction: column;
              margin-right: 8px;
            }
            .actions-wrapper {
            }
          }
        }
        .ant-space-compact.actions-wrapper {
          .ant-btn {
            justify-content: flex-start;
          }
        }
      }
    }
  }

  & > .start-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1 1 auto;
    min-width: 520px;
    max-width: 520px;
    & > .header-wrapper {
      max-width: 415px;
      text-align: center;
      .title {
        font-size: 24px;
      }
      .subtitle {
        font-size: 14px;
      }
    }
  }
`;

export default MessageLayout;

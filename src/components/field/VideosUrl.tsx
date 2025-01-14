import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { useSafeState } from "ahooks";
import { ButtonProps, Form, Input, ModalProps, Space } from "antd";
import { useId } from "react";
import { BsPlusLg, BsUpload } from "react-icons/bs";
import { TbChevronDown, TbChevronUp, TbTrash } from "react-icons/tb";
import useChangeLocale from "src/hooks/useChangeLocale";
import Button from "../button/Button";
import Modal from "../modal/Modal";

type TVideosUrlProps = {
  onOk?: (videoUrls: string[]) => void;
  maxLength?: number | null;
  buttonProps?: ButtonProps;
  modalProps?: ModalProps;
};

const VideosUrl = ({ onOk, maxLength = 3, buttonProps, modalProps }: TVideosUrlProps) => {
  const uid = useId();
  const [form] = Form.useForm();
  const { i18n } = useChangeLocale();
  const [open, setOpen] = useSafeState(false);
  const videoUrlsWatch = Form.useWatch("videoUrls", form);
  const { generatedColors } = useTheme();
  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        type="text"
        size="small"
        color={generatedColors[7]}
        className="imageUrl-btn"
        {...buttonProps}
      >
        {i18n["Thêm video từ URL"]}
      </Button>
      <Modal
        title={i18n["Đường dẫn video"]}
        open={open}
        okText={i18n[`Tải lên`]}
        cancelText={i18n["Hủy"]}
        onCancel={() => {
          form.resetFields();
          setOpen(false);
        }}
        okButtonProps={{
          size: "large",
          disabled: !videoUrlsWatch,
          icon: <BsUpload />,
        }}
        cancelButtonProps={{
          size: "large",
        }}
        onOk={() => {
          form
            .validateFields()
            .then(({ videoUrls }) => {
              onOk?.(videoUrls?.filter((i: any) => !!i));
              form.resetFields();
              setOpen(false);
            })
            .catch((err) => {});
        }}
        {...(!videoUrlsWatch?.length ? { footer: null } : {})}
        {...modalProps}
      >
        <Form form={form} id={uid} layout="vertical">
          <Form.List name={"videoUrls"}>
            {(fields, { add, remove, move }) => {
              return (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <ImageUrlItemStyled key={uid + key + "videoUrl"}>
                      <div className="image-wrapper">
                        {videoUrlsWatch?.[name] && (
                          <video
                            controls
                            style={{
                              width: 100,
                              height: 100,
                            }}
                            onError={(e) => {
                              form.setFieldValue(["videoUrls", name], undefined);
                            }}
                          >
                            <source src={videoUrlsWatch?.[name]} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                      <div className="input-wrapper">
                        <Form.Item
                          name={[name]}
                          rules={[{ type: "url", required: true }]}
                          className="hide-error"
                        >
                          <Input.TextArea
                            rows={4}
                            autoSize={{ minRows: 4, maxRows: 4 }}
                            placeholder={`${i18n["Nhập đường dẫn video"]} ${name + 1}...`}
                            variant="borderless"
                            style={{ padding: "0px 20px 0px 0px" }}
                          />
                        </Form.Item>
                      </div>
                      {fields.length > 1 ? (
                        <div className="actions-wrapper">
                          <Space.Compact direction="vertical" size="middle">
                            <Button
                              type="dashed"
                              onClick={() => move(name, name - 1)}
                              icon={<TbChevronUp size={20} />}
                            ></Button>
                            <Button
                              type="dashed"
                              onClick={() => move(name, name + 1)}
                              icon={<TbChevronDown size={20} />}
                            ></Button>
                            <Button
                              type="dashed"
                              onClick={() => remove(name)}
                              icon={<TbTrash size={20} />}
                            ></Button>
                          </Space.Compact>
                        </div>
                      ) : (
                        <div className="actions-wrapper-1">
                          <Button
                            size="middle"
                            type="dashed"
                            onClick={() => remove(name)}
                            icon={<TbTrash size={20} />}
                          ></Button>
                        </div>
                      )}
                    </ImageUrlItemStyled>
                  ))}
                  {!!maxLength && fields.length < maxLength && (
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<BsPlusLg />}
                      style={{ marginBottom: 6 }}
                    >
                      {i18n["Thêm URL"]}
                    </Button>
                  )}
                </>
              );
            }}
          </Form.List>
        </Form>
      </Modal>
    </>
  );
};
const ImageUrlItemStyled = styled.div`
  display: flex;
  align-items: flex-start;
  position: relative;
  margin-bottom: 12px;
  padding: 8px;
  gap: 8px;
  border-radius: 8px;
  background-color: #ffffff;
  border: 1px dashed #d9d9d9;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02);
  & > .image-wrapper {
    flex-shrink: 0;
    .ant-image img {
      border-radius: 4px;
    }
  }
  & > .input-wrapper {
    flex: 1 1 auto;
    min-width: 0px;
    textarea {
      padding: 0;
    }
    .ant-input-textarea-suffix {
      inset-inline-end: 9px !important;
      .ant-form-item-feedback-icon {
        font-size: 16px;
      }
    }
  }
  & > .actions-wrapper {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(50%, -50%);
  }
  & > .actions-wrapper-1 {
    position: absolute;
    right: 8px;
    bottom: 8px;
  }
`;

export default VideosUrl;

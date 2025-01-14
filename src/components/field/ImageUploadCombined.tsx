import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { useSafeState } from "ahooks";
import { Divider, Form, Input, ModalProps, Select, Typography, Upload } from "antd";
import { NamePath } from "antd/es/form/interface";
import { useId, useMemo } from "react";
import { BsUpload } from "react-icons/bs";
import { MdOutlineInbox } from "react-icons/md";
import { TbChevronDown } from "react-icons/tb";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useUploadImageMutation } from "src/redux/query/image.query";
import Modal from "../modal/Modal";
import Image from "../next/Image";
import ImageItem from "../shared/ImageItem";
import { SelectItemStyled } from "../shared/ItemStyled";

type TImageUploadCombinedProps = {
  name?: NamePath[];
  value?: string;
  onChange?: (newValue?: string) => void;
  modalProps?: ModalProps;
  width?: string;
  height?: string;
  icon?: React.ReactNode;
  desc01?: React.ReactNode;
  desc02?: React.ReactNode;
};

const ImageUploadCombined = ({
  name,
  value,
  onChange,
  modalProps,
  width = "156px",
  height = "156px",
  desc01 = (
    <Typography.Text strong type="secondary" className="upload-text">
      {"Tải ảnh lên"}
    </Typography.Text>
  ),
  desc02 = (
    <Typography.Text type="secondary" className="upload-text-desc">
      {"(Chọn phương thức"}
      <TbChevronDown size={14} style={{ marginBottom: -3, marginRight: -3 }} />
      {")"}
    </Typography.Text>
  ),
  icon = (
    <div className="upload-icon">
      <MdOutlineInbox size={40} />
    </div>
  ),
}: TImageUploadCombinedProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { message } = useApp();
  const { generatedColors } = useTheme();
  const form = Form.useFormInstance();
  const [open, setOpen] = useSafeState(false);
  const [selectImageUrl, setSelectImageUrl] = useSafeState<string>();
  const [urlText, setUrlText] = useSafeState<string>();
  const { status, errors } = Form.Item.useStatus();

  const imageUrlListWatch = Form.useWatch("imageUrlList", form);

  const [selectedFile, setSelectedFile] = useSafeState<File>();
  const selectedFileUrl = useMemo(
    () => (!!selectedFile ? URL.createObjectURL(selectedFile) : undefined),
    [selectedFile],
  );

  const [uploadImageMutate, { isLoading }] = useUploadImageMutation();

  const handleUploadImage = () => {
    !!selectedFileUrl &&
      uploadImageMutate({ file: selectedFile as any })
        .unwrap()
        .then(({ result }) => {
          onChange?.(result.data);
          message.success(i18n["Tải ảnh lên thành công"]);
        })
        .catch((err) => {
          message.error(i18n["Đã có lỗi xảy ra khi tải ảnh lên"]);
        })
        .finally(() => {
          URL.revokeObjectURL(selectedFileUrl);
          setSelectedFile(undefined);
        });
  };

  return (
    <>
      {!!value ? (
        <ImageItem
          width={width}
          height={height}
          isUploaded={!!value}
          src={value}
          onClickRemove={(src) => {
            !!selectedFileUrl && URL.revokeObjectURL(selectedFileUrl);
            setSelectedFile(undefined);
            setSelectImageUrl(undefined);
            setUrlText(undefined);
            onChange?.(undefined);
          }}
        />
      ) : (
        <ImageUploadCombinedStyled
          onClick={() => setOpen(!open)}
          className={`${status} ${!!open ? "open" : ""}`}
          style={{
            width,
            height,
          }}
        >
          {icon}
          {desc01}
          {desc02}
        </ImageUploadCombinedStyled>
      )}
      <Modal
        open={open}
        okText={i18n[`Tải lên`]}
        cancelText={i18n["Hủy"]}
        onCancel={() => {
          !!selectedFileUrl && URL.revokeObjectURL(selectedFileUrl);
          setSelectedFile(undefined);
          setSelectImageUrl(undefined);
          setUrlText(undefined);
          setOpen(false);
        }}
        okButtonProps={{
          size: "large",
          loading: isLoading,
          disabled: isLoading,
          icon: <BsUpload />,
        }}
        cancelButtonProps={{
          size: "large",
        }}
        onOk={() => {
          try {
            if (!!selectedFile) handleUploadImage();
            if (!!urlText) onChange?.(urlText);
            if (!!selectImageUrl) onChange?.(selectImageUrl);
          } catch (error) {
          } finally {
            setOpen(false);
          }
        }}
        {...modalProps}
      >
        <ImageUploadModalStyled>
          <div className="left-wrapper">
            {(!!selectedFile || !!urlText || !!selectImageUrl) && (
              <ImageItem
                width={156}
                height={156}
                isUploaded={!!urlText || !!selectImageUrl}
                src={selectedFileUrl || selectImageUrl || urlText}
                onClickRemove={(src) => {
                  !!selectedFileUrl && URL.revokeObjectURL(selectedFileUrl);
                  setSelectedFile(undefined);
                  setSelectImageUrl(undefined);
                  setUrlText(undefined);
                }}
              />
            )}
            <Upload
              id={uid + "upload"}
              className={`upload-container ${
                !!selectedFile || !!urlText || !!selectImageUrl ? "hidden" : ""
              }`}
              type="drag"
              multiple={false}
              accept="image/gif,image/jpeg,image/png"
              beforeUpload={(file, fileList) => {
                setSelectedFile(file);
                return false;
              }}
              fileList={[]}
              previewFile={(file) => Promise.resolve("")}
            >
              <div className="ant-upload-drag-icon">
                <MdOutlineInbox size={40} />
              </div>
              <div className="ant-upload-text">{i18n["Chọn hoặc kéo ảnh vào khu vực này"]}</div>
            </Upload>
          </div>
          <div className="right-wrapper">
            <Select
              options={((imageUrlListWatch as any) || [])?.map((url: any, index: number) => ({
                label: (
                  <SelectItemStyled>
                    <Image
                      src={url}
                      alt={String(index)}
                      width={32}
                      height={32}
                      className="select-image"
                    />
                    <div className="name-wrapper">Ảnh {index + 1}</div>
                  </SelectItemStyled>
                ),
                value: url,
              }))}
              placeholder="Chọn ảnh đã tải lên..."
              value={selectImageUrl}
              onChange={(value) => {
                setSelectImageUrl(value);
                setUrlText(undefined);
                setSelectedFile(undefined);
              }}
            ></Select>
            <Divider style={{ margin: "2px 0" }} plain>
              hoặc
            </Divider>
            <Input.TextArea
              rows={3}
              autoSize={{ minRows: 3, maxRows: 3 }}
              placeholder={`${i18n["Nhập đường dẫn ảnh"]}...`}
              value={urlText}
              onChange={(e) => {
                setUrlText(e.target.value);
                setSelectImageUrl(undefined);
                setSelectedFile(undefined);
              }}
            />
          </div>
          <Image
            hidden
            className="hidden"
            alt=""
            src={urlText}
            onError={(e) => {
              setUrlText(undefined);
            }}
          ></Image>
        </ImageUploadModalStyled>
      </Modal>
    </>
  );
};
const ImageUploadCombinedStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 1px dashed rgba(0, 0, 0, 0.1);
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  &.open {
    border-color: ${({ theme }) => theme.colorPrimary};
  }
  &.error {
    border-color: #ff4d4f;
    .upload-icon {
      color: rgba(255, 77, 80, 0.65);
    }
  }
  .upload-text-desc {
    font-size: 12px;
    text-align: center;
  }
`;

const ImageUploadModalStyled = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
  padding: 0 0 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  & > .left-wrapper {
    width: 158px;
    height: 158px;
    flex-shrink: 0;
    overflow: hidden;
    .ant-upload-text {
      line-height: 1.2;
    }
    .upload-container {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      height: 158px;
      .ant-upload-text {
        padding: 0 4px;
      }
    }
  }
  & > .right-wrapper {
    flex: 1 1 auto;
    min-width: 0px;
    margin-left: 14px;
    display: flex;
    flex-direction: column;
    .ant-divider-inner-text {
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
    }
  }
`;

export default ImageUploadCombined;

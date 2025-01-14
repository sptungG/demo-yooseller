import styled from "@emotion/styled";
import { ButtonProps, Upload, UploadProps } from "antd";
import { useId, useMemo, useState } from "react";
import { MdOutlineInbox, MdUpload } from "react-icons/md";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useUploadImageMutation } from "src/redux/query/image.query";
import Button from "../button/Button";
import ImageItem from "../shared/ImageItem";

type TImageUploadWithQueryProps = Omit<UploadProps, "onChange" | "fileList"> & {
  renderUploadedItem?: (url: string) => React.ReactNode;
  extra?: React.ReactNode;
  value?: string;
  onChange?: (urls: string) => void;
  buttonUploadProps?: ButtonProps;
  imageFileProps?: {
    width?: number | string;
    height?: number | string;
  };
};

const ImageUploadWithQuery = ({
  renderUploadedItem,
  value,
  onChange,
  buttonUploadProps = {},
  imageFileProps = { width: "100%", height: 120 },
  extra,
  ...props
}: TImageUploadWithQueryProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { message } = useApp();
  const [selectedFile, setSelectedFile] = useState<File>();
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
    <ImageUploadWithQueryStyled className={`image-upload-wrapper`}>
      {!!selectedFileUrl && (
        <ImageItem
          width={imageFileProps.width}
          height={imageFileProps.height}
          src={selectedFileUrl}
          onClickRemove={(src) => {
            URL.revokeObjectURL(selectedFileUrl);
            setSelectedFile(undefined);
          }}
        />
      )}
      {!!value && renderUploadedItem?.(value)}
      {!value && (
        <Upload
          className={!!selectedFile ? "hidden" : ""}
          type="drag"
          multiple={false}
          accept="image/gif,image/jpeg,image/png"
          beforeUpload={(file, fileList) => {
            setSelectedFile(file);
            return false;
          }}
          fileList={[]}
          previewFile={(file) => Promise.resolve("")}
          {...props}
        >
          <p className="ant-upload-drag-icon">
            <MdOutlineInbox size={40} />
          </p>
          <p className="ant-upload-text">{i18n["Chọn hoặc kéo ảnh vào khu vực này"]}</p>
        </Upload>
      )}
      {!!selectedFileUrl && !value && (
        <Button
          block
          className="btn-upload"
          icon={<MdUpload />}
          disabled={!selectedFile}
          loading={isLoading}
          onClick={() => handleUploadImage()}
          {...buttonUploadProps}
        >
          {buttonUploadProps.children || `${i18n["Tải lên"]}`}
        </Button>
      )}
    </ImageUploadWithQueryStyled>
  );
};
const ImageUploadWithQueryStyled = styled.div``;

export default ImageUploadWithQuery;

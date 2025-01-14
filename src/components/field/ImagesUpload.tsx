import styled from "@emotion/styled";
import { Form, Upload, UploadProps } from "antd";
import uniqBy from "lodash/uniqBy";
import { memo, useId, useMemo } from "react";
import { MdOutlineInbox } from "react-icons/md";
import useChangeLocale from "src/hooks/useChangeLocale";
import ImageItem from "../shared/ImageItem";

type TImagesUploadProps = Omit<UploadProps, "onChange" | "fileList"> & {
  isError?: boolean;
  uploadedList?: string[];
  renderUploadedItem?: (item: string, index?: number) => React.ReactNode;
  value?: File[];
  onChange?: (files: File[]) => void;
};

const ImagesUpload = ({
  uploadedList,
  renderUploadedItem,
  value = [] as File[],
  onChange,
  multiple = true,
  isError,
  ...props
}: TImagesUploadProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { status, errors } = Form.Item.useStatus();

  const uploadElement = useMemo(
    () => (
      <Upload
        type="drag"
        multiple={multiple}
        accept="image/gif,image/jpeg,image/png"
        beforeUpload={(file, fileList) => {
          const newFilelist = uniqBy([...value, ...fileList], "name");
          onChange?.(newFilelist);
          return false;
        }}
        fileList={[]}
        previewFile={(file) => Promise.resolve("")}
        style={isError || status === "error" ? { borderColor: "#ff4d4f" } : {}}
        {...props}
      >
        {!!uploadedList?.length || value.length > 0 ? (
          <>+ {i18n["Chọn thêm ảnh"]}</>
        ) : (
          <>
            <p className="ant-upload-drag-icon">
              <MdOutlineInbox size={40} />
            </p>
            <p className="ant-upload-text">{i18n["Chọn hoặc kéo ảnh vào khu vực này"]}</p>
          </>
        )}
      </Upload>
    ),
    [multiple, props, value, uploadedList],
  );

  return !!uploadedList?.length || value.length > 0 ? (
    <ImagesUploadStyled className="image-list">
      {uploadedList?.map((item, index) => renderUploadedItem?.(item, index))}
      {value.map((item, index) => (
        <ImageItem
          key={uid + index}
          src={URL.createObjectURL(item)}
          onClickRemove={(src) => {
            !!src && URL.revokeObjectURL(src);
            const index = value.indexOf(item);
            const newFileList = value.slice();
            newFileList.splice(index, 1);
            onChange?.(newFileList);
          }}
        />
      ))}
      <div className="upload-square">{uploadElement}</div>
    </ImagesUploadStyled>
  ) : (
    uploadElement
  );
};

const ImagesUploadStyled = styled.div`
  /* --f-columns: 4;
  --f-gap: 12px;
  display: flex;
  flex-wrap: wrap;
  margin-left: calc(-1 * var(--f-gap));
  margin-bottom: calc(-1 * var(--f-gap));
  & > * {
    position: relative;
    width: calc((100% / var(--f-columns) - var(--f-gap))) !important;
    height: 170px;
    margin-block: 0 !important;
    margin-inline: 0 !important;
    margin-bottom: var(--f-gap) !important;
    margin-left: var(--f-gap) !important;
  } */

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  grid-gap: 12px;
  & > .upload-square {
    position: relative;
    &::before {
      // for apsect ratio
      content: "";
      display: block;
      padding-bottom: 100%;
    }
    .ant-upload-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }
  }
`;

export default memo(ImagesUpload);

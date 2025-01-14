import styled from "@emotion/styled";
import { Form, Upload, UploadProps } from "antd";
import uniqBy from "lodash/uniqBy";
import { memo, useId, useMemo } from "react";
import { MdOutlineVideoCameraBack } from "react-icons/md";
import useChangeLocale from "src/hooks/useChangeLocale";
import VideoItem from "../shared/VideoItem";

type TVideosUploadProps = Omit<UploadProps, "onChange" | "fileList"> & {
  isError?: boolean;
  uploadedList?: string[];
  renderUploadedItem?: (item: string, index?: number) => React.ReactNode;
  value?: File[];
  onChange?: (files: File[]) => void;
};

const VideosUpload = ({
  uploadedList,
  renderUploadedItem,
  value = [] as File[],
  onChange,
  multiple = true,
  isError,
  ...props
}: TVideosUploadProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { status, errors } = Form.Item.useStatus();

  const uploadElement = useMemo(
    () => (
      <Upload
        type="drag"
        multiple={multiple}
        accept="video/*"
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
          <>+ {i18n["Chọn thêm video"]}</>
        ) : (
          <>
            <p className="ant-upload-drag-icon">
              <MdOutlineVideoCameraBack size={40} />
            </p>
            <p className="ant-upload-text">{i18n["Chọn hoặc kéo video vào khu vực này"]}</p>
          </>
        )}
      </Upload>
    ),
    [multiple, isError, status, props, uploadedList?.length, value, i18n, onChange],
  );

  return !!uploadedList?.length || value.length > 0 ? (
    <VideosUploadStyled className="image-list">
      {uploadedList?.map((item, index) => renderUploadedItem?.(item, index))}
      {value.map((item, index) => (
        <VideoItem
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
    </VideosUploadStyled>
  ) : (
    uploadElement
  );
};

const VideosUploadStyled = styled.div`
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

export default memo(VideosUpload);

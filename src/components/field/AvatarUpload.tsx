import { PlusOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Form, Upload, UploadProps } from "antd";
import uniqBy from "lodash/uniqBy";
import { memo, useId, useMemo } from "react";
import useChangeLocale from "src/hooks/useChangeLocale";

type TAvatarUploadProps = Omit<UploadProps, "onChange" | "fileList"> & {
  isError?: boolean;
  urlUpload?: string;
  renderUploadedItem?: (item: string) => React.ReactNode;
  value?: File[];
  onChange?: (files: File[]) => void;
};

const AvatarUpload = ({
  urlUpload,
  renderUploadedItem,
  value = [] as File[],
  onChange,
  isError,
  ...props
}: TAvatarUploadProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { status, errors } = Form.Item.useStatus();
  const uploadElement = useMemo(
    () => (
      <Upload
        type="drag"
        multiple={false}
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
        <button style={{ border: 0, background: "none" }} type="button">
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </button>
      </Upload>
    ),
    [isError, status, props, value, onChange],
  );
  console.log("urlUpload", urlUpload);
  console.log("value", value);
  return urlUpload || value.length > 0 ? (
    <AvatarUploadStyled className="image-list">
      {urlUpload && renderUploadedItem?.(urlUpload)}
    </AvatarUploadStyled>
  ) : (
    <div className="upload-square">{uploadElement}</div>
  );
};

const AvatarUploadStyled = styled.div`
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

export default memo(AvatarUpload);

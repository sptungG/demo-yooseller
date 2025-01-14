import { Upload, UploadProps } from "antd";

type TUploadFileProps = { value?: File; onChange?: (v?: File) => void } & UploadProps;

const UploadFile = ({ value, onChange, children, ...props }: TUploadFileProps) => {
  return (
    <Upload
      type="select"
      multiple={props.multiple || false}
      beforeUpload={(file, fileList) => {
        onChange?.(file);
        return false;
      }}
      fileList={[]}
      previewFile={(file) => Promise.resolve("")}
      {...props}
    >
      {children}
    </Upload>
  );
};

export default UploadFile;

import { Upload, UploadProps } from "antd";

type TUploadFileEcoFarmProps = { value?: File; onChange?: (v?: File) => void } & UploadProps;

const UploadFileEcoFarm = ({ value, onChange, children, ...props }: TUploadFileEcoFarmProps) => {
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

export default UploadFileEcoFarm;

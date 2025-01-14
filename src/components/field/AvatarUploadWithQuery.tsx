import styled from "@emotion/styled";
import { Form } from "antd";
import { useId } from "react";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useUploadListImageMutation } from "src/redux/query/image.query";
import ImageItem from "../shared/ImageItem";
import AvatarUpload from "./AvatarUpload";

type TAvatarUploadWithQueryProps = {
  value?: string;
  onChange?: (v?: string) => void;
};

const AvatarUploadWithQuery = ({ value, onChange }: TAvatarUploadWithQueryProps) => {
  const rUid = useId();
  const { i18n } = useChangeLocale();
  const { message, notification } = useApp();
  const form = Form.useFormInstance();
  const { status } = Form.Item.useStatus();
  const [uploadListImageMutate, { isLoading }] = useUploadListImageMutation();

  const handleRemoveImage = (item: string) => {
    onChange?.("");
    message.error(i18n["Xóa ảnh thành công"]);
  };

  const handleChange = (files: File[]) => {
    const fileList = form.getFieldValue("avatarFile");
    uploadListImageMutate({ files: fileList })
      .unwrap()
      .then(({ result }) => {
        const newImageUrlList = result?.data[0];
        onChange?.(newImageUrlList);
        form.resetFields(["avatarFile"]);
        message.success(i18n["Tải ảnh lên thành công"]);
      })
      .catch((err) => {
        message.error(i18n["Đã có lỗi xảy ra khi tải ảnh lên"]);
      });
  };

  return (
    <>
      <AvatarUploadWithQueryStyled>
        <Form.Item
          name="avatarFile"
          required
          rules={[{ type: "string" }]}
          help=""
          style={{ maxWidth: 150 }}
        >
          <AvatarUpload
            urlUpload={value || ""}
            onChange={handleChange}
            renderUploadedItem={(item) => (
              <ImageItem
                height={231}
                key={rUid + "uploaded:avatar"}
                src={item}
                onClickRemove={() => handleRemoveImage(item)}
              />
            )}
          />
        </Form.Item>
      </AvatarUploadWithQueryStyled>
    </>
  );
};
const AvatarUploadWithQueryStyled = styled.div`
  position: relative;
  z-index: 0;
  & > .imageUrl-btn {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    transform: translateY(calc(-100% - 8px));
  }
`;

export default AvatarUploadWithQuery;

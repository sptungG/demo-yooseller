import styled from "@emotion/styled";
import { Form } from "antd";
import union from "lodash/union";
import { useId } from "react";
import { MdUpload } from "react-icons/md";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useUploadListImageMutation } from "src/redux/query/image.query";
import Button from "../button/Button";
import ImageItem from "../shared/ImageItem";
import ImagesUpload from "./ImagesUpload";
import ImagesUrl from "./ImagesUrl";

type TImagesUploadWithQueryProps = {
  value?: string[];
  onChange?: (v?: string[]) => void;
};

const ImagesUploadWithQuery = ({ value, onChange }: TImagesUploadWithQueryProps) => {
  const rUid = useId();
  const { i18n } = useChangeLocale();
  const { message, notification } = useApp();
  const form = Form.useFormInstance();
  const { status } = Form.Item.useStatus();

  const imageFileListWatch = Form.useWatch("imageFileList", form);
  const [uploadListImageMutate, { isLoading }] = useUploadListImageMutation();

  const handleUploadImages = () => {
    const fileList = form.getFieldValue("imageFileList");
    uploadListImageMutate({ files: fileList })
      .unwrap()
      .then(({ result }) => {
        const newImageUrlList = [...(value || []), ...(result.data || [])];
        onChange?.(newImageUrlList);
        form.resetFields(["imageFileList"]);
        message.success(i18n["Tải ảnh lên thành công"]);
      })
      .catch((err) => {
        message.error(i18n["Đã có lỗi xảy ra khi tải ảnh lên"]);
      });
  };
  const handleAddImageUrls = (imageUrls: string[]) => {
    const newImageUrlList = union(value, imageUrls);
    onChange?.(newImageUrlList);
    message.success(i18n["Thêm ảnh thành công"]);
  };
  const handleRemoveImage = (item: string) => {
    const newImageUrlList = value?.filter((url) => url !== item);
    onChange?.(newImageUrlList);
    message.error(i18n["Xóa ảnh thành công"]);
  };

  return (
    <>
      <ImagesUploadWithQueryStyled>
        <ImagesUrl onOk={handleAddImageUrls} />
        <Form.Item name="imageFileList" required rules={[{ type: "array" }]} help="">
          <ImagesUpload
            uploadedList={value || []}
            renderUploadedItem={(item, index) => (
              <ImageItem
                height={231}
                key={rUid + "uploaded:" + index}
                src={item}
                isUploaded
                onClickRemove={() => handleRemoveImage(item)}
              />
            )}
          />
        </Form.Item>
      </ImagesUploadWithQueryStyled>
      <Button
        block
        className="btn-upload"
        icon={<MdUpload />}
        disabled={!(imageFileListWatch || []).length}
        loading={isLoading}
        danger={status === "error"}
        onClick={() => handleUploadImages()}
      >{`${i18n["Tải lên"]} ${(imageFileListWatch || []).length} ${i18n[
        "Ảnh"
      ].toLowerCase()}`}</Button>
    </>
  );
};
const ImagesUploadWithQueryStyled = styled.div`
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

export default ImagesUploadWithQuery;

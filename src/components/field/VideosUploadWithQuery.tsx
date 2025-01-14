import styled from "@emotion/styled";
import { Form } from "antd";
import union from "lodash/union";
import { useId } from "react";
import { MdUpload } from "react-icons/md";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useUploadListFileMutation } from "src/redux/query/file.query";
import Button from "../button/Button";
import VideoItem from "../shared/VideoItem";
import VideosUpload from "./VideosUpload";
import VideosUrl from "./VideosUrl";

type TVideosUploadWithQueryProps = {
  value?: string[];
  onChange?: (v?: string[]) => void;
};

const VideosUploadWithQuery = ({ value, onChange }: TVideosUploadWithQueryProps) => {
  const rUid = useId();
  const { i18n } = useChangeLocale();
  const { message, notification } = useApp();
  const form = Form.useFormInstance();
  const { status } = Form.Item.useStatus();

  const videoFileListWatch = Form.useWatch("videoFileList", form);
  const [uploadListFileMutate, { isLoading }] = useUploadListFileMutation();

  const handleUploadFiles = () => {
    const fileList = form.getFieldValue("videoFileList");
    uploadListFileMutate({ files: fileList })
      .unwrap()
      .then(({ result }) => {
        const newVideoUrlList = [...(value || []), ...(result.data || [])];
        onChange?.(newVideoUrlList);
        form.resetFields(["videoFileList"]);
        message.success(i18n["Tải video lên thành công"]);
      })
      .catch((err) => {
        message.error(i18n["Đã có lỗi xảy ra khi tải ảnh lên"]);
      });
  };
  const handleAddVideoUrls = (videoUrls: string[]) => {
    const newVideoUrlList = union(value, videoUrls);
    onChange?.(newVideoUrlList);
    message.success(i18n["Thêm video thành công"]);
  };
  const handleRemoveFiles = (item: string) => {
    const newVideoUrlList = value?.filter((url) => url !== item);
    onChange?.(newVideoUrlList);
    message.error(i18n["Xóa video thành công"]);
  };

  return (
    <>
      <VideosUploadWithQueryStyled>
        <VideosUrl onOk={handleAddVideoUrls} />
        <Form.Item name="videoFileList" required rules={[{ type: "array" }]} help="">
          <VideosUpload
            uploadedList={value || []}
            renderUploadedItem={(item, index) => (
              <VideoItem
                key={rUid + "uploaded:" + index}
                src={item}
                isUploaded
                onClickRemove={() => handleRemoveFiles(item)}
              />
            )}
          />
        </Form.Item>
      </VideosUploadWithQueryStyled>
      <Button
        block
        className="btn-upload"
        icon={<MdUpload />}
        disabled={!(videoFileListWatch || []).length}
        loading={isLoading}
        danger={status === "error"}
        onClick={() => handleUploadFiles()}
      >{`${i18n["Tải lên"]} ${(videoFileListWatch || []).length} ${i18n[
        "Video"
      ].toLowerCase()}`}</Button>
    </>
  );
};
const VideosUploadWithQueryStyled = styled.div`
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

export default VideosUploadWithQuery;

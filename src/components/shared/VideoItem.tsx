import styled from "@emotion/styled";
import { Modal } from "antd";
import { useId, useState } from "react";
import { BsCloudCheckFill } from "react-icons/bs";
import { MdDeleteOutline, MdOutlineVisibility } from "react-icons/md";
import useChangeLocale from "src/hooks/useChangeLocale";
import Button from "../button/Button";

type TVideoItemProps = {
  isLoading?: boolean;
  isUploaded?: boolean;
  src?: string;
  width?: string | number;
  height?: string | number;
  onClickRemove?: (src?: string) => void;
  editMode?: boolean;
};
const VideoItem = ({
  isUploaded,
  isLoading,
  src,
  width = "100%",
  height = "100%",
  onClickRemove,
  editMode = true,
}: TVideoItemProps) => {
  const { i18n } = useChangeLocale();
  const [open, setOpen] = useState(false);
  const uid = useId();
  return (
    <>
      <VideoItemStyled
        className="image-wrapper"
        title={isUploaded ? "Video đã được tải lên" : undefined}
        style={{ width, maxHeight: height, backgroundColor: "#80808029" }}
      >
        {isUploaded && (
          <div className="uploaded-badge">
            <BsCloudCheckFill size={16} />
          </div>
        )}
        <video
          controls
          style={{ width, height, position: "absolute", top: 0, left: 0, borderRadius: "8px" }}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {!isLoading && (
          <div className="actions-wrapper">
            <Button
              ghost
              type="dashed"
              size="large"
              shape="circle"
              icon={<MdOutlineVisibility size={18} />}
              onClick={() => setOpen(true)}
            ></Button>
            {editMode && (
              <Button
                ghost
                type="dashed"
                size="large"
                shape="circle"
                icon={<MdDeleteOutline size={18} />}
                onClick={() => onClickRemove?.(src)}
              ></Button>
            )}
          </div>
        )}
      </VideoItemStyled>
      <Modal
        title=""
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        footer={null}
        style={{
          width: 500,
          height: 400,
        }}
      >
        <video
          controls
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Modal>
    </>
  );
};

const VideoItemStyled = styled.div`
  position: relative;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02),
    0 2px 4px 0 rgba(0, 0, 0, 0.02);
  &::before {
    // for apsect ratio
    content: "";
    display: block;
    padding-bottom: 100%;
  }
  .ant-image {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    img {
      border-radius: 8px;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }
  }
  & > .actions-wrapper {
    display: none;
    border-radius: 8px;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 12px;
    background-color: rgba(0, 0, 0, 0.4);
    .ant-btn {
      backdrop-filter: blur(0.5px);
    }
  }
  &:hover {
    & > .actions-wrapper {
      display: flex;
    }
  }
  .uploaded-badge {
    border-radius: 8px 0 8px 0;
    padding: 4px 8px 0;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    color: ${({ theme }) => theme.generatedColors[0]};
    background-color: ${({ theme }) => theme.colorPrimary};
  }
`;

export default VideoItem;

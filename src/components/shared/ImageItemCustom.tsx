import styled from "@emotion/styled";
import { useId, useState } from "react";
import { BsCloudCheckFill } from "react-icons/bs";
import { MdOutlineVisibility } from "react-icons/md";
import Button from "../button/Button";
import Image from "../next/Image";

type TImageItemCustomProps = {
  isLoading?: boolean;
  isUploaded?: boolean;
  src?: string;
  width?: string | number;
  height?: string | number;
  onClickView: (data: string[]) => void;
  data: string[];
};
const ImageItemCustom = ({
  isUploaded,
  isLoading,
  src,
  width = "100%",
  height = "100%",
  data,
  onClickView,
}: TImageItemCustomProps) => {
  const [visiblePreview, setVisiblePreview] = useState(false);
  const uid = useId();
  return (
    <ImageItemCustomStyled
      className="image-wrapper"
      title={isUploaded ? "Ảnh đã được tải lên" : undefined}
      style={{ width, maxHeight: height }}
    >
      {isUploaded && (
        <div className="uploaded-badge">
          <BsCloudCheckFill size={16} />
        </div>
      )}
      <Image
        src={src}
        alt={uid}
        preview={{
          visible: isLoading ? false : visiblePreview,
          maskClassName: "hidden",
          mask: <></>,
          src: src,
          onVisibleChange: (value) => {
            setVisiblePreview(value);
          },
        }}
      />
      {!isLoading && (
        <div className="actions-wrapper">
          <Button
            ghost
            type="dashed"
            size="large"
            shape="circle"
            icon={<MdOutlineVisibility size={18} />}
            onClick={() => {
              setVisiblePreview(false);
              onClickView?.(data);
            }}
          ></Button>
        </div>
      )}
    </ImageItemCustomStyled>
  );
};

const ImageItemCustomStyled = styled.div`
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
    color: #fff;
    background-color: ${({ theme }) => theme.colorPrimary};
  }
`;

export default ImageItemCustom;

import { NOT_FOUND_IMG64 } from "@/configs/constant.config";
import styled from "@emotion/styled";
import { Image as AntdImage, ImageProps, Skeleton } from "antd";
import { default as NextjsImage, ImageProps as NextjsImageProps } from "next/image";

export type TImageProps = ImageProps;

export function NextImage(props: NextjsImageProps) {
  return <NextjsImage sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw" {...props} />;
}

const Image = ({ preview = false, src, ...props }: ImageProps) => {
  return (
    <AntdImage
      preview={preview}
      src={src}
      placeholder={
        <Skeleton.Image
          active
          style={{ width: props.width || "100%", height: props.height || "100%" }}
        />
      }
      fallback={NOT_FOUND_IMG64}
      {...props}
    />
  );
};
const ImageStyled = styled.picture`
  position: relative;
  display: inline-flex;
  justify-content: center;
  overflow: hidden;
  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export default Image;

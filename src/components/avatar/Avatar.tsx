import { NOT_FOUND_IMG64 } from "@/configs/constant.config";
import styled from "@emotion/styled";
import { useSafeState } from "ahooks";
import { Avatar as AntdAvatar, AvatarProps } from "antd";
import { useId } from "react";
type TAvatarProps = AvatarProps & {};

const Avatar = ({ children, src, ...props }: TAvatarProps) => {
  const uid = useId();
  const [internalSrc, setInternalSrc] = useSafeState(src);
  return (
    <AvatarStyled
      key={uid + String(src)}
      src={internalSrc}
      onError={() => {
        setInternalSrc(NOT_FOUND_IMG64);
        return false;
      }}
      style={{ backgroundColor: "#d9d9d9", ...props.style }}
      {...props}
    >
      {children}
    </AvatarStyled>
  );
};
const AvatarStyled = styled(AntdAvatar)``;

export const AvatarGroup = AntdAvatar.Group;

export default Avatar;

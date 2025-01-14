import styled from "@emotion/styled";
import { useId } from "react";
import Avatar, { AvatarGroup } from "./Avatar";

type TAvatarGroupItemProps = { items?: string[]; size?: number; className?: string };

const AvatarGroupItem = ({ items, size = 64, className }: TAvatarGroupItemProps) => {
  const uid = useId();
  return (
    <AvatarGroupItemStyled className={className} style={{ width: size, height: size }}>
      {!!items?.length ? (
        <AvatarGroup maxCount={1} maxPopoverPlacement="bottom">
          {items.map((url, index) => (
            <Avatar key={uid + "AvatarGroupItem" + index} size={size} shape="square" src={url} />
          ))}
        </AvatarGroup>
      ) : (
        <Avatar size={68} shape="square" src={"string"} />
      )}
    </AvatarGroupItemStyled>
  );
};
const AvatarGroupItemStyled = styled.div`
  position: relative;
  height: fit-content;
  width: fit-content;
  .ant-image,
  .detail-image {
    border-radius: 6px;
    width: 100%;
    height: 100%;
  }
  & .ant-avatar-group > span.ant-avatar.ant-avatar-circle {
    position: absolute;
    bottom: 4px;
    right: 4px;
  }
`;

export default AvatarGroupItem;

import styled from "@emotion/styled";
import { Tag as AntdTag, TagProps } from "antd";

type TTagProps = TagProps & {};

const Tag = ({ children, ...props }: TTagProps) => {
  return !!children ? <TagStyled {...props}>{children}</TagStyled> : <></>;
};
const TagStyled = styled(AntdTag)`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0;
`;

export const CheckableTag = AntdTag.CheckableTag;

export default Tag;

import styled from "@emotion/styled";
import { Card as AntdCard, CardProps, Skeleton } from "antd";

type TCardProps = CardProps & {};

const Card = ({ children, loading, title, ...props }: TCardProps) => {
  return (
    <CardStyled
      title={loading ? <Skeleton.Button active size="small" /> : title}
      loading={loading}
      {...props}
    >
      {children}
    </CardStyled>
  );
};

const CardStyled = styled(AntdCard)`
  height: inherit;
  display: flex;
  flex-direction: column;
  &.fit .ant-card-body {
    flex: 1 1 auto;
    min-height: 0px;
    display: flex;
    flex-direction: column;
    & > .list-empty {
      flex: 1 1 auto;
      min-height: 0px;
    }
  }
`;
export default Card;

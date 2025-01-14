import Card from "@/components/card/Card";
import styled from "@emotion/styled";
import { CardProps, Skeleton, SkeletonProps, Typography } from "antd";
import { useId } from "react";

type TMockCardProps = CardProps & {
  desc?: string;
  paragraph?: SkeletonProps["paragraph"];
};

const MockCard = ({ paragraph, desc, ...props }: TMockCardProps) => {
  const uid = useId();

  return (
    <StyledWrapper {...props}>
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        {desc}
      </Typography.Text>
      <Skeleton title={false} paragraph={paragraph}></Skeleton>
    </StyledWrapper>
  );
};

const StyledWrapper = styled(Card)``;

export default MockCard;

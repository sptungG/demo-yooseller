import styled from "@emotion/styled";
import { TagProps } from "antd";
import useStateConf from "src/hooks/useStateConf";
import { TStatusOrder } from "src/types/farm.types";
import Tag from "../tag/Tag";

type TOrderStateFarmProps = { state: TStatusOrder } & TagProps;

const OrderStateFarm = ({ state, ...props }: TOrderStateFarmProps) => {
  const { mappedOrderStateFarmConf } = useStateConf();
  const mappedState = mappedOrderStateFarmConf(state);
  return (
    <OrderStateFarmStyled
      color={mappedState?.color === "gray" ? "default" : mappedState?.color}
      bordered={false}
      {...props}
    >
      {mappedState?.label}
    </OrderStateFarmStyled>
  );
};
const OrderStateFarmStyled = styled(Tag)``;

export default OrderStateFarm;

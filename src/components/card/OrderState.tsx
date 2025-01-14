import styled from "@emotion/styled";
import { TagProps } from "antd";
import useStateConf from "src/hooks/useStateConf";
import { TStateOrder } from "src/types/order.types";
import Tag from "../tag/Tag";

type TOrderStateProps = { state: TStateOrder } & TagProps;

const OrderState = ({ state, bordered, ...props }: TOrderStateProps) => {
  const { mappedOrderStateConf } = useStateConf();
  const mappedState = mappedOrderStateConf(state);
  return (
    <OrderStateStyled
      color={mappedState?.color === "gray" ? "default" : mappedState?.color}
      bordered={bordered}
      {...props}
    >
      {mappedState?.label}
    </OrderStateStyled>
  );
};
const OrderStateStyled = styled(Tag)``;

export default OrderState;

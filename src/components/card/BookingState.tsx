import styled from "@emotion/styled";
import { TagProps } from "antd";
import useStateConf from "src/hooks/useStateConf";
import { TBState } from "src/types/booking.types";
import Tag from "../tag/Tag";

type TBookingStateProps = { state: TBState } & TagProps;

const BookingState = ({ state, ...props }: TBookingStateProps) => {
  const { mappedBookingStateConf } = useStateConf();
  const mappedState = mappedBookingStateConf(state);
  return (
    <BookingStateStyled
      color={mappedState?.color === "gray" ? "default" : mappedState?.color}
      bordered={false}
      {...props}
    >
      {mappedState?.label}
    </BookingStateStyled>
  );
};
const BookingStateStyled = styled(Tag)``;

export default BookingState;

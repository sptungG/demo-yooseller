import styled from "@emotion/styled";
import { TagProps } from "antd";
import Tag from "./Tag";

type TBookingStateTagProps = { bstate: number } & TagProps;

const BookingStateTag = ({}: TBookingStateTagProps) => {
  return <BookingStateTagStyled>BookingStateTag</BookingStateTagStyled>;
};
const BookingStateTagStyled = styled(Tag)``;

export default BookingStateTag;

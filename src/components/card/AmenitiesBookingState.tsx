import { TAmenitiesState } from "@/types/amenity.types";
import styled from "@emotion/styled";
import { TagProps } from "antd";
import useStateConf from "src/hooks/useStateConf";
import Tag from "../tag/Tag";

type TAmenitiesBookingStateProps = { state: TAmenitiesState } & TagProps;

const AmenitiesBookingState = ({ state, ...props }: TAmenitiesBookingStateProps) => {
  const { mappedAmenitiesBookingStateConf } = useStateConf();
  const mappedState = mappedAmenitiesBookingStateConf(state);
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

export default AmenitiesBookingState;

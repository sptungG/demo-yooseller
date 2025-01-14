import styled from "@emotion/styled";
import StyledTable from "./StyledTable";

const BookingTableStyled = styled(StyledTable)`
  .ant-table-thead > tr > th,
  .ant-table-thead > tr > td {
    border-radius: 0 !important;
  }
  .checkin-wrapper,
  .checkout-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const PopoverContentStyled = styled.div``;

export default BookingTableStyled;

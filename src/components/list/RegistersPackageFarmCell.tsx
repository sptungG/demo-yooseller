import { useGetListEcofarmRegisterByPartnerQuery } from "@/redux/query/farm.query";
import { TRegisterStatus } from "@/types/farm.types";
import { formatNumber } from "@/utils/utils";
import styled from "@emotion/styled";
import { Flex, Tooltip, Typography } from "antd";
import { useId } from "react";

type TRegistersPackageFarmCellProps = {
  ecofarmPackageId: number;
  providerId: number;
  onClick?: () => void;
};

const RegistersPackageFarmCell = ({
  ecofarmPackageId,
  providerId,
  onClick,
}: TRegistersPackageFarmCellProps) => {
  const uid = useId();
  const { data: getListEcofarmRegistersRes } = useGetListEcofarmRegisterByPartnerQuery({
    ecofarmPackageId,
    providerId,
    formId: 0,
    orderBy: 1,
    sortBy: 2,
    maxResultCount: 100,
  });
  const listPendingRegister =
    getListEcofarmRegistersRes?.data.filter(
      (item) => item.status === TRegisterStatus.PENDING_APPROVAL,
    ) || [];
  const listInvestingRegister =
    getListEcofarmRegistersRes?.data.filter((item) => item.status === TRegisterStatus.INVESTING) ||
    [];
  const listCompletedRegister =
    getListEcofarmRegistersRes?.data.filter((item) => item.status === TRegisterStatus.COMPLETED) ||
    [];
  const listCancelledRegister =
    getListEcofarmRegistersRes?.data.filter((item) => item.status === TRegisterStatus.CANCELLED) ||
    [];

  return (
    <Tooltip placement="topRight" arrow={false} title={"Xem chi tiết"}>
      <StyledWrapper vertical align="flex-end" onClick={onClick}>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {!!listPendingRegister?.length ? <b>{formatNumber(listPendingRegister.length)}</b> : "0"}{" "}
          đăng ký mới
        </Typography.Text>

        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {!!listInvestingRegister?.length ? (
            <b>{formatNumber(listInvestingRegister.length)}</b>
          ) : (
            "0"
          )}{" "}
          đang đầu tư
        </Typography.Text>

        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {!!listCompletedRegister?.length ? (
            <b>{formatNumber(listCompletedRegister.length)}</b>
          ) : (
            "0"
          )}{" "}
          đã hoàn thành
        </Typography.Text>

        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {!!listCancelledRegister?.length ? (
            <b>{formatNumber(listCancelledRegister.length)}</b>
          ) : (
            "0"
          )}{" "}
          đã hủy đăng ký
        </Typography.Text>
      </StyledWrapper>
    </Tooltip>
  );
};

const StyledWrapper = styled(Flex)`
  padding: 4px 8px 4px 8px;
  margin-right: -8px;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

export default RegistersPackageFarmCell;

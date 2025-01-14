import styled from "@emotion/styled";
import { Tag, Tooltip } from "antd";
import { memo } from "react";

type TProviderTypeProps = { groupType?: string; type?: string };

const ProviderType = ({ groupType = "", type = "" }: TProviderTypeProps) => {
  const isLong = groupType.split(" ").length > 2 && type.split(" ").length > 3;
  return (
    <ProviderTypeStyled bordered={false} style={{ fontSize: isLong ? 10 : 12 }}>
      {isLong ? (
        <Tooltip title={groupType} arrow={false} placement="topLeft">
          <span className="groupTypeTooltip" style={{ flexShrink: 0 }}>
            ...
          </span>
        </Tooltip>
      ) : (
        groupType
      )}
      {!!type ? " / " + type : ""}
    </ProviderTypeStyled>
  );
};
const ProviderTypeStyled = styled(Tag)`
  margin: 0;
  .groupTypeTooltip {
    color: ${({ theme }) => theme.colorPrimary};
    font-size: 16px;
  }
`;

export default memo(ProviderType);

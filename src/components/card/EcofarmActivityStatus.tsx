import styled from "@emotion/styled";
import { TagProps } from "antd";
import useStateConf from "src/hooks/useStateConf";
import { TEEcoFarmPackageActivityStatus } from "src/types/farm.types";
import Tag from "../tag/Tag";

type TEcofarmActivityStatusProps = { state: TEEcoFarmPackageActivityStatus } & TagProps;

// PENDING = 1,
// ACTIVATED = 2,
// DEBOOSTED = 31,
// BANNED = 32,
// DELETED_BY_ADMIN = 32,
// DELETED = 4,
// HIDDEN = 5,

const EcofarmActivityStatus = ({
  state,
  bordered = false,
  ...props
}: TEcofarmActivityStatusProps) => {
  const { mappedEcofarmActivityStatusConf } = useStateConf();

  const mappedState = mappedEcofarmActivityStatusConf(state);
  return (
    <EcofarmActivityStatusStyled
      color={mappedState?.color === "gray" ? "default" : mappedState?.color}
      bordered={bordered}
      {...props}
    >
      {mappedState?.label}
    </EcofarmActivityStatusStyled>
  );
};
const EcofarmActivityStatusStyled = styled(Tag)`
  font-weight: 500;
`;

export default EcofarmActivityStatus;

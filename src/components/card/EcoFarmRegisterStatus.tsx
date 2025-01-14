import styled from "@emotion/styled";
import { TagProps } from "antd";
import useStateConf from "src/hooks/useStateConf";
import { TRegisterStatus } from "src/types/farm.types";
import Tag from "../tag/Tag";

type TEcoFarmRegisterStatusProps = { state: TRegisterStatus } & TagProps;

const EcoFarmRegisterStatus = ({
  state,
  bordered = false,
  ...props
}: TEcoFarmRegisterStatusProps) => {
  const { mappedEcoFarmRegisterStatusConf } = useStateConf();

  const mappedState = mappedEcoFarmRegisterStatusConf(state);
  return (
    <EcoFarmRegisterStatusStyled
      color={mappedState?.color === "gray" ? "default" : mappedState?.color}
      bordered={bordered}
      {...props}
    >
      {mappedState?.label}
    </EcoFarmRegisterStatusStyled>
  );
};
const EcoFarmRegisterStatusStyled = styled(Tag)`
  font-weight: 500;
`;

export default EcoFarmRegisterStatus;

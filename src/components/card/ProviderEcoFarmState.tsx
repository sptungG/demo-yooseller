import styled from "@emotion/styled";
import { TagProps } from "antd";
import useChangeLocale from "src/hooks/useChangeLocale";
import useStateConf from "src/hooks/useStateConf";
import { TProviderEcoFarmState } from "src/types/farm.types";
import Tag from "../tag/Tag";

type TProviderEcoFarmStateProps = { state: TProviderEcoFarmState } & TagProps;

const ProviderEcoFarmState = ({
  state,
  bordered = false,
  ...props
}: TProviderEcoFarmStateProps) => {
  const { i18n } = useChangeLocale();
  const { mappedProviderEcoFarmStateConf } = useStateConf();
  const mappedState = mappedProviderEcoFarmStateConf(state);
  return (
    <ProviderEcoFarmStateStyled
      color={mappedState?.color === "gray" ? "default" : mappedState?.color}
      bordered={bordered}
      {...props}
    >
      {mappedState?.label}
    </ProviderEcoFarmStateStyled>
  );
};
const ProviderEcoFarmStateStyled = styled(Tag)`
  font-weight: 500;
`;

export default ProviderEcoFarmState;

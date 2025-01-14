import styled from "@emotion/styled";
import { TagProps } from "antd";
import useChangeLocale from "src/hooks/useChangeLocale";
import useStateConf from "src/hooks/useStateConf";
import { TProviderState } from "src/types/provider.types";
import Tag from "../tag/Tag";

type TProviderStateProps = { state: TProviderState } & TagProps;

const ProviderState = ({ state, bordered = false, ...props }: TProviderStateProps) => {
  const { i18n } = useChangeLocale();
  const { mappedProviderStateConf } = useStateConf();
  const mappedState = mappedProviderStateConf(state);
  return (
    <ProviderStateStyled
      color={mappedState?.color === "gray" ? "default" : mappedState?.color}
      bordered={bordered}
      {...props}
    >
      {mappedState?.label}
    </ProviderStateStyled>
  );
};
const ProviderStateStyled = styled(Tag)`
  font-weight: 500;
`;

export default ProviderState;

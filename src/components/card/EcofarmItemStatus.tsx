import styled from "@emotion/styled";
import { TagProps } from "antd";
import useStateConf from "src/hooks/useStateConf";
import { TItemStatus } from "src/types/farm.types";
import Tag from "../tag/Tag";

type TEcofarmItemStatusProps = { state: TItemStatus } & TagProps;

// PENDING = 1,
// ACTIVATED = 2,
// DEBOOSTED = 31,
// BANNED = 32,
// DELETED_BY_ADMIN = 32,
// DELETED = 4,
// HIDDEN = 5,

const EcofarmItemStatus = ({ state, bordered = false, ...props }: TEcofarmItemStatusProps) => {
  const { mappedEcofarmItemStatusConf } = useStateConf();

  const mappedState = mappedEcofarmItemStatusConf(state);
  return (
    <EcofarmItemStatusStyled
      color={mappedState?.color === "gray" ? "default" : mappedState?.color}
      bordered={bordered}
      {...props}
    >
      {mappedState?.label}
    </EcofarmItemStatusStyled>
  );
};
const EcofarmItemStatusStyled = styled(Tag)`
  font-weight: 500;
`;

export default EcofarmItemStatus;

import styled from "@emotion/styled";
import { TagProps } from "antd";
import useStateConf from "src/hooks/useStateConf";
import { TItemStatus } from "src/types/item.types";
import Tag from "../tag/Tag";

type TItemStateProps = { state: TItemStatus } & TagProps;

// PENDING = 1,
// ACTIVATED = 2,
// DEBOOSTED = 31,
// BANNED = 32,
// DELETED_BY_ADMIN = 32,
// DELETED = 4,
// HIDDEN = 5,

const ItemState = ({ state, bordered = false, ...props }: TItemStateProps) => {
  const { mappedItemStateConf } = useStateConf();

  const mappedState = mappedItemStateConf(state);
  return (
    <ItemStateStyled
      color={mappedState?.color === "gray" ? "default" : mappedState?.color}
      bordered={bordered}
      {...props}
    >
      {mappedState?.label}
    </ItemStateStyled>
  );
};

const ItemStateStyled = styled(Tag)`
  font-weight: 500;
`;

export default ItemState;

import { Dropdown, MenuProps } from "antd";
import { memo } from "react";

type TOrderStateSelectProps = {
  children: (selected?: any) => React.ReactNode;
  items?: MenuProps["items"];
  value?: string;
  onChange?: (v?: string) => void;
};

const OrderStateSelect = ({ children, items = [], value, onChange }: TOrderStateSelectProps) => {
  const foundedSelectedState = !!value ? items.find((item: any) => item?.key === value) : undefined;
  return (
    <Dropdown
      menu={{
        items,
        selectable: true,
        selectedKeys: !!value ? [value] : undefined,
        onSelect: ({ key }) => {
          onChange?.(key);
        },
      }}
      trigger={["click"]}
      mouseEnterDelay={0.001}
      mouseLeaveDelay={0.001}
    >
      {children(foundedSelectedState)}
    </Dropdown>
  );
};

export default memo(OrderStateSelect);

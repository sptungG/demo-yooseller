import styled from "@emotion/styled";
import { Select, SelectProps } from "antd";

type TDisplayChannelSelectProps = SelectProps & {};

const DisplayChannelSelect = (props: TDisplayChannelSelectProps) => {
  const OPTIONS = [
    { label: "Tất cả các màn", value: 1 },
    { label: "Màn trong shop", value: 2 },
    { label: "Màn đặt sản phẩm", value: 3 },
    { label: "Sự kiện", value: 4 },
    { label: "Live streaming", value: 5 },
  ];
  return (
    <Select
      mode="multiple"
      allowClear
      options={OPTIONS.map((item) => ({
        value: item.value,
        label: item.label,
      }))}
      {...props}
    />
  );
};
const DisplayChannelSelectStyled = styled(Select)``;

export default DisplayChannelSelect;

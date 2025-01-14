import styled from "@emotion/styled";
import { Select, SelectProps } from "antd";
import { vietnameseSlug } from "src/utils/utils";

type TAddressSelectProps = SelectProps & {};

const AddressSelect = (props: TAddressSelectProps) => {
  return (
    <Select
      allowClear
      showSearch
      optionFilterProp="children"
      filterOption={(input, option) =>
        vietnameseSlug(String(option?.label || ""), " ").indexOf(vietnameseSlug(input, " ")) >= 0
      }
      {...props}
    />
  );
};
const AddressSelectStyled = styled(Select)``;

export default AddressSelect;

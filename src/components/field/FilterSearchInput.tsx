import styled from "@emotion/styled";
import { Input, InputProps, theme, Typography } from "antd";
import { BsSearch } from "react-icons/bs";

type TFilterSearchInputProps = {} & InputProps;

const FilterSearchInput = ({ value, ...props }: TFilterSearchInputProps) => {
  const {
    token: { colorTextPlaceholder, colorTextSecondary },
  } = theme.useToken();
  return (
    <FilterSearchInputStyled
      className="input-search"
      allowClear
      placeholder={"..."}
      prefix={<BsSearch size={16} color={colorTextPlaceholder} />}
      suffix={
        !!value ? (
          <button type="submit" className="btn-submit" style={{ color: colorTextSecondary }}>
            <Typography.Text code style={{ margin: "0" }}>
              Enter
            </Typography.Text>
          </button>
        ) : (
          <></>
        )
      }
      value={value}
      {...props}
    />
  );
};
const FilterSearchInputStyled = styled(Input)`
  .btn-submit {
    margin: -2.2px -6px 0 0;
    padding: 0;
    background-color: transparent;
    outline: none;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export default FilterSearchInput;

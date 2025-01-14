import { Input, InputProps } from "antd";

type TInputAutoSizeProps = InputProps & {};

const InputAutoSize = ({ value, onChange, placeholder, ...props }: TInputAutoSizeProps) => {
  const valueLength = value?.toString().length || 0;
  const placeholderLength = placeholder?.length || 0;
  return (
    <Input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: `calc(${Math.max(valueLength, placeholderLength)}ch + 20px)`,
      }}
      {...props}
    />
  );
};

export default InputAutoSize;

import { DatePicker as AntdDatePicker, DatePickerProps } from "antd";

type TDatePickerProps = DatePickerProps & { showToday?: boolean };

const DatePicker = ({ value, onChange, defaultValue, ...props }: TDatePickerProps) => {
  return (
    <AntdDatePicker
      inputReadOnly
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};

export default DatePicker;

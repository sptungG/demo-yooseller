import { dateFormat } from "@/utils/utils-date";
import { TimePicker as AntdTimePicker, TimePickerProps } from "antd";

type TTimePickerProps = TimePickerProps & {};

const TimePicker = ({ value, onChange, defaultValue, ...props }: TTimePickerProps) => {
  return (
    <AntdTimePicker
      inputReadOnly
      format={dateFormat}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};

export default TimePicker;

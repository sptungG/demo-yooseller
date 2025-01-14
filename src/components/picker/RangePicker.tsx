import { DatePicker } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";

type TRangePickerProps = RangePickerProps & {};

const RangePicker = ({ value, onChange, defaultValue, ...props }: TRangePickerProps) => {
  return (
    <DatePicker.RangePicker
      inputReadOnly
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};

export default RangePicker;

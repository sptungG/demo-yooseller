import { TimePicker, TimeRangePickerProps } from "antd";
import { timeFormat } from "src/utils/utils-date";

type TRangeTimeProps = TimeRangePickerProps & {};

const RangeTimePicker = ({ value, onChange, defaultValue, ...props }: TRangeTimeProps) => {
  return (
    <TimePicker.RangePicker
      inputReadOnly
      format={timeFormat}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};

export default RangeTimePicker;

import useChangeLocale from "@/hooks/useChangeLocale";
import { TAntdVariant } from "@/types/global.types";
import { dayjs } from "@/utils/utils-date";
import { useMemoizedFn } from "ahooks";
import { DatePickerProps, Form, FormProps, Input, Tabs, Typography } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import { DatePickerStyled } from "../shared/ItemStyled";
import DatePicker from "./DatePicker";
import RangePicker from "./RangePicker";

type TVariantDatePickerFormProps = FormProps & {
  onChangeYear?: (date: any) => void;
  onChangeMonth?: (date: any) => void;
  onChangeRangeDate?: (dateRange: [any, any]) => void;
  onChangeDate?: (date: any) => void;
  bordered?: boolean;
  stylePicker?: React.CSSProperties;
  pickerProps?: DatePickerProps;
  rangeProps?: RangePickerProps;
  variant?: TAntdVariant;
};

const VariantDatePickerForm = ({
  onChangeYear,
  onChangeMonth,
  onChangeRangeDate,
  onChangeDate,
  bordered,
  stylePicker,
  pickerProps,
  rangeProps,
  variant,
  ...props
}: TVariantDatePickerFormProps) => {
  const { i18n } = useChangeLocale();
  const [form] = Form.useForm();
  const typeWatch = Form.useWatch("type", form);

  const handleChangeYear = (year: any) => {
    onChangeYear?.(year);
    // setFilterStatisticOrdersData({ formId: 2, type: 1, year: year.get("year") });
  };
  const handleChangeMonth = (month: any) => {
    onChangeMonth?.(month);
    // setFilterStatisticOrdersData({
    //   formId: 2,
    //   type: 3,
    //   month: month.get("month") + 1,
    //   year: month.get("year"),
    // });
  };
  const handleChangeRangeDate = (dateRange: [any, any]) => {
    onChangeRangeDate?.(dateRange);
    // const [dateForm, dateTo] = dateRange;
    // setFilterStatisticOrdersData({
    //   formId: 2,
    //   type: 4,
    //   dateFrom: dateForm.startOf("day").format("MM/DD/YYYY"),
    //   dateTo: dateTo.startOf("day").format("MM/DD/YYYY"),
    // });
  };
  const handleChangeDate = (date: any) => {
    onChangeDate?.(date);
    // setFilterStatisticOrdersData({
    //   formId: 2,
    //   type: 5,
    //   day: date.get("date"),
    //   month: date.get("month") + 1,
    //   year: date.get("year"),
    // });
  };
  const panelRender = useMemoizedFn((panelNode: React.ReactNode) => (
    <DatePickerStyled>
      <div className="title-wrapper">
        <Typography.Paragraph strong type="secondary" style={{ margin: 0 }}>
          {i18n["Chọn khoảng thời gian thống kê"]}:
        </Typography.Paragraph>
      </div>
      <div className="wrapper">
        <div className="left-wrapper">
          <Tabs
            tabPosition="right"
            style={{ width: 112, height: "100%" }}
            activeKey={String(typeWatch)}
            onChange={(activeKey) => {
              form.setFieldValue("type", +activeKey);
              if (activeKey === "1") {
                form.setFieldValue("year", dayjs());
                handleChangeYear(dayjs());
              } else {
                form.resetFields(["month", "dateRange", "date"]);
              }
            }}
            items={[
              {
                key: "1",
                label: i18n["Năm"],
              },
              {
                key: "3",
                label: i18n["Tháng"],
              },
              {
                key: "4",
                label: i18n["Khoảng ngày"],
              },
              {
                key: "5",
                label: i18n["Trong ngày"],
              },
            ]}
          />
        </div>
        <div className="right-wrapper">{panelNode}</div>
      </div>
    </DatePickerStyled>
  ));

  return (
    <Form
      form={form}
      size="large"
      preserve={false}
      initialValues={{ type: 1, year: dayjs() }}
      onFinish={(formData) => {}}
      onValuesChange={(changedValues, values) => {
        const { dateRange } = changedValues as any;
        if (!!dateRange?.length) {
          handleChangeRangeDate(dateRange);
        }
      }}
      {...props}
    >
      <Form.Item name="type" noStyle hidden>
        <Input />
      </Form.Item>
      <Form.Item name="year" noStyle hidden={typeWatch !== 1}>
        <DatePicker
          format={"YYYY"}
          variant={variant}
          style={stylePicker}
          picker="year"
          disabledDate={(current) => current > dayjs()}
          onChange={(value) => handleChangeYear(value)}
          panelRender={panelRender}
          allowClear={false}
          {...pickerProps}
        />
      </Form.Item>
      <Form.Item name="month" noStyle hidden={typeWatch !== 3}>
        <DatePicker
          variant={variant}
          style={stylePicker}
          defaultOpen={typeWatch === 3}
          picker="month"
          format={"MM-YYYY"}
          disabledDate={(current) => current > dayjs()}
          onChange={(month) => handleChangeMonth(month)}
          panelRender={panelRender}
          allowClear={false}
          {...pickerProps}
        />
      </Form.Item>
      <Form.Item name="dateRange" noStyle hidden={typeWatch !== 4}>
        <RangePicker
          variant={variant}
          style={stylePicker}
          defaultOpen={typeWatch === 4}
          format={"DD-MM-YYYY"}
          disabledDate={(current) => current > dayjs()}
          panelRender={panelRender}
          allowClear={false}
          presets={[
            {
              label: [i18n["Tuần trước"]],
              value: [
                dayjs().subtract(1, "week").startOf("week"),
                dayjs().subtract(1, "week").endOf("week"),
              ],
            },
            {
              label: [i18n["Tháng trước"]],
              value: [
                dayjs().subtract(1, "month").startOf("month"),
                dayjs().subtract(1, "month").endOf("month"),
              ],
            },
            {
              label: [i18n["Tuần này"]],
              value: [dayjs().startOf("week"), dayjs()],
            },
            {
              label: [i18n["Tháng này"]],
              value: [dayjs().startOf("month"), dayjs()],
            },
          ]}
          {...rangeProps}
        />
      </Form.Item>
      <Form.Item name="date" noStyle hidden={typeWatch !== 5}>
        <DatePicker
          variant={variant}
          style={stylePicker}
          defaultOpen={typeWatch === 5}
          format={"DD-MM-YYYY"}
          disabledDate={(current) => current > dayjs().endOf("day")}
          onChange={(date) => handleChangeDate(date)}
          panelRender={panelRender}
          showToday={false}
          allowClear={false}
          {...pickerProps}
        />
      </Form.Item>
    </Form>
  );
};

export default VariantDatePickerForm;

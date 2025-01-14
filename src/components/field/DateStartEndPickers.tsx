import useChangeLocale from "@/hooks/useChangeLocale";
import { dateFormatVoucher, dayjs } from "@/utils/utils-date";
import { Form } from "antd";
import DatePicker from "../picker/DatePicker";

type TDateStartEndPickersProps = { mode?: string };

const DateStartEndPickers = ({ mode = "CREATE" }: TDateStartEndPickersProps) => {
  const form = Form.useFormInstance();
  const { i18n } = useChangeLocale();
  const formDateStart = Form.useWatch("dateStart", form);
  const formDateEnd = Form.useWatch("dateEnd", form);

  return (
    <>
      <Form.Item
        label={i18n["Thời gian bắt đầu"]}
        name="dateStart"
        rules={[
          {
            required: true,
            type: "date",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (mode === "UPDATE") return Promise.resolve();

              if (dayjs().isSameOrBefore(value, "hour")) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("Vui lòng nhập thời gian bắt đầu muộn hơn thời gian hiện tại."),
              );
            },
          }),
        ]}
        validateFirst
      >
        <DatePicker
          bordered={true}
          picker="date"
          allowClear={false}
          format="DD-MM-YYYY HH:mm"
          disabledDate={(current) => current < dayjs().startOf("day")}
          showTime={{ format: "HH:mm" }}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        label={i18n["Thời gian kết thúc"]}
        name="dateEnd"
        dependencies={["dateStart"]}
        rules={[
          {
            required: true,
            type: "date",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (value.isSameOrAfter(getFieldValue("dateStart").add(1, "hour"), "minute")) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("Chương trình phải kéo dài ít nhất là 1h kể từ khi bắt đầu"),
              );
            },
          }),
        ]}
        validateFirst
      >
        <DatePicker
          bordered={true}
          picker="date"
          allowClear={false}
          format="DD-MM-YYYY HH:mm"
          disabledDate={(current) => current < formDateStart}
          showTime={{ format: "HH:mm" }}
          style={{ width: "100%" }}
          showNow={false}
        />
      </Form.Item>
    </>
  );
};

export const DateStartEndPickersPackage = ({ mode = "CREATE" }: TDateStartEndPickersProps) => {
  const form = Form.useFormInstance();
  const { i18n } = useChangeLocale();
  const formDateStart = Form.useWatch("startDate", form);
  const formDateEnd = Form.useWatch("expectedEndDate", form);

  const totalInvestmentTerm = formDateEnd?.diff(formDateStart, "month") || 0;

  return (
    <Form.Item
      label={
        <>
          Khoảng thời gian dự kiến thu hoạch:{" "}
          <b style={{ margin: "0 2px 0 4px" }}>{totalInvestmentTerm}</b> tháng
        </>
      }
    >
      <div className="row5050">
        <Form.Item
          label={i18n["Thời gian bắt đầu"]}
          name="startDate"
          rules={[
            {
              required: true,
              type: "date",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (mode === "UPDATE") return Promise.resolve();

                if (dayjs().isSameOrBefore(value, "day")) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Vui lòng nhập thời gian bắt đầu muộn hơn thời gian hiện tại."),
                );
              },
            }),
          ]}
          validateFirst
        >
          <DatePicker
            bordered={true}
            picker="date"
            allowClear={false}
            //format="DD-MM-YYYY HH:mm"
            disabledDate={(current) => current < dayjs().startOf("day")}
            //showTime={false}
            style={{ width: "100%" }}
            showTime={{ format: dateFormatVoucher }} // Hiển thị chỉ giờ và phút
            format={dateFormatVoucher}
          />
        </Form.Item>

        <Form.Item
          label={i18n["Ngày thu hoạch dự kiến"]}
          name="expectedEndDate"
          dependencies={["startDate"]}
          rules={[
            {
              required: true,
              type: "date",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (value.isAfter(getFieldValue("startDate").add(1, "hour"), "minute")) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Chương trình phải kéo dài ít nhất là 1h kể từ khi bắt đầu"),
                );
              },
            }),
          ]}
          validateFirst
        >
          <DatePicker
            bordered={true}
            picker="date"
            allowClear={false}
            //format="DD-MM-YYYY HH:mm"
            disabledDate={(current) => current < formDateStart}
            //showTime={false}
            style={{ width: "100%" }}
            showNow={false}
            showTime={{ format: dateFormatVoucher }} // Hiển thị chỉ giờ và phút
            format={dateFormatVoucher}
          />
        </Form.Item>
      </div>
    </Form.Item>
  );
};

export default DateStartEndPickers;

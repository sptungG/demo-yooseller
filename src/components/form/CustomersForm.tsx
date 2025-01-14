import { regexVNPhoneAll } from "@/utils/utils";
import { dateFormat, dayjs } from "@/utils/utils-date";
import { css } from "@emotion/react";
import { useUpdateEffect } from "ahooks";
import {
  Affix,
  Card,
  Flex,
  Form,
  FormProps,
  Input,
  InputNumber,
  Select,
  Typography,
  theme,
} from "antd";
import { MdPhoneEnabled } from "react-icons/md";
import { SiMaildotru } from "react-icons/si";
import { cssAddItemModel } from "src/components/shared/ItemStyled";
import useChangeLocale from "src/hooks/useChangeLocale";
import StepAnchor from "../list/StepAnchor";
import DatePicker from "../picker/DatePicker";

type TCustomersFormProps = Pick<FormProps, "initialValues" | "onFinish" | "id"> & {
  extraRight?: React.ReactNode;
};

const CustomersForm = ({}: TCustomersFormProps) => {
  const { i18n } = useChangeLocale();
  const {
    token: { colorTextPlaceholder },
  } = theme.useToken();
  const form = Form.useFormInstance();
  const formUsedPoints = Form.useWatch("usedPoints", form);
  const formUnusedPoints = Form.useWatch("unusedPoints", form);
  const totalPoint = (formUsedPoints || 0) + (formUnusedPoints || 0) || 0;
  useUpdateEffect(() => {
    form.setFieldValue("totalPoints", totalPoint);
  }, [totalPoint]);
  return (
    <>
      <Affix offsetTop={76}>
        <div className="right-wrapper-Affix" style={{ width: 204 }}>
          <Card size="small" bodyStyle={{ padding: "6px 6px 0 6px" }}>
            <StepAnchor
              items={[
                {
                  title: i18n["Thông tin cơ bản"],
                  formFields: [["fullName"], ["phoneNumber"], ["dateOfBirth"], ["gender"]],
                },
                {
                  title: i18n["Thông tin khác"],
                  formFields: [
                    ["homeAddress"],
                    ["emailAddress"],
                    ["totalPoints"],
                    ["usedPoints"],
                    ["unusedPoints"],
                  ],
                },
              ]}
              anchorProps={{ targetOffset: 12, bounds: 400 }}
            />
          </Card>
        </div>
      </Affix>
      <div className="left-wrapper">
        <Card id="thong-tin-co-ban">
          <Typography.Title
            level={4}
            type="secondary"
            style={{ lineHeight: 1, margin: "0 0 12px" }}
          >
            {i18n["Thông tin cơ bản"]}
          </Typography.Title>
          <div className="row5050">
            <Form.Item
              name="fullName"
              label={i18n["Họ & tên"]}
              rules={[{ required: true }, { type: "string" }]}
            >
              <Input placeholder={i18n["Nhập họ và tên"]} />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label={i18n["Số điện thoại"]}
              rules={[
                { required: true },
                {
                  pattern: regexVNPhoneAll,
                  message: i18n["Số điện thoại chưa đúng định dạng"],
                },
              ]}
            >
              <Input
                type="tel"
                placeholder={i18n["Nhập số điện thoại"]}
                suffix={<MdPhoneEnabled size={16} color={colorTextPlaceholder} />}
              />
            </Form.Item>
            <Form.Item
              name="dateOfBirth"
              label={i18n["Ngày sinh"]}
              rules={[{ required: false }, { type: "date" }]}
            >
              <DatePicker
                allowClear={true}
                disabledDate={(current) => current > dayjs().startOf("day")}
                style={{ width: "100%" }}
                showTime={{ format: dateFormat }} // Hiển thị chỉ giờ và phút
                format={dateFormat}
              />
            </Form.Item>
            <Form.Item
              name="gender"
              label={i18n["Giới tính"]}
              rules={[{ required: false }, { type: "string" }]}
            >
              <Select
                allowClear
                placement="bottomRight"
                placeholder={i18n["Chọn"]}
                showSearch={true}
                options={[
                  { value: "Nam", label: "Nam" },
                  { value: "Nữ", label: "Nữ" },
                  { value: "Khác", label: "Khác" },
                ]}
              />
            </Form.Item>
          </div>
        </Card>

        <Card id="thong-tin-khac">
          <Typography.Title
            level={4}
            type="secondary"
            style={{ lineHeight: 1, margin: "0 0 12px" }}
          >
            {i18n["Thông tin khác"]}
          </Typography.Title>
          <Form.Item
            name="homeAddress"
            label={i18n["Địa chỉ"]}
            rules={[{ required: false, type: "string" }]}
          >
            <Input.TextArea
              placeholder={i18n["Nhập vào"]}
              autoSize={{ minRows: 2, maxRows: 2 }}
              showCount
              maxLength={1000}
            />
          </Form.Item>
          <Form.Item
            name="emailAddress"
            label={i18n["Địa chỉ Email"]}
            rules={[{ required: false, type: "email" }]}
          >
            <Input
              type="email"
              placeholder={i18n["Nhập Địa chỉ Email"]}
              suffix={<SiMaildotru size={16} color={colorTextPlaceholder} />}
            />
          </Form.Item>
          <Typography.Title
            level={4}
            type="secondary"
            style={{ lineHeight: 1, margin: "0 0 12px" }}
          >
            {i18n["Điểm tích lũy"]}
          </Typography.Title>
          <Flex justify="space-between" align="flex-start">
            <Form.Item
              name="usedPoints"
              label={i18n["Đã sử dụng"]}
              rules={[{ required: true }, { type: "number", min: 0 }]}
            >
              <InputNumber<number>
                suffix={"điểm"}
                step={1}
                min={0}
                placeholder={i18n["Nhập vào"]}
                style={{ width: "100%" }}
                formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => +value!.replace(/[^0-9]/g, "")}
                onChange={(e) => {}}
              />
            </Form.Item>
            <Form.Item
              name="unusedPoints"
              label={i18n["Chưa sử dụng"]}
              rules={[{ required: true }, { type: "number", min: 0 }]}
            >
              <InputNumber<number>
                suffix={"điểm"}
                step={1}
                min={0}
                placeholder={i18n["Nhập vào"]}
                style={{ width: "100%" }}
                formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => +value!.replace(/[^0-9]/g, "")}
              />
            </Form.Item>
            <Form.Item
              name="totalPoints"
              label={i18n["Tổng điểm"]}
              rules={[{ type: "number", min: 0 }]}
            >
              <InputNumber<number>
                suffix={"điểm"}
                step={1}
                min={0}
                placeholder={i18n["Nhập vào"]}
                style={{ width: "100%" }}
                formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => +value!.replace(/[^0-9]/g, "")}
                disabled={true}
              />
            </Form.Item>
          </Flex>
        </Card>
      </div>
    </>
  );
};

export const cssItemForm = css`
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
  gap: 12px;
  position: relative;
  & > .left-wrapper {
    flex: 1 1 auto;
    min-width: 0px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  & .right-wrapper-Affix {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    transform: translateX(-100%);
    @media screen and (max-width: 1200px) {
      display: none;
    }
  }
  .ant-form-item-control-input-content .quill {
    .ql-toolbar {
      border-radius: 8px 8px 0 0;
    }
    .ql-container {
      border-radius: 0 0 8px 8px;
    }
  }
  .ant-form-item-label .ant-typography-secondary {
    margin-left: 8px;
  }
  .add-itemmodel-wrapper {
    margin-bottom: 24px;
    .container {
      ${cssAddItemModel}
    }
  }
`;

export default CustomersForm;

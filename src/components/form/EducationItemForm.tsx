import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Card, Checkbox, Divider, Form, Input, InputNumber, Typography } from "antd";
import CertificateFormList from "src/components/field/CertificateFormList";
import Editor from "src/components/field/Editor";
import EducationFormList from "src/components/field/EducationFormList";
import ExperienceFormList from "src/components/field/ExperienceFormList";
import FormAddressNameSelects from "src/components/field/FormAddressNameSelects";
import ImageUploadWithQuery from "src/components/field/ImageUploadWithQuery";
import SkillsFormList from "src/components/field/SkillsFormList";
import ImageItem from "src/components/shared/ImageItem";
import { DaysWeek } from "src/configs/constant.config";
import useChangeLocale from "src/hooks/useChangeLocale";
import { dateFormat, dayjs } from "src/utils/utils-date";
import DatePicker from "../picker/DatePicker";
import RangeTimePicker from "../picker/RangeTimePicker";

type TEducationItemFormProps = { id?: string };

const EducationItemForm = ({ id }: TEducationItemFormProps) => {
  const { i18n } = useChangeLocale();
  const form = Form.useFormInstance();
  return (
    <>
      <div className="basic-wrapper">
        <div className="banner-wrapper">
          <Form.Item name={["imageUrlList", 1]} noStyle>
            <ImageUploadWithQuery
              renderUploadedItem={(item) => (
                <ImageItem
                  src={item}
                  isUploaded
                  onClickRemove={() => form.setFieldValue(["imageUrlList", 1], undefined)}
                />
              )}
              buttonUploadProps={{ block: false, size: "middle" }}
            />
          </Form.Item>
        </div>
        <div className="avatar-wrapper">
          <Form.Item name={["imageUrlList", 0]} noStyle>
            <ImageUploadWithQuery
              renderUploadedItem={(item) => (
                <ImageItem
                  src={item}
                  isUploaded
                  onClickRemove={() => form.setFieldValue(["imageUrlList", 0], undefined)}
                />
              )}
              buttonUploadProps={{ block: false, size: "middle", shape: "round" }}
            />
          </Form.Item>
        </div>
      </div>
      <div className="layout-wrapper">
        <div className="left-wrapper">
          <Card>
            <Form.Item
              name={"name"}
              label={i18n["Tên gia sư"]}
              rules={[{ required: true }, { type: "string" }]}
            >
              <Input placeholder={i18n["Nhập tên gia sư"]} />
            </Form.Item>
            <Form.Item
              name={"description"}
              label={i18n["Mô tả"]}
              rules={[{ required: true }, { type: "string" }]}
            >
              <Editor placeholder={i18n["Giới thiệu bản thân"]} />
            </Form.Item>
            <Divider />
            <Form.Item
              name={["itemModel", "originalPrice"]}
              label={i18n["Giá"]}
              rules={[{ required: true }]}
            >
              <InputNumber<number>
                style={{ width: "100%" }}
                placeholder={i18n["Giá theo thời gian"]}
                step={1000}
                min={0}
                prefix="₫"
                formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
                addonAfter={`/ ${i18n["giờ"]}`}
              />
            </Form.Item>
            <Form.Item
              name="availabilityDay"
              label={i18n["Ngày có thể dạy"]}
              rules={[{ required: true }]}
            >
              <Checkbox.Group style={{ gap: 8 }}>
                {DaysWeek.map((d, index) => (
                  <CheckboxStyled key={"availabilityDay" + index} value={d}>
                    {i18n[d]}
                  </CheckboxStyled>
                ))}
              </Checkbox.Group>
            </Form.Item>
            <Form.Item
              name="availabilityTime"
              label={i18n["Thời gian dạy"]}
              rules={[{ required: true }]}
            >
              <RangeTimePicker format={"HH:mm"} />
            </Form.Item>
          </Card>

          <Card>
            <Typography.Title level={4} type="secondary">
              {i18n["Học vấn"]}:
            </Typography.Title>
            <EducationFormList />
          </Card>

          <Card>
            <Typography.Title level={4} type="secondary">
              {i18n["Kĩ năng"]}:
            </Typography.Title>
            <SkillsFormList />
            <Divider />
            <Typography.Title level={4} type="secondary">
              {i18n["Kinh nghiệm làm việc"]}:
            </Typography.Title>
            <ExperienceFormList />
          </Card>

          <Card>
            <Typography.Title level={4} type="secondary">
              {i18n["Chứng chỉ"]}:
            </Typography.Title>
            <CertificateFormList />
          </Card>
        </div>
        <div className="right-wrapper">
          <Card>
            <Form.Item
              name={["properties", "personalInfo", "dateOfBirth"]}
              label={i18n["Ngày sinh"]}
              rules={[{ required: true }, { type: "date" }]}
            >
              <DatePicker
                format={dateFormat}
                placeholder={"DD-MM-YYYY"}
                style={{ width: "100%" }}
                disabledDate={(current) => current > dayjs()}
                showToday={false}
              />
            </Form.Item>
            <Divider />
            <Form.Item
              name={["properties", "personalInfo", "phoneNumber"]}
              label={i18n["Số điện thoại"]}
              rules={[{ required: true }, { type: "string" }]}
            >
              <Input placeholder={i18n["Nhập số điện thoại"]} />
            </Form.Item>
            <Form.Item
              name={["properties", "personalInfo", "email"]}
              label={i18n["Email"]}
              rules={[{ required: true }, { type: "email" }]}
            >
              <Input placeholder={i18n["Nhập địa chỉ Email"]} />
            </Form.Item>
            <Divider />
            <Form.Item
              label={
                <>
                  {i18n["Điạ chỉ"]}{" "}
                  <Typography.Text type="secondary">{`(${i18n["Tỉnh thành | Quận huyện | Phường xã"]})`}</Typography.Text>
                </>
              }
              required
              help=""
            >
              <FormAddressNameSelects
                provinceFormProps={{ name: ["properties", "location", "province"] }}
                districtFormProps={{ name: ["properties", "location", "district"] }}
                wardFormProps={{ name: ["properties", "location", "ward"] }}
              />
            </Form.Item>
            <Form.Item
              name={["properties", "location", "address"]}
              label={i18n["Địa chỉ chi tiết"]}
              required
              help=""
            >
              <Input.TextArea
                placeholder={i18n["Nhập địa chỉ chi tiết"]}
                autoSize={{ minRows: 2, maxRows: 2 }}
                showCount
                maxLength={255}
              />
            </Form.Item>
          </Card>
        </div>
      </div>
    </>
  );
};
const CheckboxStyled = styled(Checkbox)`
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  &.ant-checkbox-wrapper-checked {
    border-color: ${({ theme }) => theme.colorPrimary};
  }
`;
export const cssItemForm = css`
  .layout-wrapper {
    display: flex;
    align-items: flex-start;
    flex-wrap: nowrap;
    gap: 12px;
    & > .left-wrapper {
      flex: 1 1 auto;
      min-width: 0px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    & > .right-wrapper {
      flex: 0 0 360px;
      display: flex;
      flex-direction: column;
      gap: 12px;
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
  }
  .w-full {
    .ant-steps-item-title {
      width: 100%;
    }
  }
  .basic-wrapper {
    position: relative;
    height: 188px;
    margin-bottom: 24px;
    .banner-wrapper {
      .image-upload-wrapper {
        position: relative;
        height: 188px;
        .image-wrapper,
        .ant-upload,
        .ant-image img {
          height: 188px;
        }
        .ant-upload-drag-container {
          opacity: 0.5;
          .ant-upload-drag-icon {
            margin-bottom: 0px;
          }
        }
        .btn-upload {
          position: absolute;
          bottom: 8px;
          right: 8px;
        }
      }
    }
    .avatar-wrapper {
      position: absolute;
      top: 108px;
      left: 0;
      width: 160px;
      height: 160px;
      border-radius: 50%;
      background-color: #fff;
      box-shadow: 0 0 0 4px #fff, 0 1px 6px -1px rgba(0, 0, 0, 0.02),
        0 2px 4px 0 rgba(0, 0, 0, 0.02);
      transform: translate(24px, -50%);
      .image-upload-wrapper {
        position: relative;
        .image-wrapper,
        .ant-upload,
        .ant-image img {
          border-radius: 50%;
          width: 160px;
          height: 160px;
        }
        .image-wrapper .uploaded-badge {
          position: absolute;
          top: auto;
          left: auto;
          bottom: 22px;
          right: 0;
          border-radius: 50%;
          padding: 6px 6px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .actions-wrapper {
          border-radius: 50%;
        }
        .ant-upload-drag-container .ant-upload-drag-icon {
          margin-bottom: 0px;
        }
        .btn-upload {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 50%);
          background-color: auto !important;
        }
      }
    }
    .detail-wrapper {
      position: absolute;
      top: 160px;
      left: 160px;
      transform: translate(32px, 2px);
      .name {
        margin-bottom: 2px;
      }
    }
  }
`;

export default EducationItemForm;

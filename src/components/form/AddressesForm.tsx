import { regexVNPhoneAll } from "@/utils/utils";
import { css } from "@emotion/react";
import { Affix, Card, Divider, Form, FormProps, Input, Radio, Typography, theme } from "antd";
import { MdPhoneEnabled } from "react-icons/md";
import { cssAddItemModel } from "src/components/shared/ItemStyled";
import useChangeLocale from "src/hooks/useChangeLocale";
import FormAddressSelects from "../field/FormAddressSelects";
import StepAnchor from "../list/StepAnchor";
import MapPicker from "../picker/MapPicker";

type TAddressesFormProps = Pick<FormProps, "initialValues" | "onFinish" | "id"> & {
  extraRight?: React.ReactNode;
};

const AddressesForm = ({}: TAddressesFormProps) => {
  const { i18n } = useChangeLocale();
  const {
    token: { colorTextPlaceholder },
  } = theme.useToken();
  const form = Form.useFormInstance();

  return (
    <>
      <Affix offsetTop={76}>
        <div className="right-wrapper-Affix" style={{ width: 204 }}>
          <Card size="small" bodyStyle={{ padding: "6px 6px 0 6px" }}>
            <StepAnchor
              items={[
                {
                  title: i18n["Thông tin cơ bản"],
                  formFields: [["name"], ["phoneNumber"]],
                },
                {
                  title: i18n["Thông tin địa chỉ"],
                  formFields: [["provinceCode"], ["districtCode"], ["provinceCode"], ["detail"]],
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
          <Form.Item
            name="defaultAddress"
            label={i18n["Địa chỉ mặc định/không mặc định"]}
            rules={[{ required: true }, { type: "boolean" }]}
          >
            <Radio.Group buttonStyle="solid">
              <Radio.Button value={true}>{i18n["Mặc định"]}</Radio.Button>
              <Radio.Button value={false}>{i18n["Không mặc định"]}</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <div className="row5050">
            <Form.Item
              name="pickUp"
              label={i18n["Là địa chỉ nhận hàng"]}
              rules={[{ required: true }, { type: "boolean" }]}
            >
              <Radio.Group>
                <Radio value={true}>Có</Radio>
                <Radio value={false}>Không</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="returnAddress"
              label={i18n["Là địa chỉ trả hàng"]}
              rules={[{ required: true }, { type: "boolean" }]}
            >
              <Radio.Group>
                <Radio value={true}>Có</Radio>
                <Radio value={false}>Không</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
          <Divider />
          <div className="row5050">
            <Form.Item
              name="name"
              label={i18n["Tên địa chỉ"]}
              rules={[{ required: true }, { type: "string" }]}
            >
              <Input placeholder={i18n["Nhập vào"]} />
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
          </div>
        </Card>

        <Card id="thong-tin-dia-chi">
          <Form.Item
            label={
              <>
                {i18n["Điạ chỉ"]}{" "}
                <Typography.Text type="secondary">{`(${i18n["Tỉnh thành | Quận huyện | Phường xã"]})`}</Typography.Text>
              </>
            }
            required
          >
            <FormAddressSelects
              size="large"
              provinceFormProps={{
                name: "provinceCode",
                rules: [{ type: "string", required: true }],
              }}
              districtFormProps={{
                name: "districtCode",
                rules: [{ type: "string", required: true }],
              }}
              wardFormProps={{
                name: "wardCode",
                rules: [{ type: "string", required: true }],
              }}
            />
          </Form.Item>
          <Form.Item
            name="detail"
            label={i18n["Địa chỉ chi tiết"]}
            rules={[{ required: true, type: "string" }]}
          >
            <Input.TextArea
              placeholder={i18n["Nhập địa chỉ chi tiết"]}
              autoSize={{ minRows: 2, maxRows: 2 }}
              showCount
              maxLength={255}
            />
          </Form.Item>
          <Form.Item name="geoLocation" label="" help="">
            <MapPicker
              style={{ height: 240, zIndex: 0 }}
              draggable
              onChangeAddressName={(name) => form.setFieldValue("detail", name)}
              // onChange={(val) => console.log(val)}
            />
          </Form.Item>
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

export default AddressesForm;

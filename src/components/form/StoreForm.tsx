import { css } from "@emotion/react";
import { Affix, Divider, Form, Input, Typography, theme } from "antd";
import { useRouter } from "next/router";
import { useId } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { MdPhoneEnabled } from "react-icons/md";
import { SiMaildotru } from "react-icons/si";
import Card from "src/components/card/Card";
import Editor from "src/components/field/Editor";
import FormAddressSelects from "src/components/field/FormAddressSelects";
import MapPicker from "src/components/picker/MapPicker";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import { regexVNPhoneAll } from "src/utils/utils";
import DeliverySelect from "../field/DeliverySelect";
import GroupTypeCombinedCascader from "../field/GroupTypeCombinedCascader";
import ImagesUploadWithQuery from "../field/ImagesUploadWithQuery";
import WorkTimeList from "../field/WorkTimeList";
import StepAnchor from "../list/StepAnchor";

type TStoreFormProps = { id?: string };

function StoreForm({ id }: TStoreFormProps) {
  const rUid = useId();
  const uid = id || rUid;
  const { message, notification } = useApp();
  const {
    query: { storeId },
    replace,
  } = useRouter();
  const { i18n } = useChangeLocale();
  const {
    token: { colorTextPlaceholder },
  } = theme.useToken();
  const form = Form.useFormInstance();

  return (
    <>
      <Affix offsetTop={76}>
        <div className="right-wrapper-Affix" style={{ width: 188 }}>
          <Card size="small" bodyStyle={{ padding: "6px 6px 0 6px" }}>
            <StepAnchor
              items={[
                {
                  title: "Thông tin cơ bản",
                  formFields: [["types"], ["name"], ["description"]],
                },
                {
                  title: "Địa chỉ cửa hàng",
                  formFields: [
                    ["provinceId"],
                    ["districtId"],
                    ["wardId"],
                    ["address"],
                    ["carrierList"],
                  ],
                },
                {
                  title: "Ảnh cửa hàng",
                  formFields: [["imageUrls"]],
                },
                {
                  title: "Thông tin liên hệ",
                  formFields: [["email"], ["phoneNumber"], ["contact"]],
                },
              ]}
              anchorProps={{ targetOffset: 12, bounds: 400 }}
            />
          </Card>
        </div>
      </Affix>
      <div className="left-wrapper">
        <Card id="thong-tin-co-ban">
          <Form.Item
            name="types"
            label={i18n["Loại cửa hàng"]}
            rules={[{ required: true }, { type: "array" }]}
          >
            <GroupTypeCombinedCascader disabled={!!storeId} />
          </Form.Item>
          <Divider />
          <Form.Item
            name="name"
            label={i18n["Tên cửa hàng"]}
            rules={[{ required: true }, { type: "string" }]}
          >
            <Input placeholder={i18n["Nhập tên cửa hàng"]} />
          </Form.Item>
          <Form.Item
            name="description"
            label={i18n["Mô tả cửa hàng"]}
            rules={[{ required: true }, { type: "string" }]}
          >
            <Editor theme="snow" placeholder={i18n["Nhập mô tả cửa hàng"]} />
          </Form.Item>
        </Card>

        <Card id="dia-chi-cua-hang">
          <Typography.Title level={5} type="secondary">
            Địa chỉ cửa hàng
          </Typography.Title>
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
                name: "provinceId",
                rules: [{ type: "string", required: true }],
              }}
              districtFormProps={{
                name: "districtId",
                rules: [{ type: "string", required: true }],
              }}
              wardFormProps={{
                name: "wardId",
                rules: [{ type: "string", required: true }],
              }}
            />
          </Form.Item>
          <Form.Item
            name="address"
            label={i18n["Địa chỉ chi tiết"]}
            rules={[{ required: true, type: "string" }]}
          >
            <Input.TextArea
              placeholder={i18n["Nhập địa chỉ chi tiết cửa hàng"]}
              autoSize={{ minRows: 2, maxRows: 2 }}
              showCount
              maxLength={255}
            />
          </Form.Item>
          <Form.Item name="geoLocation" label="" help="">
            <MapPicker
              style={{ height: 240, zIndex: 0 }}
              draggable
              onChangeAddressName={(name) => form.setFieldValue("address", name)}
            />
          </Form.Item>
        </Card>
        <Card bodyStyle={{ paddingBottom: 1 }}>
          <Typography.Title level={5} type="secondary">
            Cấu hình đơn vị vận chuyển
          </Typography.Title>
          <Form.Item
            name="carrierList"
            label={i18n["Quản lý phương thức vận chuyển đơn hàng"]}
            rules={[{ required: true }, { type: "array" }]}
          >
            <DeliverySelect placeholder={i18n["Chọn đơn vị vận chuyển"]} />
          </Form.Item>
        </Card>
        <Card id="anh-cua-hang">
          <Form.Item
            label={i18n["Ảnh cửa hàng"]}
            name="imageUrls"
            rules={[{ type: "array", required: true, defaultField: { type: "url" } }]}
          >
            <ImagesUploadWithQuery />
          </Form.Item>
        </Card>
        <Card id="thong-tin-lien-he">
          <Typography.Title level={5} type="secondary">
            Thông tin liên hệ
          </Typography.Title>
          <div className="row5050">
            <Form.Item
              name="email"
              label={i18n["Địa chỉ Email"]}
              rules={[{ required: false, type: "email" }]}
            >
              <Input
                type="email"
                placeholder={i18n["Nhập Địa chỉ Email"]}
                suffix={<SiMaildotru size={16} color={colorTextPlaceholder} />}
              />
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
              tooltip={{
                title: "Có thể nhập số máy bàn, số điện thoại cá nhân, số hotline",
              }}
            >
              <Input
                type="tel"
                placeholder={i18n["Nhập số điện thoại cửa hàng"]}
                suffix={<MdPhoneEnabled size={16} color={colorTextPlaceholder} />}
              />
            </Form.Item>
            <Form.Item name="contact" label={i18n["Tên liên hệ"]} rules={[{ required: true }]}>
              <Input
                placeholder={i18n["Nhập Tên liên hệ"]}
                suffix={<BsPersonCircle size={16} color={colorTextPlaceholder} />}
              />
            </Form.Item>
          </div>
          <Divider />
          <WorkTimeList />
        </Card>
      </div>
      <div className="right-wrapper"></div>
    </>
  );
}

export const cssStoreFormWrapper = css`
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
  & > .right-wrapper {
    flex: 0 0 360px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    display: none;
  }
  & .right-wrapper-Affix {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    height: fit-content;
    transform: translateX(-100%);
    @media screen and (max-width: 1200px) {
      display: none;
    }
  }
  .images-upload-wrapper {
    position: relative;
    z-index: 0;
    & > .imageUrl-btn {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1;
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
`;

export default StoreForm;

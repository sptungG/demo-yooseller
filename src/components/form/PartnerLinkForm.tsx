import { css } from "@emotion/react";
import { Affix, Card, Form, FormProps, Input, InputNumber, Typography, theme } from "antd";
import { cssAddItemModel } from "src/components/shared/ItemStyled";
import useChangeLocale from "src/hooks/useChangeLocale";
import AvatarUploadWithQuery from "../field/AvatarUploadWithQuery";
import StepAnchor from "../list/StepAnchor";

type TPartnerLinkFormProps = Pick<FormProps, "initialValues" | "onFinish" | "id"> & {
  extraRight?: React.ReactNode;
};

const PartnerLinkForm = ({}: TPartnerLinkFormProps) => {
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
                  title: i18n["Hình ảnh"],
                  formFields: [["imageUrl"]],
                },
                {
                  title: i18n["Thông tin liên kết"],
                  formFields: [["name"], ["districtCode"], ["provinceCode"], ["detail"]],
                },
              ]}
              anchorProps={{ targetOffset: 12, bounds: 400 }}
            />
          </Card>
        </div>
      </Affix>
      <div className="left-wrapper">
        <Card id="hinh-anh">
          <Form.Item label="Hình ảnh" name="imageUrl" rules={[{ type: "string", required: true }]}>
            <AvatarUploadWithQuery />
          </Form.Item>
        </Card>
        <Card id="thong-tin-lien-ket">
          <Typography.Title
            level={4}
            type="secondary"
            style={{ lineHeight: 1, margin: "0 0 12px" }}
          >
            {i18n["Thông tin liên kết"]}
          </Typography.Title>
          <Form.Item
            name="name"
            label={i18n["Tên liên kết"]}
            rules={[{ required: true }, { type: "string" }]}
          >
            <Input placeholder="Nhập vào" />
          </Form.Item>
          <Form.Item
            name="link"
            label={i18n["Đường dẫn"]}
            rules={[{ required: false }, { type: "string" }]}
          >
            <Input placeholder="Nhập vào" />
          </Form.Item>
          <Form.Item
            name="stt"
            label={i18n["STT"]}
            rules={[{ required: true }, { type: "number" }]}
          >
            <InputNumber placeholder="Nhập vào" />
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

export default PartnerLinkForm;

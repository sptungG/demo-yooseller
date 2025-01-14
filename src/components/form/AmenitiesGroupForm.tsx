import { Card, Form, Input, theme } from "antd";

import { useId } from "react";
import useChangeLocale from "src/hooks/useChangeLocale";

import { css } from "@emotion/react";
import { useRouter } from "next/router";
import AmenityAttributeList from "../field/AmenityAttributeList";
import { cssAddItemModel } from "../shared/ItemStyled";
const { TextArea } = Input;

const AmenitiesGroupForm = () => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const {
    query: { storeId, amenityId },
  } = useRouter();

  const {
    token: { colorTextSecondary },
  } = theme.useToken();

  return (
    <div className="left-wrapper">
      <Card>
        <Form.Item
          name="name"
          label={i18n["Tên nhóm dịch vụ"]}
          rules={[{ required: true, type: "string" }]}
        >
          <Input placeholder={i18n["Nhập vào"]} />
        </Form.Item>
        <Form.Item
          name="description"
          label={i18n["Thông tin chi tiết"]}
          rules={[{ type: "string" }]}
          style={{ marginBottom: 36 }}
        >
          <TextArea
            autoSize={{ minRows: 3, maxRows: 5 }}
            placeholder={i18n["Nhập vào"]}
            style={{ color: colorTextSecondary }}
          />
        </Form.Item>

        <Form.Item name="attributeExtensions">
          <AmenityAttributeList type="GROUP" />
        </Form.Item>
      </Card>
    </div>
  );
};

export const cssAmenitiesGroupForm = css`
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

export default AmenitiesGroupForm;

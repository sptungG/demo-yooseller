import { css } from "@emotion/react";
import { Divider, Form, Input, InputNumber, theme } from "antd";
import useChangeLocale from "src/hooks/useChangeLocale";
import Card from "../card/Card";
import Editor from "../field/Editor";
import ImagesUploadWithQuery from "../field/ImagesUploadWithQuery";

type TDefaultItemFormProps = { id?: string };

const DefaultItemForm = ({ id }: TDefaultItemFormProps) => {
  const { i18n } = useChangeLocale();
  const form = Form.useFormInstance();
  const {
    token: { colorTextPlaceholder, colorSuccess },
  } = theme.useToken();
  return (
    <>
      <div className="left-wrapper">
        <Card>
          <Form.Item
            name="name"
            label={i18n["Tên sản phẩm"]}
            rules={[{ required: true }, { type: "string" }]}
          >
            <Input placeholder={i18n["Nhập tên sản phẩm"]} />
          </Form.Item>
          <Form.Item
            name="description"
            label={i18n["Mô tả sản phẩm"]}
            rules={[{ required: true }, { type: "string" }]}
          >
            <Editor placeholder={i18n["Nhập mô tả sản phẩm"]} />
          </Form.Item>
          <Divider />
          <Form.Item
            label={i18n["Ảnh sản phẩm"]}
            name="imageUrlList"
            rules={[{ type: "array", required: true, defaultField: { type: "url" } }]}
          >
            <ImagesUploadWithQuery />
          </Form.Item>
        </Card>
      </div>
      <div className="right-wrapper">
        <Card>
          <Form.Item name="stock" label={i18n["Kho hàng"]} rules={[{ required: true }]}>
            <InputNumber<number>
              placeholder={i18n["Nhập số lượng sản phẩm"]}
              style={{ width: "100%", color: colorTextPlaceholder }}
              step={1}
              min={0}
              prefix="x"
              formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Divider />
          <Form.Item
            name={["itemModel", "currentPrice"]}
            label={i18n["Giá hiển thị"]}
            rules={[{ required: true }]}
          >
            <InputNumber<number>
              placeholder={i18n["Nhập giá hiển thị"]}
              style={{ width: "100%", color: colorSuccess }}
              step={1000}
              min={0}
              prefix="₫"
              formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item
            name={["itemModel", "originalPrice"]}
            label={i18n["Giá ban đầu"]}
            rules={[{ required: true }]}
          >
            <InputNumber<number>
              placeholder={i18n["Nhập giá ban đầu"]}
              style={{ width: "100%", color: colorTextPlaceholder }}
              step={1000}
              min={0}
              prefix="₫"
              formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
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
`;

export default DefaultItemForm;

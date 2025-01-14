import { css } from "@emotion/react";
import {
  Affix,
  Card,
  Divider,
  Flex,
  Form,
  FormProps,
  Input,
  InputNumber,
  Typography,
  theme,
} from "antd";
import { useRouter } from "next/router";
import { useId } from "react";
import Editor from "src/components/field/Editor";
import { cssAddItemModel } from "src/components/shared/ItemStyled";
import useChangeLocale from "src/hooks/useChangeLocale";

import { BsXLg } from "react-icons/bs";
import useGetProvider from "src/hooks/useGetProvider";
import CategorySelectDrawer from "../field/CategorySelectDrawer";
import ImagesUploadWithQuery from "../field/ImagesUploadWithQuery";
import ItemAttributesCombined from "../field/ItemAttributesCombined";
import ItemModelCombined from "../field/ItemModelCombined";
import StepAnchor from "../list/StepAnchor";

type TShoppingItemFormProps = Pick<FormProps, "initialValues" | "onFinish" | "id"> & {
  extraRight?: React.ReactNode;
};

const ShoppingItemForm = ({ id, extraRight }: TShoppingItemFormProps) => {
  const rUid = useId();
  const uid = id || rUid;
  const { i18n } = useChangeLocale();
  const {
    token: { colorSuccess, colorTextPlaceholder },
  } = theme.useToken();

  const {
    query: { itemId, storeId },
    replace,
  } = useRouter();

  const { gSelectedProvider } = useGetProvider({});
  const form = Form.useFormInstance();
  const formTierVariationListWatch = Form.useWatch("tierVariationList", form);

  return (
    <>
      <Affix offsetTop={76}>
        <div className="right-wrapper-Affix" style={{ width: 204 }}>
          <Card size="small" bodyStyle={{ padding: "6px 6px 0 6px" }}>
            <StepAnchor
              items={[
                {
                  title: "Thông tin cơ bản",
                  formFields: [["name"], ["categoryId"], ["description"]],
                },
                {
                  title: "Ảnh sản phẩm",
                  formFields: [["imageUrlList"]],
                },
                {
                  title: "Thông tin chi tiết",
                  formFields: [["attributeList"]],
                },
                {
                  title: "Thông tin vận chuyển",
                  formFields: [
                    ["sizeInfo", "weight"],
                    ["sizeInfo", "width"],
                    ["sizeInfo", "length"],
                    ["sizeInfo", "height"],
                  ],
                },
                {
                  title: "Thông tin bán hàng",
                  formFields: formTierVariationListWatch?.length
                    ? [["tierVariationList"], ["modelList"]]
                    : [["stock"], ["sku"], ["minPrice"]],
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
            name="name"
            label={i18n["Tên sản phẩm"]}
            rules={[{ required: true }, { type: "string" }]}
          >
            <Input placeholder={i18n["Nhập tên sản phẩm"]} />
          </Form.Item>
          <Divider />
          <Form.Item
            name="categoryId"
            label={i18n["Danh mục"]}
            rules={[{ required: true }, { type: "number" }]}
          >
            <CategorySelectDrawer
              businessType={gSelectedProvider?.type}
              selectableLastChildrenOnly
              buttonProps={{ size: "large", disabled: !!itemId, style: { width: "100%" } }}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label={i18n["Mô tả sản phẩm"]}
            rules={[{ required: true }, { type: "string" }]}
          >
            <Editor placeholder={i18n["Nhập mô tả sản phẩm"]} />
          </Form.Item>
        </Card>

        <Card id="anh-san-pham" bodyStyle={{ paddingBottom: 4 }}>
          <Form.Item
            label={i18n["Ảnh sản phẩm"]}
            name="imageUrlList"
            rules={[{ type: "array", required: true, defaultField: { type: "url" } }]}
          >
            <ImagesUploadWithQuery />
          </Form.Item>
        </Card>

        <Card id="thong-tin-chi-tiet" bodyStyle={{ paddingBottom: 28 }}>
          <Typography.Title
            level={4}
            type="secondary"
            style={{ lineHeight: 1, margin: "0 0 12px" }}
          >
            {i18n["Thông tin chi tiết"]}
          </Typography.Title>
          <ItemAttributesCombined />
        </Card>

        <Card id="van-chuyen" bodyStyle={{ paddingBottom: 28 }}>
          <Typography.Title
            level={4}
            type="secondary"
            style={{ lineHeight: 1, margin: "0 0 12px" }}
          >
            {i18n["Vận chuyển"]}
          </Typography.Title>
          <Form.Item
            name={["sizeInfo", "weight"]}
            label={i18n["Cân nặng (Sau khi đóng gói)"]}
            rules={[{ required: true, type: "number", min: 0.1 }]}
          >
            <InputNumber<number>
              prefix={"gr |"}
              step={1}
              min={0}
              placeholder={i18n["Nhập vào"]}
              style={{ color: colorTextPlaceholder, width: "226px" }}
              formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item
            required
            help={
              i18n[
                "Kích thước đóng gói (Phí vận chuyển thực tế sẽ thay đổi nếu bạn nhập sai kích thước)"
              ]
            }
          >
            <Flex gap={2} align="flex-end">
              <Form.Item
                name={["sizeInfo", "width"]}
                label="Chiều rộng"
                rules={[{ required: true, type: "number", min: 0.1 }]}
                help=""
                style={{ width: "33%", marginBottom: 6 }}
              >
                <InputNumber<number>
                  prefix={"cm |"}
                  step={1}
                  min={0}
                  placeholder={i18n["Nhập vào"]}
                  style={{ color: colorTextPlaceholder, width: "100%" }}
                  formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
              <BsXLg size={16} style={{ opacity: 0.25, marginBottom: 16, flexShrink: 0 }} />
              <Form.Item
                name={["sizeInfo", "length"]}
                label="Chiều dài"
                rules={[{ required: true, type: "number", min: 0.1 }]}
                help=""
                style={{ width: "33%", marginBottom: 6 }}
              >
                <InputNumber<number>
                  prefix={"cm |"}
                  step={1}
                  min={0}
                  placeholder={i18n["Nhập vào"]}
                  style={{ color: colorTextPlaceholder, width: "100%" }}
                  formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
              <BsXLg size={16} style={{ opacity: 0.25, marginBottom: 16, flexShrink: 0 }} />
              <Form.Item
                name={["sizeInfo", "height"]}
                label="Chiều cao"
                rules={[{ required: true, type: "number", min: 0.1 }]}
                help=""
                style={{ width: "33%", marginBottom: 6 }}
              >
                <InputNumber<number>
                  prefix={"cm |"}
                  step={1}
                  min={0}
                  placeholder={i18n["Nhập vào"]}
                  style={{ color: colorTextPlaceholder, width: "100%" }}
                  formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Flex>
          </Form.Item>
        </Card>

        <Card id="thong-tin-ban-hang" bodyStyle={{ padding: "24px 0 28px" }}>
          <div style={{ padding: "0 24px" }}>
            <Typography.Title
              level={4}
              type="secondary"
              style={{ lineHeight: 1, margin: "0 0 12px" }}
            >
              {i18n["Thông tin bán hàng"]}
            </Typography.Title>
            <div className="title-wrapper" style={{ margin: "0 0 12px" }}>
              <Typography.Text type="secondary" style={{ fontSize: 16 }}>
                {i18n["Phân loại hàng"]}
              </Typography.Text>{" "}
              <Typography.Text type="secondary">{`( Màu sắc, Kích thước, Chất liệu,... )`}</Typography.Text>
            </div>
          </div>
          <ItemModelCombined />
          {!formTierVariationListWatch?.length && <Divider />}
          <div style={{ padding: "0 24px" }}>
            <div className="row5050">
              <Form.Item
                name="stock"
                label={i18n["Kho hàng"]}
                rules={[{ required: !formTierVariationListWatch?.length, type: "number", min: 0 }]}
                hidden={!!formTierVariationListWatch?.length}
              >
                <InputNumber<number>
                  prefix={"x"}
                  step={1}
                  min={0}
                  placeholder={i18n["Nhập số lượng sản phẩm"]}
                  style={{ color: colorTextPlaceholder, width: "100%" }}
                  disabled={!!formTierVariationListWatch?.length}
                  formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
              <Form.Item
                name="sku"
                label={"SKU"}
                rules={[{ type: "string" }]}
                hidden={!!formTierVariationListWatch?.length}
              >
                <Input placeholder={i18n["Nhập SKU"]} />
              </Form.Item>
              <Form.Item
                name="minPrice"
                label={i18n["Giá hiển thị"]}
                rules={[{ required: !formTierVariationListWatch?.length, type: "number", min: 0 }]}
                hidden={!!formTierVariationListWatch?.length}
              >
                <InputNumber<number>
                  prefix={"₫"}
                  min={0}
                  step={1000}
                  placeholder={i18n["Nhập giá"]}
                  style={{ color: colorSuccess, width: "100%" }}
                  disabled={!!formTierVariationListWatch?.length}
                  formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
              <Form.Item name="maxPrice" label={i18n["Giá ban đầu"]} hidden={true}>
                <InputNumber<number>
                  prefix={"₫"}
                  min={0}
                  step={1000}
                  placeholder={i18n["Nhập giá"]}
                  style={{ color: colorTextPlaceholder, width: "100%" }}
                  disabled={true}
                  formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </div>
          </div>
        </Card>
      </div>
      <Form.Item name="complaintPolicy" hidden label={"ComplaintPolicy"}>
        <Input />
      </Form.Item>
      <Form.Item name="logisticInfo" hidden label={"LogisticInfo"}>
        <Input />
      </Form.Item>
      <Form.Item name="videoUrlList" hidden label={"VIDEO"}>
        <Input />
      </Form.Item>
      <Form.Item name="condition" hidden label={i18n["Tình trạng"]}>
        <Input />
      </Form.Item>
      <Form.Item name="status" hidden label={i18n["Trạng thái"]}>
        <Input />
      </Form.Item>
      <Form.Item name="tenantId" hidden label={"tenantId"}>
        <Input />
      </Form.Item>
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

export default ShoppingItemForm;

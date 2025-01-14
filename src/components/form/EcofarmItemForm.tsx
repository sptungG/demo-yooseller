import { useGetListEcofarmPackageQuery } from "@/redux/query/farm.query";
import { css } from "@emotion/react";
import { useDebounce } from "ahooks";
import {
  Affix,
  Card,
  Divider,
  Flex,
  Form,
  FormProps,
  Input,
  InputNumber,
  Select,
  Typography,
  theme,
} from "antd";
import { useRouter } from "next/router";
import { BsXLg } from "react-icons/bs";
import Editor from "src/components/field/Editor";
import { cssAddItemModel } from "src/components/shared/ItemStyled";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProviderFarm from "src/hooks/useGetProviderFarm";
import { CategorySelectDrawerFarm } from "../field/CategorySelectDrawer";
import ImagesUploadWithQuery from "../field/ImagesUploadWithQuery";
import ItemEcofarmAttributesCombined from "../field/ItemEcofarmAttributesCombined";
import ItemModelCombined from "../field/ItemModelCombined";
import VideosUploadWithQuery from "../field/VideosUploadWithQuery";
import StepAnchor from "../list/StepAnchor";

type TEcofarmItemFormProps = Pick<FormProps, "initialValues" | "onFinish" | "id"> & {
  extraRight?: React.ReactNode;
};

const EcofarmItemForm = ({}: TEcofarmItemFormProps) => {
  const { i18n } = useChangeLocale();
  const {
    token: { colorSuccess, colorTextPlaceholder },
  } = theme.useToken();

  const {
    query: { itemId },
  } = useRouter();

  const { gSelectedProvider } = useGetProviderFarm();
  const debouncedFilterData = useDebounce(
    {
      maxResultCount: 1000,
      providerId: gSelectedProvider?.id,
    },
    { wait: 500 },
  );
  const { data: resPackage } = useGetListEcofarmPackageQuery(debouncedFilterData, {
    refetchOnMountOrArgChange: true,
    skip: !debouncedFilterData?.providerId,
  });
  const dataPackage = resPackage?.data || [];

  const form = Form.useFormInstance();
  const formTierVariationListWatch = Form.useWatch("tierVariationList", form);
  const filterOptionPackage = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  return (
    <>
      <Affix offsetTop={76}>
        <div className="right-wrapper-Affix" style={{ width: 204 }}>
          <Card size="small" bodyStyle={{ padding: "6px 6px 0 6px" }}>
            <StepAnchor
              items={[
                {
                  title: i18n["Thông tin cơ bản"],
                  formFields: [["name"], ["categoryId"], ["description"], ["ecofarmPackageId"]],
                },
                {
                  title: i18n["Hình ảnh và video"],
                  formFields: [["imageUrlList"], ["videoUrlList"]],
                },
                {
                  title: i18n["Thông tin chi tiết"],
                  formFields: [["attributeList"]],
                },
                {
                  title: i18n["Thông tin vận chuyển"],
                  formFields: [
                    ["sizeInfo", "weight"],
                    ["sizeInfo", "width"],
                    ["sizeInfo", "length"],
                    ["sizeInfo", "height"],
                  ],
                },
                {
                  title: i18n["Thông tin bán hàng"],
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
          <div className="row5050">
            <Form.Item
              name="categoryId"
              label={i18n["Danh mục"]}
              rules={[{ required: true }, { type: "number" }]}
            >
              <CategorySelectDrawerFarm
                businessType={gSelectedProvider?.type}
                selectableLastChildrenOnly
                buttonProps={{ size: "large", disabled: !!itemId, style: { width: "100%" } }}
              />
            </Form.Item>
            <Form.Item
              name="ecofarmPackageId"
              label={i18n["Gói dịch vụ farming"]}
              rules={[{ required: false }, { type: "number" }]}
            >
              <Select
                allowClear
                placement="bottomRight"
                placeholder={i18n["Chọn"]}
                showSearch={true}
                filterOption={filterOptionPackage}
                options={dataPackage?.map((item: any) => ({
                  value: item.id,
                  label: item.name,
                }))}
              />
            </Form.Item>
          </div>
          <Divider />
          <Form.Item
            name="description"
            label={i18n["Mô tả sản phẩm"]}
            rules={[{ required: true }, { type: "string" }]}
          >
            <Editor placeholder={i18n["Nhập mô tả sản phẩm"]} />
          </Form.Item>
        </Card>

        <Card id="hinh-anh-va-video" bodyStyle={{ paddingBottom: 4 }}>
          <Form.Item
            label={i18n["Ảnh sản phẩm"]}
            name="imageUrlList"
            rules={[{ type: "array", required: true, defaultField: { type: "url" } }]}
          >
            <ImagesUploadWithQuery />
          </Form.Item>
          <Divider />
          <Form.Item
            label="Video sản phẩm"
            name="videoUrlList"
            rules={[{ type: "array", required: false, defaultField: { type: "url" } }]}
          >
            <VideosUploadWithQuery />
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
          <ItemEcofarmAttributesCombined />
        </Card>
        <Card id="thong-tin-van-chuyen" bodyStyle={{ paddingBottom: 28 }}>
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
            rules={[{ required: true }, { type: "number", min: 0 }]}
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
                label={i18n["Chiều rộng"]}
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
                label={i18n["Chiều dài"]}
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
                label={i18n["Chiều cao"]}
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
                  step={1000}
                  min={0}
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
                  step={1000}
                  min={0}
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
      <Form.Item name="sizeInfo" hidden label={"SizeInfo"}>
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

export default EcofarmItemForm;

import {
  Affix,
  Card,
  Flex,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  Typography,
  theme,
} from "antd";

import { useId } from "react";
import useChangeLocale from "src/hooks/useChangeLocale";

import { vietnameseSlug } from "@/utils/utils";
import { css } from "@emotion/react";
import { useRouter } from "next/router";
import useGetProvider from "src/hooks/useGetProvider";
import {
  TDiscountType,
  TVoucherScope,
  TVoucherType,
  VoucherScopeDesc,
} from "src/types/voucher.types";
import DateStartEndPickers from "../field/DateStartEndPickers";
import DisplayChannelSelect from "../field/DisplayChannelSelect";
import ItemsSelect from "../field/ItemsSelect";
import StepAnchor from "../list/StepAnchor";
import { cssAddItemModel } from "../shared/ItemStyled";

type TVoucherFormProps = {
  mode?: string;
};

const VoucherForm = ({ mode = "CREATE" }: TVoucherFormProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const {
    query: { voucherId },
  } = useRouter();

  const form = Form.useFormInstance();
  const {
    token: { colorSuccess, colorTextSecondary },
  } = theme.useToken();

  const { gSelectedProvider } = useGetProvider({});
  const prefixVoucherCode = gSelectedProvider?.name
    ? vietnameseSlug(gSelectedProvider?.name, "")
        .toUpperCase()
        .replace(/[^A-Za-z0-9]/g, "")
        .substring(0, 4)
    : undefined;

  const formVoucherDiscountType = Form.useWatch("discountType", form);
  const formVoucherScope = Form.useWatch("scope", form);
  const formVoucherType = Form.useWatch("type", form);

  return (
    <>
      <Affix offsetTop={76}>
        <div className="right-wrapper-Affix" style={{ width: 204 }}>
          <Card size="small" bodyStyle={{ padding: "6px 6px 0 6px" }}>
            <StepAnchor
              items={[
                {
                  title: "Thông tin mã giảm giá",
                  formFields: [["name"], ["type"]],
                },
                {
                  title: "Thiết lập mã giảm giá",
                  formFields: [
                    ["discountType"],
                    formVoucherDiscountType === TDiscountType.FIX_AMOUNT
                      ? ["discountAmount"]
                      : ["percentage"],
                    ["maxPrice"],
                    ["minBasketPrice"],
                    ["quantity"],
                    ["maxDistributionBuyer"],
                  ],
                },
                {
                  title: "Thiết lập thời gian",
                  formFields: [["dateStart"], ["dateEnd"]],
                },
                {
                  title: "Mã giảm giá",
                  formFields: [["voucherCode"], ["scope"], ["displayChannelList"]],
                },
              ]}
              anchorProps={{ targetOffset: 12, bounds: 400 }}
            />
          </Card>
        </div>
      </Affix>

      <div className="left-wrapper">
        <Card id="thong-tin-ma-giam-gia">
          <Form.Item
            name="name"
            label={i18n["Tên chương trình giảm giá"]}
            rules={[{ required: true, type: "string" }]}
          >
            <Input placeholder={i18n["Nhập vào"]} />
          </Form.Item>
          <Form.Item
            name="voucherCode"
            label={i18n["Mã giảm giá"]}
            rules={[
              { type: "string", required: true },
              { pattern: /[0-9]/, warningOnly: true },
              { pattern: /[A-Z]/, warningOnly: true },
            ]}
            help={
              <Flex vertical gap={2} style={{ lineHeight: 1.1, paddingTop: 4 }}>
                <div>4 ký tự đầu được mặc định lấy từ tên của cửa hàng</div>
                <div>Vui lòng chỉ nhập các kí tự chữ cái (A-Z), số (0-9); tối đa 5 kí tự.</div>
              </Flex>
            }
            style={{ marginBottom: 36 }}
          >
            <Input
              placeholder={i18n["Nhập vào"]}
              disabled={!!voucherId}
              maxLength={5}
              showCount
              prefix={prefixVoucherCode}
              style={{ color: colorTextSecondary }}
            />
          </Form.Item>
          <Form.Item
            name="type"
            label={i18n["Phân loại mã"]}
            rules={[{ required: true, type: "number" }]}
            style={{ marginBottom: 0 }}
          >
            <Radio.Group>
              <Radio.Button
                value={TVoucherType.VOUCHER_SHIPPING}
                disabled={!!voucherId && formVoucherType === TVoucherType.VOUCHER_DISCOUNT}
              >
                {i18n["Voucher vận chuyển"]}
              </Radio.Button>
              <Radio.Button
                value={TVoucherType.VOUCHER_DISCOUNT}
                disabled={!!voucherId && formVoucherType === TVoucherType.VOUCHER_SHIPPING}
              >
                {i18n["Voucher bán hàng"]}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Card>

        <Card id="thiet-lap-ma-giam-gia" bodyStyle={{ paddingBottom: 28 }}>
          <Typography.Title
            level={4}
            type="secondary"
            style={{ lineHeight: 1, margin: "0 0 12px" }}
          >
            {i18n["Thiết lập mã giảm giá"]}
          </Typography.Title>

          <div className="row5050">
            <Form.Item label="Loại giảm giá | Mức giảm" required>
              <Space.Compact style={{ display: "flex" }}>
                <Form.Item name={"discountType"} noStyle>
                  <Select
                    disabled={!!voucherId}
                    options={[
                      { value: TDiscountType.FIX_AMOUNT, label: "Theo số tiền" },
                      {
                        value: TDiscountType.DISCOUNT_PERCENTAGE,
                        label: "Theo phần trăm",
                        disabled: formVoucherType === TVoucherType.VOUCHER_SHIPPING ? true : false,
                      },
                    ]}
                    placeholder={i18n["Thiết lập mã giảm giá"]}
                    style={{ maxWidth: 160 }}
                    popupMatchSelectWidth={false}
                  />
                </Form.Item>
                <Form.Item
                  name={`${
                    formVoucherDiscountType === TDiscountType.FIX_AMOUNT
                      ? "discountAmount"
                      : "percentage"
                  }`}
                  rules={[
                    { type: "number", required: true },
                    formVoucherDiscountType === TDiscountType.DISCOUNT_PERCENTAGE
                      ? {
                          type: "number",
                          max: 100,
                          min: 0,
                          message: "Mức giảm trong khoảng từ 0% đến 100%",
                        }
                      : { type: "number", min: 0, message: "Mức giảm tối thiểu là 0" },
                  ]}
                  noStyle
                >
                  <InputNumber<number>
                    min={0}
                    max={
                      formVoucherDiscountType === TDiscountType.DISCOUNT_PERCENTAGE
                        ? 100
                        : undefined
                    }
                    prefix={`${formVoucherDiscountType === TDiscountType.FIX_AMOUNT ? "₫" : "%"}`}
                    formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
                    style={{ color: colorSuccess, width: "100%" }}
                    placeholder={i18n["Nhập vào"]}
                  />
                </Form.Item>
              </Space.Compact>
            </Form.Item>

            {formVoucherDiscountType === TDiscountType.DISCOUNT_PERCENTAGE && <div></div>}

            {formVoucherDiscountType === TDiscountType.DISCOUNT_PERCENTAGE && (
              <Form.Item
                label={i18n["Giảm tối đa"]}
                name="maxPrice"
                rules={[{ type: "number", required: true }]}
                preserve={false}
              >
                <InputNumber<number>
                  min={0}
                  prefix={"₫"}
                  formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
                  style={{ color: colorSuccess, width: "100%" }}
                  step={1000}
                  placeholder={i18n["Nhập vào"]}
                />
              </Form.Item>
            )}

            <Form.Item
              label={i18n["Giá trị đơn hàng tối thiểu"]}
              name="minBasketPrice"
              rules={[{ type: "number", required: true }]}
            >
              <InputNumber<number>
                min={0}
                prefix={"₫"}
                formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
                style={{ color: colorSuccess, width: "100%" }}
                step={1000}
                placeholder={i18n["Nhập vào"]}
              />
            </Form.Item>

            <Form.Item
              label={i18n["Tổng số lượng sử dụng tối đa"]}
              name="quantity"
              rules={[
                {
                  type: "number",
                  required: true,
                  min: 1,
                  message: "Số lượt sử dụng tối thiểu là 1",
                },
              ]}
            >
              <InputNumber<number>
                min={0}
                formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
                style={{ width: "100%" }}
                placeholder={i18n["Nhập vào"]}
              />
            </Form.Item>

            <Form.Item
              label={i18n["Lượt sử dụng tối đa/ Khách hàng"]}
              name="maxDistributionBuyer"
              rules={[
                {
                  type: "number",
                  required: true,
                  min: 1,
                  message: "Số lượt sử dụng tối thiểu của mỗi Người mua là 1",
                },
              ]}
            >
              <InputNumber<number>
                min={0}
                formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </div>
        </Card>

        <Card id="thiet-lap-thoi-gian" bodyStyle={{ paddingBottom: 28 }}>
          <Typography.Title
            level={4}
            type="secondary"
            style={{ lineHeight: 1, margin: "0 0 12px" }}
          >
            {i18n["Thiết lập thời gian"]}
          </Typography.Title>
          <div className="row5050">
            <DateStartEndPickers mode={mode} />
          </div>
        </Card>

        <Card id="ma-giam-gia" bodyStyle={{ paddingBottom: 28 }}>
          <Typography.Title
            level={4}
            type="secondary"
            style={{ lineHeight: 1, margin: "0 0 12px" }}
          >
            {i18n["Hiển thị mã giảm giá và các sản phẩm áp dụng"]}
          </Typography.Title>

          <Form.Item
            name="displayChannelList"
            label={i18n["Màn hình hiển thị voucher"]}
            rules={[{ type: "array", required: true }]}
          >
            <DisplayChannelSelect placeholder={i18n["Chọn màn hiển thị"]} />
          </Form.Item>

          {/* <Form.Item
              label={i18n["Thời gian hiển thị voucher"]}
              name="displayDateStart"
              rules={[{ type: "date", required: true }]}
            >
              <DatePicker
                bordered={true}
                picker="date"
                allowClear
                format="DD-MM-YYYY HH:mm"
                showTime={{ format: "HH:mm" }}
                disabledDate={(current) => current < dayjs()}
                style={{ width: "100%" }}
              />
            </Form.Item> */}

          <Form.Item
            name="scope"
            label={i18n["Loại mã"]}
            rules={[{ type: "number", required: true }]}
            help={VoucherScopeDesc[formVoucherScope]}
          >
            <Radio.Group>
              <Radio.Button
                value={TVoucherScope.SHOP_VOUCHER}
                disabled={!!voucherId && formVoucherScope === TVoucherScope.PRODUCT_VOUCHER}
              >
                {i18n["Voucher toàn shop"]}
              </Radio.Button>
              <Radio.Button
                value={TVoucherScope.PRODUCT_VOUCHER}
                disabled={!!voucherId && formVoucherScope === TVoucherScope.SHOP_VOUCHER}
              >
                {i18n["Voucher sản phẩm"]}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          {formVoucherScope === TVoucherScope.PRODUCT_VOUCHER && (
            <Form.Item label={i18n["Sản phẩm được áp dụng"]} name="listItems" noStyle>
              <ItemsSelect
                providerId={gSelectedProvider?.id}
                rowSelection={{
                  getCheckboxProps: (record) => ({
                    disabled: !!voucherId,
                  }),
                  fixed: "left",
                }}
              />
            </Form.Item>
          )}
        </Card>
      </div>
    </>
  );
};

export const cssVoucherForm = css`
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

export default VoucherForm;

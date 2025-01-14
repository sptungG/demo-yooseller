import useGetProviderFarm from "@/hooks/useGetProviderFarm";
import {
  TEVoucherChannelDisplay,
  TEVoucherDiscountType,
  TEVoucherScope,
  TEVoucherType,
} from "@/types/farm.types";
import { dateFormatVoucher, dayjs } from "@/utils/utils-date";
import { css } from "@emotion/react";
import { useCreation, useDebounce } from "ahooks";
import {
  Affix,
  Card,
  Divider,
  Empty,
  Form,
  FormProps,
  Input,
  InputNumber,
  Radio,
  Select,
  Typography,
  theme,
} from "antd";
import { useState } from "react";
import { cssAddItemModel } from "src/components/shared/ItemStyled";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useGetAllItemsByPartnerForEcoFarmQuery } from "src/redux/query/farm.query";
import { TItemStatus, TItemsFilter } from "src/types/farm.types";
import Editor from "../field/Editor";
import StepAnchor from "../list/StepAnchor";
import RangePicker from "../picker/RangePicker";
import ItemTableStyled from "../table/ItemTable";
import useItemsFarmColumns from "../table/useItemsFarmColumns";

type TVoucherFarmFormProps = Pick<FormProps, "initialValues" | "onFinish" | "id"> & {
  extraRight?: React.ReactNode;
};

const VoucherFarmForm = ({}: TVoucherFarmFormProps) => {
  const { i18n } = useChangeLocale();
  const {
    token: { colorSuccess },
  } = theme.useToken();

  const { gSelectedProvider } = useGetProviderFarm();
  const form = Form.useFormInstance();
  const discountType = Form.useWatch("discountType", form);
  const scope = Form.useWatch("scope", form);
  const [filterData, setFilterData] = useState<TItemsFilter>({
    formId: 10,
    orderBy: 1,
    sortBy: 1,
    maxResultCount: 10,
  });
  const debouncedFilterData = useDebounce(
    {
      ...filterData,
      providerId: gSelectedProvider?.id,
    },
    { wait: 500 },
  );
  const { data } = useGetAllItemsByPartnerForEcoFarmQuery(debouncedFilterData, {
    refetchOnMountOrArgChange: true,
    skip: !debouncedFilterData?.providerId,
  });
  const itemListData = data?.data || [];
  const Columns = useItemsFarmColumns();
  const mappedColumns = useCreation(() => {
    const { nameCombined, status, sales, stock } = Columns;
    return [{ ...nameCombined, sorter: undefined }, sales, stock, status];
  }, [gSelectedProvider, Columns]);

  return (
    <>
      <Affix offsetTop={76}>
        <div className="right-wrapper-Affix" style={{ width: 204 }}>
          <Card size="small" bodyStyle={{ padding: "6px 6px 0 6px" }}>
            <StepAnchor
              items={[
                {
                  title: i18n["Thông tin cơ bản"],
                  formFields: [["scope"], ["rangeDate"], ["name"]],
                },
                {
                  title: i18n["Thiết lập mã giảm giá"],
                  formFields: [
                    ["discountType"],
                    ["minBasketPrice"],
                    ["quantity"],
                    ["maxDistributionBuyer"],
                    ["type"],
                    ["displayChannelList"],
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
          <Form.Item
            name="scope"
            label={i18n["Loại Voucher"]}
            rules={[{ required: true }, { type: "number" }]}
          >
            <Radio.Group buttonStyle="solid">
              <Radio.Button value={TEVoucherScope.SHOP_VOUCHER}>
                {i18n["Voucher toàn Shop"]}
              </Radio.Button>
              <Radio.Button value={TEVoucherScope.PRODUCT_VOUCHER}>
                {i18n["Voucher sản phẩm"]}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Divider />
          <Form.Item
            name="name"
            label={i18n["Tên chương trình giảm giá"]}
            rules={[{ required: true }, { type: "string" }]}
          >
            <Input placeholder={i18n["Nhập vào"]} />
          </Form.Item>
          <Form.Item
            name="description"
            label={i18n["Mô tả"]}
            rules={[{ required: false }, { type: "string" }]}
          >
            <Editor theme="snow" placeholder={i18n["Nhập vào"]} />
          </Form.Item>
          <Form.Item
            name="voucherCode"
            label={`${i18n["Mã Voucher"]} (${i18n["Chỉ nhập các chữ cái từ (A-Z), số (0-9), tối đa 5 ký tự"]})`}
            rules={[
              { required: true, message: i18n["Nhập vào mã voucher"] },
              { type: "string" },
              {
                pattern: /^[A-Z0-9]{1,5}$/,
                message: i18n["Chỉ nhập các chữ cái từ (A-Z), số (0-9), tối đa 5 ký tự"],
              },
            ]}
          >
            <Input placeholder={i18n["Nhập vào"]} showCount maxLength={5} />
          </Form.Item>

          <Form.Item
            label={i18n["Thời gian sử dụng mã"]}
            labelCol={{ span: 8 }}
            labelAlign="left"
            name="rangeDate"
            help=""
            rules={[{ required: true }, { type: "array" }]}
          >
            <RangePicker
              inputReadOnly
              disabledDate={(current) => current && current < dayjs().startOf("day")}
              placeholder={[i18n["Từ"], i18n["Đến"]]}
              style={{ width: "100%" }}
              showTime={{ format: dateFormatVoucher }} // Hiển thị chỉ giờ và phút
              format={dateFormatVoucher}
            />
          </Form.Item>
        </Card>

        <Card id="thiet-lap-ma-giam-gia">
          <Typography.Title
            level={4}
            type="secondary"
            style={{ lineHeight: 1, margin: "0 0 12px" }}
          >
            {i18n["Thiết lập mã giảm giá"]}
          </Typography.Title>
          <div className="row5050" style={{ marginBottom: 5 }}>
            <Form.Item
              name="discountType"
              label={i18n["Loại giảm giá"]}
              rules={[{ required: true }, { type: "number" }]}
            >
              <Select
                style={{ width: "100%" }}
                options={[
                  { value: TEVoucherDiscountType.FIX_AMOUNT, label: i18n["Theo số tiền"] },
                  {
                    value: TEVoucherDiscountType.DISCOUNT_PERCENTAGE,
                    label: i18n["Theo phần trăm"],
                  },
                ]}
              />
            </Form.Item>

            {discountType == TEVoucherDiscountType.FIX_AMOUNT && (
              <Form.Item
                name="discountAmount"
                label={i18n["Mức giảm"]}
                rules={[{ required: true }, { type: "number" }]}
              >
                <InputNumber<number>
                  prefix="₫"
                  step={1000}
                  min={0}
                  style={{ color: colorSuccess, width: "100%" }}
                  formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => +value!.replace(/[^0-9]/g, "")}
                />
              </Form.Item>
            )}
            {discountType == TEVoucherDiscountType.DISCOUNT_PERCENTAGE && (
              <div className="row5050" style={{ marginBottom: 5 }}>
                <Form.Item
                  name="percentage"
                  label={i18n["Mức giảm"]}
                  rules={[{ required: true }, { type: "number" }]}
                  style={{ margin: 0 }}
                >
                  <InputNumber<number>
                    prefix="%"
                    style={{ color: colorSuccess, width: "100%" }}
                    min={0}
                    max={100}
                  />
                </Form.Item>
                <Form.Item
                  name="maxPrice"
                  label={i18n["Số tiền giảm tối đa"]}
                  rules={[{ required: true }, { type: "number" }]}
                >
                  <InputNumber<number>
                    prefix="₫"
                    step={1000}
                    min={0}
                    style={{ color: colorSuccess, width: "100%" }}
                    formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => +value!.replace(/[^0-9]/g, "")}
                  />
                </Form.Item>
              </div>
            )}
          </div>
          <div className="row5050" style={{ marginBottom: 5 }}>
            <Form.Item
              name="minBasketPrice"
              label={i18n["Giá trị đơn hàng tối thiểu"]}
              rules={[{ required: true }, { type: "number" }]}
            >
              <InputNumber<number>
                prefix="₫"
                min={0}
                step={1000}
                style={{ color: colorSuccess, width: "100%" }}
                formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => +value!.replace(/[^0-9]/g, "")}
              />
            </Form.Item>
            <Form.Item
              name="quantity"
              label={i18n["Số lượng voucher"]}
              rules={[{ required: true }, { type: "number" }]}
            >
              <InputNumber<number> style={{ color: colorSuccess, width: "100%" }} min={0} />
            </Form.Item>
          </div>
          <div className="row5050" style={{ marginBottom: 5 }}>
            <Form.Item
              name="maxDistributionBuyer"
              label={i18n["Số lượng voucher 1 người có thể nhận"]}
              rules={[{ required: true }, { type: "number" }]}
            >
              <InputNumber<number> style={{ color: colorSuccess, width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item
              name="type"
              label={i18n["Voucher vận chuyển/giảm giá sản phẩm"]}
              rules={[{ required: true }, { type: "number" }]}
            >
              <Select
                style={{ width: "100%" }}
                options={[
                  { value: TEVoucherType.VOUCHER_SHIPPING, label: i18n["Vận chuyển"] },
                  {
                    value: TEVoucherType.VOUCHER_DISCOUNT,
                    label: i18n["Giảm giá sản phẩm"],
                  },
                ]}
              />
            </Form.Item>
          </div>
          <Form.Item
            name="displayChannelList"
            label={i18n["Nơi voucher được hiển thị"]}
            rules={[{ required: true }, { type: "array" }]}
          >
            <Select
              style={{ width: "100%" }}
              mode="multiple"
              allowClear
              options={[
                { value: TEVoucherChannelDisplay.SHOP, label: i18n["Màn trong shop"] },
                { value: TEVoucherChannelDisplay.ORDER_PAGE, label: i18n["Màn đặt sản phẩm"] },
                { value: TEVoucherChannelDisplay.FEED, label: i18n["Sự kiện"] },
                { value: TEVoucherChannelDisplay.LIVE_STREAMING, label: i18n["Live streaming"] },
              ]}
            />
          </Form.Item>
          {scope == TEVoucherScope.PRODUCT_VOUCHER && (
            <>
              <Typography.Title
                level={4}
                type="secondary"
                style={{ lineHeight: 1, margin: "0 0 12px" }}
              >
                <span style={{ color: "#ff4d4f" }}>* </span>
                {i18n["Tất cả sản phẩm"]}
              </Typography.Title>
              <div>
                {itemListData.length > 0 && !!debouncedFilterData.providerId ? (
                  <Form.Item
                    name="listItems"
                    rules={[
                      { required: true, message: "Vui lòng chọn sản phẩm" },
                      { type: "array" },
                    ]}
                  >
                    <ItemTableStyled
                      showSorterTooltip={false}
                      columns={mappedColumns as any[]}
                      dataSource={itemListData}
                      pagination={false}
                      size="large"
                      rowSelection={{
                        columnWidth: 32,
                        onChange: (selectCheck) => {
                          form.setFieldValue("listItems", selectCheck as any[]);
                        },
                        selectedRowKeys: form.getFieldValue("listItems"),
                        getCheckboxProps: (item: any) => ({
                          disabled: ![TItemStatus.ACTIVATED].includes(item.status),
                        }),
                      }}
                      rowKey={(item: any) => item.id}
                      scroll={{ x: true }}
                    />
                  </Form.Item>
                ) : (
                  <Empty
                    className="list-empty"
                    imageStyle={{ height: 144 }}
                    description={
                      <Typography.Text ellipsis type="secondary">
                        {!debouncedFilterData.providerId
                          ? i18n["Hãy chọn gian hàng trước"]
                          : i18n["Không tìm thấy sản phẩm phù hợp"]}
                      </Typography.Text>
                    }
                  />
                )}
              </div>
            </>
          )}
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

export default VoucherFarmForm;

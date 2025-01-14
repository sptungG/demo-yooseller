import { Divider, Empty, Form, Input, InputNumber, Space, Table, Typography, theme } from "antd";
import { BsPlusLg } from "react-icons/bs";
import { MdOutlineInbox, MdRemove } from "react-icons/md";
import Button from "src/components/button/Button";
import InputTags from "src/components/field/InputTags";
import { TierItemStyled } from "src/components/shared/ItemStyled";

import styled from "@emotion/styled";
import { useUpdateEffect } from "ahooks";
import { useRouter } from "next/router";
import { useId } from "react";
import { TbChevronDown, TbChevronUp, TbTrash } from "react-icons/tb";
import useChangeLocale from "src/hooks/useChangeLocale";
import { TItemModel } from "src/types/item.types";
import { allCombinedCases } from "src/utils/utils";
import ImageUploadCombined from "./ImageUploadCombined";

type TItemModelCombinedProps = {};

const ItemModelCombined = ({}: TItemModelCombinedProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const {
    query: { itemId },
  } = useRouter();

  const {
    token: { colorSuccess, colorTextPlaceholder },
  } = theme.useToken();

  const form = Form.useFormInstance();
  const formTierVariationListWatch = Form.useWatch("tierVariationList", form);
  const formModelListWatch = Form.useWatch("modelList", form);
  useUpdateEffect(() => {
    const tierVariationList = form.getFieldValue("tierVariationList");
    if (!itemId && !!tierVariationList?.length) {
      const combinedTierVariationList = !!tierVariationList?.length
        ? allCombinedCases(
            tierVariationList.map((item: any) =>
              item?.optionList?.map((_: any, index: number) => index),
            ),
          )
        : [];
      const newDefaultItemModelList: Partial<TItemModel>[] = combinedTierVariationList.map(
        (options, index) => {
          const foundModelItem = form
            .getFieldValue("modelList")
            ?.find((item: any) => JSON.stringify(item?.tierIndex) === JSON.stringify(options));
          const mappedName = options
            .map((o, index) => tierVariationList[index].optionList[o])
            .join(", ");
          if (!!foundModelItem)
            return {
              ...foundModelItem,
              tierIndex: options,
              name: mappedName,
            };
          return {
            currentPrice: undefined,
            originalPrice: undefined,
            imageUrl: undefined,
            isDefault: false,
            itemId: 0,
            sku: "",
            stock: 0,
            tenantId: 0,
            tierIndex: options,
            name: mappedName,
          };
        },
      );
      form.setFieldValue(["modelList"], newDefaultItemModelList);
    }
  }, [formTierVariationListWatch, itemId]);

  return (
    <>
      <Form.List name="tierVariationList">
        {(fields, { add, remove }) => (
          <div
            className={`tierVariationList-wrapper ${!!fields.length ? "" : "empty"}`}
            style={{ padding: "0 24px" }}
          >
            {fields.map((field, index) => (
              <TierItemStyled
                key={uid + "tierVariationList" + field.key}
                style={{ marginBottom: field.name < 3 ? 12 : 0 }}
              >
                <Form.Item
                  label={index === 0 ? i18n["Tên"] : undefined}
                  name={[field.name, "name"]}
                  rules={[{ required: true }]}
                  className="form-item-name hide-error"
                >
                  <Input
                    disabled={!!itemId}
                    placeholder={`${i18n["Tên phân loại"]} ${index + 1}...`}
                    style={{ height: 42 }}
                  />
                </Form.Item>
                <Form.Item
                  label={index === 0 ? i18n["Giá trị"] : undefined}
                  className="form-item-optionList hide-error"
                  name={[field.name, "optionList"]}
                  rules={[{ required: true }]}
                >
                  <InputTags
                    disabled={!!itemId}
                    placeholder={`${i18n["Giá trị phân loại"]} ${index + 1}...`}
                  />
                </Form.Item>
                <Form.Item
                  className="hide-error"
                  label={index === 0 ? <div style={{ height: 10 }}></div> : undefined}
                >
                  <Button
                    disabled={!!itemId}
                    type="dashed"
                    onClick={() => remove(field.name)}
                    icon={<MdRemove size={20} />}
                  ></Button>
                </Form.Item>
              </TierItemStyled>
            ))}
            {fields.length < 3 && (
              <Button
                disabled={!!itemId}
                type="dashed"
                onClick={() => add({ optionList: [], name: "" })}
                block
                icon={<BsPlusLg />}
              >
                {i18n["Thêm phân loại"]}
              </Button>
            )}
          </div>
        )}
      </Form.List>
      {!!formTierVariationListWatch?.length ? (
        <>
          <div style={{ padding: "0 24px" }}>
            <Divider style={{ margin: "28px 0 12px 0" }} />
            <Typography.Paragraph type="secondary" style={{ fontSize: 16, marginBottom: 14 }}>
              {i18n["Danh sách phân loại hàng"]}
            </Typography.Paragraph>
          </div>
          <Form.List
            name="modelList"
            rules={[
              {
                validator: async (_, names) => {
                  if (!names || names.length < 1) {
                    return Promise.reject(new Error(i18n["Tối thiểu 01 phiên bản"]));
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove, move }, { errors }) => (
              <>
                {!fields?.length ? (
                  <div style={{ padding: "0 24px" }}>
                    <Empty
                      className="bordered"
                      style={{ borderRadius: 8, marginBottom: 20 }}
                      imageStyle={{ height: 96 }}
                      description={i18n["Có thể điều chỉnh sau khi thêm phân loại"]}
                    />
                  </div>
                ) : (
                  <TableStyled
                    dataSource={fields}
                    pagination={false}
                    rowKey="key"
                    size="large"
                    scroll={{ x: 766 }}
                    footer={() => <div style={{ height: 20 }}></div>}
                    columns={[
                      {
                        title: (
                          <Typography.Text style={{ padding: "0 0 0 8px" }}>
                            {`Sản phẩm x${formModelListWatch?.length || 0}`}
                          </Typography.Text>
                        ),
                        ellipsis: true,
                        key: "imageUrl-name",
                        render: (text, record, index) => {
                          const modelData = formModelListWatch[index];
                          return (
                            <Space align="center" style={{ padding: "0 0 0 8px" }}>
                              <Form.Item
                                name={[record.name, "imageUrl"]}
                                rules={[{ required: true }]}
                                className="hide-error"
                              >
                                <ImageUploadCombined
                                  modalProps={{
                                    title: `${i18n["Ảnh phiên bản"]} • ${modelData?.name}`,
                                  }}
                                  width="60px"
                                  height="60px"
                                  icon={<MdOutlineInbox size={24} />}
                                  desc01={<></>}
                                  desc02={<></>}
                                />
                              </Form.Item>
                              <Space direction="vertical">
                                <Typography.Title
                                  level={5}
                                  ellipsis
                                  className="name"
                                  delete={!modelData?.stock}
                                  style={{ margin: 0, lineHeight: 1.1 }}
                                >
                                  {modelData?.name}
                                </Typography.Title>
                                {!modelData?.stock && (
                                  <Typography.Text type="danger" style={{ opacity: 0.6 }}>
                                    {i18n["Hết hàng"]}
                                  </Typography.Text>
                                )}
                              </Space>
                            </Space>
                          );
                        },
                      },
                      {
                        title: "Giá bán",
                        key: "currentPrice",
                        align: "right",
                        //ellipsis: true,
                        width: 160,
                        render: (text, record, index) => {
                          return (
                            <>
                              <Form.Item
                                name={[record.name, "currentPrice"]}
                                className="hide-error"
                                rules={[{ required: true, type: "number", min: 0 }]}
                                getValueFromEvent={(e) => {
                                  form.setFieldValue(
                                    ["modelList", record.name, "originalPrice"],
                                    e,
                                  );
                                  return e;
                                }}
                              >
                                <InputNumber<number>
                                  placeholder={"Nhập vào"}
                                  variant={"borderless"}
                                  controls={false}
                                  min={0}
                                  step={1000}
                                  suffix={"₫"}
                                  formatter={(value) =>
                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  }
                                  parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
                                  style={{ width: "100%" }}
                                />
                              </Form.Item>
                              <Form.Item noStyle name={[record.name, "originalPrice"]} hidden>
                                <input type="number" />
                              </Form.Item>
                            </>
                          );
                        },
                      },
                      {
                        title: "Số lượng",
                        key: "stock",
                        align: "right",
                        width: 120,
                        render: (text, record, index) => {
                          return (
                            <Form.Item
                              name={[record.name, "stock"]}
                              className="hide-error"
                              rules={[{ required: true, type: "number", min: 0 }]}
                            >
                              <InputNumber<number>
                                rootClassName="input-stock"
                                controls={false}
                                min={0}
                                placeholder={"Nhập vào"}
                                formatter={(value) =>
                                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                                parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
                                variant={"borderless"}
                              />
                            </Form.Item>
                          );
                        },
                      },

                      {
                        title: "SKU",
                        key: "sku",
                        align: "right",
                        width: 120,
                        render: (text, record, index) => {
                          return (
                            <Form.Item name={[record.name, "sku"]} className="hide-error">
                              <Input
                                style={{
                                  padding: 0,
                                  textAlign: "right",
                                }}
                                placeholder={`Nhập vào`}
                                variant="borderless"
                                autoComplete="off"
                              />
                            </Form.Item>
                          );
                        },
                      },
                      {
                        title: "Hành động",
                        key: "actions",
                        align: "center",
                        width: 120,
                        fixed: "right",
                        render: (text, record, index) => {
                          return (
                            <Space>
                              {!itemId && (
                                <Button
                                  type="dashed"
                                  onClick={() => {
                                    form.setFieldValue(["modelList", record.name, "stock"], 0);
                                  }}
                                  icon={<TbTrash size={20} />}
                                  disabled={!!itemId}
                                ></Button>
                              )}
                              <Space.Compact direction="vertical" size="small">
                                <Button
                                  type="text"
                                  onClick={() => move(record.name, record.name - 1)}
                                  icon={<TbChevronUp size={20} />}
                                ></Button>
                                <Button
                                  type="text"
                                  onClick={() => move(record.name, record.name + 1)}
                                  icon={<TbChevronDown size={20} />}
                                ></Button>
                              </Space.Compact>
                            </Space>
                          );
                        },
                      },
                    ]}
                  />
                )}
              </>
            )}
          </Form.List>
        </>
      ) : (
        <Form.List name="modelList">{() => <></>}</Form.List>
      )}
    </>
  );
};
const TableStyled = styled(Table)`
  .ant-input-number-input::placeholder,
  .ant-input::placeholder {
    font-size: 14.2px;
  }
  .input-stock {
    width: 100%;
    .ant-input-number-input {
      text-align: right;
      padding: 0;
    }
  }
  .input-price-wrapper {
    width: 100%;
    .ant-input-number {
      padding-right: 15px;
    }
    .ant-input-number-input {
      text-align: right;
      padding: 0;
    }
    .ant-input-number-suffix {
      margin: 0;
      font-size: 18px;
      opacity: 0.6;
    }
  }
  .ant-input-number-status-error {
    .ant-input-number-prefix {
      color: #ff4d4f;
    }
    input::placeholder {
      color: #ff4d50b8;
    }
  }
  .ant-table-footer {
    background-color: transparent;
  }
`;

export default ItemModelCombined;

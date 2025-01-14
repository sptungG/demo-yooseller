import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useUpdateEffect } from "ahooks";
import { Checkbox, Empty, Form, Input, InputNumber, Radio, Select, Typography } from "antd";
import { Fragment, useId } from "react";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useGetAllItemAttributesQuery } from "src/redux/query/farm.query";
import { TIAInputType } from "src/types/item.types";
import { vietnameseSlug } from "src/utils/utils";
import DatePicker from "../picker/DatePicker";
import Editor from "./Editor";

type TItemEcofarmAttributesCombinedProps = {};

const ItemEcofarmAttributesCombined = ({}: TItemEcofarmAttributesCombinedProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const form = Form.useFormInstance();
  const formCategoryIdWatch = Form.useWatch("categoryId", form);
  const { data: dataItemAttributesRes } = useGetAllItemAttributesQuery(
    !!formCategoryIdWatch ? { categoryId: formCategoryIdWatch } : skipToken,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    },
  );
  const dataItemAttributes = dataItemAttributesRes?.data || [];

  useUpdateEffect(() => {
    form.resetFields(["attributeList"]);
  }, [dataItemAttributes]);

  return (
    <ItemEcofarmAttributesCombinedStyled>
      <Form.List
        key={uid + "attributeList"}
        name="attributeList"
        initialValue={dataItemAttributes.map((item) => ({
          id: item.id,
          unitList: item.unitList,
          valueList: item.valueList,
        }))}
      >
        {(fields) =>
          !!formCategoryIdWatch ? (
            !!fields.length ? (
              <>
                <Typography.Paragraph type="secondary">
                  {i18n["Điền thông tin thuộc tính để tăng mức độ hiển thị cho sản phẩm"]}
                </Typography.Paragraph>
                <div className="wrapper">
                  {fields.map((field, index) => {
                    const item = dataItemAttributes[field.name];
                    if (!!item?.inputType)
                      switch (item.inputType) {
                        case TIAInputType.Input:
                          return (
                            <Fragment key={uid + item.id + "Input" + index}>
                              <Form.Item name={[field.name, "id"]} hidden>
                                <Input />
                              </Form.Item>
                              <Form.Item name={[field.name, "unitList"]} hidden>
                                <Input />
                              </Form.Item>
                              <Form.Item
                                name={[field.name, "valueList", 0]}
                                label={item.displayName || item.name}
                                rules={[{ required: false }]}
                                // rules={[{ required: item.isRequired }]}
                              >
                                <Input placeholder={item.name} />
                              </Form.Item>
                            </Fragment>
                          );
                        case TIAInputType.TextArea:
                          return (
                            <Fragment key={uid + item.id + "TextArea" + index}>
                              <Form.Item name={[field.name, "id"]} hidden>
                                <Input />
                              </Form.Item>
                              <Form.Item name={[field.name, "unitList"]} hidden>
                                <Input />
                              </Form.Item>
                              <Form.Item
                                name={[field.name, "valueList", 0]}
                                label={item.displayName}
                                rules={[{ required: false }]}
                                // rules={[{ required: item.isRequired }]}
                              >
                                <Input.TextArea
                                  placeholder={item.name}
                                  autoSize={{ minRows: 1, maxRows: 3 }}
                                />
                              </Form.Item>
                            </Fragment>
                          );
                        case TIAInputType.InputNumber:
                          return (
                            <Fragment key={uid + item.id + "InputNumber" + index}>
                              <Form.Item name={[field.name, "id"]} hidden>
                                <Input />
                              </Form.Item>
                              <Form.Item name={[field.name, "unitList"]} hidden>
                                <Input />
                              </Form.Item>
                              <Form.Item
                                name={[field.name, "valueList", 0]}
                                label={item.displayName}
                                rules={[{ required: false }]}
                                // rules={[{ required: item.isRequired }]}
                              >
                                <InputNumber<number>
                                  min={0}
                                  placeholder={item.name}
                                  style={{ width: "100%" }}
                                />
                              </Form.Item>
                            </Fragment>
                          );
                        case TIAInputType.DateTime:
                          return (
                            <Fragment key={uid + item.id + "DateTime" + index}>
                              <Form.Item name={[field.name, "id"]} hidden>
                                <Input />
                              </Form.Item>
                              <Form.Item name={[field.name, "unitList"]} hidden>
                                <Input />
                              </Form.Item>
                              <Form.Item
                                name={[field.name, "valueList", 0]}
                                label={item.displayName}
                                rules={[{ required: false }]}
                                // rules={[{ required: item.isRequired }]}
                              >
                                <DatePicker
                                  format={"DD-MM-YYYY"}
                                  style={{ width: "100%" }}
                                  placeholder={item.name}
                                />
                              </Form.Item>
                            </Fragment>
                          );
                        case TIAInputType.Select:
                          return (
                            <Fragment key={uid + item.id + "Select" + index}>
                              <Form.Item name={[field.name, "id"]} hidden>
                                <Input />
                              </Form.Item>
                              <Form.Item name={[field.name, "unitList"]} hidden>
                                <Input />
                              </Form.Item>
                              <Form.Item
                                name={[field.name, "valueList", 0]}
                                label={item.displayName}
                                rules={[{ required: false }]}
                                // rules={[{ required: item.isRequired }]}
                              >
                                <Select
                                  placeholder={item.displayName}
                                  options={(item?.valueList || []).map((item) => ({
                                    label: item,
                                    value: item,
                                  }))}
                                  allowClear
                                  showSearch
                                  optionFilterProp="children"
                                  filterOption={(input, option) =>
                                    vietnameseSlug(String(option?.label || ""), " ").indexOf(
                                      vietnameseSlug(input, " "),
                                    ) >= 0
                                  }
                                />
                              </Form.Item>
                            </Fragment>
                          );
                        case TIAInputType.MultiSelect:
                          return (
                            <Fragment key={uid + item.id + "MultiSelect" + index}>
                              <Form.Item name={[field.name, "id"]} hidden>
                                <Input />
                              </Form.Item>
                              <Form.Item name={[field.name, "unitList"]} hidden>
                                <Input />
                              </Form.Item>
                              <Form.Item
                                name={[field.name, "valueList"]}
                                label={item.displayName}
                                rules={[{ required: false }]}
                                // rules={[{ required: item.isRequired }]}
                              >
                                <Select
                                  mode="multiple"
                                  placeholder={item.name}
                                  options={(item?.valueList || []).map((item) => ({
                                    label: item,
                                    value: item,
                                  }))}
                                  allowClear
                                  showSearch
                                  optionFilterProp="children"
                                  filterOption={(input, option) =>
                                    vietnameseSlug(String(option?.label || ""), " ").indexOf(
                                      vietnameseSlug(input, " "),
                                    ) >= 0
                                  }
                                />
                              </Form.Item>
                            </Fragment>
                          );
                        case TIAInputType.Checkbox:
                          return (
                            <Fragment key={uid + item.id + "Checkbox" + index}>
                              <Form.Item name={[field.name, "id"]} hidden>
                                <Input />
                              </Form.Item>
                              <Form.Item name={[field.name, "unitList"]} hidden>
                                <Input />
                              </Form.Item>
                              <Form.Item
                                name={[field.name, "valueList"]}
                                label={item.displayName}
                                rules={[{ required: false }]}
                                // rules={[{ required: item.isRequired }]}
                              >
                                {item?.valueList?.length ? (
                                  <Checkbox.Group
                                    options={(item?.valueList || []).map((item) => ({
                                      label: item,
                                      value: item,
                                    }))}
                                  />
                                ) : (
                                  <Empty
                                    className="bordered"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                  />
                                )}
                              </Form.Item>
                            </Fragment>
                          );
                        case TIAInputType.Radio:
                          return (
                            <Fragment key={uid + item.id + "Radio" + index}>
                              <Form.Item name={[field.name, "id"]} hidden>
                                <Input />
                              </Form.Item>
                              <Form.Item name={[field.name, "unitList"]} hidden>
                                <Input />
                              </Form.Item>
                              <Form.Item
                                name={[field.name, "valueList", 0]}
                                label={item.displayName}
                                rules={[{ required: false }]}
                                // rules={[{ required: item.isRequired }]}
                              >
                                {item?.valueList?.length ? (
                                  <Radio.Group
                                    options={(item?.valueList || []).map((item) => ({
                                      label: item,
                                      value: item,
                                    }))}
                                  />
                                ) : (
                                  <Empty
                                    className="bordered"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                  />
                                )}
                              </Form.Item>
                            </Fragment>
                          );
                        case TIAInputType.Editor:
                          return (
                            <Fragment key={uid + item.id + "Editor" + index}>
                              <Form.Item name={[field.name, "id"]} hidden>
                                <Input />
                              </Form.Item>
                              <Form.Item name={[field.name, "unitList"]} hidden>
                                <Input />
                              </Form.Item>
                              <Form.Item
                                name={[field.name, "valueList", 0]}
                                label={item.displayName}
                                rules={[{ required: false }]}
                                // rules={[{ required: item.isRequired }]}
                              >
                                <Editor theme="snow" placeholder={item.name} />
                              </Form.Item>
                            </Fragment>
                          );
                        default:
                          return <></>;
                      }
                  })}
                </div>
              </>
            ) : (
              <Empty
                className="bordered"
                description="Danh mục này chưa có thuộc tính"
                style={{ borderRadius: 8 }}
              />
            )
          ) : (
            <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
              {i18n["Có thể điều chỉnh sau khi chọn"]}{" "}
              <Typography.Text strong type="secondary">
                {i18n["Danh mục"].toLowerCase()}
              </Typography.Text>
            </Typography.Paragraph>
          )
        }
      </Form.List>
    </ItemEcofarmAttributesCombinedStyled>
  );
};
const ItemEcofarmAttributesCombinedStyled = styled.div`
  .wrapper {
    --f-columns: 2;
    --f-gap: 24px;
    display: flex;
    flex-wrap: wrap;
    margin-left: calc(-1 * var(--f-gap));
    margin-bottom: calc(-1 * var(--f-gap));
    & > * {
      margin-left: var(--f-gap);
      margin-bottom: var(--f-gap);
      width: calc((100% / var(--f-columns) - var(--f-gap)));
    }
  }
`;

export default ItemEcofarmAttributesCombined;

import useApp from "@/hooks/useApp";
import useChangeLocale from "@/hooks/useChangeLocale";
import { TItem, TItem2, TItemModel2 } from "@/types/item.types";
import { TDiscountType } from "@/types/voucher.types";
import { formatNumber } from "@/utils/utils";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Empty, Flex, Form, InputNumber, Select, Switch, Typography } from "antd";
import { useEffect, useId, useState } from "react";
import { BsPlusLg, BsXLg } from "react-icons/bs";
import { TbTrash } from "react-icons/tb";
import Avatar, { AvatarGroup } from "../avatar/Avatar";
import Button from "../button/Button";
import Modal from "../modal/Modal";
import StyledTable from "../table/StyledTable";
import ItemsSelect from "./ItemsSelect";

type TValue = {
  itemModelId: number;
  stock: number;
  discountAmount: number;
  percent: number;
};

type TFlashSaleItemsProps = {
  providerId?: number;
  onReset?: () => void;
};

export type TListItem = Omit<TItem2, "modelList"> & {
  discountType: number;
  maxDistributionBuyer: number;
  modelList: (Omit<TItemModel2, "stock"> & {
    stock: number;
    originalStock: number;
    discountAmount: number;
    percent: number;
  })[];
};

const FlashSaleItems = ({ providerId, onReset }: TFlashSaleItemsProps) => {
  const uid = useId();
  const { message } = useApp();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const { i18n } = useChangeLocale();
  const form = Form.useFormInstance();
  const formListItem = Form.useWatch("listItems", form) as TListItem[];

  useEffect(() => {
    if (!formListItem?.length) setSelectedItems([]);
  }, [formListItem]);

  return (
    <Form.List
      name="listItems"
      initialValue={[]}
      rules={[
        {
          validator: async (_, names) => {
            if (!names || names.length < 1) {
              return Promise.reject(new Error(i18n["Tối thiểu 01"]));
            }
            if (!names || names.length > 9) {
              return Promise.reject(new Error(i18n["Tối đa 10"]));
            }
          },
        },
      ]}
    >
      {(fields, { add, remove, move }, { errors }) => (
        <>
          <Button
            icon={<BsPlusLg size={16} style={{ margin: "0 -2px 0 -6px" }} />}
            style={{ fontSize: 14, margin: "0 0 10px" }}
            onClick={() => setIsOpen(true)}
          >{`Đã chọn ${fields?.length || 0} sản phẩm cho khung giờ này`}</Button>

          {!fields?.length ? (
            <div style={{ padding: "0 0" }}>
              <Empty
                className="bordered"
                style={{ borderRadius: 8, marginBottom: 20 }}
                imageStyle={{ height: 96 }}
                description={i18n["Có thể điều chỉnh sau khi thêm sản phẩm"]}
              />
            </div>
          ) : (
            <TableStyled
              dataSource={fields}
              pagination={false}
              rowKey="key"
              size="middle"
              key={String(formListItem)}
              scroll={{ x: "100%" }}
              css={css({
                border: "1px solid #f0f0f0",
                "& th.ant-table-cell": { fontSize: 14, padding: "8px 8px !important" },
              })}
              rowClassName={"parent-row"}
              footer={() => <div style={{ height: 20 }}></div>}
              expandable={{
                defaultExpandAllRows: true,
                columnWidth: 26,
                indentSize: 0,
                expandedRowRender: (pRecord, pIndex, indent, expanded) => {
                  const listItem = formListItem[pIndex];
                  const modelList = listItem.modelList;
                  return (
                    <Form.List name={[pRecord.name, "modelList"]}>
                      {(subFields, subOpt) => (
                        <TableStyled
                          rowKey="key"
                          size="middle"
                          // showHeader={false}
                          dataSource={subFields}
                          pagination={false}
                          css={css({
                            borderLeft: "1px solid #f0f0f0",
                            "& .ant-table": { marginInline: "20px -8px !important" },
                            "& th.ant-table-cell": {
                              fontSize: "12px !important",
                              padding: "8px 8px !important",
                            },
                          })}
                          scroll={{ x: "100%" }}
                          rowSelection={{
                            columnWidth: 24,
                            // getCheckboxProps: (item: any) => {},
                          }}
                          columns={[
                            {
                              title: "Phân loại hàng",
                              ellipsis: true,
                              width: 144,
                              key: "modelList-name",
                              dataIndex: "name",
                              render: (text, record, index) => {
                                const modelData = modelList[index];
                                return (
                                  <Flex
                                    align="center"
                                    key={String(modelData)}
                                    gap={8}
                                    style={{ maxWidth: 240 }}
                                  >
                                    <Avatar
                                      src={modelData.imageUrl}
                                      shape="square"
                                      size={32}
                                      style={{
                                        flexShrink: 0,
                                        border: "1px solid rgba(0,0,0,0.05)",
                                      }}
                                    >
                                      {record.name?.[0]}
                                    </Avatar>
                                    <Typography.Text
                                      strong
                                      delete={!modelData?.isFlashSale}
                                      ellipsis
                                      type="secondary"
                                    >
                                      {modelData.name}
                                    </Typography.Text>
                                  </Flex>
                                );
                              },
                            },
                            {
                              title: "Giá gốc",
                              ellipsis: true,
                              align: "right",
                              key: "modelList-currentPrice",
                              dataIndex: "currentPrice",
                              width: 100,
                              render: (text, record, index) => {
                                const modelData = modelList[index];
                                return (
                                  <Typography.Text
                                    ellipsis
                                    type="secondary"
                                    style={{ fontSize: 13 }}
                                  >
                                    {formatNumber(modelData.currentPrice)}₫
                                  </Typography.Text>
                                );
                              },
                            },
                            {
                              title: (
                                <Typography.Text style={{ fontSize: 12 }}>
                                  Giá khuyến mãi
                                </Typography.Text>
                              ),
                              key: "modelList-discountAmount",
                              align: "right",
                              ellipsis: true,
                              width: 140,
                              render: (text, record, index) => {
                                const modelData = modelList[index];
                                return (
                                  <Flex align="center" justify="flex-end">
                                    {listItem.discountType === TDiscountType.FIX_AMOUNT && (
                                      <Form.Item
                                        name={[record.name, "discountAmount"]}
                                        className="hide-error"
                                        preserve={false}
                                        rules={[{ required: true, type: "number", min: 0 }]}
                                      >
                                        <InputNumber<number>
                                          changeOnBlur={false}
                                          placeholder={"Nhập vào"}
                                          variant={"borderless"}
                                          controls={false}
                                          min={0}
                                          step={1000}
                                          max={modelData.currentPrice}
                                          suffix={"₫"}
                                          formatter={(value) =>
                                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                          }
                                          parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
                                          style={{ width: "110px", margin: "0 -11px 0 0" }}
                                        />
                                      </Form.Item>
                                    )}

                                    {listItem.discountType ===
                                      TDiscountType.DISCOUNT_PERCENTAGE && (
                                      <Form.Item
                                        name={[record.name, "percent"]}
                                        className="hide-error"
                                        preserve={false}
                                        rules={[{ required: true, type: "number", min: 0 }]}
                                      >
                                        <InputNumber<number>
                                          changeOnBlur={false}
                                          placeholder={"Nhập vào"}
                                          variant={"borderless"}
                                          controls={false}
                                          min={0}
                                          max={99}
                                          step={1}
                                          suffix={"% giảm"}
                                          formatter={(value) =>
                                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                          }
                                          parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
                                          style={{
                                            width: 130,
                                            fontSize: 12,
                                            margin: "0 -11px 0 0",
                                          }}
                                        />
                                      </Form.Item>
                                    )}
                                  </Flex>
                                );
                              },
                            },
                            {
                              title: (
                                <Typography.Text style={{ fontSize: 11 }}>
                                  SL khuyến mãi
                                </Typography.Text>
                              ),
                              key: "modelList-stock",
                              align: "right",
                              ellipsis: true,
                              width: 96,
                              render: (text, record, index) => {
                                const modelData = modelList[index];
                                return (
                                  <Form.Item
                                    name={[record.name, "stock"]}
                                    className="hide-error"
                                    rules={
                                      !!modelData.originalStock
                                        ? [{ required: false }]
                                        : [{ required: true, type: "number", min: 0 }]
                                    }
                                  >
                                    <InputNumber<number>
                                      changeOnBlur={false}
                                      placeholder={
                                        !!modelData.originalStock ? "Nhập vào" : "Hết hàng"
                                      }
                                      rootClassName="input-stock"
                                      variant={"borderless"}
                                      controls={false}
                                      min={0}
                                      step={1}
                                      disabled={!modelData.originalStock}
                                      max={modelData.originalStock}
                                      formatter={(value) =>
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                      }
                                      parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
                                      style={{ width: "100%", padding: 0 }}
                                    />
                                  </Form.Item>
                                );
                              },
                            },
                            {
                              title: (
                                <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                                  Kho hàng
                                </Typography.Text>
                              ),
                              key: "modelList-originalStock",
                              align: "left",
                              ellipsis: true,
                              width: 70,
                              render: (text, record, index) => {
                                const modelData = modelList[index];
                                return (
                                  <Typography.Text type="secondary">
                                    {modelData.originalStock}
                                  </Typography.Text>
                                );
                              },
                            },
                            {
                              title: (
                                <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                                  Bật / Tắt
                                </Typography.Text>
                              ),
                              key: "modelList-originalStock",
                              align: "center",
                              width: 80,
                              ellipsis: true,
                              render: (text, record, index) => {
                                const modelData = modelList[index];
                                return (
                                  <Form.Item
                                    initialValue={!!modelData?.originalStock}
                                    name={[record.name, "isFlashSale"]}
                                    className="hide-error"
                                  >
                                    <Switch size="default" disabled={!modelData?.originalStock} />
                                  </Form.Item>
                                );
                              },
                            },
                          ]}
                        />
                      )}
                    </Form.List>
                  );
                },
              }}
              columns={[
                {
                  title: "Sản phẩm",
                  ellipsis: true,
                  key: "imageUrl-name",
                  width: 210,
                  render: (text, record, index) => {
                    const modelData = formListItem[index];
                    return (
                      <Flex align="center" gap={4} style={{ maxWidth: 300 }}>
                        {!!modelData.imageUrlList?.length ? (
                          <AvatarGroup
                            maxCount={1}
                            maxPopoverPlacement="bottom"
                            style={{ flexShrink: 0, marginLeft: -1 }}
                            maxStyle={{ width: 24, height: 24, fontSize: 12, marginTop: 4 }}
                          >
                            {modelData.imageUrlList.map((url, index) => (
                              <Avatar
                                key={uid + "AvatarGroupItem" + index}
                                size={index > 0 ? 56 : 32}
                                shape="square"
                                src={url}
                                style={{
                                  border: "1px solid rgba(0,0,0,0.05)",
                                }}
                              >
                                {modelData?.name?.[0] || "---"}
                              </Avatar>
                            ))}
                          </AvatarGroup>
                        ) : (
                          <Avatar
                            key={uid + "AvatarGroupItem" + index}
                            size={32}
                            shape="square"
                            src={modelData.imageUrlList?.[0]}
                            style={{
                              border: "1px solid rgba(0,0,0,0.05)",
                            }}
                          >
                            {modelData?.name?.[0] || "---"}
                          </Avatar>
                        )}
                        <Flex vertical flex={"1 1 auto"} style={{ minWidth: 0 }}>
                          <Typography.Text
                            strong
                            ellipsis
                            delete={!modelData?.stock}
                            style={{ margin: 0, lineHeight: 1.1, maxWidth: "100%" }}
                          >
                            {modelData?.name}
                          </Typography.Text>
                        </Flex>
                      </Flex>
                    );
                  },
                },
                {
                  title: <Typography.Text style={{ fontSize: 12 }}>Loại giảm giá</Typography.Text>,
                  key: "discountType",
                  align: "right",
                  width: 155,
                  ellipsis: true,
                  render: (text, record, index) => {
                    const modelData = formListItem[index];
                    return (
                      <Form.Item
                        initialValue={TDiscountType.FIX_AMOUNT}
                        name={[record.name, "discountType"]}
                        className="hide-error"
                        rules={[{ required: true, type: "number", min: 0 }]}
                      >
                        <Select
                          placement="bottomRight"
                          variant="borderless"
                          options={[
                            { value: TDiscountType.FIX_AMOUNT, label: "Theo số tiền" },
                            { value: TDiscountType.DISCOUNT_PERCENTAGE, label: "Theo phần trăm" },
                          ]}
                          placeholder={"Chọn loại"}
                          style={{
                            maxWidth:
                              modelData.discountType === TDiscountType.FIX_AMOUNT ? 120 : 142,
                            margin: "0 -11px 0 0",
                          }}
                          popupMatchSelectWidth={false}
                        />
                      </Form.Item>
                    );
                  },
                },
                {
                  title: (
                    <Typography.Text style={{ fontSize: 12 }}>Giới hạn đặt hàng</Typography.Text>
                  ),
                  key: "maxDistributionBuyer",
                  align: "right",
                  width: 150,
                  ellipsis: true,
                  render: (text, record, index) => {
                    return (
                      <Form.Item
                        name={[record.name, "maxDistributionBuyer"]}
                        className="hide-error"
                        rules={[{ required: false, type: "number" }]}
                      >
                        <InputNumber<number>
                          changeOnBlur={false}
                          rootClassName="input-stock"
                          controls={false}
                          min={0}
                          placeholder={"Không giới hạn"}
                          variant={"borderless"}
                        />
                      </Form.Item>
                    );
                  },
                },
                {
                  title: (
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      Hành động
                    </Typography.Text>
                  ),
                  key: "actions",
                  align: "center",
                  width: 72,
                  ellipsis: true,
                  render: (text, record, index) => {
                    return (
                      <Button
                        size="middle"
                        type="dashed"
                        onClick={() => {
                          remove(index);
                          message.error("Xóa thành công");
                        }}
                        icon={<TbTrash size={20} />}
                      ></Button>
                    );
                  },
                },
              ]}
            />
          )}

          <Modal
            onOk={() => {
              form.setFieldValue(["listItems"], selectedItems);
              message.success(`Đã chọn ${selectedItems.length} sản phẩm`);
              setIsOpen(false);
            }}
            onCancel={() => {
              setSelectedItems((prev) => (!!prev?.length ? prev : []));
              setIsOpen(false);
            }}
            open={isOpen}
            width={800}
            centered={false}
            title={"Chọn Sản Phẩm"}
            styles={{
              content: { padding: "12px 12px 0", minHeight: "calc(100dvh - 48px)" },
              body: { flex: "1 1 auto", minHeight: 0, display: "flex", flexDirection: "column" },
              footer: {
                zIndex: 10,
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                padding: "12px 0",
                height: 64,
              },
            }}
            style={{ top: 24, marginRight: 24 }}
            cancelText="Đóng"
            okText={`Xác nhận chọn ${selectedItems.length} sản phẩm`}
            okButtonProps={{ size: "large" }}
            cancelButtonProps={{
              icon: <BsXLg />,
              size: "middle",
              type: "text",
              style: { fontSize: 16 },
            }}
          >
            <ItemsSelect
              value={selectedItems?.map(({ id }) => id)}
              onChangeFull={(_, selectedRows) => {
                const mapped = ((selectedRows || []) as TItem[]).map(
                  ({ modelList, ...item }, index) => {
                    return {
                      ...item,
                      discountType: TDiscountType.FIX_AMOUNT,
                      maxDistributionBuyer: undefined,
                      modelList: modelList.map(({ stock, ...m }) => {
                        return {
                          ...m,
                          originalStock: stock,
                          stock: undefined,
                          isFlashSale: !!stock,
                        };
                      }),
                    };
                  },
                );
                setSelectedItems(mapped);
              }}
              providerId={providerId}
              rowSelection={{
                getCheckboxProps: (record) => ({
                  disabled: !record.stock,
                }),
                fixed: "left",
              }}
              tableProps={{
                scroll: { x: "100%" },
              }}
              footerStyle={{ padding: "12px 0", position: "sticky", bottom: 64, zIndex: 10 }}
              style={{ height: "100%" }}
            />
          </Modal>
        </>
      )}
    </Form.List>
  );
};

const TableStyled = styled(StyledTable)`
  border-radius: 0;
  .ant-table-tbody .ant-table-row-level-0.parent-row {
    & > td {
      background-color: #fff !important;
      padding-top: 32px !important;
    }
  }
  .ant-table-wrapper {
    border-radius: 0;
  }
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

export default FlashSaleItems;

import { Affix, Card, Divider, Form, Input, InputNumber, Typography, theme } from "antd";

import { useId } from "react";
import useChangeLocale from "src/hooks/useChangeLocale";

import { useGetAllAmenitiesItemsQuery } from "@/redux/query/amenity.query";
import { css } from "@emotion/react";
import { skipToken } from "@reduxjs/toolkit/query";
import { parseAsInteger, useQueryStates } from "next-usequerystate";
import { useRouter } from "next/router";
import useGetProvider from "src/hooks/useGetProvider";
import AmenitiesSelect from "../field/AmenitiesSelect";
import AmenityAttributeList from "../field/AmenityAttributeList";
import ImageUploadWithQuery from "../field/ImageUploadWithQuery";
import StepAnchor from "../list/StepAnchor";
import ImageItem from "../shared/ImageItem";
import { cssAddItemModel } from "../shared/ItemStyled";

const { TextArea } = Input;
const defaultFilter = {
  type: parseAsInteger.withDefault(208),
  objectType: parseAsInteger.withDefault(1),
};

const AmenitiesComboForm = () => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const {
    query: { storeId, amenityComboId },
  } = useRouter();

  const form = Form.useFormInstance();
  const {
    token: { colorTextSecondary, colorTextPlaceholder },
  } = theme.useToken();

  const { gSelectedProvider } = useGetProvider({});

  const [filterData, setFilterData] = useQueryStates(defaultFilter);

  const { data: getAllAmenitiesItemsRes } = useGetAllAmenitiesItemsQuery(
    !!gSelectedProvider?.id
      ? {
          ...filterData,
          providerId: gSelectedProvider?.id,
        }
      : skipToken,
    {
      refetchOnMountOrArgChange: true,
      pollingInterval: 60000,
    },
  );

  return (
    <>
      <Affix offsetTop={76}>
        <div className="right-wrapper-Affix" style={{ width: 204 }}>
          <Card size="small" bodyStyle={{ padding: "6px 6px 0 6px" }}>
            <StepAnchor
              items={[
                {
                  title: "Thông tin combo",
                  formFields: [["avatarUrl"], ["name"], ["description"]],
                },
                {
                  title: "Thiết lập combo",
                  formFields: [
                    ["attributeExtensions"],
                    ["originPrice"],
                    ["totalPrice"],
                    ["deposit"],
                    ["stock"],
                    ["itemIds"],
                  ],
                },
              ]}
              anchorProps={{ targetOffset: 12, bounds: 400 }}
            />
          </Card>
        </div>
      </Affix>

      <div className="left-wrapper">
        <Card id="thong-tin-combo">
          <div className="row">
            <div className="avatar-wrapper">
              <Form.Item label={i18n["Hình ảnh"]} name="avatarUrl" noStyle>
                <ImageUploadWithQuery
                  renderUploadedItem={(item) => <ImageItem src={item} isUploaded />}
                  buttonUploadProps={{ block: false, size: "middle", shape: "round" }}
                />
              </Form.Item>
            </div>

            <div style={{ marginLeft: 130 }}>
              <Form.Item
                name="name"
                label={i18n["Tên combo"]}
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
                <TextArea placeholder={i18n["Nhập vào"]} style={{ color: colorTextSecondary }} />
              </Form.Item>
            </div>
          </div>
        </Card>

        <Card id="thiet-lap-combo" bodyStyle={{ paddingBottom: 28 }}>
          <Typography.Title
            level={4}
            type="secondary"
            style={{ lineHeight: 1, margin: "0 0 12px" }}
          >
            {i18n["Thiết lập combo"]}
          </Typography.Title>

          <div className="row5050">
            <Form.Item
              name="originPrice"
              label={i18n["Giá gốc"]}
              rules={[{ required: true, type: "number", min: 0 }]}
            >
              <InputNumber
                value={form.getFieldValue("originPrice")}
                disabled
                style={{ color: colorTextPlaceholder, width: "100%" }}
                formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>

            <Form.Item
              name="totalPrice"
              label={i18n["Giá combo"]}
              rules={[
                { required: true, type: "number", min: 0 },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("originPrice") >= value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(i18n["Giá combo không được vượt quá tổng giá"]),
                    );
                  },
                }),
              ]}
            >
              <InputNumber
                prefix={"₫"}
                step={1000}
                placeholder={i18n["Nhập giá"]}
                style={{ color: colorTextPlaceholder, width: "100%" }}
                formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
          </div>

          <div className="row5050" style={{ marginTop: 20, marginBottom: 20 }}>
            <Form.Item
              name="deposit"
              label={i18n["Đặt cọc"]}
              rules={[
                { required: true, type: "number", min: 0 },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("totalPrice") >= value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(i18n["Đặt cọc không được vượt quá giá tiền"]));
                  },
                }),
              ]}
            >
              <InputNumber
                prefix={"₫"}
                step={1000}
                placeholder={i18n["Nhập giá"]}
                style={{ color: colorTextPlaceholder, width: "100%" }}
                formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
            <Form.Item name="stock" label={i18n["Số lượng"]} rules={[{ type: "number", min: 0 }]}>
              <InputNumber placeholder={i18n["Nhập vào"]} style={{ width: "100%" }} />
            </Form.Item>
          </div>
          <Form.Item name="itemIds" label={i18n["Dịch vụ áp dụng"]} rules={[{ required: true }]}>
            <AmenitiesSelect
              providerId={gSelectedProvider?.id}
              rowSelection={{
                fixed: "left",
              }}
            />
          </Form.Item>

          <Divider />
          <Form.Item name="attributeExtensions">
            <AmenityAttributeList type="COMBO" />
          </Form.Item>
        </Card>
      </div>
    </>
  );
};

export const cssAmenityForm = css`
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
    .avatar-wrapper {
      position: absolute;
      top: 100px;
      left: 0;
      width: 108px;
      height: 108px;
      border-radius: 50%;
      background-color: #fff;
      box-shadow: 0 0 0 4px #fff, 0 1px 6px -1px rgba(0, 0, 0, 0.02),
        0 2px 4px 0 rgba(0, 0, 0, 0.02);
      transform: translate(24px, -50%);
      .image-upload-wrapper {
        position: relative;
        .ant-upload-text {
          display: none;
        }
        .image-wrapper,
        .ant-upload,
        .ant-image img {
          border-radius: 50%;
          width: 108px !important;
          height: 108px !important;
        }
        .image-wrapper .uploaded-badge {
          position: absolute;
          top: auto;
          left: 2px;
          bottom: 2px;
          border-radius: 50%;
          padding: 4px 4px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .actions-wrapper {
          border-radius: 50%;
        }
        .ant-upload-drag-container .ant-upload-drag-icon {
          margin-bottom: 0px;
        }
        .btn-upload {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 50%);
          background-color: auto !important;
        }
      }
    }
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

export default AmenitiesComboForm;

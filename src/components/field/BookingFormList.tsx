import styled from "@emotion/styled";
import { Form, Input, InputNumber, Space, Steps, theme } from "antd";
import { BsPlusLg } from "react-icons/bs";
import { MdOutlinePostAdd } from "react-icons/md";
import { TbCertificate, TbChevronDown, TbChevronUp, TbTrash } from "react-icons/tb";
import useChangeLocale from "src/hooks/useChangeLocale";
import Button from "../button/Button";
import ImageItem from "../shared/ImageItem";
import ImageUploadWithQuery from "./ImageUploadWithQuery";

function BookingFormList() {
  const { i18n } = useChangeLocale();
  const form = Form.useFormInstance();
  const bookingItemListWatch = Form.useWatch("bookingItemList", form);
  const {
    token: { colorSuccess, colorTextPlaceholder },
  } = theme.useToken();
  return (
    <Form.List name={"bookingItemList"}>
      {(fields, { add, remove, move }) => {
        return (
          <div>
            <Steps
              className="w-full"
              direction="vertical"
              items={[
                ...fields.map((field, index) => {
                  const modelData = bookingItemListWatch?.[index] as any;
                  return {
                    status: "wait" as any,
                    icon: <TbCertificate size={20} />,
                    title: (
                      <BookingFormListItemStyled>
                        <div className="image-wrapper">
                          <Form.Item
                            name={[field.name, "imageUrl"]}
                            noStyle
                            rules={[{ required: true }]}
                          >
                            <ImageUploadWithQuery
                              buttonUploadProps={{
                                block: false,
                                size: "middle",
                                style: { display: !!modelData?.imageUrl ? "none" : "flex" },
                              }}
                              renderUploadedItem={(item) => (
                                <ImageItem
                                  src={item}
                                  isUploaded
                                  onClickRemove={() =>
                                    form.setFieldValue(
                                      ["bookingItemList", field.name, "imageUrl"],
                                      undefined,
                                    )
                                  }
                                />
                              )}
                            />
                          </Form.Item>
                        </div>
                        <div className="right-wrapper">
                          <Form.Item
                            name={[field.name, "name"]}
                            noStyle
                            rules={[{ required: true }]}
                          >
                            <Input
                              placeholder={`${i18n["Loại phòng"]} ${index + 1}`}
                              variant={"borderless"}
                            />
                          </Form.Item>
                          <Form.Item
                            name={[field.name, "quantity"]}
                            noStyle
                            rules={[{ required: true }]}
                          >
                            <InputNumber<number>
                              prefix={"x"}
                              min={0}
                              style={{ color: colorTextPlaceholder, width: 120 }}
                              controls={false}
                              placeholder={i18n["Số lượng"]}
                              formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              }
                              parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
                              variant={"borderless"}
                            />
                          </Form.Item>
                          <div className="price-wrapper">
                            <Form.Item
                              name={[field.name, "currentPrice"]}
                              noStyle
                              rules={[{ required: true }]}
                            >
                              <InputNumber<number>
                                placeholder={i18n["Giá hiển thị"]}
                                style={{ color: colorSuccess, width: 120 }}
                                variant={"borderless"}
                                min={0}
                                controls={false}
                                prefix={"₫"}
                                formatter={(value) =>
                                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                                parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
                              />
                            </Form.Item>
                            <div className="middle-icon">~</div>
                            <Form.Item
                              name={[field.name, "originalPrice"]}
                              noStyle
                              rules={[{ required: true }]}
                            >
                              <InputNumber<number>
                                placeholder={i18n["Giá ban đầu"]}
                                style={{ color: colorSuccess, width: 120 }}
                                prefix={"₫"}
                                controls={false}
                                variant={"borderless"}
                                min={0}
                                formatter={(value) =>
                                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                                parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
                              />
                            </Form.Item>
                          </div>
                        </div>
                        <div className="actions-wrapper">
                          <Space.Compact direction="vertical" size="middle">
                            <Button
                              type="dashed"
                              onClick={() => move(field.name, field.name - 1)}
                              icon={<TbChevronUp size={20} />}
                            ></Button>
                            <Button
                              type="dashed"
                              onClick={() => move(field.name, field.name + 1)}
                              icon={<TbChevronDown size={20} />}
                            ></Button>
                            <Button
                              type="dashed"
                              onClick={() => remove(field.name)}
                              icon={<TbTrash size={20} />}
                            ></Button>
                          </Space.Compact>
                        </div>
                      </BookingFormListItemStyled>
                    ),
                  };
                }),
                {
                  status: "wait" as any,
                  icon: <MdOutlinePostAdd />,
                  title: (
                    <Button type="dashed" onClick={() => add()} block icon={<BsPlusLg />}>
                      {i18n["Thêm"]}
                    </Button>
                  ),
                },
              ]}
            />
          </div>
        );
      }}
    </Form.List>
  );
}

const BookingFormListItemStyled = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 24px;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-wrap: nowrap;
  & > .image-wrapper {
    flex: 0 0 160px;
    position: relative;
    & .image-upload-wrapper > .image-wrapper {
      height: 120px;
      .uploaded-badge {
        padding: 0 8px;
      }
    }
    .ant-upload {
      border-radius: 4px;
      height: 120px;
      padding-top: 2px;
    }
    .ant-upload-drag-icon {
      margin-bottom: 0px !important;
    }
    .ant-upload-text {
      font-size: 14px !important;
      line-height: 1.1;
    }
    .btn-upload {
      gap: 4px;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 50%);
      &:disabled {
        background-color: #eee;
      }
    }
  }
  & > .right-wrapper {
    flex: 1 1 auto;
    min-width: 0px;
  }
  .price-wrapper {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    width: 100%;
    .middle-icon {
      flex: 0 0 16px;
    }
  }
  & > .actions-wrapper {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(50%, -50%);
  }
  &:focus-within {
    border-color: ${({ theme }) => theme.colorPrimary};
  }
`;

export default BookingFormList;

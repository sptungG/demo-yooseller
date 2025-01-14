import { useGetListPageTemplatesQuery } from "@/redux/query/pageprivate.query";
import { css } from "@emotion/react";
import { useDebounce } from "ahooks";
import { Affix, Card, Flex, Form, FormProps, Image, Input, Radio, Typography, theme } from "antd";
import { useState } from "react";
import { cssAddItemModel } from "src/components/shared/ItemStyled";
import useChangeLocale from "src/hooks/useChangeLocale";
import AvatarUploadWithQuery from "../field/AvatarUploadWithQuery";
import ImagesUploadWithQuery from "../field/ImagesUploadWithQuery";
import StepAnchor from "../list/StepAnchor";
import ImageItemCustom from "../shared/ImageItemCustom";
type TPageFormProps = Pick<FormProps, "initialValues" | "onFinish" | "id"> & {
  extraRight?: React.ReactNode;
};

const PageForm = ({}: TPageFormProps) => {
  const { i18n } = useChangeLocale();
  const {
    token: { colorTextPlaceholder },
  } = theme.useToken();
  const form = Form.useFormInstance();
  const debouncedFilterData = useDebounce(
    {
      maxResultCount: 1000,
    },
    { wait: 500 },
  );
  const { data: resTemplate } = useGetListPageTemplatesQuery(debouncedFilterData, {
    refetchOnMountOrArgChange: true,
  });
  const dataTemplate = resTemplate?.data || [];
  const [visible, setVisible] = useState(false);
  const [imageList, setImageList] = useState<string[]>([]);
  const openModal = (imageUrls: string[]) => {
    setImageList(imageUrls);
    setVisible(true);
  };

  return (
    <>
      <Affix offsetTop={76}>
        <div className="right-wrapper-Affix" style={{ width: 204 }}>
          <Card size="small" bodyStyle={{ padding: "6px 6px 0 6px" }}>
            <StepAnchor
              items={[
                {
                  title: "Mẫu website",
                  formFields: [["pageTemplatesCode"]],
                },
                {
                  title: "Địa chỉ website",
                  formFields: [["website"]],
                },
                {
                  title: "Giới thiệu",
                  formFields: [["aboutUs"], ["aboutUsImageUrl"]],
                },
                {
                  title: "Hình ảnh",
                  formFields: [["logo"], ["background"], ["certificate"], ["productImageRanking"]],
                },
              ]}
              anchorProps={{ targetOffset: 12, bounds: 400 }}
            />
          </Card>
        </div>
      </Affix>
      <div className="left-wrapper">
        <Card id="mau-website">
          <Typography.Title
            level={4}
            type="secondary"
            style={{ lineHeight: 1, margin: "0 0 12px" }}
          >
            Mẫu website
          </Typography.Title>
          <Form.Item
            name="pageTemplatesCode"
            label="Chọn mẫu website"
            rules={[{ required: true }, { type: "string" }]}
          >
            <Radio.Group>
              {dataTemplate && (
                <>
                  <Flex wrap="wrap" gap="large">
                    {dataTemplate.map((item, index) => {
                      return (
                        <div key={index}>
                          <Flex vertical={true} align="center" wrap="wrap" gap="large">
                            {item?.imageUrlList && (
                              <ImageItemCustom
                                height={150}
                                width={150}
                                data={item.imageUrlList}
                                src={item.imageUrlList[0]}
                                onClickView={() => openModal(item.imageUrlList)}
                              />
                              
                            )}
                            <Radio value={item.code}>{item.name}</Radio>
                          </Flex>
                        </div>
                      );
                    })}
                  </Flex>
                  {visible && imageList && (
                    <Image.PreviewGroup
                      preview={{
                        visible,
                        onVisibleChange: (value) => {
                          setVisible(value);
                        },
                        onChange: (current, prev) =>
                          console.log(`current index: ${current}, prev index: ${prev}`),
                      }}
                    >
                      {imageList.map((url: string, index: number) => {
                        return (
                          <Image
                            key={index}
                            style={{ display: "none" }}
                            alt={`Ảnh ${index + 1}`}
                            src={url}
                          />
                        );
                      })}
                    </Image.PreviewGroup>
                  )}
                </>
              )}
            </Radio.Group>
          </Form.Item>
        </Card>
        <Card id="dia-chi-website">
          <Form.Item
            name="website"
            label="Website"
            rules={[{ required: true }, { type: "string" }]}
          >
            <Input placeholder="Nhập website" />
          </Form.Item>
        </Card>
        <Card id="gioi-thieu">
          <Typography.Title
            level={4}
            type="secondary"
            style={{ lineHeight: 1, margin: "0 0 12px" }}
          >
            Giới thiệu
          </Typography.Title>
          <div className="row5050" style={{ marginBottom: 5 }}>
            <Form.Item
              name="aboutUs"
              label="Giới thiệu"
              rules={[{ required: true }, { type: "string" }]}
            >
              {/* <Editor placeholder="Nhập giới thiệu" /> */}
              <Input.TextArea
                placeholder={"Nhập giới thiệu"}
                autoSize={{ minRows: 5, maxRows: 10 }}
                showCount
                maxLength={255}
              />
            </Form.Item>

            <Form.Item
              label="Hình ảnh giới thiệu"
              name="aboutUsImageUrl"
              rules={[{ type: "string", required: false }]}
            >
              <AvatarUploadWithQuery />
            </Form.Item>
          </div>
        </Card>
        <Card id="hinh-anh">
          <Typography.Title
            level={4}
            type="secondary"
            style={{ lineHeight: 1, margin: "0 0 12px" }}
          >
            Hình ảnh
          </Typography.Title>
          <div className="row5050" style={{ marginBottom: 5 }}>
            <Form.Item label="Logo" name="logo" rules={[{ type: "string", required: true }]}>
              <AvatarUploadWithQuery />
            </Form.Item>
            <Form.Item
              label="Background sản phẩm bán chạy"
              name="productImageRanking"
              rules={[{ type: "string", required: false }]}
            >
              <AvatarUploadWithQuery />
            </Form.Item>
          </div>
          <Form.Item
            label="Ảnh slider"
            name="background"
            rules={[{ type: "array", required: true, defaultField: { type: "url" } }]}
          >
            <ImagesUploadWithQuery />
          </Form.Item>
          <Form.Item
            label="Ảnh chứng nhận"
            name="certificate"
            rules={[{ type: "array", required: false, defaultField: { type: "url" } }]}
          >
            <ImagesUploadWithQuery />
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

export default PageForm;

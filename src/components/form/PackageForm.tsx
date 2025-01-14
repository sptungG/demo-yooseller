import { css } from "@emotion/react";
import { Affix, Card, Divider, Form, Input, Typography, theme } from "antd";
import Editor from "src/components/field/Editor";
import { cssAddItemModel } from "src/components/shared/ItemStyled";
import useChangeLocale from "src/hooks/useChangeLocale";

import { DateStartEndPickersPackage } from "../field/DateStartEndPickers";
import ImagesUploadWithQuery from "../field/ImagesUploadWithQuery";
import NumberPriceShares from "../field/NumberPriceShares";
import VideosUploadWithQuery from "../field/VideosUploadWithQuery";
import StepAnchor from "../list/StepAnchor";

type TPackageFormProps = { mode?: string };

const PackageForm = ({ mode = "CREATE" }: TPackageFormProps) => {
  const { i18n } = useChangeLocale();
  const {
    token: { colorSuccess },
  } = theme.useToken();

  return (
    <>
      <Affix offsetTop={76}>
        <div className="right-wrapper-Affix" style={{ width: 204 }}>
          <Card size="small" bodyStyle={{ padding: "6px 6px 0 6px" }}>
            <StepAnchor
              items={[
                {
                  title: i18n["Thông tin cơ bản"],
                  formFields: [["name"], ["description"], ["address"]],
                },
                {
                  title: i18n["Thông tin gói dịch vụ"],
                  formFields: [
                    ["startDate"],
                    ["expectedEndDate"],
                    ["pricePerShare"],
                    ["totalNumberShares"],
                    ["packagePrice"],
                  ],
                },
                {
                  title: i18n["Hình ảnh và video"],
                  formFields: [["imageUrlList"], ["videoUrlList"]],
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
            name="name"
            label={i18n["Tên gói dịch vụ farming"]}
            rules={[{ required: true }, { type: "string" }]}
          >
            <Input placeholder={i18n["Nhập tên gói dịch vụ farming"]} />
          </Form.Item>
          <Form.Item
            name="description"
            label={i18n["Mô tả"]}
            required
            rules={[{ required: false }, { type: "string" }]}
          >
            <Editor placeholder={i18n["Nhập mô tả gói dịch vụ farming"]} />
          </Form.Item>
          <Form.Item
            name="address"
            label={i18n["Địa chỉ trang trại"]}
            rules={[{ required: true, type: "string", warningOnly: true }]}
            style={{ margin: 0 }}
            help={""}
          >
            <Input.TextArea
              disabled
              placeholder={i18n["Nhập"] + " " + i18n["Địa chỉ trang trại"].toLowerCase()}
              autoSize={{ minRows: 2, maxRows: 2 }}
            />
          </Form.Item>
        </Card>

        <Card id="thong-tin-goi-dich-vu">
          <Typography.Title
            level={4}
            type="secondary"
            style={{ lineHeight: 1, margin: "0 0 12px" }}
          >
            {i18n["Thông tin gói dịch vụ"]}
          </Typography.Title>

          <DateStartEndPickersPackage mode={mode} />

          <NumberPriceShares />
        </Card>

        <Card id="anh-goi-farm" bodyStyle={{ paddingBottom: 4 }}>
          <Typography.Title
            level={4}
            type="secondary"
            style={{ lineHeight: 1, margin: "0 0 12px" }}
          >
            {i18n["Hình ảnh và video"]}
          </Typography.Title>
          <Form.Item
            label={i18n["Ảnh gói dịch vụ farming"]}
            name="imageUrlList"
            rules={[{ type: "array", required: true, defaultField: { type: "url" } }]}
          >
            <ImagesUploadWithQuery />
          </Form.Item>
          <Divider />
          <Form.Item
            label={i18n["Video gói dịch vụ farming"]}
            name="videoUrlList"
            rules={[{ type: "array", required: false, defaultField: { type: "url" } }]}
          >
            <VideosUploadWithQuery />
          </Form.Item>
        </Card>
      </div>
    </>
  );
};

export const cssPackageForm = css`
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

export default PackageForm;

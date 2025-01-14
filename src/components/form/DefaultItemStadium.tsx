import { css } from "@emotion/react";
import {
  Affix,
  Divider,
  Form,
  FormProps,
  Input,
  InputNumber,
  Select,
  Space,
  Typography,
  theme,
} from "antd";
import { useRouter } from "next/router";
import { useId } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { MdPhoneEnabled } from "react-icons/md";
import FormAddressSelects from "src/components/field/FormAddressSelects";
import MapPicker from "src/components/picker/MapPicker";
import { cssAddItemModel } from "src/components/shared/ItemStyled";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useUploadListImageMutation } from "src/redux/query/image.query";
import { regexVNPhone } from "src/utils/utils";
import Card from "../card/Card";
import Editor from "../field/Editor";
import ImagesUploadWithQuery from "../field/ImagesUploadWithQuery";
import InputPriceRange from "../field/InputPriceRange";
import StepAnchor from "../list/StepAnchor";

type TDefaultItemStadiumProps = Pick<FormProps, "initialValues" | "onFinish" | "id"> & {
  extraRight?: React.ReactNode;
};

const DefaultItemStadium = ({ id }: TDefaultItemStadiumProps) => {
  const { i18n } = useChangeLocale();
  const form = Form.useFormInstance();
  const rUid = useId();
  const uid = id || rUid;
  const {
    query: { itemId, storeId },
    replace,
  } = useRouter();
  const {
    token: { colorTextPlaceholder, colorSuccess },
  } = theme.useToken();
  const [uploadListImageMutate, { isLoading: isLoadingUploadImages }] =
    useUploadListImageMutation();

  const handleUploadImages = () => {
    const imageUrls = (form.getFieldValue("imageUrls") as string[]) || [];
    const fileList = form.getFieldValue("imageFileList");
    uploadListImageMutate({ files: fileList })
      .unwrap()
      .then(({ result }) => {
        const newImageUrls = [...imageUrls, ...(result.data || [])];
        form.setFieldValue("imageUrls", newImageUrls);
        form.resetFields(["imageFileList"]);
        message.success(i18n["Tải ảnh lên thành công"]);
      })
      .catch((err) => {
        message.error(i18n["Đã có lỗi xảy ra khi tải ảnh lên"]);
      });
  };
  const handleRemoveImage = (item: string) => {
    const imageUrls = (form.getFieldValue("imageUrls") as string[]) || [];
    const newImageUrls = imageUrls.filter((url) => url !== item);
    form.setFieldValue("imageUrls", newImageUrls);
    message.error(i18n["Xóa ảnh thành công"]);
  };
  const { message, notification } = useApp();

  return (
    <>
      <Affix offsetTop={76}>
        <div className="right-wrapper-Affix">
          <Card size="small" bodyStyle={{ paddingBottom: 0 }}>
            <StepAnchor
              items={[
                {
                  title: "Thông tin cơ bản",
                  percent: 0,
                },
                {
                  title: "Ảnh sản phẩm",
                  percent: 0,
                },
                {
                  title: "Giá sân vận động",
                  percent: 0,
                },
                {
                  title: "Thông tin chi tiết",
                  percent: 0,
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
            label={i18n["Tên sân vận động"]}
            rules={[{ required: true }, { type: "string" }]}
          >
            <Input placeholder={i18n["Nhập tên sân vận động"]} />
          </Form.Item>
          <Divider />
          <Form.Item
            name={["properties", "pitchtype"]}
            label={i18n["Loại sân vận động"]}
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder={i18n["Chọn loại sân vận động"]}
              optionFilterProp="stadium"
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              options={[
                {
                  value: "Sân 5 người",
                  label: "Sân 5 người",
                },
                {
                  value: "Sân 7 người",
                  label: "Sân 7 người",
                },
                {
                  value: "Sân 9 người",
                  label: "Sân 9 người",
                },
                {
                  value: "Sân 11 người",
                  label: "Sân 11 người",
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label={i18n["Mô tả sân vận động"]}
            rules={[{ required: true }, { type: "string" }]}
          >
            <Editor placeholder={i18n["Nhập mô tả sân vận động"]} />
          </Form.Item>
        </Card>
        <Card id="anh-san-pham" bodyStyle={{ paddingBottom: 4 }}>
          <Form.Item
            label={i18n["Ảnh sân vận động"]}
            name="imageUrlList"
            rules={[{ type: "array", required: true, defaultField: { type: "url" } }]}
          >
            <ImagesUploadWithQuery />
          </Form.Item>
        </Card>
        <Card id="gia-san-van-dong" bodyStyle={{ paddingBottom: 28 }}>
          <Form.Item
            label={i18n["Giá theo trận"]}
            rules={[{ required: true }]}
            style={{ width: "100%" }}
          >
            <Space style={{ width: "100%", color: colorSuccess }}>
              <InputPriceRange
                minFormProps={{
                  name: ["properties", "minPrices"],
                  label: "Minimum Price",
                  rules: [{ required: true }],
                }}
                maxFormProps={{
                  name: ["properties", "maxPrices"],
                  label: "Maximum Price",
                  rules: [{ required: true }],
                }}
                size="large"
              />
              <span>/ Trận</span>
            </Space>
          </Form.Item>
          <Form.Item
            name={["properties", "priceHour"]}
            label={i18n["Giá theo giờ"]}
            rules={[{ required: true }]}
            style={{ width: "100%" }}
          >
            <Space style={{ width: "100%", color: colorSuccess }}>
              <InputNumber<number>
                placeholder={i18n["Nhập giá theo giờ"]}
                style={{ width: "100%", color: colorSuccess }}
                step={1000}
                min={0}
                prefix="₫"
                formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
              />
              <span>/Giờ</span>
            </Space>
          </Form.Item>
        </Card>
        <Card id="thong-tin-chi-tiet" bodyStyle={{ paddingBottom: 28 }}>
          <Form.Item
            label={
              <>
                {i18n["Điạ chỉ"]}{" "}
                <Typography.Text type="secondary">{`(${i18n["Tỉnh thành | Quận huyện | Phường xã"]})`}</Typography.Text>
              </>
            }
            required
          >
            <FormAddressSelects
              size="large"
              provinceFormProps={{
                name: "provinceId",
                rules: [{ type: "string", required: true }],
              }}
              districtFormProps={{
                name: "districtId",
                rules: [{ type: "string", required: true }],
              }}
              wardFormProps={{
                name: "wardId",
                rules: [{ type: "string", required: true }],
              }}
            />
          </Form.Item>
          <Form.Item
            name={["properties", "address"]}
            label={i18n["Địa chỉ chi tiết"]}
            rules={[{ type: "string", required: true }]}
          >
            <Input.TextArea
              placeholder={i18n["Nhập địa chỉ chi tiết sân vận động"]}
              autoSize={{ minRows: 2, maxRows: 2 }}
              showCount
              maxLength={255}
            />
          </Form.Item>
          <Form.Item
            name={["properties", "geoLocation"]}
            label=""
            rules={[{ type: "object", required: true }]}
            help=""
          >
            <MapPicker
              style={{ height: 240, zIndex: 0 }}
              draggable
              onChangeAddressName={(name) => {
                if (form && form.setFieldValue) {
                  form.setFieldValue("address", name);
                }
              }}
            />
          </Form.Item>
          <Form.Item
            name={["properties", "phoneNumber"]}
            label={i18n["Số điện thoại"]}
            rules={[
              { required: true },
              {
                pattern: regexVNPhone,
                message: i18n["Số điện thoại chưa đúng định dạng"],
              },
            ]}
          >
            <Input
              type="tel"
              placeholder={i18n["Nhập số điện thoại cửa hàng"]}
              suffix={<MdPhoneEnabled size={16} color={colorTextPlaceholder} />}
            />
          </Form.Item>
          <Form.Item
            name={["properties", "contact"]}
            label={i18n["Tên liên hệ"]}
            rules={[{ required: true }]}
          >
            <Input
              placeholder={i18n["Nhập Tên liên hệ"]}
              suffix={<BsPersonCircle size={16} color={colorTextPlaceholder} />}
            />
          </Form.Item>
        </Card>
      </div>
    </>
  );
};
export const cssItemStadium = css`
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
    width: 242px;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(-100%);
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

export default DefaultItemStadium;

import { css } from "@emotion/react";
import { Affix, Form, FormProps, Input, InputRef, Typography, theme } from "antd";
import { useRouter } from "next/router";
import { useId, useRef } from "react";
import { MdPhoneEnabled } from "react-icons/md";
import Editor from "src/components/field/Editor";
import FormAddressSelects from "src/components/field/FormAddressSelects";
import MapPicker from "src/components/picker/MapPicker";
import { cssAddItemModel } from "src/components/shared/ItemStyled";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useUploadListImageMutation } from "src/redux/query/image.query";
import { regexVNPhone } from "src/utils/utils";
import Card from "../card/Card";
import ImagesUploadWithQuery from "../field/ImagesUploadWithQuery";
import WorkTimeList from "../field/WorkTimeList";
import StepAnchor from "../list/StepAnchor";

type TBookingHotelFormProps = Pick<FormProps, "initialValues" | "onFinish" | "id"> & {
  extraRight?: React.ReactNode;
};
const BookingHotelForm = ({ id }: TBookingHotelFormProps) => {
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
  const inputRef = useRef<InputRef>(null);

  return (
    <>
      <Affix offsetTop={76}>
        <div className="right-wrapper-Affix">
          <Card size="small" bodyStyle={{ paddingBottom: 0 }}>
            <StepAnchor
              items={[
                {
                  title: "Thông tin khách sạn",
                  percent: 0,
                },
                {
                  title: "Ảnh khách sạn",
                  percent: 0,
                },
                {
                  title: "Loại phòng",
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
        <Card id="thong-tin-khach-san">
          <Form.Item
            name="name"
            label={i18n["Tên khách sạn"]}
            rules={[{ required: true }, { type: "string" }]}
          >
            <Input placeholder={i18n["Nhập tên khách sạn"]} />
          </Form.Item>
          <Form.Item
            name="description"
            label={i18n["Mô tả khách sạn"]}
            rules={[{ required: true }, { type: "string" }]}
          >
            <Editor theme="snow" placeholder={i18n["Nhập mô tả khách sạn"]} />
          </Form.Item>
          <Form.Item
            name="web"
            label={i18n["Trang web"]}
            rules={[{ type: "url" }]}
            style={{ width: "100%" }}
          >
            <Input placeholder={i18n["Nhập link trang web"]} />
          </Form.Item>
        </Card>
        <Card id="anh-khach-san">
          <Form.Item
            label={i18n["Ảnh khách sạn"]}
            name="imageUrlList"
            rules={[{ type: "array", required: true, defaultField: { type: "url" } }]}
          >
            <ImagesUploadWithQuery />
          </Form.Item>
        </Card>
        <Card id="thong-tin-chi-tiet">
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
              placeholder={i18n["Nhập địa chỉ chi tiết khách sạn"]}
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
              placeholder={i18n["Nhập số điện thoại liên hệ"]}
              suffix={<MdPhoneEnabled size={16} color={colorTextPlaceholder} />}
            />
          </Form.Item>
          <WorkTimeList />
        </Card>
      </div>
    </>
  );
};
export const cssBookingHotelForm = css`
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

export default BookingHotelForm;

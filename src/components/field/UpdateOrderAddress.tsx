import styled from "@emotion/styled";
import { Drawer, Form, Input, Space, Typography } from "antd";
import { useId, useState } from "react";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useUpdateOrderDetailMutation } from "src/redux/query/order.query";
import {
  useGetDistrictsQuery,
  useGetProvincesQuery,
  useGetWardsQuery,
} from "src/redux/query/province.query";
import { TOrder } from "src/types/order.types";
import Button from "../button/Button";
import AddressSelect from "./AddressSelect";

type TUpdateOrderAddressProps = {
  onClose?: () => void;
  item?: Pick<TOrder, "id" | "orderCode" | "recipientAddress">;
};

const UpdateOrderAddress = ({ item, onClose, ...props }: TUpdateOrderAddressProps) => {
  const uid = useId();
  const [form] = Form.useForm();
  const { message } = useApp();
  const { i18n } = useChangeLocale();

  const [provinceId, setProvinceId] = useState<number>();
  const [districtId, setDistrictId] = useState<number>();
  const { data: getProvincesRes, isFetching: getProvincesFetching } = useGetProvincesQuery({});
  const getProvincesData = getProvincesRes?.result || [];
  const { data: getDistrictsRes, isFetching: getDistrictsFetching } =
    useGetDistrictsQuery(provinceId);
  const getDistrictsData = getDistrictsRes?.result || [];
  const { data: getWardsRes, isFetching: getWardsFetching } = useGetWardsQuery(districtId);
  const getWardsData = getWardsRes?.result || [];

  const [updateOrderMutate, { isLoading }] = useUpdateOrderDetailMutation();

  const handleUpdateAddress = (formData: any) => {
    updateOrderMutate(formData)
      .unwrap()
      .then((res) => {
        message.success("Cập nhật địa chỉ thành công");
      })
      .catch((err) => {
        message.error("Đã có lỗi xảy ra khi cập nhật địa chỉ");
      })
      .finally(() => {
        onClose?.();
      });
  };

  return (
    <Drawer
      destroyOnClose
      className="hide-close"
      open={!!item}
      onClose={(e) => {
        form.resetFields();
        onClose?.();
      }}
      maskClosable={!isLoading}
      closable={!isLoading}
      title={
        <Typography.Text ellipsis>{`Cập nhật địa chỉ · ${item?.orderCode || ""}`}</Typography.Text>
      }
      footer={
        <FooterStyled>
          <Button
            type="text"
            size="large"
            form={uid}
            htmlType="button"
            onClick={() => form.resetFields()}
          >
            Hủy
          </Button>
          <Button
            form={uid}
            size="large"
            type="primary"
            htmlType="submit"
            block
            loading={isLoading}
          >
            Cập nhật
          </Button>
        </FooterStyled>
      }
    >
      <Form
        id={uid}
        form={form}
        layout="vertical"
        autoComplete="off"
        requiredMark={false}
        size="large"
        onFinish={(formData) => !!item && handleUpdateAddress(formData)}
        initialValues={item}
      >
        <Form.Item name="id" hidden rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Tên người nhận"
          rules={[{ required: true }]}
          name={["recipientAddress", "name"]}
        >
          <Input placeholder={`Nhập tên người nhận...`} />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          rules={[
            { required: true },
            {
              pattern: new RegExp(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/),
              message: i18n["Số điện thoại chưa đúng định dạng"],
            },
          ]}
          name={["recipientAddress", "phone"]}
        >
          <Input type="tel" placeholder={`Nhập số điện thoại...`} />
        </Form.Item>
        <Form.Item
          label={
            <>
              {i18n["Địa chỉ"]}{" "}
              <Typography.Text type="secondary">{`(${i18n["Tỉnh thành | Quận huyện | Phường xã"]})`}</Typography.Text>
            </>
          }
          required
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Form.Item
              noStyle
              label={i18n["Tỉnh thành"]}
              name={["recipientAddress", "city"]}
              rules={[{ type: "string", required: true }]}
            >
              <AddressSelect
                placeholder={i18n["Chọn tỉnh thành"]}
                onSelect={(value, option) => {
                  form.setFieldValue(["recipientAddress", "city"], option.label);
                  form.setFieldValue(["recipientAddress", "district"], undefined);
                  form.setFieldValue(["recipientAddress", "town"], undefined);
                  setProvinceId(value);
                }}
                onClear={() => form.setFieldsValue({ district: undefined, ward: undefined })}
                loading={getProvincesFetching}
                options={(getProvincesData || []).map(({ code, fullName }) => ({
                  label: fullName,
                  value: code.trim(),
                }))}
              />
            </Form.Item>
            <Form.Item
              noStyle
              label={i18n["Quận huyện"]}
              name={["recipientAddress", "district"]}
              rules={[{ type: "string", required: true }]}
            >
              <AddressSelect
                placeholder={i18n["Chọn quận huyện"]}
                onSelect={(value, option) => {
                  form.setFieldValue(["recipientAddress", "district"], option.label);
                  form.setFieldValue(["recipientAddress", "town"], undefined);
                  setDistrictId(value);
                }}
                onClear={() => form.setFieldsValue({ ward: undefined })}
                loading={getDistrictsFetching}
                options={(getDistrictsData || []).map(({ code, fullName }) => ({
                  label: fullName,
                  value: code.trim(),
                }))}
              />
            </Form.Item>
            <Form.Item
              noStyle
              label={i18n["Phường xã"]}
              name={["recipientAddress", "town"]}
              rules={[{ type: "string", required: true }]}
            >
              <AddressSelect
                placeholder={i18n["Chọn phường xã"]}
                onSelect={(value, option) => {
                  form.setFieldValue(["recipientAddress", "town"], option.label);
                  setDistrictId(value);
                }}
                loading={getWardsFetching}
                options={(getWardsData || []).map(({ code, fullName }) => ({
                  label: fullName,
                  value: code.trim(),
                }))}
              />
            </Form.Item>
          </Space>
        </Form.Item>
        <Form.Item
          label="Địa chỉ"
          rules={[{ required: true }]}
          name={["recipientAddress", "fullAddress"]}
        >
          <Input.TextArea
            rows={4}
            showCount
            autoSize={{ minRows: 4, maxRows: 4 }}
            placeholder="Nhập địa chỉ cụ thể..."
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};
const UpdateOrderAddressStyled = styled.div``;
const FooterStyled = styled.div`
  display: flex;
  flex-wrap: nowrap;
  column-gap: 8px;
`;

export default UpdateOrderAddress;

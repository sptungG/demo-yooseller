import styled from "@emotion/styled";
import { useIsomorphicLayoutEffect } from "ahooks";
import { Checkbox, Divider, Form, Input, Typography, theme } from "antd";
import { useRouter } from "next/router";
import { useId } from "react";
import { MdPhoneEnabled } from "react-icons/md";
import { SiMaildotru } from "react-icons/si";
import Button from "src/components/button/Button";
import Card from "src/components/card/Card";
import BookingFormList from "src/components/field/BookingFormList";
import Editor from "src/components/field/Editor";
import FormAddressNameSelects from "src/components/field/FormAddressNameSelects";
import { cssBookingHotelForm } from "src/components/form/BookingHotelForm";
import withAuth from "src/components/hoc/withAuth";
import Breadcrumb from "src/components/layout/Breadcrumb";
import SiderHeaderLayout from "src/components/layout/SiderHeaderLayout";
import StyledPage from "src/components/layout/StyledPage";
import RangePicker from "src/components/picker/RangePicker";
import { PaymentMethods } from "src/configs/constant.config";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProvider from "src/hooks/useGetProvider";
import { useCreateBookingMutation } from "src/redux/query/booking.query";
import { regexVNPhoneAll } from "src/utils/utils";
import { dayjs } from "src/utils/utils-date";

const Page = () => {
  const uid = useId();
  const {
    replace,
    query: { storeId },
  } = useRouter();
  const { i18n } = useChangeLocale();
  const {
    token: { colorTextPlaceholder },
  } = theme.useToken();
  const { message, notification } = useApp();
  const [form] = Form.useForm();

  const { gSelectedProvider } = useGetProvider({});

  const [createBookingMutate, { isLoading: isLoadingCreateBooking }] = useCreateBookingMutation();
  const handleCreateBooking = (formValues: any) => {
    const {
      bookingItemList,
      checkTime,
      description,
      email,
      name,
      paymentMethod,
      phoneNumber,
      providerId,
      recipientAddress,
      tenantId,
    } = formValues as any;
    const checkIn = dayjs(checkTime[0]).toISOString();
    const checkOut = dayjs(checkTime[1]).toISOString();

    createBookingMutate({
      bookingItemList,
      checkIn,
      checkOut,
      description,
      email,
      name,
      paymentMethod,
      phoneNumber,
      providerId,
      recipientAddress: { name, ...recipientAddress },
      tenantId,
      type: 0,
      totalPrice: 0,
    })
      .unwrap()
      .then(({ result }) => {
        if (result.data === true) {
          notification.success({
            message: i18n["Tạo dịch vụ thành công"],
            placement: "bottomRight",
          });
          form.resetFields();
          replace("/supplier/booking");
        } else {
          notification.error({
            message: i18n["Đã có lỗi xảy ra khi tạo dịch vụ"],
            placement: "bottomRight",
          });
        }
      })
      .catch((err) => {
        notification.error({
          message: i18n["Đã có lỗi xảy ra khi tạo dịch vụ"],
          placement: "bottomRight",
        });
      });
  };

  useIsomorphicLayoutEffect(() => {
    if (gSelectedProvider?.groupType === 2) {
      replace("/");
    }
  }, [gSelectedProvider?.groupType]);

  return (
    <SiderHeaderLayout>
      <PageWrapper>
        <div className="page-header">
          <div className="left-wrapper">
            <Breadcrumb
              items={[{ "/supplier/booking": i18n["Dịch vụ"] }]}
              current={i18n["Thêm dịch vụ"]}
            />
            <Typography.Title level={2}>{i18n["Thêm dịch vụ"]}</Typography.Title>
          </div>
          <div className="right-wrapper"></div>
        </div>
        <Form
          id={uid}
          form={form}
          layout="vertical"
          size="large"
          className="form-wrapper"
          initialValues={{
            tenantId: gSelectedProvider?.tenantId,
            providerId: gSelectedProvider?.id,
            bookingItemList: [
              {
                quantity: 0,
              },
            ],
          }}
          onFinish={handleCreateBooking}
          onValuesChange={(changedValues, values) => {
            // const { modelList } = values as any;
            // if (!!modelList?.length) {
            //   const totalStock = reduce(modelList, (prev, cur) => prev + (cur?.stock || 0), 0);
            //   form.setFieldValue(["stock"], totalStock);
            //   form.setFieldValue(["price"], undefined);
            // }
          }}
        >
          <div className="left-wrapper">
            <Card>
              <Form.Item name="name" label={i18n["Tên dịch vụ"]} rules={[{ required: true }]}>
                <Input placeholder={i18n["Nhập Tên dịch vụ"]} />
              </Form.Item>
              <Form.Item name="description" label={i18n["Mô tả"]} rules={[{ required: true }]}>
                <Editor theme="snow" placeholder={i18n["Nhập Mô tả dịch vụ"]} />
              </Form.Item>
              <Divider style={{ margin: "24px 0 12px" }} />
              <Form.Item
                name="checkTime"
                label={i18n["Thời gian CheckIn - CheckOut"]}
                rules={[{ required: true }]}
              >
                <RangePicker
                  showNow={false}
                  format={"DD-MM-YYYY HH:mm"}
                  placeholder={["Checkin", "Checkout"]}
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Divider style={{ margin: "24px 0 12px" }} />
              <Form.Item
                name="paymentMethod"
                label={i18n["Phương thức thanh toán"]}
                rules={[{ required: true }]}
              >
                <Checkbox.Group style={{ gap: 8 }}>
                  {PaymentMethods.map((item, index) => (
                    <CheckboxStyled value={item.value} key={"paymentMethod" + index}>
                      {item.label}
                    </CheckboxStyled>
                  ))}
                </Checkbox.Group>
              </Form.Item>
            </Card>
            <Card>
              <Typography.Title level={4} type="secondary">
                {i18n["Danh sách sản phẩm"]}:
              </Typography.Title>
              <BookingFormList />
            </Card>
          </div>
          <div className="right-wrapper">
            <Card>
              <Form.Item name="email" label="Email" rules={[{ type: "email", required: true }]}>
                <Input
                  placeholder={i18n["Email liên hệ"]}
                  suffix={<SiMaildotru size={16} color={colorTextPlaceholder} />}
                />
              </Form.Item>
              <Form.Item
                name="phoneNumber"
                label={i18n["Số điện thoại liên hệ"]}
                rules={[
                  { required: true },
                  {
                    pattern: regexVNPhoneAll,
                    message: i18n["Số điện thoại chưa đúng định dạng"],
                  },
                ]}
              >
                <Input
                  type="tel"
                  placeholder={i18n["Nhập số điện thoại"]}
                  suffix={<MdPhoneEnabled size={16} color={colorTextPlaceholder} />}
                />
              </Form.Item>
              <Divider style={{ margin: "24px 0 12px" }} />
              <Form.Item
                label={
                  <>
                    {i18n["Điạ chỉ"]}{" "}
                    <Typography.Text type="secondary">{`(${i18n["Tỉnh thành | Quận huyện | Phường xã"]})`}</Typography.Text>
                  </>
                }
                required
                help=""
              >
                <FormAddressNameSelects
                  provinceFormProps={{ name: ["recipientAddress", "city"] }}
                  districtFormProps={{ name: ["recipientAddress", "district"] }}
                  wardFormProps={{ name: ["recipientAddress", "town"] }}
                />
              </Form.Item>
              <Form.Item
                name={["recipientAddress", "address"]}
                label={i18n["Địa chỉ chi tiết"]}
                required
                help=""
              >
                <Input.TextArea
                  placeholder={i18n["Nhập địa chỉ chi tiết"]}
                  autoSize={{ minRows: 2, maxRows: 2 }}
                  showCount
                  maxLength={255}
                />
              </Form.Item>
            </Card>
          </div>
          <Form.Item name="tenantId" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="providerId" hidden>
            <Input />
          </Form.Item>
        </Form>
        <Divider />
        <div className="actions-wrapper">
          <Button
            className="btn-reset"
            form={uid}
            size="large"
            disabled={isLoadingCreateBooking}
            onClick={() => form.resetFields()}
          >
            {i18n["Hủy"]}
          </Button>
          <Button
            className="btn-submit"
            htmlType="submit"
            type="primary"
            form={uid}
            size="large"
            loading={isLoadingCreateBooking}
            disabled={isLoadingCreateBooking}
          >
            {i18n["Thêm dịch vụ"]}
          </Button>
        </div>
      </PageWrapper>
    </SiderHeaderLayout>
  );
};

const CheckboxStyled = styled(Checkbox)`
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  &.ant-checkbox-wrapper-checked {
    border-color: ${({ theme }) => theme.colorPrimary};
  }
`;

const PageWrapper = styled(StyledPage)`
  padding: 12px;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  .form-wrapper {
    ${cssBookingHotelForm}
    .w-full {
      .ant-steps-item-title {
        width: 100%;
      }
    }
  }
  & > .actions-wrapper {
    display: flex;
    align-items: flex-start;
    flex-wrap: nowrap;
    gap: 12px;
    justify-content: flex-end;
    padding-bottom: 12px;
    .btn-submit {
      flex: 0 0 360px;
    }
  }
`;

export default withAuth(Page);

import styled from "@emotion/styled";
import { Descriptions, Divider, Drawer, Form, Input, Typography, theme } from "antd";
import { useId } from "react";
import { BsChevronDown, BsInfoCircle } from "react-icons/bs";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProvider from "src/hooks/useGetProvider";
import {
  useCancelBookingPartnerMutation,
  useConfirmBookingPartnerMutation,
  useGetBookingByIdQuery,
  useRefuseBookingPartnerMutation,
} from "src/redux/query/booking.query";
import { formatNumber, mappedAddressDetail } from "src/utils/utils";
import { formatDate } from "src/utils/utils-date";
import Button from "../button/Button";
import BookingState from "../card/BookingState";
import Image from "../next/Image";
import PaymentMethodTag from "../tag/PaymentMethodTag";
import OrderStateSelect from "./OrderStateSelect";

type TUpdateBookingStateProps = { id: number; open?: boolean; onClose?: () => void };

const UpdateBookingState = ({ id, onClose, open }: TUpdateBookingStateProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { notification } = useApp();
  const {
    token: { colorTextPlaceholder },
  } = theme.useToken();
  const items: any = [
    { label: i18n["Xác nhận"], key: "1" },
    { label: i18n["Từ chối"], key: "4", danger: true },
    { label: i18n["Hủy"], key: "5", danger: true },
  ];
  const { gTypeProvider } = useGetProvider({});

  const { data, isFetching } = useGetBookingByIdQuery({ id }, { refetchOnMountOrArgChange: true });
  const bookingData = data?.result.data;
  const selectedOItem = bookingData?.bookingItemList[0] || undefined;
  const [form] = Form.useForm();
  const typeWatch = Form.useWatch("type", form);

  const [confirmBookingMutate, { isLoading: isConfirmLoading }] =
    useConfirmBookingPartnerMutation();
  const [cancelBookingMutate, { isLoading: isCancelLoading }] = useCancelBookingPartnerMutation();
  const [refuseBookingMutate, { isLoading: isRefuseLoading }] = useRefuseBookingPartnerMutation();
  const isLoading = isConfirmLoading || isCancelLoading || isRefuseLoading;

  const addressDetail = !!bookingData?.recipientAddress
    ? mappedAddressDetail(bookingData.recipientAddress)
    : "___";

  const handleSubmit = (formData: any) => {
    const { id, type, reason } = formData;
    switch (type) {
      case "1":
        confirmBookingMutate({ id, type: +type })
          .unwrap()
          .then((res) => {
            notification.success({
              message: i18n["Xác nhận dịch vụ thành công"],
              placement: "bottomRight",
            });
          })
          .catch((err) => {
            notification.error({
              message: i18n["Đã có lỗi xảy ra khi xác nhận dịch vụ"],
              placement: "bottomRight",
            });
          })
          .finally(() => {
            onClose?.();
          });
        return;
      case "4":
        refuseBookingMutate({ id, type: +type })
          .unwrap()
          .then((res) => {
            notification.success({
              message: i18n["Xác nhận hủy dịch vụ thành công"],
              placement: "bottomRight",
            });
          })
          .catch((err) => {
            notification.error({
              message: i18n["Đã có lỗi xảy ra khi xác nhận hủy dịch vụ"],
              placement: "bottomRight",
            });
          })
          .finally(() => {
            onClose?.();
          });
        return;
      case "5":
        cancelBookingMutate({ id, reason })
          .unwrap()
          .then((res) => {
            notification.success({
              message: i18n["Hủy nhận dịch vụ thành công"],
              placement: "bottomRight",
            });
          })
          .catch((err) => {
            notification.error({
              message: i18n["Đã có lỗi xảy ra khi hủy nhận dịch vụ"],
              placement: "bottomRight",
            });
          })
          .finally(() => {
            onClose?.();
          });
        return;
      default:
        return;
    }
  };

  if (!bookingData) return <></>;

  return (
    <Drawer
      open={open}
      onClose={() => onClose?.()}
      maskClosable={!isLoading}
      closable={!isLoading}
      destroyOnClose
      afterOpenChange={() => {
        form.resetFields();
      }}
      title={<Typography.Text ellipsis>{bookingData.bookingCode}</Typography.Text>}
      footer={
        <FooterStyled>
          <Button
            type="text"
            size="large"
            htmlType="button"
            onClick={() => {
              form.resetFields();
              onClose?.();
            }}
          >
            {i18n["Hủy"]}
          </Button>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            block
            loading={isLoading}
            form={uid}
          >
            {i18n["Cập nhật"]}
          </Button>
        </FooterStyled>
      }
    >
      <UpdateBookingStateStyled>
        <Typography.Title level={5} ellipsis type="secondary" style={{ margin: "8px 0" }}>
          {i18n["Cập nhật trạng thái dịch vụ"]}:
        </Typography.Title>
        <Form
          form={form}
          id={uid}
          size="large"
          layout="vertical"
          requiredMark={false}
          onFinish={handleSubmit}
          initialValues={{ id }}
        >
          <Form.Item name="id" hidden rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" rules={[{ required: true }]} className="hide-error">
            <OrderStateSelect items={items}>
              {(selectedType) => (
                <BtnLabelStyled size="large">
                  {!!selectedType ? selectedType.label : i18n["Chọn trạng thái"]}
                  <Divider type="vertical" style={{ marginLeft: "auto" }} />
                  <BsChevronDown size={16} color={colorTextPlaceholder} />
                </BtnLabelStyled>
              )}
            </OrderStateSelect>
          </Form.Item>
          {typeWatch === "5" && (
            <Form.Item
              name="reason"
              rules={[{ required: true }]}
              label={
                <div className="help-wrapper">
                  <BsInfoCircle size={14} color={"#ff4d4f"} />
                  <Typography.Text type="secondary">
                    {i18n["Bạn có chắc chắn"]} <b>{i18n["Hủy"]}</b> {i18n["dịch vụ này"]}?
                  </Typography.Text>
                </div>
              }
            >
              <Input.TextArea
                size="large"
                placeholder={i18n["Nhập lý do hủy"]}
                autoSize={{ minRows: 2 }}
                showCount
              />
            </Form.Item>
          )}
        </Form>
        <Divider style={{ margin: "12px 0" }} />
        <div className="recipientAddress-wrapper">
          <Typography.Title level={5} ellipsis type="secondary">
            {i18n["Thông tin người đặt"]}:
          </Typography.Title>
          {!!bookingData.recipientAddress && (
            <Descriptions column={2} size="small">
              <Descriptions.Item label={i18n["Tên người đặt"]} span={2}>
                {bookingData.recipientAddress.name}
              </Descriptions.Item>
              <Descriptions.Item label={i18n["Số điện thoại"]} span={2}>
                {bookingData.recipientAddress.phone}
              </Descriptions.Item>
              <Descriptions.Item label={i18n["Khu vực"]} span={2}>
                {addressDetail}
              </Descriptions.Item>
              <Descriptions.Item className="flex-col" label={i18n["Địa chỉ cụ thể"]} span={2}>
                {bookingData.recipientAddress.fullAddress}
              </Descriptions.Item>
            </Descriptions>
          )}
        </div>
        <Divider style={{ margin: "12px 0" }} />
        <Typography.Title level={5} ellipsis type="secondary">
          {i18n["Tóm tắt"]}:
        </Typography.Title>
        <Descriptions column={2} size="small">
          <Descriptions.Item label={i18n["Trạng thái"]} span={2}>
            <BookingState state={bookingData.state} />
          </Descriptions.Item>
          <Descriptions.Item label={i18n["Phương thức"]} span={2}>
            <PaymentMethodTag method={bookingData.paymentMethod} />
          </Descriptions.Item>
          {gTypeProvider === 3 ? (
            <></>
          ) : (
            <Descriptions.Item label={i18n["Tổng tiền"]} span={2}>
              <Typography.Text ellipsis type="success">
                {`${formatNumber(bookingData.totalPrice)}₫`}
              </Typography.Text>
            </Descriptions.Item>
          )}
        </Descriptions>
        <Divider style={{ margin: "12px 0" }} />
        <Typography.Title level={5} ellipsis type="secondary">
          {i18n["Chi tiết"]}:
        </Typography.Title>
        {!!selectedOItem && (
          <div className="orderItems-wrapper">
            <Typography.Text ellipsis className="checkin" type="secondary">
              Checkin: {formatDate(bookingData.checkIn, "DD-MM-YYYY HH:mm")}
            </Typography.Text>
            <div className="orderItem-wrapper">
              <div className="orderItem" key={uid + "firstOItem"}>
                <div className="image-wrapper">
                  <Image
                    src={selectedOItem.imageUrl}
                    alt={uid + selectedOItem.id}
                    width={48}
                    height={48}
                  />
                </div>
                <div className="name-wrapper">
                  <Typography.Text strong ellipsis>
                    {selectedOItem.name}
                  </Typography.Text>
                  {gTypeProvider === 3 ? (
                    <></>
                  ) : (
                    <div className="price-wrapper">
                      <Typography.Text ellipsis type="success">
                        {`${formatNumber(selectedOItem.currentPrice)}₫`}
                      </Typography.Text>
                      <Typography.Text
                        ellipsis
                        type="secondary"
                        style={{ marginLeft: 8, fontSize: 12 }}
                      >
                        {`${formatNumber(selectedOItem.originalPrice)}₫`}
                      </Typography.Text>
                    </div>
                  )}
                </div>
              </div>
              <div className="description-wrapper">
                <Typography.Paragraph
                  ellipsis={{ rows: 2 }}
                  className="description"
                  style={{ margin: 0 }}
                >
                  <Typography.Text
                    type="secondary"
                    style={{ marginRight: 4, whiteSpace: "nowrap" }}
                  >
                    {i18n["Mô tả"]}:
                  </Typography.Text>
                  {bookingData.description}
                </Typography.Paragraph>
              </div>
            </div>
            <Typography.Text ellipsis className="checkout" type="secondary"></Typography.Text>
          </div>
        )}
      </UpdateBookingStateStyled>
    </Drawer>
  );
};
const UpdateBookingStateStyled = styled.div`
  .ant-descriptions-item-label {
    flex-shrink: 0;
  }
  .recipientAddress-wrapper {
    display: flex;
    flex-direction: column;
    position: relative;
    & > .actions-wrapper {
      position: absolute;
      right: 0;
      top: 0;
      .btn-update {
        padding-right: 4px;
        text-decoration: underline;
      }
    }
  }
  .orderItems-wrapper {
    position: relative;
    .checkin,
    .checkout {
      position: relative;
      padding-left: 16px;
      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(0, -50%);
        width: 10px;
        height: 10px;
        background-color: #ffffff;
        border: 3px solid #1677ff;
        border-radius: 50%;
      }
    }
    .checkin {
    }
    .checkout {
      margin-top: 8px;
    }
    .bottom-wrapper {
      margin-top: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .remain-items {
        flex-shrink: 0;
      }
      .remain-item {
        position: relative;
        .quantity-wrapper {
          position: absolute;
          bottom: 0;
          left: 0;
          padding: 2px 4px;
          background-color: #d9d9d9;
          border-radius: 0 4px 0 4px;
          font-size: 13px;
          max-width: calc(100% - 8px);
          overflow: hidden;
          line-height: 1.1;
        }
      }
    }
    .orderItem-wrapper {
      position: relative;
      padding-left: 16px;
      .description-wrapper {
        padding-left: 8px;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: column;
        column-gap: 4px;
      }
      &::before {
        content: "";
        position: absolute;
        inset-block-start: 10px;
        inset-inline-start: 4px;
        border-inline-start: 2px solid rgba(5, 5, 5, 0.06);
        top: 0;
        left: 0;
        height: calc(100% + 8px);
        transform: translate(4px, 0);
      }
    }
    .orderItem {
      position: relative;
      padding: 8px 12px 8px 8px;
      width: 100%;
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0.05);
      border-bottom: 1px solid transparent;
      display: flex;
      align-items: stretch;
      .image-wrapper {
        position: relative;
        & > .ant-image > .ant-image-img {
          border-radius: 4px;
        }
        .quantity-wrapper {
          position: absolute;
          bottom: 0;
          left: 0;
          padding: 0px 6px;
          background-color: #d9d9d9;
          border-radius: 0 4px 0 4px;
        }
      }
      .name-wrapper {
        margin-left: 8px;
        display: flex;
        flex-direction: column;
        padding-bottom: 1px;
        & > * {
          line-height: 1.25;
        }
        .price-wrapper {
          margin-top: auto;
        }
      }
    }
  }
  .help-wrapper {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    flex-wrap: nowrap;
    padding-top: 8px;
    & > svg {
      flex-shrink: 0;
      margin-top: 2px;
    }
    & > .ant-typography {
      line-height: 1.3;
    }
  }
`;

const BtnLabelStyled = styled(Button)`
  width: 100%;
  justify-content: flex-start;
  gap: 0;
  height: 38px;
  & > span {
    margin-bottom: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 4px;
  }
  & > svg {
    flex-shrink: 0;
  }
`;

const FooterStyled = styled.div`
  display: flex;
  flex-wrap: nowrap;
  column-gap: 8px;
`;

export default UpdateBookingState;

import { useUpdateStateBookingMutation } from "@/redux/query/amenity.query";
import { TAmenitiesBooking, TAmenitiesState } from "@/types/amenity.types";
import styled from "@emotion/styled";
import { Descriptions, Divider, Drawer, Form, Input, Typography, theme } from "antd";
import { useId } from "react";
import { BsChevronDown, BsInfoCircle } from "react-icons/bs";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import { formatNumber } from "src/utils/utils";
import Button from "../button/Button";
import AmenitiesBookingState from "../card/AmenitiesBookingState";
import Image from "../next/Image";
import OrderStateSelect from "./OrderStateSelect";

type TUpdateOrderStateProps = {
  open?: boolean;
  onClose?: () => void;
  item: Pick<
    TAmenitiesBooking,
    | "id"
    | "items"
    | "bookingCode"
    | "name"
    | "phoneNumber"
    | "email"
    | "description"
    | "checkIn"
    | "checkOut"
    | "totalPrice"
    | "state"
    | "totalDepist"
    | "recipientAddress"
  >;
};

const UpdateAmenitiesBookingState = ({ item, onClose, open, ...props }: TUpdateOrderStateProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { notification } = useApp();

  const [updateStateBookingMutate, { isLoading: isUpdateStateBookingLoading }] =
    useUpdateStateBookingMutation();

  const {
    token: { colorTextPlaceholder },
  } = theme.useToken();

  const [form] = Form.useForm();
  const stateWatch = Form.useWatch("state", form);

  const handleSubmit = (formData: any) => {
    const { id, state, rejectReason } = formData;
    let msgSuccess = "";
    let msgError = "";

    switch (state) {
      case TAmenitiesState.PROVIDER_ACCEPTED.toString():
        msgSuccess = i18n["Xác nhận đơn hàng"] + " " + i18n["thành công"];
        msgError = i18n["Đã có lỗi xảy ra khi"] + " " + i18n["Xác nhận đơn hàng"].toLowerCase();
        break;

      case TAmenitiesState.PROVIDER_COMPLETED.toString():
        msgSuccess = i18n["Hoàn thành đơn hàng"] + " " + i18n["thành công"];
        msgError = i18n["Đã có lỗi xảy ra khi"] + " " + i18n["Hoàn thành đơn hàng"].toLowerCase();
        break;

      case TAmenitiesState.PROVIDER_REJECTED.toString():
        msgSuccess = i18n["Hủy đơn hàng"] + " " + i18n["thành công"];
        msgError = i18n["Đã có lỗi xảy ra khi"] + " " + i18n["Hủy đơn hàng"].toLowerCase();
        break;

      default:
        break;
    }
    if (msgSuccess && msgError) {
      updateStateBookingMutate({ id, state, rejectReason })
        .unwrap()
        .then(() => {
          notification.success({
            message: msgSuccess,
            placement: "bottomRight",
          });
        })
        .catch(() => {
          notification.error({
            message: msgError,
            placement: "bottomRight",
          });
        })
        .finally(() => {
          onClose?.();
        });
    }
  };

  return (
    <Drawer
      open={open}
      onClose={() => onClose?.()}
      maskClosable={!isUpdateStateBookingLoading}
      closable={!isUpdateStateBookingLoading}
      destroyOnClose
      width={440}
      afterOpenChange={() => {
        form.resetFields();
      }}
      title={
        <Typography.Text ellipsis style={{ maxWidth: 360, textAlign: "right" }}>
          {i18n["Đơn hàng"]} · {item?.bookingCode || ""}
        </Typography.Text>
      }
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
          {[
            TAmenitiesState.USER_REQUESTED,
            TAmenitiesState.USER_REQUESTED_WITH_PAY_DEPOSIT,
            TAmenitiesState.USER_REQUESTED_WITH_PAY_ALL,
            TAmenitiesState.PROVIDER_ACCEPTED,
          ].includes(item.state) && (
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              block
              loading={isUpdateStateBookingLoading}
              form={uid}
            >
              {i18n["Cập nhật"]}
            </Button>
          )}
        </FooterStyled>
      }
    >
      <UpdateAmenitiesBookingStateStyled>
        <div className="recipientAddress-wrapper">
          <Typography.Title level={5} ellipsis type="secondary" style={{ margin: "8px 0" }}>
            {i18n["Cập nhật đơn hàng"]}:
          </Typography.Title>
          {!!item && (
            <Form
              form={form}
              id={uid}
              size="large"
              layout="vertical"
              requiredMark={false}
              onFinish={handleSubmit}
              initialValues={{ id: item.id }}
            >
              <Form.Item name="id" hidden rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="state" rules={[{ required: true }]} className="hide-error">
                <OrderStateSelect
                  items={
                    item.state == TAmenitiesState.USER_REQUESTED
                      ? [
                          {
                            label: i18n["Xác nhận đơn hàng"],
                            key: TAmenitiesState.PROVIDER_ACCEPTED.toString(),
                          },
                          { type: "divider" },
                          {
                            label: i18n["Hủy đơn hàng"],
                            key: TAmenitiesState.PROVIDER_REJECTED.toString(),
                            danger: true,
                          },
                        ]
                      : item.state == TAmenitiesState.PROVIDER_ACCEPTED
                      ? [
                          {
                            label: i18n["Xác nhận hoàn thành"],
                            key: TAmenitiesState.PROVIDER_COMPLETED.toString(),
                          },
                          { type: "divider" },
                          {
                            label: i18n["Hủy đơn hàng"],
                            key: TAmenitiesState.PROVIDER_REJECTED.toString(),
                            danger: true,
                          },
                        ]
                      : []
                  }
                >
                  {(selectedType) => (
                    <BtnLabelStyled size="large">
                      {!!selectedType ? selectedType.label : i18n["Chọn trạng thái đơn"]}
                      <Divider type="vertical" style={{ marginLeft: "auto" }} />
                      <BsChevronDown size={16} color={colorTextPlaceholder} />
                    </BtnLabelStyled>
                  )}
                </OrderStateSelect>
              </Form.Item>

              {stateWatch === TAmenitiesState.PROVIDER_ACCEPTED.toString() && (
                <div className="help-wrapper">
                  <BsInfoCircle size={14} />
                  <Typography.Paragraph type="secondary">
                    {i18n["Đơn hàng sẽ từ"]} <b>{i18n["Đã yêu cầu"]}</b> {i18n["sang"]}{" "}
                    <b>{i18n["Đang xử lý"]}</b>
                  </Typography.Paragraph>
                </div>
              )}
              {stateWatch === TAmenitiesState.PROVIDER_COMPLETED.toString() && (
                <div className="help-wrapper">
                  <BsInfoCircle size={14} />
                  <Typography.Paragraph type="secondary">
                    {i18n["Đơn hàng sẽ từ"]} <b>{i18n["Đang xử lý"]}</b> {i18n["sang"]}{" "}
                    <b>{i18n["Đã hoàn thành"]}</b>
                  </Typography.Paragraph>
                </div>
              )}

              {stateWatch === TAmenitiesState.PROVIDER_REJECTED.toString() && (
                <Form.Item
                  name="rejectReason"
                  rules={[{ required: true }]}
                  label={
                    <div className="help-wrapper">
                      <BsInfoCircle size={14} color={"#ff4d4f"} />
                      <Typography.Text type="secondary">
                        {i18n["Bạn có chắc chắn"]} <b>{i18n["Hủy"].toLowerCase()}</b>{" "}
                        {i18n["đơn hàng này"]}?
                      </Typography.Text>
                    </div>
                  }
                >
                  <Input.TextArea
                    size="large"
                    placeholder={i18n["Nhập lý do bạn hủy đơn"]}
                    autoSize={{ minRows: 2 }}
                    showCount
                  />
                </Form.Item>
              )}
            </Form>
          )}

          <Divider style={{ margin: "16px 0" }} />
          <Typography.Title level={5} ellipsis type="secondary">
            {i18n["Thông tin người đặt hàng"]}:
          </Typography.Title>
          <Descriptions column={2} size="small">
            <Descriptions.Item label={i18n["Tên khách hàng"]} span={2}>
              {item.name}
            </Descriptions.Item>
            <Descriptions.Item label={i18n["Email"]} span={2}>
              {item?.email}
            </Descriptions.Item>
            <Descriptions.Item label={i18n["Số điện thoại"]} span={2}>
              {item?.phoneNumber}
            </Descriptions.Item>
            <Descriptions.Item label={i18n["Địa chỉ"]} span={2}>
              {item?.recipientAddress}
            </Descriptions.Item>
            <Descriptions.Item label={i18n["Lời nhắn"]} span={2}>
              {item?.description}
            </Descriptions.Item>
          </Descriptions>
        </div>

        <Divider style={{ margin: "12px 0" }} />
        <Typography.Title level={5} ellipsis type="secondary">
          {i18n["Tóm tắt"]}:
        </Typography.Title>
        {item && (
          <Descriptions column={2} size="small">
            <Descriptions.Item label={i18n["Trạng thái"]} span={2}>
              <AmenitiesBookingState state={item.state} />
            </Descriptions.Item>

            <Descriptions.Item label={i18n["Tổng số dịch vụ"]} span={2}>
              {`x${formatNumber(item?.items?.length)}`}
            </Descriptions.Item>
            <Descriptions.Item label={i18n["Tổng tiền"]} span={2}>
              <Typography.Text ellipsis type="success">
                {`${formatNumber(item.totalPrice)}₫`}
              </Typography.Text>
            </Descriptions.Item>
          </Descriptions>
        )}

        <Divider style={{ margin: "12px 0" }} />
        <div className="bookingItems-wrapper">
          <Typography.Title level={5} ellipsis type="secondary">
            {i18n["Danh sách dịch vụ"]}:
          </Typography.Title>
          {item?.items?.map((bItem, index) => (
            <div className="bookingItem" key={uid + index}>
              <div className="image-wrapper">
                <Image src={bItem?.avatarUrl || ""} alt={uid + index} width={80} height={80} />
              </div>
              <div className="name-wrapper">
                <Typography.Text strong ellipsis>
                  {bItem.name}
                </Typography.Text>

                <Typography.Text ellipsis type="success" style={{ marginTop: 8 }}>
                  {i18n["Giá tiền"]}: {`${formatNumber(bItem.price)}₫`}
                </Typography.Text>
                <Typography.Text ellipsis type="secondary" style={{ marginTop: 8 }}>
                  {i18n["Đặt cọc"]}: {`${formatNumber(bItem?.minimumDeposit)}₫`}
                </Typography.Text>
              </div>
            </div>
          ))}
        </div>
      </UpdateAmenitiesBookingStateStyled>
    </Drawer>
  );
};
const UpdateAmenitiesBookingStateStyled = styled.div`
  .ant-descriptions-item-label {
    flex-shrink: 0;
  }
  .bookingItems-wrapper {
    .bookingItem {
      padding: 8px 12px 8px 8px;
      margin-bottom: 12px;
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
  .ant-timeline-item {
    .ant-timeline-item-content {
      min-height: 0px;
      height: fit-content;
      display: flex;
      flex-direction: column;
      & > .ant-typography {
        line-height: 1.4;
        margin-bottom: 0;
      }
    }
    &.ant-timeline-item-last {
      padding-bottom: 0px;
    }
    &:nth-last-of-type(2) {
      padding-bottom: 0px;
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

export default UpdateAmenitiesBookingState;

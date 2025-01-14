import useGetProvider from "@/hooks/useGetProvider";
import { useGetAllRatesQuery } from "@/redux/query/item.query";
import { TEDeliveryProvider } from "@/types/farm.types";
import { TItemRateFilter } from "@/types/item.types";
import { formatDate } from "@/utils/utils-date";
import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/query";
import { useDebounce } from "ahooks";
import {
  Avatar,
  Descriptions,
  Divider,
  Drawer,
  Flex,
  Form,
  Input,
  Rate,
  Select,
  Timeline,
  Typography,
  theme,
} from "antd";
import { useId, useState } from "react";
import { BsChevronDown, BsInfoCircle } from "react-icons/bs";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useGetListProviderAddressesQuery } from "src/redux/query/addresses.query";
import {
  usePartnerCancelOrderMutation,
  usePartnerConfirmOrderMutation,
} from "src/redux/query/order.query";
import { TEOrderTypeConfirm, TEOrderTypeRefuse, TOrder, TStateOrder } from "src/types/order.types";
import { formatNumber, getTotalByDatakey } from "src/utils/utils";
import Button from "../button/Button";
import OrderState from "../card/OrderState";
import Image from "../next/Image";
import DeliveryMethodTag from "../tag/DeliveryMethodTag";
import PaymentMethodTag from "../tag/PaymentMethodTag";
import ImagesUploadWithQuery from "./ImagesUploadWithQuery";
import OrderStateSelect from "./OrderStateSelect";
import RateResponseInput from "./RateResponseInput";

type TUpdateOrderStateProps = {
  open?: boolean;
  onClose?: () => void;
  item: Pick<
    TOrder,
    | "id"
    | "orderCode"
    | "trackingInfo"
    | "state"
    | "paymentMethod"
    | "orderItemList"
    | "totalPrice"
    | "recipientAddress"
    | "description"
  >;
};

const UpdateOrderState = ({ item, onClose, open }: TUpdateOrderStateProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { notification } = useApp();
  const [confirmOrderMutate, { isLoading: isConfirmLoading }] = usePartnerConfirmOrderMutation();
  const [cancelOrderMutate, { isLoading: isCancelLoading }] = usePartnerCancelOrderMutation();
  const isLoading = isConfirmLoading || isCancelLoading;

  const {
    token: { colorTextPlaceholder },
  } = theme.useToken();

  const [form] = Form.useForm();
  const typeWatch = Form.useWatch("type", form);
  const { gSelectedProvider } = useGetProvider({});
  const debouncedFilterData = useDebounce(
    {
      maxResultCount: 1000,
      providerId: gSelectedProvider?.id,
    },
    { wait: 500 },
  );
  const { data: resAddress } = useGetListProviderAddressesQuery(debouncedFilterData, {
    refetchOnMountOrArgChange: true,
    skip: !debouncedFilterData?.providerId,
  });
  const dataAddress = resAddress?.data || [];

  const [rateFilterData, setRateFilterData] = useState<TItemRateFilter>({
    orderBy: 1,
    maxResultCount: 1000,
    sortBy: 2,
  });
  const debouncedRateFilterData = useDebounce(
    {
      ...rateFilterData,
      providerId: gSelectedProvider?.id,
      type: 3,
      transactionType: 1,
      transactionId: item?.id,
    },
    { wait: 500 },
  );

  const { data: dataRatesRes } = useGetAllRatesQuery(
    !!gSelectedProvider?.id ? debouncedRateFilterData : skipToken,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      skip: !debouncedRateFilterData?.providerId,
    },
  );

  const dataItemRates = dataRatesRes?.data || [];

  const handleSubmit = (formData: any) => {
    const { id, type, reason, urls, addressId } = formData;
    let address = {
      fromProvinceName: "",
      fromDistrictName: "",
      fromWardName: "",
      fromAddress: "",
      fromName: "",
      fromPhone: "",
    };
    if (addressId) {
      let addressItem = dataAddress.find((x) => x.id == addressId);
      if (addressItem) {
        address.fromProvinceName = addressItem.provinceName;
        address.fromDistrictName = addressItem.districtName;
        address.fromWardName = addressItem.wardName;
        address.fromAddress = addressItem.detail;
        address.fromName = addressItem.name;
        address.fromPhone = addressItem.phoneNumber;
      }
    }
    let msgSuccess = "";
    let msgError = "";
    let action = 0; //1:confirm, 2:cancel
    let typeAction = 0;
    switch (type) {
      case TStateOrder.TO_SHIP_TO_PROCESS.toString():
        msgSuccess =
          (item.state == TStateOrder.TO_CONFIRM
            ? i18n["Xác nhận đơn hàng"]
            : i18n["Từ chối hủy đơn"]) +
          " " +
          i18n["thành công"];
        msgError =
          i18n["Đã có lỗi xảy ra khi"] +
          " " +
          (item.state == TStateOrder.TO_CONFIRM
            ? i18n["Xác nhận đơn hàng"].toLowerCase()
            : i18n["Từ chối hủy đơn"].toLowerCase());
        action = item.state == TStateOrder.TO_CONFIRM ? 1 : 2;
        typeAction =
          item.state == TStateOrder.TO_CONFIRM
            ? TEOrderTypeConfirm.CONFIRM
            : TEOrderTypeRefuse.REFUSE_CANCEL;
        break;
      case TStateOrder.TO_SHIP_PROCESSED.toString():
        msgSuccess = i18n["Xác nhận đóng gói đơn hàng"] + " " + i18n["thành công"];
        msgError =
          i18n["Đã có lỗi xảy ra khi"] + " " + i18n["Xác nhận đóng gói đơn hàng"].toLowerCase();
        action = 1;
        typeAction = TEOrderTypeConfirm.CONFIRM_TO_SHIP_PROCESSED;
        break;
      case TStateOrder.SHIPPING.toString():
        msgSuccess = i18n["Xác nhận giao đơn"] + " " + i18n["thành công"];
        msgError = i18n["Đã có lỗi xảy ra khi"] + " " + i18n["Xác nhận giao đơn"].toLowerCase();
        action = 1;
        typeAction = TEOrderTypeConfirm.CONFIRM_SHIPPING;
        break;
      case TStateOrder.SHIPPER_COMPLETED.toString():
        msgSuccess =
          (item.state == TStateOrder.SHIPPING
            ? i18n["Xác nhận giao hàng"]
            : i18n["Từ chối trả hàng/hoàn tiền"]) +
          " " +
          i18n["thành công"];
        msgError =
          i18n["Đã có lỗi xảy ra khi"] +
          " " +
          (item.state == TStateOrder.TO_CONFIRM
            ? i18n["Xác nhận giao hàng"].toLowerCase()
            : i18n["Từ chối trả hàng/hoàn tiền"].toLowerCase());
        action = item.state == TStateOrder.SHIPPING ? 1 : 2;
        typeAction =
          item.state == TStateOrder.SHIPPING
            ? TEOrderTypeConfirm.CONFIRM_SHIPPER_COMPLETED
            : TEOrderTypeRefuse.REFUSE_RETURN_REFUND;
        break;

      case TStateOrder.CANCELLATION_CANCELLED.toString():
        msgSuccess =
          (item.state == TStateOrder.TO_CONFIRM || item.state == TStateOrder.TO_SHIP_TO_PROCESS
            ? i18n["Hủy đơn hàng"]
            : i18n["Xác nhận hủy đơn"]) +
          " " +
          i18n["thành công"];
        msgError =
          i18n["Đã có lỗi xảy ra khi"] +
          " " +
          (item.state == TStateOrder.TO_CONFIRM || item.state == TStateOrder.TO_SHIP_TO_PROCESS
            ? i18n["Hủy đơn hàng"].toLowerCase()
            : i18n["Xác nhận hủy đơn"].toLowerCase());
        action =
          item.state == TStateOrder.TO_CONFIRM || item.state == TStateOrder.TO_SHIP_TO_PROCESS
            ? 2
            : 1;
        typeAction =
          item.state == TStateOrder.TO_CONFIRM || item.state == TStateOrder.TO_SHIP_TO_PROCESS
            ? TEOrderTypeRefuse.REFUSE
            : TEOrderTypeConfirm.CONFIRM_CANCEL;
        break;
      case TStateOrder.RETURN_REFUND_COMPLETED.toString():
        msgSuccess = i18n["Xác nhận trả hàng/hoàn tiền"] + " " + i18n["thành công"];
        msgError =
          i18n["Đã có lỗi xảy ra khi"] + " " + i18n["Xác nhận trả hàng/hoàn tiền"].toLowerCase();
        action = 1;
        typeAction = TEOrderTypeConfirm.CONFIRM_RETURN_REFUND;
        break;

      default:
        break;
    }
    if (msgSuccess && msgError && action > 0 && action <= 2) {
      if (action == 1) {
        confirmOrderMutate({ id, typeAction, address: address })
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
      } else {
        cancelOrderMutate({ id, reason, typeAction, urls: urls || [] })
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
    }
  };
  const filterOptionAddress = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  return (
    <Drawer
      open={open}
      onClose={() => onClose?.()}
      maskClosable={!isLoading}
      closable={!isLoading}
      destroyOnClose
      width={440}
      afterOpenChange={() => {
        form.resetFields();
      }}
      title={
        <Typography.Text ellipsis style={{ maxWidth: 360, textAlign: "right" }}>
          {i18n["Đơn hàng"]} · {item?.orderCode || ""}
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
            TStateOrder.TO_CONFIRM,
            TStateOrder.TO_SHIP_TO_PROCESS,
            TStateOrder.TO_SHIP_PROCESSED,
            TStateOrder.SHIPPING,
            TStateOrder.CANCELLATION_TO_RESPOND,
            TStateOrder.RETURN_REFUND_NEW_REQUEST,
          ].includes(item.state) && (
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
          )}
        </FooterStyled>
      }
    >
      <UpdateOrderStateStyled>
        <div className="recipientAddress-wrapper">
          <Typography.Title level={5} ellipsis type="secondary" style={{ marginBottom: 0 }}>
            {i18n["Trạng thái đơn hàng"]}:
          </Typography.Title>
          <Timeline
            mode="left"
            items={[
              { dot: <></> },
              ...(item?.trackingInfo || []).map(({ actionAt, content, title }) => ({
                color: "blue",
                children: (
                  <>
                    <Typography.Text ellipsis style={{ fontWeight: "600" }}>
                      {title}
                    </Typography.Text>
                    <Typography.Text ellipsis type="secondary">
                      {content}
                    </Typography.Text>
                    <Typography.Text ellipsis type="secondary">
                      {formatDate(actionAt, "DD-MM-YYYY HH:mm")}
                    </Typography.Text>
                  </>
                ),
              })),
              { dot: <></> },
            ]}
          />
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
              <Form.Item name="type" rules={[{ required: true }]} className="hide-error">
                <OrderStateSelect
                  items={
                    item.state == TStateOrder.TO_CONFIRM
                      ? [
                          // {
                          //   label: i18n["Xác nhận đơn hàng"],
                          //   key: TStateOrder.TO_SHIP_TO_PROCESS.toString(),
                          // },
                          // { type: "divider" },
                          {
                            label: i18n["Hủy đơn hàng"],
                            key: TStateOrder.CANCELLATION_CANCELLED.toString(),
                            danger: true,
                          },
                        ]
                      : item.state == TStateOrder.TO_SHIP_TO_PROCESS
                      ? [
                          {
                            label: i18n["Xác nhận đóng gói đơn hàng"],
                            key: TStateOrder.TO_SHIP_PROCESSED.toString(),
                          },
                          { type: "divider" },
                          {
                            label: i18n["Hủy đơn hàng"],
                            key: TStateOrder.CANCELLATION_CANCELLED.toString(),
                            danger: true,
                          },
                        ]
                      : item.state == TStateOrder.TO_SHIP_PROCESSED &&
                        item.recipientAddress?.deliveryProvider == TEDeliveryProvider.Self
                      ? [
                          {
                            label: i18n["Xác nhận giao đơn"],
                            key: TStateOrder.SHIPPING.toString(),
                          },
                        ]
                      : item.state == TStateOrder.SHIPPING &&
                        item.recipientAddress?.deliveryProvider == TEDeliveryProvider.Self
                      ? [
                          {
                            label: i18n["Xác nhận giao hàng"],
                            key: TStateOrder.SHIPPER_COMPLETED.toString(),
                          },
                        ]
                      : item.state == TStateOrder.CANCELLATION_TO_RESPOND
                      ? [
                          {
                            label: i18n["Đồng ý hủy đơn"],
                            key: TStateOrder.CANCELLATION_CANCELLED.toString(),
                          },
                          { type: "divider" },
                          {
                            label: i18n["Từ chối hủy đơn"],
                            key: TStateOrder.TO_SHIP_TO_PROCESS.toString(),
                            danger: true,
                          },
                        ]
                      : item.state == TStateOrder.RETURN_REFUND_NEW_REQUEST
                      ? [
                          {
                            label: i18n["Xác nhận trả hàng/hoàn tiền"],
                            key: TStateOrder.RETURN_REFUND_COMPLETED.toString(),
                          },
                          { type: "divider" },
                          {
                            label: i18n["Từ chối trả hàng/hoàn tiền"],
                            key: TStateOrder.SHIPPER_COMPLETED.toString(),
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
              {typeWatch === TStateOrder.TO_SHIP_TO_PROCESS.toString() && (
                <div className="help-wrapper">
                  <BsInfoCircle size={14} />
                  <Typography.Paragraph type="secondary">
                    {i18n["Đơn hàng sẽ từ"]} <b>{i18n["Chờ xác nhận"]}</b> {i18n["sang"]}{" "}
                    <b>{i18n["Chờ lấy hàng"]}</b>
                  </Typography.Paragraph>
                </div>
              )}
              {typeWatch === TStateOrder.TO_SHIP_PROCESSED.toString() && (
                <div className="help-wrapper">
                  <BsInfoCircle size={14} />
                  <Typography.Paragraph type="secondary">
                    {i18n["Đơn hàng sẽ từ"]} <b>{i18n["Chờ đóng gói"]}</b> {i18n["sang"]}{" "}
                    <b>{i18n["Chờ lấy hàng"]}</b>
                  </Typography.Paragraph>
                </div>
              )}
              {typeWatch === TStateOrder.SHIPPING.toString() && (
                <div className="help-wrapper">
                  <BsInfoCircle size={14} />
                  <Typography.Paragraph type="secondary">
                    {i18n["Đơn hàng sẽ từ"]} <b>{i18n["Chờ lấy hàng"]}</b> {i18n["sang"]}{" "}
                    <b>{i18n["Đang giao hàng"]}</b>
                  </Typography.Paragraph>
                </div>
              )}
              {typeWatch === TStateOrder.SHIPPER_COMPLETED.toString() && (
                <div className="help-wrapper">
                  <BsInfoCircle size={14} />
                  <Typography.Paragraph type="secondary">
                    {i18n["Đơn hàng sẽ từ"]} <b>{i18n["Đang giao hàng"]}</b> {i18n["sang"]}{" "}
                    <b>{i18n["Giao hàng thành công"]}</b>
                  </Typography.Paragraph>
                </div>
              )}
              {typeWatch === TStateOrder.RETURN_REFUND_COMPLETED.toString() && (
                <div className="help-wrapper">
                  <BsInfoCircle size={14} color={"#ff4d4f"} />
                  <Typography.Paragraph type="secondary">
                    {i18n["Chấp nhận cho"]} <b>{i18n["Trả hàng/hoàn tiền"]}</b> {i18n["đơn hàng"]}{" "}
                    {"("} {i18n["khi đơn hàng đang trong trạng thái"]}{" "}
                    <b>{i18n["Chờ xác nhận trả hàng/hoàn tiền"]}</b> {")"}
                  </Typography.Paragraph>
                </div>
              )}
              {typeWatch === TStateOrder.CANCELLATION_CANCELLED.toString() && (
                <>
                  <Form.Item
                    name="reason"
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
                  <Divider />
                  <Form.Item
                    label={i18n["Hình ảnh"]}
                    name="urls"
                    rules={[{ type: "array", required: false, defaultField: { type: "url" } }]}
                  >
                    <ImagesUploadWithQuery />
                  </Form.Item>
                </>
              )}
              {typeWatch == TStateOrder.TO_SHIP_PROCESSED.toString() && (
                <>
                  <Form.Item
                    label={i18n["Địa chỉ lấy hàng"]}
                    name="addressId"
                    rules={[{ required: true }]}
                  >
                    <Select
                      allowClear
                      placement="bottomRight"
                      placeholder={i18n["Chọn"]}
                      showSearch={true}
                      filterOption={filterOptionAddress}
                      options={dataAddress?.map((item: any) => ({
                        value: item.id,
                        label: item.name,
                      }))}
                    />
                  </Form.Item>
                </>
              )}
            </Form>
          )}
          <Divider style={{ margin: "12px 0" }} />
          <Typography.Title level={5} ellipsis type="secondary">
            {i18n["Thông tin nơi lấy hàng"]}:
          </Typography.Title>
          <Descriptions column={2} size="small">
            <Descriptions.Item label={i18n["Đơn vị vận chuyển"]} span={2}>
              <DeliveryMethodTag
                bordered={false}
                method={item.recipientAddress?.deliveryProvider}
              />
            </Descriptions.Item>
            {item.recipientAddress?.fromName && (
              <Descriptions.Item label={i18n["Nơi lấy hàng"]} span={2}>
                {item.recipientAddress?.fromName}
              </Descriptions.Item>
            )}
            {item.recipientAddress?.fromPhone && (
              <Descriptions.Item label={i18n["Số điện thoại"]} span={2}>
                {item.recipientAddress?.fromPhone}
              </Descriptions.Item>
            )}
            {item.recipientAddress?.fromWardName && (
              <Descriptions.Item label={i18n["Khu vực"]} span={2}>
                {`${item.recipientAddress?.fromWardName}, ${item.recipientAddress?.fromDistrictName}, ${item.recipientAddress?.fromProvinceName}`}
              </Descriptions.Item>
            )}
            {item.recipientAddress?.fromAddress && (
              <Descriptions.Item className="flex-col" label={i18n["Địa chỉ cụ thể"]} span={2}>
                {item.recipientAddress?.fromAddress}
              </Descriptions.Item>
            )}
          </Descriptions>
          <Divider style={{ margin: "12px 0" }} />
          <Typography.Title level={5} ellipsis type="secondary">
            {i18n["Thông tin giao hàng"]}:
          </Typography.Title>
          <Descriptions column={2} size="small">
            <Descriptions.Item label={i18n["Tên người nhận"]} span={2}>
              {item.recipientAddress?.toName}
            </Descriptions.Item>
            <Descriptions.Item label={i18n["Số điện thoại"]} span={2}>
              {item.recipientAddress?.toPhone}
            </Descriptions.Item>
            <Descriptions.Item label={i18n["Khu vực"]} span={2}>
              {`${item.recipientAddress?.toWardName}, ${item.recipientAddress?.toDistrictName}, ${item.recipientAddress?.toProvinceName}`}
            </Descriptions.Item>
            <Descriptions.Item className="flex-col" label={i18n["Địa chỉ cụ thể"]} span={2}>
              {item.recipientAddress?.toAddress}
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
              <OrderState state={item.state} />
            </Descriptions.Item>
            <Descriptions.Item label={i18n["Phương thức"]} span={2}>
              <PaymentMethodTag method={item.paymentMethod} />
            </Descriptions.Item>
            <Descriptions.Item label={i18n["Tổng sản phẩm"]} span={2}>
              {`x${formatNumber(getTotalByDatakey(item.orderItemList, "quantity"))}`}
            </Descriptions.Item>
            <Descriptions.Item label={i18n["Tổng tiền"]} span={2}>
              <Typography.Text ellipsis type="success">
                {`${formatNumber(item.totalPrice)}₫`}
              </Typography.Text>
            </Descriptions.Item>
          </Descriptions>
        )}

        <Divider style={{ margin: "12px 0" }} />
        <div className="orderItems-wrapper">
          <Typography.Title level={5} ellipsis type="secondary">
            {i18n["Danh sách sản phẩm"]}:
          </Typography.Title>
          {item.orderItemList.map((oItem, index) => (
            <div className="orderItem" key={uid + oItem.id + index}>
              <div className="image-wrapper">
                <Image src={oItem.imageUrl} alt={uid + oItem.id} width={80} height={80} />
                <div className="quantity-wrapper">{`x${oItem.quantity}`}</div>
              </div>
              <div className="name-wrapper">
                <Typography.Text strong ellipsis>
                  {oItem.name}
                </Typography.Text>
                <Typography.Text ellipsis type="secondary">
                  {`(${oItem.itemName})`}
                </Typography.Text>
                <Typography.Text ellipsis type="secondary">
                  {`SKU: ${!!oItem.sku ? oItem.sku : "---"}`}
                </Typography.Text>
                <div className="price-wrapper">
                  <Typography.Text ellipsis type="success">
                    {`${formatNumber(oItem.currentPrice)}₫`}
                  </Typography.Text>
                  <Typography.Text ellipsis type="secondary" style={{ marginLeft: 8 }}>
                    {`${formatNumber(oItem.originalPrice)}₫`}
                  </Typography.Text>
                </div>
              </div>

            </div>
          ))}
        </div>

        {!!dataItemRates?.length && (
          <>
            <Divider style={{ margin: "12px 0" }} />
            <div className="rateItems-wrapper">
              <Typography.Title level={5} ellipsis type="secondary">
                {i18n["Đánh giá đơn hàng"]}:
              </Typography.Title>
              {dataItemRates.map((rate, index) => (
                <div key={index}>
                  <Flex gap="middle">
                    <Avatar src={rate?.avatar || ""} shape="circle" />
                    <Flex vertical gap="small" className="rate-content">
                      <Typography.Text>{rate?.userName}</Typography.Text>
                      <Rate disabled defaultValue={rate.ratePoint} value={rate.ratePoint} />

                      <Typography.Text type="secondary">
                        {formatDate(rate?.creationTime, "DD-MM-YYYY HH:mm")}
                      </Typography.Text>

                      <Typography.Text>{rate?.comment}</Typography.Text>
                      {rate?.fileUrl && (
                        <Image src={rate?.fileUrl} width={80} height={80} alt="feedback" />
                      )}

                      <Flex gap="middle" align="center" className="item-rated">
                        <Image
                          src={
                            item?.orderItemList?.find((item) => item?.itemId === rate?.itemId)
                              ?.imageUrl
                          }
                          width={40}
                          height={40}
                          alt="feedback"
                        />
                        <Typography.Text>
                          {
                            item?.orderItemList?.find((item) => item?.itemId === rate?.itemId)
                              ?.itemName
                          }
                        </Typography.Text>
                      </Flex>
                      {rate?.partnerResponse?.content || rate?.partnerResponse?.imageUrls ? (
                        <Flex className="partnerResponse-wrapper" vertical>
                          <Typography.Text type="secondary">
                            {i18n["Phản hồi của người bán"]}:
                          </Typography.Text>
                          <Typography.Text>{rate?.partnerResponse?.content}</Typography.Text>
                          <Flex gap="middle">
                            {rate?.partnerResponse?.imageUrls &&
                              rate?.partnerResponse?.imageUrls?.map(
                                (image: any, imageIndex: any) => (
                                  <Image
                                    key={imageIndex}
                                    src={image}
                                    width={80}
                                    height={80}
                                    alt="partnerResponse-image"
                                  />
                                ),
                              )}
                          </Flex>
                        </Flex>
                      ) : (
                        <RateResponseInput rateId={rate?.id} />
                      )}
                    </Flex>
                  </Flex>
                  <Divider style={{ margin: "20px 10px" }} />
                </div>
              ))}
            </div>
          </>
        )}
      </UpdateOrderStateStyled>
    </Drawer>
  );
};
const UpdateOrderStateStyled = styled.div`
  .ant-descriptions-item-label {
    flex-shrink: 0;
  }
  .orderItems-wrapper {
    .orderItem {
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

  .rateItems-wrapper {
    .rate-content {
      width: calc(100% - 50px);
      .partnerResponse-wrapper {
        background-color: #f5f5f5;
        padding: 15px;
        width: 100%;
      }
      .item-rated {
        background-color: #f8f8f8;
        width: 100%;
      }
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

export default UpdateOrderState;

import styled from "@emotion/styled";
import { Descriptions, Divider, Drawer, Form, Input, Typography, theme } from "antd";
import { useId } from "react";
import { BsChevronDown, BsInfoCircle } from "react-icons/bs";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import {
  useGetEcofarmRegisterByIdQuery,
  useUpdateStateEcofarmRegisterMutation,
} from "src/redux/query/farm.query";
import { TRegisterStatus } from "src/types/farm.types";
import { formatNumber } from "src/utils/utils";
import Button from "../button/Button";
import EcoFarmRegisterStatus from "../card/EcoFarmRegisterStatus";

import { formatDate } from "@/utils/utils-date";
import { Image } from "antd";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import OrderStateSelect from "./OrderStateSelect";

type TUpdateRegisterStateFarmProps = {
  open?: boolean;
  onClose?: () => void;
  id: number;
};

const UpdateRegisterStateFarm = ({ id, onClose, open }: TUpdateRegisterStateFarmProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { notification } = useApp();
  const { data: dataRes } = useGetEcofarmRegisterByIdQuery(
    { id: id },
    { refetchOnMountOrArgChange: true },
  );
  const item = dataRes?.data;
  //const ecofarmPackage = item && item.properties ? JSON.parse(item.properties) : null;

  const [updateStatusMutate, { isLoading: isLoadingUpdate }] =
    useUpdateStateEcofarmRegisterMutation();
  const isLoading = isLoadingUpdate;

  const {
    token: { colorTextPlaceholder },
  } = theme.useToken();
  const [form] = Form.useForm();
  const typeWatch = Form.useWatch("type", form);

  const handleSubmit = (formData: any) => {
    debugger;
    const { id, type } = formData;
    let msgSuccess = "";
    let msgError = "";
    let status = 0;
    if (type == TRegisterStatus.CANCELLED) {
      status;
      msgSuccess = i18n["Hủy đăng ký gói farming thành công"];
      msgError = i18n["Đã có lỗi xảy ra khi hủy đăng ký gói farming"];
    } else if (type == TRegisterStatus.INVESTING) {
      msgSuccess = i18n["Xác nhận đăng ký gói farming thành công"];
      msgError = i18n["Đã có lỗi xảy ra khi đồng ý đăng ký gói farming"];
    }
    if (msgSuccess && msgError && type) {
      updateStatusMutate({ id, status: type })
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
      maskClosable={!isLoading}
      closable={!isLoading}
      destroyOnClose
      width={420}
      afterOpenChange={() => {
        form.resetFields();
      }}
      title={<Typography.Text ellipsis>{i18n["Thông tin đăng ký gói farming"]}</Typography.Text>}
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
            {i18n["Đóng"]}
          </Button>
          {!!item && [TRegisterStatus.PENDING_APPROVAL].includes(item.status) && (
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
      {!!item && (
        <UpdateRegisterStateFarmStyled>
          <div className="recipientAddress-wrapper">
            <Descriptions column={2} size="small">
              <Descriptions.Item label={i18n["Trạng thái"]} span={2}>
                <EcoFarmRegisterStatus state={item.status} />
              </Descriptions.Item>
              <Descriptions.Item label={i18n["Ngày đăng ký"]} span={2}>
                {formatDate(item.creationTime, "DD-MM-YYYY HH:mm")}
              </Descriptions.Item>
            </Descriptions>
            {[TRegisterStatus.PENDING_APPROVAL].includes(item.status) && (
              <>
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
                          item.status == TRegisterStatus.PENDING_APPROVAL
                            ? [
                                {
                                  label: i18n["Xác nhận đăng ký gói farming"],
                                  key: TRegisterStatus.INVESTING.toString(),
                                },
                                { type: "divider" },
                                {
                                  label: i18n["Từ chối đăng ký gói farming"],
                                  key: TRegisterStatus.CANCELLED.toString(),
                                  danger: true,
                                },
                              ]
                            : []
                        }
                      >
                        {(selectedType) => (
                          <BtnLabelStyled size="large">
                            {!!selectedType ? selectedType.label : i18n["Chọn trạng thái đăng ký"]}
                            <Divider type="vertical" style={{ marginLeft: "auto" }} />
                            <BsChevronDown size={16} color={colorTextPlaceholder} />
                          </BtnLabelStyled>
                        )}
                      </OrderStateSelect>
                    </Form.Item>
                    {typeWatch === TRegisterStatus.INVESTING.toString() && (
                      <div className="help-wrapper">
                        <BsInfoCircle size={14} />
                        <Typography.Paragraph type="secondary">
                          {i18n["Trạng thái sẽ từ"]} <b>{i18n["Chờ phê duyệt"]}</b> {i18n["sang"]}{" "}
                          <b>{i18n["Đang đầu tư"]}</b>
                        </Typography.Paragraph>
                      </div>
                    )}
                    {typeWatch === TRegisterStatus.CANCELLED.toString() && (
                      <div className="help-wrapper">
                        <BsInfoCircle size={14} />
                        <Typography.Paragraph type="secondary">
                          {i18n["Trạng thái sẽ từ"]} <b>{i18n["Chờ phê duyệt"]}</b> {i18n["sang"]}{" "}
                          <b>{i18n["Hủy đăng ký"]}</b>
                        </Typography.Paragraph>
                      </div>
                    )}
                  </Form>
                )}
              </>
            )}
            <Divider style={{ margin: "12px 0" }} />
            <Typography.Title level={5} ellipsis type="secondary">
              {i18n["Thông tin người đăng ký"]}:
            </Typography.Title>
            <Descriptions column={2} size="small">
              <Descriptions.Item label={i18n["Tên người đăng ký"]} span={2}>
                {item.recipientAddress?.name}
              </Descriptions.Item>
              <Descriptions.Item label={i18n["Điện thoại"]} span={2}>
                {item.recipientAddress?.phone}
              </Descriptions.Item>
              <Descriptions.Item label={i18n["Địa chỉ"]} span={2}>
                {item.recipientAddress?.fullAddress}
              </Descriptions.Item>
            </Descriptions>
            <Divider style={{ margin: "12px 0" }} />
            <Typography.Title level={5} ellipsis type="secondary">
              {i18n["Thông tin gói đầu tư"]}:{" "}
              <Typography.Text ellipsis type="success">
                {item.ecoFarmPackage.name}
              </Typography.Text>
            </Typography.Title>
            <div className="image-wrapper" style={{ marginBottom: 12 }}>
              <SwiperThumbStyled
                loop={true}
                spaceBetween={12}
                slidesPerView={"auto"}
                pagination={{
                  type: "fraction",
                }}
                navigation={item.ecoFarmPackage.imageUrlList.length > 4}
                modules={[Pagination, Navigation, Thumbs]}
                watchSlidesProgress
                direction={"horizontal"}
                style={{ width: "100%", height: 90 }}
              >
                {item.ecoFarmPackage.imageUrlList.length > 0 ? (
                  item.ecoFarmPackage.imageUrlList.map((vl: any, index: number) => (
                    <SwiperSlide
                      key={uid + "slider" + index}
                      style={{
                        width: 110,
                        borderRadius: 4,
                        border: `1px solid transparent`,
                      }}
                    >
                      <Image src={vl} alt={""} preview />
                    </SwiperSlide>
                  ))
                ) : (
                  <></>
                )}
              </SwiperThumbStyled>
            </div>
            {/* <Divider style={{ margin: "12px 0" }} />
            <Typography.Title level={5} ellipsis type="secondary">
              {i18n["Thông tin chủ farm"]}:
            </Typography.Title>
            <Descriptions column={2} size="small">
              <Descriptions.Item label={i18n["Chủ Farm"]} span={2}>
                {(item.partnerInfo.surName ? item.partnerInfo.surName + " " : "") +
                  item.partnerInfo.name}
              </Descriptions.Item>
              <Descriptions.Item label={i18n["Email"]} span={2}>
                {item.partnerInfo.emailAddress}
              </Descriptions.Item>
            </Descriptions> */}
          </div>

          <Divider style={{ margin: "12px 0" }} />
          <Typography.Title level={5} ellipsis type="secondary">
            {i18n["Tóm tắt"]}:
          </Typography.Title>
          {item && (
            <Descriptions column={2} size="small">
              <Descriptions.Item label={i18n["Số lượng đăng ký"]} span={2}>
                <Typography.Text ellipsis type="success">
                  {item.ecofarmType == 1 ? (
                    i18n["Combo gói"]
                  ) : (
                    <>
                      <b>{item.numberOfShared}</b> {i18n["suất"]}
                    </>
                  )}
                </Typography.Text>
              </Descriptions.Item>
              <Descriptions.Item label={i18n["Tổng tiền"]} span={2}>
                <Typography.Text ellipsis type="success">
                  {`${formatNumber(item.totalPrice)}₫`}
                </Typography.Text>
              </Descriptions.Item>
              <Descriptions.Item label={i18n["Lời nhắn"]} span={2}>
                {item.note}
              </Descriptions.Item>
            </Descriptions>
          )}

          {/* <Divider style={{ margin: "12px 0" }} />
          <Typography.Title level={5} ellipsis type="secondary">
            {i18n["Hình ảnh"]}:
          </Typography.Title>
          {item.imageUrlList?.length > 0 ? (
            <Image.PreviewGroup
              preview={{
                onChange: (current: any, prev: any) =>
                  console.log(`current index: ${current}, prev index: ${prev}`),
              }}
            >
              {item.imageUrlList.map((itemImg: any, index: number) => (
                <Image key={index} width={150} height={120} src={itemImg} alt={""} preview />
              ))}
            </Image.PreviewGroup>
          ) : (
            ""
          )} */}
        </UpdateRegisterStateFarmStyled>
      )}
    </Drawer>
  );
};

const SwiperThumbStyled = styled(Swiper)`
  flex-shrink: 0;
  .swiper-slide {
    width: 25%;
    height: 100%;
    .ant-image {
      border-radius: 4px;
      width: 100%;
      height: 100%;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02),
        0 2px 4px 0 rgba(0, 0, 0, 0.02);
      border: 1px solid rgba(0, 0, 0, 0.05);
      img {
        border-radius: 4px;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    &.swiper-slide-thumb-active {
      opacity: 1;
      .ant-image {
        border-color: ${({ theme }) => theme.colorPrimary};
      }
    }
  }
`;
const UpdateRegisterStateFarmStyled = styled.div`
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

export default UpdateRegisterStateFarm;

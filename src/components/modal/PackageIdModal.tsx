import useChangeLocale from "@/hooks/useChangeLocale";
import { useGetEcofarmPackageByIdQuery } from "@/redux/query/farm.query";
import { TPackageStatus } from "@/types/farm.types";
import { formatNumber } from "@/utils/utils";
import { formatDate } from "@/utils/utils-date";
import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/query";
import { Divider, Flex, ModalProps, Rate, Tabs, TagProps, Typography, theme } from "antd";
import { rgba } from "emotion-rgba";
import { useId, useState } from "react";
import { BsXLg } from "react-icons/bs";
import { RiEdit2Fill } from "react-icons/ri";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Button from "../button/Button";
import ItemsPackage from "../list/ItemsPackage";
import RegistersPackage from "../list/RegistersPackage";
import Image from "../next/Image";
import Container from "../shared/Container";
import { cssSwiperNavigation } from "../shared/ItemStyled";
import Tag from "../tag/Tag";
import Modal from "./Modal";

type TPackageIdModalProps = ModalProps & {
  packageId?: number;
  providerId?: number;
  activeTab?: string;
};

const PackageIdModal = ({
  packageId,
  providerId,
  activeTab = "INFO",
  ...props
}: TPackageIdModalProps) => {
  const uid = useId();
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const { i18n } = useChangeLocale();
  const { data: getEcofarmPackageByIdRes } = useGetEcofarmPackageByIdQuery(
    packageId ? { id: packageId } : skipToken,
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const itemData = getEcofarmPackageByIdRes?.data;

  const [selectedTab, setSelectedTab] = useState<string>(activeTab);

  const stateConf: Record<number, TagProps> = {
    [TPackageStatus.ONGOING]: {
      children: "Sắp diễn ra",
      color: "cyan",
    },
    [TPackageStatus.ACTIVATED]: {
      children: "Đang diễn ra",
      color: "blue",
    },
    [TPackageStatus.COMPLETED]: {
      children: "Đã hoàn thành/kết thúc",
      color: "success",
    },
    [TPackageStatus.CLOSED]: {
      children: "Đã đóng/hủy",
      color: "error",
      bordered: false,
    },
  };

  return (
    <Modal
      maskClosable={false}
      title={itemData?.name}
      style={{ top: 24 }}
      width={800}
      cancelText="Đóng"
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ icon: <BsXLg /> }}
      footer={(originNode, { CancelBtn, OkBtn }) => (
        <Flex align="center">
          <Button
            type="link"
            bgColor={rgba(colorPrimary, 0.2)}
            icon={<RiEdit2Fill />}
            target="_blank"
            className="btn-link-edit"
            href={`/supplier/farm/${providerId}/package/${String(packageId)}/edit`}
          >
            {i18n["Cập nhật"]}
          </Button>
          {/* <Divider type="vertical" style={{ height: 24 }} />
          <Button>Xem gói tiếp theo</Button> */}
          <Divider type="vertical" />
          {originNode}
        </Flex>
      )}
      styles={{
        content: { minHeight: "calc(100dvh - 48px)" },
        body: { flex: "1 1 auto", minHeight: 0 },
      }}
      {...props}
    >
      {itemData ? (
        <StyleWrapper>
          <Flex className="name-wrapper" justify="space-between">
            <Typography.Title
              level={2}
              className="name"
              style={{ margin: 0 }}
              ellipsis={{
                rows: 2,
                tooltip: {
                  title: `${itemData.name}`,
                  arrow: false,
                  placement: "bottomLeft",
                },
              }}
            >
              {`${itemData.name}`}
            </Typography.Title>
          </Flex>
          <Flex gap={4} style={{ marginBottom: 2 }}>
            <Typography.Text type="secondary">Địa chỉ trang trại:</Typography.Text>
            <Typography.Text>{itemData.address}</Typography.Text>
          </Flex>
          <Flex justify="space-between" style={{ marginBottom: 6 }}>
            <Flex className="others-wrapper">
              <Flex className="rate-wrapper">
                <Typography.Text type="warning" style={{ marginRight: 4 }}>
                  {itemData.ratePoint || "0"}
                </Typography.Text>
                <Rate disabled defaultValue={itemData.ratePoint} />
                <Typography.Text type="secondary" style={{ margin: "0 4px" }}>
                  •
                </Typography.Text>
                <Typography.Text type="secondary" style={{ marginRight: 4 }}>
                  {formatNumber(itemData.countRate) || "0"}
                </Typography.Text>
                <Typography.Text type="secondary">Đánh giá</Typography.Text>
              </Flex>
              <Divider type="vertical" style={{ height: 24 }} />
              <Flex>
                <Typography.Text style={{ marginRight: 4 }}>
                  {formatNumber(itemData.viewCount) || "0"}
                </Typography.Text>
                <Typography.Text>Lượt xem</Typography.Text>
              </Flex>
            </Flex>
            <Flex>
              <Typography.Text type="secondary" style={{ marginRight: 4 }}>
                Ngày tạo:
              </Typography.Text>
              <Typography.Text>
                {formatDate(itemData.creationTime, "DD-MM-YYYY HH:mm")}
              </Typography.Text>
            </Flex>
          </Flex>

          <Tabs
            tabBarGutter={12}
            defaultActiveKey={activeTab}
            activeKey={selectedTab}
            onChange={setSelectedTab}
            items={[
              {
                key: "INFO",
                label: i18n["Thông tin gói dịch vụ"].toUpperCase(),
              },
              {
                key: "PRODUCT",
                label: i18n["Sản phẩm liên quan"].toUpperCase(),
              },
              {
                key: "REGISTER",
                label: i18n["Danh sách người đăng ký"].toUpperCase(),
              },
            ]}
          />

          {selectedTab === "INFO" && (
            <>
              <div className="" style={{ marginBottom: 24 }}>
                <Flex justify="flex-start" gap={7} align="center" className="title-bg-wrapper">
                  <Typography.Title level={4} style={{ margin: 0, fontSize: 16 }}>
                    Tổng giá tiền gói:
                  </Typography.Title>

                  <Typography.Text type="success" style={{ fontSize: 17 }}>
                    {formatNumber(itemData.packagePrice)}₫
                  </Typography.Text>
                </Flex>

                <Flex align="baseline" gap={4} style={{ paddingLeft: 12, marginBottom: 6 }}>
                  <Typography.Text type="secondary" style={{ width: 132 }}>
                    {i18n["Giá tiền từng suất"]}:
                  </Typography.Text>
                  <Typography.Text ellipsis type="success" style={{ fontSize: 16 }}>
                    {formatNumber(itemData.pricePerShare)}₫
                  </Typography.Text>
                </Flex>

                <Flex align="baseline" gap={4} style={{ paddingLeft: 12, marginBottom: 6 }}>
                  <Typography.Text type="secondary" style={{ width: 132 }}>
                    {i18n["Tổng số suất"]}:
                  </Typography.Text>
                  <Typography.Text ellipsis style={{ fontSize: 16 }}>
                    {formatNumber(itemData.totalNumberShares)}
                  </Typography.Text>
                </Flex>

                <Flex align="baseline" gap={4} style={{ paddingLeft: 12 }}>
                  <Typography.Text type="secondary" style={{ width: 132 }}>
                    {i18n["Số suất đã bán"]}:
                  </Typography.Text>
                  <Typography.Text ellipsis style={{ fontSize: 16 }}>
                    {formatNumber(itemData.numberSharesSold)}
                  </Typography.Text>
                </Flex>
              </div>

              <div className="start-end-date-wrapper" style={{ marginBottom: 24 }}>
                <Flex justify="space-between" align="center" className="title-bg-wrapper">
                  <Typography.Title level={4} style={{ margin: 0, fontSize: 16 }}>
                    <span>Thời gian</span> <span style={{ opacity: 0.6 }}>bắt đầu → thu hoạch</span>
                  </Typography.Title>
                </Flex>

                <Flex align="baseline" gap={4} style={{ paddingLeft: 12, marginBottom: 6 }}>
                  <Typography.Text type="secondary" style={{ width: 78 }}>
                    Bắt đầu:
                  </Typography.Text>
                  <Typography.Text ellipsis style={{ fontSize: 16 }}>
                    {formatDate(itemData.startDate, "HH:mm DD-MM-YYYY")}
                  </Typography.Text>
                  <Tag
                    style={{ alignSelf: "center" }}
                    className="tag"
                    bordered
                    {...(stateConf?.[itemData.status] || { children: "---" })}
                  />
                </Flex>
                <Flex align="baseline" gap={4} style={{ paddingLeft: 12 }}>
                  <Typography.Text type="secondary" style={{ width: 78 }}>
                    Thu hoạch:
                  </Typography.Text>
                  <Typography.Text ellipsis style={{ fontSize: 16 }}>
                    {formatDate(itemData.expectedEndDate, "HH:mm DD-MM-YYYY")}
                  </Typography.Text>
                </Flex>
              </div>

              <div className="image-wrapper" style={{ marginBottom: 12 }}>
                <Flex justify="space-between" align="center" className="title-bg-wrapper">
                  <Typography.Title level={4} style={{ margin: 0, fontSize: 16 }}>
                    Video & Ảnh
                  </Typography.Title>
                </Flex>
                <SwiperThumbStyled
                  loop={true}
                  spaceBetween={12}
                  slidesPerView={"auto"}
                  pagination={{
                    type: "fraction",
                  }}
                  navigation={!!itemData.imageUrlList?.length}
                  modules={[Pagination, Navigation, Thumbs]}
                  watchSlidesProgress
                  direction={"horizontal"}
                  style={{ width: "100%", height: 200 }}
                >
                  {itemData.imageUrlList.length > 0 ? (
                    itemData.imageUrlList.map((item, index) => (
                      <SwiperSlide
                        key={uid + "slider" + index}
                        style={{
                          width: 200,
                          borderRadius: 4,
                          border: `1px solid transparent`,
                        }}
                      >
                        <Image src={item} alt={""} preview />
                      </SwiperSlide>
                    ))
                  ) : (
                    <></>
                  )}
                </SwiperThumbStyled>
              </div>

              <div className="desc-wrapper">
                <div className="title-bg-wrapper">
                  <Typography.Title level={4} style={{ margin: 0, fontSize: 17 }}>
                    Mô tả
                  </Typography.Title>
                </div>
                <div
                  className="desc"
                  dangerouslySetInnerHTML={{
                    __html: itemData.description,
                  }}
                ></div>
              </div>
            </>
          )}

          {selectedTab === "PRODUCT" && (
            <ItemsPackage packageId={packageId} providerId={itemData.providerId} />
          )}

          {selectedTab === "REGISTER" && (
            <RegistersPackage packageId={packageId} providerId={itemData.providerId} />
          )}
        </StyleWrapper>
      ) : (
        <StyleWrapper>
          <></>
        </StyleWrapper>
      )}
    </Modal>
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
  ${cssSwiperNavigation}
`;

const StyleWrapper = styled(Container)`
  display: flex;
  flex-direction: column;
  .title-bg-wrapper {
    padding: 12px;
    margin: 0 0 12px;
    background-color: rgba(0, 0, 0, 0.02);
    height: 48px;
    display: flex;
    align-items: center;
  }
  & .desc-wrapper {
    user-select: none;
    pointer-events: none;
    .desc > * {
      margin-bottom: 0px;
    }
    .desc {
      padding: 0 12px 12px;
    }
    img {
      max-width: 100%;
      object-fit: contain;
    }
  }
`;

export default PackageIdModal;

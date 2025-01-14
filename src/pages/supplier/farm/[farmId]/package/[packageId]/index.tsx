import { EcofarmSvg } from "@/components/icons";
import VideoItem from "@/components/shared/VideoItem";
import styled from "@emotion/styled";
import { Col, Divider, Rate, Row, Tabs, Typography } from "antd";
import { useRouter } from "next/router";
import { useId, useState } from "react";
import { RiEdit2Fill } from "react-icons/ri";
import Avatar from "src/components/avatar/Avatar";
import Button from "src/components/button/Button";
import Card from "src/components/card/Card";
import ItemsList from "src/components/ecofarm/itemList";
import RegisterList from "src/components/ecofarm/registerList";
import withAuth from "src/components/hoc/withAuth";
import BreadcrumbHeader from "src/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "src/components/layout/SiderHeaderLayout";
import StyledPage from "src/components/layout/StyledPage";
import Image from "src/components/next/Image";
import { cssSwiperNavigation } from "src/components/shared/ItemStyled";
import useChangeLocale from "src/hooks/useChangeLocale";
import {
  useGetEcofarmPackageByIdQuery,
  useGetProviderEcofarmByIdQuery,
} from "src/redux/query/farm.query";
import { formatNumber } from "src/utils/utils";
import { formatDate } from "src/utils/utils-date";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const Page = () => {
  const uid = useId();
  const {
    query: { packageId, farmId },
  } = useRouter();

  const { i18n } = useChangeLocale();
  const { data: dataPackage } = useGetEcofarmPackageByIdQuery(
    { id: +(packageId as string) },
    { refetchOnMountOrArgChange: true },
  );
  const { data: dataFarm } = useGetProviderEcofarmByIdQuery(
    { id: +(farmId as string) },
    { refetchOnMountOrArgChange: true, skip: !farmId },
  );
  const itemData = dataPackage?.data;
  const itemDataFarm = dataFarm?.data;

  const [selectedTab, setSelectedTab] = useState<string>("INFO");

  return (
    <SiderHeaderLayout
      headerLeft={
        <BreadcrumbHeader
          items={[
            { "/supplier/farm": <EcofarmSvg width={26} /> },
            {
              [`/supplier/farm/${farmId}`]: (
                <Avatar
                  shape="square"
                  key={String(itemDataFarm?.id) + uid}
                  src={itemDataFarm?.imageUrls[0]}
                  size={26}
                />
              ),
            },
            { [`/supplier/farm/${farmId}/package`]: i18n["Gói dịch vụ farming"] },
            { [`/supplier/farm/${farmId}/package/${packageId}`]: itemData?.name },
          ]}
        />
      }
    >
      <PageWrapper>
        {!!itemData ? (
          <>
            <Card
              size="default"
              className="detail-wrapper"
              style={{ margin: "0 auto", width: "80%" }}
            >
              <div className="image-wrapper" style={{ marginBottom: 12 }}>
                <SwiperThumbStyled
                  loop={true}
                  spaceBetween={12}
                  slidesPerView={"auto"}
                  pagination={{
                    type: "fraction",
                  }}
                  navigation={itemData.imageUrlList.length + itemData.videoUrlList.length > 4}
                  modules={[Pagination, Navigation, Thumbs]}
                  watchSlidesProgress
                  direction={"horizontal"}
                  style={{ width: "100%", height: 200 }}
                >
                  {itemData.imageUrlList.length > 0 ? (
                    itemData.imageUrlList.map((item: any, index: number) => (
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
                  {itemData.videoUrlList.length > 0 ? (
                    itemData.videoUrlList.map((item: any, index: number) => (
                      <SwiperSlide
                        key={uid + "slider" + index}
                        style={{
                          width: 200,
                          borderRadius: 4,
                          border: `1px solid transparent`,
                        }}
                      >
                        <VideoItem src={item} editMode={false} />
                      </SwiperSlide>
                    ))
                  ) : (
                    <></>
                  )}
                </SwiperThumbStyled>
              </div>
              <div className="name-wrapper">
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
                <Button
                  type="primary"
                  icon={<RiEdit2Fill />}
                  className="btn-link-edit"
                  href={`/supplier/farm/${farmId}/package/${String(packageId)}/edit`}
                >
                  {i18n["Cập nhật"]}
                </Button>
              </div>
              <div style={{ marginBottom: 6 }}>
                <Typography.Text type="secondary" style={{ marginRight: 4 }}>
                  Ngày tạo:
                </Typography.Text>
                <Typography.Text>
                  {formatDate(itemData.creationTime, "DD-MM-YYYY HH:mm")}
                </Typography.Text>
              </div>
              <div className="others-wrapper">
                <div className="flex rate-wrapper">
                  <Typography.Text type="warning" underline style={{ marginRight: 4 }}>
                    {itemData.ratePoint || "0"}
                  </Typography.Text>
                  <Rate disabled defaultValue={itemData.ratePoint} />
                  <Typography.Text type="secondary" style={{ margin: "0 4px" }}>
                    •
                  </Typography.Text>
                  <Typography.Text type="secondary" underline style={{ marginRight: 4 }}>
                    {formatNumber(itemData.countRate) || "0"}
                  </Typography.Text>
                  <Typography.Text type="secondary">Đánh giá</Typography.Text>
                </div>
                <Divider type="vertical" style={{ height: 24 }} />
                <div className="flex">
                  <Typography.Text underline style={{ marginRight: 4 }}>
                    {formatNumber(itemData.viewCount) || "0"}
                  </Typography.Text>
                  <Typography.Text>Lượt xem</Typography.Text>
                </div>
              </div>
              <div className="price-wrapper">
                <Typography.Text type="success" style={{ fontSize: 24 }}>
                  {`${formatNumber(itemData.pricePerShare)}₫ ~ ${formatNumber(
                    itemData.packagePrice,
                  )}₫`}
                </Typography.Text>
              </div>
              <div className="nav-tabs">
                <Tabs
                  defaultActiveKey={selectedTab}
                  onChange={(activeKey) => {
                    setSelectedTab(activeKey);
                  }}
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
              </div>
              {selectedTab == "INFO" && (
                <div className="tab-more-detail">
                  {itemData.description && (
                    <>
                      <div className="desc-wrapper">
                        <div className="title-bg-wrapper">
                          <Typography.Title level={5} style={{ margin: 0 }}>
                            {i18n["Mô tả"]}
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
                  <div className="desc-wrapper">
                    <div className="title-bg-wrapper">
                      <Typography.Title level={5} style={{ margin: 0 }}>
                        {i18n["Thông tin thời gian gói dịch vụ farming"]}
                      </Typography.Title>
                    </div>
                    <div className="desc package-view-expand">
                      <Row>
                        <Col span={8} className="divcol">
                          <span className="divtitle">{i18n["Số tháng đầu tư"]}:</span>
                          <span className="divvalue">
                            <b>{itemData.totalInvestmentTerm}</b>{" "}
                            <span style={{ color: "green" }}>{i18n["tháng"]}</span>
                          </span>
                        </Col>
                        <Col span={8} className="divcol">
                          <span className="divtitle">{i18n["Thời gian bắt đầu đầu tư"]}:</span>
                          <span className="divvalue">
                            <b>{formatDate(itemData.startDate.toString())}</b>
                          </span>
                        </Col>
                        <Col span={8} className="divcol">
                          <span className="divtitle">{i18n["Ngày thu hoạch dự kiến"]}:</span>
                          <span className="divvalue">
                            <b>{formatDate(itemData.expectedEndDate.toString())}</b>
                          </span>
                        </Col>
                      </Row>
                    </div>
                  </div>
                  <div className="desc-wrapper">
                    <div className="title-bg-wrapper">
                      <Typography.Title level={5} style={{ margin: 0 }}>
                        {i18n["Số suất trong gói dịch vụ farming"]}
                      </Typography.Title>
                    </div>
                    <div className="desc package-view-expand">
                      <Row>
                        <Col span={12} className="divcol">
                          <span className="divtitle">{i18n["Tổng số suất"]}:</span>
                          <span className="divvalue">
                            <b>{itemData.totalNumberShares}</b>{" "}
                            <span style={{ color: "green" }}>{i18n["suất"]}</span>
                          </span>
                        </Col>
                        <Col span={12} className="divcol">
                          <span className="divtitle">{i18n["Số suất đã bán"]}:</span>
                          <span className="divvalue">
                            <b>{itemData.numberSharesSold}</b>{" "}
                            <span style={{ color: "green" }}>{i18n["suất"]}</span>
                          </span>
                        </Col>
                      </Row>
                    </div>
                  </div>
                  <div className="desc-wrapper">
                    <div className="title-bg-wrapper">
                      <Typography.Title level={5} style={{ margin: 0 }}>
                        {i18n["Giá gói dịch vụ farming"]}
                      </Typography.Title>
                    </div>
                    <div className="desc package-view-expand">
                      <Row>
                        <Col span={12} className="divcol">
                          <span className="divtitle">{i18n["Giá mỗi suất"]}:</span>
                          <span className="divvalue">
                            <b>{formatNumber(itemData.pricePerShare)}</b>{" "}
                            <span style={{ color: "green" }}>₫</span>
                          </span>
                        </Col>
                        <Col span={12} className="divcol">
                          <span className="divtitle">{i18n["Giá combo gói"]}:</span>
                          <span className="divvalue">
                            <b>{formatNumber(itemData.packagePrice)}</b>{" "}
                            <span style={{ color: "green" }}>₫</span>
                          </span>
                        </Col>
                      </Row>
                    </div>
                  </div>
                  {itemData.address && (
                    <>
                      <div className="desc-wrapper">
                        <div className="title-bg-wrapper">
                          <Typography.Title level={5} style={{ margin: 0 }}>
                            {i18n["Địa chỉ gói"]}
                          </Typography.Title>
                        </div>
                        <div className="desc">{itemData.address}</div>
                      </div>
                    </>
                  )}
                  {itemData.properties && (
                    <>
                      <div className="desc-wrapper">
                        <div className="title-bg-wrapper">
                          <Typography.Title level={5} style={{ margin: 0 }}>
                            {i18n["Thông tin chi tiết"]}
                          </Typography.Title>
                        </div>
                        <div
                          className="desc"
                          dangerouslySetInnerHTML={{
                            __html: itemData.properties,
                          }}
                        ></div>
                      </div>
                    </>
                  )}
                </div>
              )}
              {selectedTab == "PRODUCT" && <ItemsList id={uid} />}
              {selectedTab == "REGISTER" && <RegisterList id={uid} />}
              {/* <Divider style={{ margin: "0 0 10px" }} /> */}
            </Card>
          </>
        ) : (
          <></>
        )}
      </PageWrapper>
    </SiderHeaderLayout>
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

const PageWrapper = styled(StyledPage)`
  padding: 24px;
  & > .ant-card {
    .title-bg-wrapper {
      padding: 12px;
      margin: 0 0 24px;
      background-color: rgba(0, 0, 0, 0.02);
    }
  }
  & > .detail-wrapper .ant-card-body {
    display: flex;
    flex-direction: column;
    & > .image-wrapper {
      display: flex;
      & > .left-wrapper {
        flex: 0 0 auto;
        min-width: 0;
      }
      & > .right-wrapper {
        flex: 1 1 auto;
        min-width: 0;
      }
      .swiper {
        ${cssSwiperNavigation}
      }
    }
    & > .name-wrapper {
      display: flex;
      align-items: flex-start;
      & > .name {
        padding: 0 12px 0 0;
        flex: 1 1 auto;
        min-width: 0px;
      }
      & > .btn-link-edit {
        margin-left: auto;
      }
    }
    & > .others-wrapper {
      display: flex;
      align-items: center;
      & > div.flex {
        display: flex;
        align-items: center;
      }
      & > .rate-wrapper .ant-rate {
        margin-top: -4px;
      }
    }
    & > .price-wrapper {
      padding: 12px;
      margin: 12px 0;
      background-color: rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: flex-start;
    }
    & > .others-desc-wrapper {
      .ant-descriptions-item {
        padding-bottom: 6px;
      }
    }
    & > .tierVariationList-wrapper {
      padding: 6px 12px 0;
      border: 1px dashed rgba(0, 0, 0, 0.05);
      border-radius: 4px;
      .ant-descriptions-header {
        margin-bottom: 6px;
      }
      .ant-descriptions-item {
        padding-bottom: 12px;
      }
    }
    & > .related-wrapper {
      max-width: 100%;
    }
  }
  & .more-detail-wrapper {
    .more-detail {
      .ant-descriptions-item {
        padding-bottom: 6px;
      }
    }
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
  }
  & .itemListItemRelated-wrapper {
    .ant-card-body {
      padding: 16px;
    }
  }
`;

export default withAuth(Page);

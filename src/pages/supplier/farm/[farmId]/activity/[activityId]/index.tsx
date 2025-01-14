import EcofarmActivityStatus from "@/components/card/EcofarmActivityStatus";
import { EcofarmSvg } from "@/components/icons";
import VideoItem from "@/components/shared/VideoItem";
import useGetProviderFarm from "@/hooks/useGetProviderFarm";
import styled from "@emotion/styled";
import { Descriptions, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useId } from "react";
import { RiEdit2Fill } from "react-icons/ri";
import Avatar from "src/components/avatar/Avatar";
import Button from "src/components/button/Button";
import Card from "src/components/card/Card";
import withAuth from "src/components/hoc/withAuth";
import BreadcrumbHeader from "src/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "src/components/layout/SiderHeaderLayout";
import StyledPage from "src/components/layout/StyledPage";
import Image from "src/components/next/Image";
import { cssSwiperNavigation } from "src/components/shared/ItemStyled";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useGetEcofarmPackageActivityByIdQuery } from "src/redux/query/farm.query";
import { dateFormatVoucher1, formatDate } from "src/utils/utils-date";
import { Navigation, Pagination, Thumbs } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

const Page = () => {
  const uid = useId();
  const {
    query: { activityId, farmId },
  } = useRouter();
  const { i18n } = useChangeLocale();
  const { data: getItemByIdRes } = useGetEcofarmPackageActivityByIdQuery(
    { id: +(activityId as string) },
    { refetchOnMountOrArgChange: true },
  );
  const itemData = getItemByIdRes?.data;
  const { gSelectedProvider } = useGetProviderFarm();

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
                  key={String(gSelectedProvider?.id) + uid}
                  src={gSelectedProvider?.imageUrls[0]}
                  size={26}
                />
              ),
            },
            { [`/supplier/farm/${farmId}/activity`]: i18n["Hoạt động"] },
            { [`/supplier/farm/${farmId}/activity/${activityId}`]: itemData?.name },
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
                  href={`/supplier/farm/${farmId}/activity/${String(activityId)}/edit`}
                >
                  {i18n["Cập nhật"]}
                </Button>
              </div>
              <div style={{ marginBottom: 6 }}>
                <Typography.Text type="secondary" style={{ marginRight: 4 }}>
                  {i18n["Thời gian diễn ra hoạt động"]}:
                </Typography.Text>
                <Typography.Text>
                  {formatDate(itemData.dateStart, dateFormatVoucher1)}
                  {" - "}
                  {formatDate(itemData.dateExpect, dateFormatVoucher1)}
                </Typography.Text>
                <EcofarmActivityStatus
                  style={{ marginLeft: 15 }}
                  state={itemData.status}
                  className="tag"
                  bordered
                />
              </div>

              <Descriptions column={1} rootClassName="others-desc-wrapper">
                <Descriptions.Item label={i18n["Thuộc gói farming"]}>
                  <Typography.Text>
                    <Link
                      href={`/supplier/farm/${farmId}/package/${itemData.ecofarmPackageId}`}
                      passHref
                    >
                      {itemData?.ecofarmPackageInfo?.name}
                    </Link>
                  </Typography.Text>
                </Descriptions.Item>
              </Descriptions>
              <div className="desc-wrapper">
                <div className="title-bg-wrapper">
                  <Typography.Title level={4} style={{ margin: 0 }}>
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

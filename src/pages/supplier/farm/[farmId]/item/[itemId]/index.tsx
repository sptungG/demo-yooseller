import { EcofarmSvg } from "@/components/icons";
import VideoItem from "@/components/shared/VideoItem";
import { TPackageStatus } from "@/types/farm.types";
import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useSafeState } from "ahooks";
import {
  Col,
  Descriptions,
  Divider,
  Empty,
  Popover,
  Radio,
  Rate,
  Row,
  Typography,
  theme,
} from "antd";
import { parseAsFloat, useQueryState } from "next-usequerystate";
import { useRouter } from "next/router";
import {
  JSXElementConstructor,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactNode,
  ReactPortal,
  useId,
} from "react";
import { BsChevronRight } from "react-icons/bs";
import { RiEdit2Fill } from "react-icons/ri";
import Avatar from "src/components/avatar/Avatar";
import Button from "src/components/button/Button";
import Card from "src/components/card/Card";
import withAuth from "src/components/hoc/withAuth";
import BreadcrumbHeader from "src/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "src/components/layout/SiderHeaderLayout";
import StyledPage from "src/components/layout/StyledPage";
import Image from "src/components/next/Image";
import Link from "src/components/next/Link";
import { cssSwiperNavigation } from "src/components/shared/ItemStyled";
import SmItemModelTableStyled from "src/components/table/SmItemModelTable";
import useItemModelColumns from "src/components/table/useItemModelColumns";
import Tag from "src/components/tag/Tag";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProvider from "src/hooks/useGetProvider";
import {
  useGetAllItemAttributesQuery,
  useGetItemByIdForEcoFarmQuery,
  useGetListCategoryFromChildrenQuery,
} from "src/redux/query/farm.query";

import { formatNumber } from "src/utils/utils";
import { formatDate } from "src/utils/utils-date";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const Page = () => {
  const uid = useId();
  const {
    query: { itemId, farmId },
  } = useRouter();
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const { i18n } = useChangeLocale();
  const { data: getItemByIdRes } = useGetItemByIdForEcoFarmQuery(
    { id: +(itemId as string) },
    { refetchOnMountOrArgChange: true },
  );
  const itemData = getItemByIdRes?.data;
  const [selectedModelId, setSelectedModelId] = useQueryState("v", parseAsFloat);
  const selectedModel = itemData?.modelList.find((m: any) => m.id === selectedModelId);
  const [selectedTierIndexes, setSelectedTierIndexes] = useSafeState<(number | undefined)[]>(
    selectedModel?.tierIndex || Array(itemData?.tierVariationList.length || 0).fill(undefined),
  );
  const { data: getListCategoryFromChildrenRes } = useGetListCategoryFromChildrenQuery(
    itemData?.categoryId ? { id: itemData?.categoryId } : skipToken,
    { refetchOnMountOrArgChange: true },
  );
  const listCategory = getListCategoryFromChildrenRes?.data || [];

  const { gSelectedProvider } = useGetProvider({});
  const { nameCombined1, sku, sales, stock, currentPrice, originalPrice } = useItemModelColumns({});
  const { data: dataItemAttributesRes } = useGetAllItemAttributesQuery(
    !!itemData?.categoryId ? { categoryId: itemData.categoryId } : skipToken,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    },
  );
  const dataItemAttributes = dataItemAttributesRes?.data || [];

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
            { [`/supplier/farm/${farmId}/item`]: i18n["Sản phẩm"] },
            { [`/supplier/farm/${farmId}/item/${itemId}`]: itemData?.name },
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
              style={{ margin: "0 auto", maxWidth: 800 }}
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
                          ...(selectedModel?.imageUrl === item
                            ? {
                                border: `1px solid ${colorPrimary}`,
                              }
                            : {
                                border: `1px solid transparent`,
                              }),
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
                          ...(selectedModel?.imageUrl === item
                            ? {
                                border: `1px solid ${colorPrimary}`,
                              }
                            : {
                                border: `1px solid transparent`,
                              }),
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
                      title: `${itemData.name}${!!selectedModel ? " - " + selectedModel.name : ""}`,
                      arrow: false,
                      placement: "bottomLeft",
                    },
                  }}
                >
                  {`${itemData.name}${!!selectedModel ? " - " + selectedModel.name : ""}`}
                </Typography.Title>
                {!itemData.ecofarmPackageInfo ||
                itemData.ecofarmPackageInfo?.status == TPackageStatus.ONGOING ||
                itemData.ecofarmPackageInfo?.status == TPackageStatus.ACTIVATED ? (
                  <Button
                    type="primary"
                    icon={<RiEdit2Fill />}
                    className="btn-link-edit"
                    href={`/supplier/farm/${farmId}/item/${String(itemId)}/edit`}
                  >
                    {i18n["Cập nhật"]}
                  </Button>
                ) : (
                  ""
                )}
              </div>
              <div style={{ marginBottom: 6 }}>
                <Typography.Text type="secondary" style={{ marginRight: 4 }}>
                  Ngày tạo:
                </Typography.Text>
                <Typography.Text>
                  {formatDate(itemData.creationTime, "DD-MM-YYYY HH:mm")}
                </Typography.Text>
                {itemData.ecofarmPackageId && (
                  <>
                    <Typography.Text type="secondary" style={{ marginRight: 4, marginLeft: 20 }}>
                      thuộc gói:
                    </Typography.Text>
                    <Typography.Text type="success" underline>
                      <Link
                        href={`/supplier/farm/${farmId}/package/${itemData.ecofarmPackageId}`}
                        passHref
                        className="name"
                      >
                        {itemData?.ecofarmPackageInfo?.name}
                      </Link>
                    </Typography.Text>
                  </>
                )}
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
                {!!selectedModel ? (
                  <>
                    {/* <Typography.Text
                        type="secondary"
                        delete
                        style={{ fontSize: 16, margin: "4px 12px 0 0" }}
                      >
                        {`${formatNumber(selectedModel.originalPrice)}₫`}
                      </Typography.Text> */}
                    <Typography.Text type="success" style={{ fontSize: 26, margin: "0 12px 0 0" }}>
                      {`${formatNumber(selectedModel.currentPrice)}₫`}
                    </Typography.Text>
                    {selectedModel.originalPrice > selectedModel.currentPrice && (
                      <Tag bordered={false} color="#ff4d4f" style={{ margin: "6px 0 0" }}>
                        {(
                          (1 - selectedModel.currentPrice / selectedModel.originalPrice) *
                          100
                        ).toFixed(2)}
                        % Giảm
                      </Tag>
                    )}
                  </>
                ) : (
                  <Typography.Text type="success" style={{ fontSize: 24 }}>
                    {itemData.minPrice === itemData.maxPrice
                      ? `${formatNumber(itemData.minPrice)}₫`
                      : `${formatNumber(itemData.minPrice)}₫ ~ ${formatNumber(itemData.maxPrice)}₫`}
                  </Typography.Text>
                )}
              </div>
              <Descriptions column={1} rootClassName="others-desc-wrapper">
                <Descriptions.Item label="SKU">
                  {(!!selectedModel ? selectedModel.sku : itemData.sku) || "---"}
                </Descriptions.Item>
                <Descriptions.Item label="Đã bán">
                  <Typography.Text type="secondary" underline strong style={{ marginRight: 4 }}>
                    {`${
                      !!selectedModel
                        ? formatNumber(selectedModel.sales)
                        : formatNumber(itemData.sales)
                    }`}
                  </Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="Kho hàng">
                  <Typography.Text type="secondary" underline strong style={{ marginRight: 4 }}>
                    {`${
                      !!selectedModel
                        ? formatNumber(selectedModel.stock)
                        : formatNumber(itemData.stock)
                    }`}
                  </Typography.Text>
                </Descriptions.Item>
              </Descriptions>
              {itemData.tierVariationList.length > 0 && (
                <Descriptions
                  column={1}
                  rootClassName="tierVariationList-wrapper"
                  title={
                    <>
                      <Typography.Text strong style={{ fontSize: 16, marginRight: 8 }}>
                        Phân loại hàng
                      </Typography.Text>
                      <Popover
                        placement="topLeft"
                        arrow={false}
                        overlayInnerStyle={{ padding: 0 }}
                        content={
                          <div>
                            {!!itemData.modelList?.length ? (
                              <SmItemModelTableStyled
                                showSorterTooltip={false}
                                size="small"
                                columns={
                                  [
                                    nameCombined1,
                                    sku,
                                    sales,
                                    stock,
                                    currentPrice,
                                    originalPrice,
                                  ] as any
                                }
                                dataSource={itemData.modelList}
                                pagination={false}
                                rowKey={(item: any) => item.id + uid}
                              />
                            ) : (
                              <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                imageStyle={{ height: 32 }}
                                style={{ padding: 0, margin: "2px 0 -8px 0" }}
                                description={false}
                              />
                            )}
                          </div>
                        }
                      >
                        <Button
                          size="small"
                          type="text"
                          style={{ padding: "0 2px" }}
                          onClick={() => {
                            setSelectedModelId(null);
                          }}
                        >
                          <Typography.Text strong type="secondary" underline>
                            Xem tất cả
                          </Typography.Text>
                        </Button>
                      </Popover>
                    </>
                  }
                >
                  {itemData.tierVariationList.map(
                    (
                      v: {
                        name:
                          | string
                          | number
                          | boolean
                          | ReactElement<any, string | JSXElementConstructor<any>>
                          | Iterable<ReactNode>
                          | ReactPortal
                          | PromiseLikeOfReactNode
                          | null
                          | undefined;
                        optionList: any[];
                      },
                      index: number,
                    ) => (
                      <Descriptions.Item
                        key={uid + "tierVariationList" + index}
                        labelStyle={{ marginTop: 5 }}
                        label={v.name}
                      >
                        <Radio.Group
                          size="middle"
                          value={selectedModel?.tierIndex[index]}
                          onChange={(e) => {
                            const newSelectedTierIndexes = [...selectedTierIndexes];
                            newSelectedTierIndexes[index] = e.target.value;
                            setSelectedTierIndexes(newSelectedTierIndexes);
                            const selectedModel = itemData?.modelList.find(
                              (m: { tierIndex: any }) =>
                                JSON.stringify(m.tierIndex) ===
                                JSON.stringify(newSelectedTierIndexes),
                            );
                            if (selectedModel?.id) setSelectedModelId(selectedModel.id);
                          }}
                        >
                          {v.optionList.map(
                            (
                              o:
                                | string
                                | number
                                | boolean
                                | ReactElement<any, string | JSXElementConstructor<any>>
                                | Iterable<ReactNode>
                                | ReactPortal
                                | PromiseLikeOfReactNode
                                | null
                                | undefined,
                              indexO: number,
                            ) => (
                              <Radio.Button
                                value={indexO}
                                key={uid + "tierVariationList:optionList" + indexO}
                                style={{ borderRadius: 4, marginRight: 12, borderWidth: 1 }}
                                rootClassName="hide-before"
                              >
                                {o}
                              </Radio.Button>
                            ),
                          )}
                        </Radio.Group>
                      </Descriptions.Item>
                    ),
                  )}
                </Descriptions>
              )}
              <Divider />
              <div className="more-detail-wrapper">
                <div className="title-bg-wrapper">
                  <Typography.Title level={4} style={{ margin: 0 }}>
                    Thông tin chi tiết
                  </Typography.Title>
                </div>
                <Descriptions rootClassName="more-detail" style={{ marginBottom: 24 }} column={1}>
                  <Descriptions.Item label="Danh mục">
                    {listCategory.map((c, index) => (
                      <div key={uid + "listCategory" + index} style={{ fontSize: 16 }}>
                        <Image
                          src={c.iconUrl}
                          alt=""
                          style={{ width: 22, height: 22, margin: "-6px 4px 0 0" }}
                        />
                        <span>{c.name}</span>
                        {index < listCategory.length - 1 && (
                          <BsChevronRight style={{ margin: "0 4px -2px 4px" }} />
                        )}
                      </div>
                    ))}
                  </Descriptions.Item>
                  {(itemData.attributeList || [])?.map((item, index) => (
                    <Descriptions.Item
                      key={uid + "attributeList" + index}
                      label={dataItemAttributes.find((a) => a.id === item?.id)?.name}
                    >
                      {(item?.valueList || [])?.join(", ")}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </div>
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
              <div className="desc-wrapper">
                <div className="title-bg-wrapper">
                  <Typography.Title level={4} style={{ margin: 0 }}>
                    {i18n["Thông tin vận chuyển"]}
                  </Typography.Title>
                </div>
                <div className="desc package-view-expand">
                  <Row>
                    <Col span={12} className="divcol">
                      <span className="divtitle">{i18n["Cân nặng (Sau khi đóng gói)"]}:</span>
                      <span className="divvalue">
                        <b>{itemData.sizeInfo?.weight}</b>
                        <span style={{ color: "green" }}>gr</span>
                      </span>
                    </Col>
                    <Col span={12} className="divcol">
                      <span className="divtitle">{i18n["Chiều rộng"]}:</span>
                      <span className="divvalue">
                        <b>{itemData.sizeInfo?.width}</b> <span style={{ color: "green" }}>cm</span>
                      </span>
                    </Col>
                  </Row>
                </div>
                <div className="desc package-view-expand">
                  <Row>
                    <Col span={12} className="divcol">
                      <span className="divtitle">{i18n["Chiều dài"]}:</span>
                      <span className="divvalue">
                        <b>{itemData.sizeInfo?.length}</b>
                        <span style={{ color: "green" }}>cm</span>
                      </span>
                    </Col>
                    <Col span={12} className="divcol">
                      <span className="divtitle">{i18n["Chiều cao"]}:</span>
                      <span className="divvalue">
                        <b>{itemData.sizeInfo?.height}</b>{" "}
                        <span style={{ color: "green" }}>cm</span>
                      </span>
                    </Col>
                  </Row>
                </div>
              </div>
              <Divider style={{ margin: "0 0 10px" }} />
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

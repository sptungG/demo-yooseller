import RateResponseInput from "@/components/field/RateResponseInput";
import { TItemRateFilter } from "@/types/item.types";
import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useDebounce, useSafeState } from "ahooks";
import {
  Descriptions,
  Divider,
  Empty,
  Flex,
  Image,
  Popover,
  Radio,
  Rate,
  Table,
  Typography,
  theme,
} from "antd";
import { Pagination as RatePagination } from "antd/lib";
import { parseAsFloat, useQueryState } from "next-usequerystate";
import { useRouter } from "next/router";
import { useId, useState } from "react";
import { BsChevronRight } from "react-icons/bs";
import { MdOutlineStore } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import Avatar from "src/components/avatar/Avatar";
import Button from "src/components/button/Button";
import Card from "src/components/card/Card";
import withAuth from "src/components/hoc/withAuth";
import BreadcrumbHeader from "src/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "src/components/layout/SiderHeaderLayout";
import StyledPage from "src/components/layout/StyledPage";
import { cssSwiperNavigation } from "src/components/shared/ItemStyled";
import SmItemModelTableStyled from "src/components/table/SmItemModelTable";
import useItemColumns from "src/components/table/useItemColumns";
import useItemModelColumns from "src/components/table/useItemModelColumns";
import Tag from "src/components/tag/Tag";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProvider from "src/hooks/useGetProvider";
import { useGetListCategoryFromChildrenQuery } from "src/redux/query/category.query";
import { useGetAllRatesQuery, useGetItemByIdQuery } from "src/redux/query/item.query";
import { useGetAllItemAttributesQuery } from "src/redux/query/itemAttribute.query";
import { formatNumber } from "src/utils/utils";
import { formatDate } from "src/utils/utils-date";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const itemListItemRelated: any[] = [];

const Page = () => {
  const uid = useId();
  const {
    query: { itemId, storeId },
  } = useRouter();
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const { i18n } = useChangeLocale();
  const { data: getItemByIdRes } = useGetItemByIdQuery(
    { id: +(itemId as string) },
    { refetchOnMountOrArgChange: true },
  );
  const itemData = getItemByIdRes?.data;

  const ItemColumns = useItemColumns({});

  const [selectedModelId, setSelectedModelId] = useQueryState("v", parseAsFloat);
  const selectedModel = itemData?.modelList.find((m) => m.id === selectedModelId);
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

  const [rateFilterData, setRateFilterData] = useState<TItemRateFilter>({
    orderBy: 1,
    skipCount: 0,
    maxResultCount: 5,
    sortBy: 2,
  });
  const debouncedFilterData = useDebounce(
    { ...rateFilterData, itemId: itemData?.id, providerId: gSelectedProvider?.id, type: 3 },
    { wait: 500 },
  );

  const { data: dataRatesRes } = useGetAllRatesQuery(
    !!itemData?.id ? debouncedFilterData : skipToken,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: false,
      skip: !debouncedFilterData?.itemId,
    },
  );
  const { data: allDataRatesRes } = useGetAllRatesQuery(
    !!itemData?.id
      ? { itemId: itemData?.id, providerId: gSelectedProvider?.id, type: 3 }
      : skipToken,
    {
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      skip: !debouncedFilterData?.itemId,
    },
  );
  const dataItemRates = dataRatesRes?.data || [];
  const totalRows = dataRatesRes?.totalRecords;
  const allDataItemRates = allDataRatesRes?.data || [];

  return (
    <SiderHeaderLayout
      headerLeft={
        <BreadcrumbHeader
          items={[
            { "/supplier/store": <MdOutlineStore size={26} /> },
            {
              [`/supplier/store/${storeId}`]: (
                <Avatar
                  shape="square"
                  key={String(gSelectedProvider?.id) + uid}
                  src={gSelectedProvider?.imageUrls[0]}
                  size={26}
                />
              ),
            },
            { [`/supplier/store/${storeId}/item`]: i18n["Sản phẩm"] },
            { [`/supplier/store/${storeId}/item/${itemId}`]: itemData?.name },
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
                  navigation={itemData.imageUrlList.length > 4}
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
                <Button
                  type="primary"
                  icon={<RiEdit2Fill />}
                  className="btn-link-edit"
                  href={`/supplier/store/${storeId}/item/${String(itemId)}/edit`}
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
                    {itemData.ratePoint?.toFixed(2) || "0"}
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
                    <Typography.Text
                      type="secondary"
                      delete
                      style={{ fontSize: 16, margin: "4px 12px 0 0" }}
                    >
                      {`${formatNumber(selectedModel.originalPrice)}₫`}
                    </Typography.Text>
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
                  {itemData.tierVariationList.map((v, index) => (
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
                            (m) =>
                              JSON.stringify(m.tierIndex) ===
                              JSON.stringify(newSelectedTierIndexes),
                          );
                          if (selectedModel?.id) setSelectedModelId(selectedModel.id);
                        }}
                      >
                        {v.optionList.map((o, indexO) => (
                          <Radio.Button
                            value={indexO}
                            key={uid + "tierVariationList:optionList" + indexO}
                            style={{ borderRadius: 4, marginRight: 12, borderWidth: 1 }}
                            rootClassName="hide-before"
                          >
                            {o}
                          </Radio.Button>
                        ))}
                      </Radio.Group>
                    </Descriptions.Item>
                  ))}
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
              <Divider style={{ margin: "0 0 10px" }} />

              <div className="itemRate-wrapper">
                <div className="title-bg-wrapper">
                  <Typography.Title level={4} style={{ margin: 0 }}>
                    {i18n["Đánh giá sản phẩm"]}
                  </Typography.Title>
                </div>

                <div className="rate-summary-wrapper">
                  <Flex gap="middle" align="center">
                    <Typography.Title level={4} style={{ width: 60 }}>
                      {itemData.ratePoint?.toFixed(2)}
                    </Typography.Title>
                    <Flex gap="middle" align="center" wrap="wrap">
                      <Button
                        className={`${
                          rateFilterData?.rating === undefined ? "btn-rating-selected" : ""
                        }`}
                        onClick={() => {
                          setRateFilterData({ ...rateFilterData, rating: undefined });
                        }}
                      >
                        {i18n["Tất cả"]} ({formatNumber(allDataItemRates?.length)})
                      </Button>
                      {[5, 4, 3, 2, 1]?.map((rate, rIndex) => (
                        <Button
                          className={`${
                            rateFilterData?.rating === rate ? "btn-rating-selected" : ""
                          }`}
                          key={rIndex}
                          onClick={() => {
                            setRateFilterData({ ...rateFilterData, rating: rate });
                          }}
                        >
                          {rate} {i18n["Sao"]} (
                          {formatNumber(
                            allDataItemRates?.filter((item) => item?.ratePoint === rate)?.length,
                          )}
                          )
                        </Button>
                      ))}
                    </Flex>
                  </Flex>
                </div>

                <div>
                  {dataItemRates?.map((item, index) => (
                    <div key={index}>
                      <Flex gap="middle">
                        <Avatar src={item?.avatar || ""} shape="circle" />
                        <Flex vertical gap="small" className="rate-content">
                          <Typography.Text>{item?.userName}</Typography.Text>
                          <Rate disabled defaultValue={item.ratePoint} value={item.ratePoint} />

                          <Typography.Text type="secondary">
                            {formatDate(item?.creationTime, "DD-MM-YYYY HH:mm")}
                          </Typography.Text>

                          <Typography.Text>{item?.comment}</Typography.Text>
                          {item?.fileUrl && (
                            <Image src={item?.fileUrl} width={80} height={80} alt="feedback" />
                          )}

                          {item?.partnerResponse?.content || item?.partnerResponse?.imageUrls ? (
                            <Flex className="partnerResponse-wrapper" vertical>
                              <Typography.Text type="secondary">
                                {i18n["Phản hồi của người bán"]}:
                              </Typography.Text>
                              <Typography.Text>{item?.partnerResponse?.content}</Typography.Text>
                              <Flex gap="middle">
                                {item?.partnerResponse?.imageUrls &&
                                  item?.partnerResponse?.imageUrls?.map(
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
                            <RateResponseInput rateId={item?.id} />
                          )}
                        </Flex>
                      </Flex>
                      <Divider style={{ margin: "20px 10px" }} />
                    </div>
                  ))}
                </div>
                <div>
                  {!!totalRows && (
                    <RatePagination
                      total={totalRows}
                      defaultPageSize={5}
                      onChange={(current, pageSize) => {
                        setRateFilterData({
                          ...rateFilterData,
                          skipCount: pageSize * (current > 0 ? current - 1 : 0),
                          maxResultCount: pageSize,
                        });
                      }}
                    />
                  )}
                </div>
              </div>

              <Divider />

              <Typography.Title
                level={4}
                type="secondary"
                style={{ marginBottom: 12, paddingLeft: 8, fontSize: 20 }}
              >
                Sản phẩm liên quan • {itemListItemRelated?.length}
              </Typography.Title>
              <div className="related-wrapper">
                {!!itemListItemRelated?.length ? (
                  <Table
                    scroll={{ x: true }}
                    dataSource={itemListItemRelated}
                    pagination={{
                      pageSize: 5,
                      pageSizeOptions: [5, 10],
                      showSizeChanger: true,
                    }}
                    columns={[
                      ItemColumns.nameCombined4,
                      ItemColumns.ratePoint,
                      { ...ItemColumns.sku, width: 110 },
                      { ...ItemColumns.sales, width: 110 },
                      { ...ItemColumns.stock, width: 120 },
                    ]}
                  />
                ) : (
                  <Empty description={false} className="bordered" />
                )}
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
    img {
      max-width: 100%;
      object-fit: contain;
    }
  }
  & .itemListItemRelated-wrapper {
    .ant-card-body {
      padding: 16px;
    }
  }

  & .itemRate-wrapper {
    display: flex;
    flex-direction: column;
    position: relative;
    .rate-summary-wrapper {
      padding: 12px 0px;
      margin: 0 0 24px;
      .btn-rating-selected {
        background-color: #f5f5f5;
      }
    }
    .rate-content {
      width: calc(100% - 50px);

      .partnerResponse-wrapper {
        background-color: #f5f5f5;
        padding: 15px;
        width: 100%;
      }
    }
  }
`;

export default withAuth(Page);

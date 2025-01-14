import VoucherStatus from "@/components/card/VoucherFarmStatus";
import { EcofarmSvg } from "@/components/icons";
import ItemTableStyled from "@/components/table/ItemTable";
import useItemsFarmColumns from "@/components/table/useItemsFarmColumns";
import useGetProviderFarm from "@/hooks/useGetProviderFarm";
import {
  TEVoucherChannelDisplay,
  TEVoucherDiscountType,
  TEVoucherScope,
  TEVoucherType,
  TItemsFilter,
} from "@/types/farm.types";
import styled from "@emotion/styled";
import { useCreation, useDebounce } from "ahooks";
import { Descriptions, Divider, Radio, Tag, Typography } from "antd";
import { useRouter } from "next/router";
import { useId, useState } from "react";
import { RiEdit2Fill } from "react-icons/ri";
import Avatar from "src/components/avatar/Avatar";
import Button from "src/components/button/Button";
import Card from "src/components/card/Card";
import withAuth from "src/components/hoc/withAuth";
import BreadcrumbHeader from "src/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "src/components/layout/SiderHeaderLayout";
import StyledPage from "src/components/layout/StyledPage";
import { cssSwiperNavigation } from "src/components/shared/ItemStyled";
import useChangeLocale from "src/hooks/useChangeLocale";
import {
  useGetAllItemsByPartnerForEcoFarmQuery,
  useGetVoucherByIdQuery,
} from "src/redux/query/farm.query";
import { formatNumber } from "src/utils/utils";
import { dateFormatVoucher1, dayjs, formatDate, isAfterDate } from "src/utils/utils-date";

const Page = () => {
  const uid = useId();
  const {
    query: { voucherId, farmId },
  } = useRouter();
  const { i18n } = useChangeLocale();
  const { data: getItemByIdRes } = useGetVoucherByIdQuery(
    { id: +(voucherId as string) },
    { refetchOnMountOrArgChange: true },
  );
  const itemData = getItemByIdRes?.data;
  const { gSelectedProvider } = useGetProviderFarm();
  const [filterData] = useState<TItemsFilter>({
    formId: 10,
    orderBy: 1,
    sortBy: 1,
    maxResultCount: 100,
  });
  const debouncedFilterData = useDebounce(
    {
      ...filterData,
      providerId: gSelectedProvider?.id,
    },
    { wait: 500 },
  );
  const { data: dataItems } = useGetAllItemsByPartnerForEcoFarmQuery(debouncedFilterData, {
    refetchOnMountOrArgChange: true,
    skip: !debouncedFilterData?.providerId,
  });
  const itemListData = dataItems?.data || [];
  const itemListSanPham = itemListData?.filter((x) => itemData?.listItems?.includes(x.id));
  const Columns = useItemsFarmColumns();
  const mappedColumns = useCreation(() => {
    const { nameCombined, status, sales, stock } = Columns;
    return [{ ...nameCombined, sorter: undefined }, sales, stock, status];
  }, [gSelectedProvider, Columns]);
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
            { [`/supplier/farm/${farmId}/voucher`]: i18n["Voucher"] },
            { [`/supplier/farm/${farmId}/voucher/${voucherId}`]: itemData?.name },
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
              <div className="name-wrapper">
                <Typography.Title
                  level={2}
                  className="name"
                  style={{ margin: 0 }}
                  ellipsis={{
                    rows: 2,
                    tooltip: {
                      title: `${itemData.voucherCode} - ${itemData.name}`,
                      arrow: false,
                      placement: "bottomLeft",
                    },
                  }}
                >
                  {`${itemData.voucherCode} - ${itemData.name}`}
                </Typography.Title>
                {isAfterDate(itemData.dateStart, dayjs()) && (
                  <Button
                    type="primary"
                    icon={<RiEdit2Fill />}
                    className="btn-link-edit"
                    href={`/supplier/farm/${farmId}/voucher/${String(voucherId)}/edit`}
                  >
                    {i18n["Cập nhật"]}
                  </Button>
                )}
              </div>
              <div style={{ marginBottom: 6 }}>
                <Typography.Text type="secondary" style={{ marginRight: 4 }}>
                  {i18n["Thời gian sử dụng mã"]}:
                </Typography.Text>
                <Typography.Text>
                  {formatDate(itemData.dateStart, dateFormatVoucher1)}
                  {" - "}
                  {formatDate(itemData.dateEnd, dateFormatVoucher1)}
                </Typography.Text>
                <VoucherStatus
                  style={{ marginLeft: 15 }}
                  item={itemData}
                  className="tag"
                  bordered
                />
              </div>
              <div className="others-wrapper" style={{ marginBottom: 15 }}>
                <Tag color="#108ee9">
                  {itemData.scope == TEVoucherScope.SHOP_VOUCHER
                    ? i18n["Voucher toàn Shop"]
                    : i18n["Voucher sản phẩm"]}
                </Tag>
                <div className="flex rate-wrapper">
                  <Typography.Text type="secondary">{i18n["Số lượng mã"]}: </Typography.Text>
                  <Typography.Text
                    type="success"
                    underline
                    style={{ marginRight: 4, marginLeft: 4 }}
                  >
                    {formatNumber(itemData.quantity) || "0"}
                  </Typography.Text>
                </div>
                <Divider type="vertical" style={{ height: 24 }} />
                <div className="flex">
                  <Typography.Text type="secondary">{i18n["Đã dùng"]}: </Typography.Text>
                  <Typography.Text
                    type="success"
                    underline
                    style={{ marginRight: 4, marginLeft: 4 }}
                  >
                    {formatNumber(itemData.currentUsage) || "0"}
                  </Typography.Text>
                </div>
              </div>
              <Divider style={{ margin: "0 0 10px" }} />
              <div className="price-wrapper" style={{ alignItems: "center" }}>
                <Typography.Text style={{ fontSize: 18 }}>{i18n["Mức giảm"]}:</Typography.Text>
                {itemData.discountType == TEVoucherDiscountType.FIX_AMOUNT && (
                  <Typography.Text type="success" style={{ fontSize: 24, marginLeft: 5 }}>
                    {`${formatNumber(itemData.discountAmount)}₫`}
                  </Typography.Text>
                )}
                {itemData.discountType == TEVoucherDiscountType.DISCOUNT_PERCENTAGE && (
                  <>
                    <Typography.Text type="success" style={{ fontSize: 24, marginLeft: 5 }}>
                      {`${formatNumber(itemData.percentage)}%`}
                    </Typography.Text>
                    <Divider type="vertical" style={{ height: 24 }} />
                    <Typography.Text style={{ fontSize: 18 }}>{i18n["tối đa"]}:</Typography.Text>
                    <Typography.Text type="success" style={{ fontSize: 24, marginLeft: 5 }}>
                      {`${formatNumber(itemData.maxPrice)}₫`}
                    </Typography.Text>
                  </>
                )}
              </div>
              <Descriptions column={1} rootClassName="others-desc-wrapper">
                <Descriptions.Item label={i18n["Giá trị đơn hàng tối thiểu"]}>
                  <Typography.Text type="success" underline strong>
                    {formatNumber(itemData.minBasketPrice)}₫
                  </Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label={i18n["Số lượng voucher"]}>
                  <Typography.Text underline strong style={{ marginRight: 4 }}>
                    {itemData.quantity}
                  </Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label={i18n["Số lượng voucher 1 người có thể nhận"]}>
                  <Typography.Text underline strong style={{ marginRight: 4 }}>
                    {itemData.maxDistributionBuyer}
                  </Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label={i18n["Giảm giá"]}>
                  <Typography.Text strong style={{ marginRight: 4 }}>
                    {itemData.type == TEVoucherType.VOUCHER_SHIPPING ? "Vận chuyển" : "Sản phẩm"}
                  </Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label={i18n["Nơi voucher được hiển thị"]}>
                  {itemData.displayChannelList?.map((vl, index) => (
                    <Radio.Button
                      key={index}
                      style={{ borderRadius: 4, marginRight: 12, borderWidth: 1 }}
                      rootClassName="hide-before"
                    >
                      {vl == TEVoucherChannelDisplay.SHOP && i18n["Màn trong shop"]}
                      {vl == TEVoucherChannelDisplay.ORDER_PAGE && i18n["Màn đặt sản phẩm"]}
                      {vl == TEVoucherChannelDisplay.FEED && i18n["Sự kiện"]}
                      {vl == TEVoucherChannelDisplay.LIVE_STREAMING && i18n["Live streaming"]}
                    </Radio.Button>
                  ))}
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
              {itemData.scope == TEVoucherScope.PRODUCT_VOUCHER && (
                <div className="more-detail-wrapper">
                  <div className="title-bg-wrapper">
                    <Typography.Title level={4} style={{ margin: 0 }}>
                      {i18n["Danh sách sản phẩm"]}
                    </Typography.Title>
                    <>
                      {itemListSanPham && (
                        <ItemTableStyled
                          showSorterTooltip={false}
                          columns={mappedColumns as any[]}
                          dataSource={itemListSanPham}
                          pagination={false}
                          size="large"
                          rowSelection={{
                            columnWidth: 32,
                            selectedRowKeys: itemData.listItems,
                            hideSelectAll: true,
                          }}
                          rowKey={(item: any) => item.id}
                          scroll={{ x: true }}
                        />
                      )}
                    </>
                  </div>
                </div>
              )}
            </Card>
          </>
        ) : (
          <></>
        )}
      </PageWrapper>
    </SiderHeaderLayout>
  );
};

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

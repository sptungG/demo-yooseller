import useGetProvider from "@/hooks/useGetProvider";
import { useGetAllRatesQuery } from "@/redux/query/item.query";
import { TItemRateFilter } from "@/types/item.types";
import { formatNumber } from "@/utils/utils";
import { formatDate } from "@/utils/utils-date";
import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/query";
import { useDebounce } from "ahooks";
import { Avatar, Divider, Drawer, Flex, Image, Rate, Typography } from "antd";
import { useState } from "react";
import useChangeLocale from "src/hooks/useChangeLocale";
import Button from "../button/Button";
import RateResponseInput from "../field/RateResponseInput";

type TShowStoreRatingProps = {
  open?: boolean;
  onClose?: () => void;
};

const StoreRating = ({ onClose, open }: TShowStoreRatingProps) => {
  const { i18n } = useChangeLocale();
  const { gSelectedProvider } = useGetProvider({});

  const [rateFilterData, setRateFilterData] = useState<TItemRateFilter>({
    orderBy: 1,
    maxResultCount: 1000,
    sortBy: 2,
  });
  const debouncedFilterData = useDebounce(
    { ...rateFilterData, providerId: gSelectedProvider?.id, type: 1 },
    { wait: 500 },
  );

  const { data: dataRatesRes } = useGetAllRatesQuery(
    !!gSelectedProvider?.id ? debouncedFilterData : skipToken,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: false,
      skip: !debouncedFilterData?.providerId,
    },
  );

  const { data: allDataRatesRes } = useGetAllRatesQuery(
    !!gSelectedProvider?.id ? { providerId: gSelectedProvider?.id, type: 1 } : skipToken,
    {
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      skip: !debouncedFilterData?.providerId,
    },
  );

  const dataItemRates = dataRatesRes?.data || [];
  const allDataItemRates = allDataRatesRes?.data || [];

  return (
    <Drawer
      open={open}
      onClose={() => onClose?.()}
      destroyOnClose
      width={440}
      title={
        <Typography.Text ellipsis style={{ maxWidth: 360, textAlign: "right" }}>
          {i18n["Đánh giá cửa hàng"]}
        </Typography.Text>
      }
    >
      <StoreRatingStyled>
        <div className="rate-summary-wrapper">
          <Flex gap="middle" align="center">
            <Typography.Title level={5} style={{ width: 60 }}>
              {gSelectedProvider?.ratePoint?.toFixed(2)}
            </Typography.Title>
            <Flex gap="middle" align="center" wrap="wrap">
              <Button
                className={`${rateFilterData?.rating === undefined ? "btn-rating-selected" : ""}`}
                onClick={() => {
                  setRateFilterData({ ...rateFilterData, rating: undefined });
                }}
              >
                {i18n["Tất cả"]} ({formatNumber(allDataItemRates?.length)})
              </Button>
              {[5, 4, 3, 2, 1]?.map((rate, rIndex) => (
                <Button
                  className={`${rateFilterData?.rating === rate ? "btn-rating-selected" : ""}`}
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
        <div className="storeRating-wrapper">
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
                          item?.partnerResponse?.imageUrls?.map((image: any, imageIndex: any) => (
                            <Image
                              key={imageIndex}
                              src={image}
                              width={80}
                              height={80}
                              alt="partnerResponse-image"
                            />
                          ))}
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
      </StoreRatingStyled>
    </Drawer>
  );
};
const StoreRatingStyled = styled.div`
  .storeRating-wrapper {
    display: flex;
    flex-direction: column;
    position: relative;

    .rate-content {
      width: calc(100% - 50px);

      .partnerResponse-wrapper {
        background-color: #f5f5f5;
        padding: 15px;
        width: 100%;
      }
    }
  }

  .rate-summary-wrapper {
    padding: 12px 0px;
    margin: 0 0 24px;
    .btn-rating-selected {
      background-color: #f5f5f5;
    }
  }
`;

export default StoreRating;

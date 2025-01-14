import { flashSaleApi } from "@/redux/query/flashSale.query";
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/query";
import { Button, Calendar, Empty, Flex, Popconfirm, Radio, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useId, useState } from "react";
import { LuCalendarDays } from "react-icons/lu";
import Container from "../shared/Container";
import Tag from "../tag/Tag";

type TFlashSaleConfigCalenderProps = {
  value?: { item1: string; item2: string };
  onChange?: (v: { item1: string; item2: string }) => void;
};

type TCellDateProps = { value: Dayjs };

const CellDate = ({ value }: TCellDateProps) => {
  const { currentData: getListConfigRes } = flashSaleApi.useGetListConfigQuery(
    !!value
      ? {
          dateStart: value.startOf("d").toISOString(),
          dateEnd: value.endOf("d").toISOString(),
        }
      : skipToken,
    { refetchOnMountOrArgChange: true },
  );
  return <div>CellDate</div>;
};

const FlashSaleConfigCalender = ({ value, onChange }: TFlashSaleConfigCalenderProps) => {
  const uid = useId();
  const { generatedColors } = useTheme();
  const [selectedDate, setSelectedDate] = useState<Dayjs>();
  const { currentData: getListConfigRes } = flashSaleApi.useGetListConfigQuery(
    !!selectedDate
      ? {
          dateStart: selectedDate.startOf("d").format("YYYY-MM-DD"),
          dateEnd: selectedDate.endOf("d").format("YYYY-MM-DD"),
        }
      : skipToken,
    { refetchOnMountOrArgChange: true },
  );
  const configData = getListConfigRes?.data?.[0];
  const configListDate = configData?.listDate || [];

  return (
    <Flex vertical align="flex-start" gap={8}>
      <Popconfirm
        icon={null}
        title="Chọn khung giờ"
        overlayInnerStyle={{ maxWidth: 700, paddingTop: 4 }}
        placement="bottomLeft"
        okText={"Xác nhận"}
        description={
          <StyledWrapper vertical gap={0}>
            <Flex style={{ marginBottom: 0 }}>
              <Flex
                flex={"0 0 330px"}
                vertical
                justify="space-between"
                style={{ minWidth: 0, border: "1px solid rgba(0,0,0,0.05)", borderRight: "none" }}
              >
                <Tag bordered={false} style={{ minHeight: 36, marginBottom: -2 }}>
                  {selectedDate
                    ? `Đã chọn: ${selectedDate?.format("DD-MMM-YYYY")}`
                    : `Hiện tại: ${dayjs().format("DD-MMM-YYYY HH:mm")}`}
                </Tag>
                <Calendar
                  fullscreen={false}
                  headerRender={() => <></>}
                  disabledDate={(date) => date < dayjs().startOf("day")}
                  value={selectedDate}
                  onSelect={(date) => setSelectedDate(date)}
                  style={{ border: "none" }}
                ></Calendar>
              </Flex>
              {selectedDate && configData ? (
                <Flex
                  flex={"1 1 auto"}
                  vertical
                  style={{ minWidth: 0, border: "1px solid rgba(0,0,0,0.05)", maxWidth: 360 }}
                >
                  <Radio.Group
                    value={!!value ? JSON.stringify(value) : undefined}
                    onChange={(e) => {
                      onChange?.(JSON.parse(e.target.value));
                    }}
                  >
                    <Flex vertical>
                      {configListDate.map((item, index) => {
                        const isCompleted = dayjs().isAfter(item.item2);
                        const isProcessing = dayjs().isBetween(item.item1, item.item2);
                        const isAboveTimeRegister = dayjs().add(30, "minute").isAfter(item.item1);

                        const isDisabled = isProcessing || isCompleted || isAboveTimeRegister;
                        return (
                          <Radio
                            className="radio-item"
                            key={uid + String(item) + index}
                            value={JSON.stringify(item)}
                            disabled={isDisabled}
                          >
                            <span style={{ opacity: 0.8, fontSize: 13 }}>{`${selectedDate.format(
                              "DD-MMM-YY",
                            )} • `}</span>
                            <span style={{ fontWeight: 500 }}>
                              {`${dayjs(item.item1).format("HH:mm:ss")}  ⇀  ${dayjs(
                                item.item2,
                              ).format("HH:mm:ss")}`}
                            </span>

                            {/* <div className="actions-c-r">
                              {!isDisabled && (
                                <div style={{ fontSize: 11, margin: "0 3px 0" }}>(10 sản phẩm)</div>
                              )}
                            </div> */}

                            <div className="actions-br">
                              {isProcessing && (
                                <div style={{ fontSize: 11, margin: "0 3px 0 0" }}>
                                  ...Đang diễn ra
                                </div>
                              )}
                              {!isCompleted && !isProcessing && isAboveTimeRegister && (
                                <div style={{ fontSize: 10, margin: "0 2px -1px 0" }}>
                                  Đã hết thời gian đăng ký (30ph trước khi bắt đầu)
                                </div>
                              )}
                            </div>
                          </Radio>
                        );
                      })}
                    </Flex>
                  </Radio.Group>
                </Flex>
              ) : (
                <Flex
                  flex={"1 1 auto"}
                  vertical
                  justify="center"
                  style={{ minWidth: 0, border: "1px solid rgba(0,0,0,0.05)", maxWidth: 360 }}
                >
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Hãy chọn ngày trước" />
                </Flex>
              )}
            </Flex>
          </StyledWrapper>
        }
      >
        <Button icon={<LuCalendarDays size={16} style={{ margin: "0 -2px 0 -6px" }} />}>
          {selectedDate && value ? (
            <Flex align="center">
              <span style={{ opacity: 0.8, fontSize: 13 }}>{`${selectedDate.format(
                "DD-MMM-YY",
              )} • `}</span>
              <span style={{ fontWeight: 500 }}>
                {`${dayjs(value.item1).format("HH:mm:ss")}  ⇀  ${dayjs(value.item2).format(
                  "HH:mm:ss",
                )}`}
              </span>
            </Flex>
          ) : (
            "Chọn khung giờ"
          )}
        </Button>
      </Popconfirm>

      <StyledWrapper2 vertical>
        <Typography.Text>Tiêu chí sản phẩm</Typography.Text>
        <Container suppressScrollY>
          <Flex wrap="nowrap" gap={12}>
            <ul className="item-limit-list" style={{ paddingLeft: 16, flexShrink: 0 }}>
              {[
                `Số lượng khuyến mãi: ${configData?.minQuantity || "---"} ~ ${
                  configData?.maxQuantity || "---"
                }`,
                `Mức khuyến mãi: ${configData?.promotionLevelMin || "---"}% ~ ${
                  configData?.promotionLevelMax || "---"
                }%`,
                "Đánh giá sản phẩm: Không giới hạn",
                "Lượt thích sản phẩm: Không giới hạn",
              ].map((item) => (
                <li key={uid + item}>
                  <Typography.Text>{item}</Typography.Text>
                </li>
              ))}
            </ul>
            <ul className="item-limit-list" style={{ paddingLeft: 20, flexShrink: 0 }}>
              {[
                "Hàng đặt trước: Không chấp nhận hàng đặt trước",
                "Số lượng đơn hàng trong vòng 30 ngày qua: Không giới hạn",
                "Thời gian chuẩn bị hàng: Không giới hạn ngày",
                "Thời gian tham gia chương trình tiếp theo: Không giới hạn ngày",
              ].map((item) => (
                <li key={uid + item}>
                  <Typography.Text>{item}</Typography.Text>
                </li>
              ))}
            </ul>
          </Flex>
        </Container>
      </StyledWrapper2>
    </Flex>
  );
};

const StyledWrapper = styled(Flex)`
  .ant-picker-panel {
    border: none;
  }
  .radio-item {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    min-height: 44px;
    padding: 8px;
    display: flex;
    margin: 0;
    align-items: center;
    position: relative;
    &.ant-radio-wrapper-checked {
      color: ${({ theme }) => theme.colorPrimary};
    }
    &:last-of-type {
      border-bottom: none;
    }

    & .actions-br {
      position: absolute;
      bottom: 0;
      right: 0;
    }

    & .actions-c-r {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 0;
    }
  }
  .item-limit-list {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    li::marker {
      color: ${({ theme }) => theme.colorPrimary};
    }
  }
`;

const StyledWrapper2 = styled(Flex)`
  .item-limit-list {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    li::marker {
      color: ${({ theme }) => theme.colorPrimary};
    }
  }
`;

export default FlashSaleConfigCalender;

import Avatar from "@/components/avatar/Avatar";
import Image from "@/components/next/Image";
import Tag from "@/components/tag/Tag";
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Card, CardProps, Carousel, Flex, Typography } from "antd";
import { rgba } from "emotion-rgba";
import { useId } from "react";
import { IoTicket } from "react-icons/io5";
import { RiLiveFill, RiShoppingBag3Line } from "react-icons/ri";

type TEventsCardProps = CardProps & { storeId?: number };

const EventsCard = ({ storeId, ...props }: TEventsCardProps) => {
  const uid = useId();
  const { generatedColors, colorPrimary } = useTheme();
  return (
    <StyledWrapper title={"Chương Trình Khuyến Mãi Cùng YooSeller"} {...props}>
      <Flex vertical gap={8} style={{ marginBottom: 12 }}>
        <Typography.Text strong type="secondary">
          Chương Trình Mới
        </Typography.Text>

        <Carousel autoplay dots={false} style={{ borderRadius: 6, overflow: "hidden" }}>
          <div>
            <Flex gap={8} wrap="nowrap">
              {[
                {
                  title: "Voucher SALE 25.1_SMF",
                  imageUrl: undefined,
                  status: 1,
                },
                {
                  title: "Voucher SALE 15.1_SMF",
                  imageUrl: undefined,
                  status: 1,
                },
                {
                  title: "Gói hiển thị voucher Tháng 1.2024 (Seller Voucher Package)_NonMS",
                  imageUrl: undefined,
                  status: 1,
                },
              ].map((item, index) => (
                <Flex
                  key={uid + item.title + index}
                  style={{
                    width: "calc(33.33% - 5.33px)",
                    padding: "4px 6px 4px 4px",
                    height: 64,
                  }}
                  gap={4}
                  className="marketing-card"
                >
                  <Image
                    preview={false}
                    src={item.imageUrl}
                    alt=""
                    style={{ height: "100%", width: 100, objectFit: "cover", borderRadius: 8 }}
                  />
                  <Flex
                    vertical
                    justify="space-between"
                    align="flex-start"
                    style={{ padding: "4px 0" }}
                    gap={4}
                  >
                    <Typography.Paragraph
                      style={{ lineHeight: 1.1, margin: 0 }}
                      ellipsis={{ rows: 3 }}
                    >
                      {item.title}
                    </Typography.Paragraph>
                  </Flex>

                  <div className="actions-br">
                    <Tag bordered={false} color="blue">
                      Sắp diễn ra
                    </Tag>
                  </div>
                </Flex>
              ))}
            </Flex>
          </div>
          <div>
            <Flex gap={8} wrap="nowrap">
              {[
                {
                  title: "Voucher SALE 25.1_SMF",
                  imageUrl: undefined,
                  status: 2,
                },
                {
                  title: "Voucher SALE 25.1_SMF",
                  imageUrl: undefined,
                  status: 2,
                },
                {
                  title: "Voucher SALE 25.1_SMF",
                  imageUrl: undefined,
                  status: 2,
                },
              ].map((item, index) => (
                <Flex
                  key={uid + item.title + index}
                  style={{
                    width: "calc(33.33% - 5.33px)",
                    padding: "4px 6px 4px 4px",
                    height: 64,
                  }}
                  gap={4}
                  className="marketing-card"
                >
                  <Image
                    preview={false}
                    src={item.imageUrl}
                    alt=""
                    style={{ height: "100%", width: 100, objectFit: "cover", borderRadius: 8 }}
                  />
                  <Flex
                    vertical
                    justify="space-between"
                    align="flex-start"
                    style={{ padding: "4px 0" }}
                    gap={4}
                  >
                    <Typography.Paragraph
                      style={{ lineHeight: 1.1, margin: 0 }}
                      ellipsis={{ rows: 3 }}
                    >
                      {item.title}
                    </Typography.Paragraph>
                  </Flex>
                  <div className="actions-br">
                    <Tag bordered={false} color="success">
                      Đang diễn ra
                    </Tag>
                  </div>
                </Flex>
              ))}
            </Flex>
          </div>
        </Carousel>
      </Flex>

      <Flex vertical gap={8} style={{}}>
        <Typography.Text strong type="secondary">
          Đăng ký tham gia Chương Trình Khuyến Mãi Cùng YooSeller
        </Typography.Text>
        <Flex gap={8}>
          {[
            {
              title: "Đăng Ký Sản phẩm",
              desc: "Tham gia các chương trình khuyến mãi để tiếp cận gần hơn với người mua",
              icon: <RiShoppingBag3Line style={{ margin: "0 0 -2px" }} />,
            },
            {
              title: "Đăng Ký Mã Giảm Giá",
              desc: "Tăng lượt sử dụng Mã giảm giá thông qua Chương trình của YooSeller",
              icon: <IoTicket style={{ margin: "0 0 -3px" }} />,
            },
            {
              title: "YooSeller Live",
              desc: "Tham gia chương trình YooSeller Live để tiếp cận nhiều người xem nhé!",
              icon: <RiLiveFill style={{ margin: "0 0 -3px" }} />,
            },
          ].map((item, index) => (
            <Flex
              key={uid + index}
              className="marketing-card"
              style={{ width: "calc(33.33% - 5.33px)" }}
              gap={8}
              align="center"
            >
              <Avatar
                icon={item.icon}
                size={56}
                style={{
                  flexShrink: 0,
                  backgroundColor: rgba(generatedColors[5], 0.2),
                  color: colorPrimary,
                }}
              ></Avatar>
              <Flex vertical style={{ paddingTop: 8 }} gap={4}>
                <Typography.Text strong style={{ lineHeight: 1.1 }}>
                  {item.title}
                </Typography.Text>
                <Typography.Paragraph
                  type="secondary"
                  style={{ lineHeight: 1.1, fontSize: 12 }}
                  ellipsis={{ rows: 3 }}
                >
                  {item.desc}
                </Typography.Paragraph>
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </StyledWrapper>
  );
};

const StyledWrapper = styled(Card)`
  & .marketing-card {
    background-color: rgba(0, 0, 0, 0.03);
    padding: 2px 6px 0;
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    & .actions-br {
      position: absolute;
      bottom: 0;
      right: 0;
    }
    &:hover {
      box-shadow: var(--box-shadow);
    }
  }
`;

export default EventsCard;

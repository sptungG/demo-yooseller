import Avatar from "@/components/avatar/Avatar";
import {
  Engagement01Svg,
  Engagement02Svg,
  Engagement03Svg,
  Engagement04Svg,
  IncreaseTraffic01Svg,
  IncreaseTraffic02Svg,
  IncreaseTraffic03Svg,
  Promotion01Svg,
  Promotion02Svg,
  Promotion03Svg,
  Promotion04Svg,
  Promotion05Svg,
  Promotion06Svg,
  Promotion07Svg,
} from "@/components/icons";
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Card, CardProps, Flex, Typography } from "antd";
import { rgba } from "emotion-rgba";
import { useId } from "react";

type TMarketingToolsCardProps = CardProps & { storeId?: number };

const MarketingToolsCard = ({ storeId, ...props }: TMarketingToolsCardProps) => {
  const uid = useId();
  const { generatedColors, colorPrimary } = useTheme();
  return (
    <StyledWrapper title={"Công Cụ Marketing"} {...props}>
      <Flex vertical gap={8} style={{ marginBottom: 12 }}>
        <Typography.Text strong type="secondary">
          Đăng ký tham gia Chương Trình Khuyến Mãi Cùng YooSeller
        </Typography.Text>
        <Flex gap={8} wrap="wrap">
          {[
            {
              title: "Mã Giảm Giá Của Shop",
              desc: "Công cụ tăng đơn hàng bằng cách tạo mã giảm giá tặng cho người mua",
              icon: <Promotion01Svg style={{ margin: "0 0 -2px" }} />,
            },
            {
              title: "Chương Trình Của Shop",
              desc: "Công cụ tăng đơn hàng bằng cách tạo chương trình giảm giá",
              icon: <Promotion02Svg style={{ margin: "0 0 -3px" }} />,
            },
            {
              title: "Combo Khuyến Mãi",
              desc: "Tạo Combo Khuyến Mãi để tăng giá trị đơn hàng trên mỗi Người mua",
              icon: <Promotion03Svg style={{ margin: "0 0 -3px" }} />,
            },
            {
              title: "Mua Kèm Deal Sốc",
              desc: "Công cụ giúp tăng đơn hàng bằng cách tạo các Deal Sốc",
              icon: <Promotion04Svg style={{ margin: "0 0 -3px" }} />,
            },
            {
              title: "Flash Sale Của Shop",
              desc: "Công cụ giúp tăng doanh số bằng cách tạo khuyến mãi khủng trong các khung giờ nhất định",
              icon: <Promotion05Svg style={{ margin: "0 0 -3px" }} />,
            },
            {
              title: "Xu Của Shop",
              desc: "Dùng Xu của Shop làm phần thưởng thu hút Người mua tham gia các hoạt động của Shop",
              icon: <Promotion06Svg style={{ margin: "0 0 -3px" }} />,
            },
            {
              title: "Tăng Đơn Cùng KOL",
              desc: "Tận dụng mạng lưới đối tác tiếp thị liên kết rộng lớn của YooSeller để đẩy mạnh doanh thu cho Shop",
              icon: <Promotion07Svg style={{ margin: "0 0 -3px" }} />,
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
                  backgroundColor: rgba("#2673dd", 0.2),
                  color: "#2673dd",
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

      <Flex vertical gap={8} style={{ marginBottom: 12 }}>
        <Typography.Text strong type="secondary">
          Tiếp cận với nhiều người mua hơn
        </Typography.Text>
        <Flex gap={8} wrap="wrap">
          {[
            {
              title: "Giải Thưởng Của Shop",
              desc: "Thu hút Người mua ghé thăm và mua sắm nhiều hơn tại shop của bạn nhờ các Game vui nhộn với giải thưởng hấp dẫn",
              icon: <Engagement01Svg style={{ margin: "0 0 -2px" }} />,
            },
            {
              title: "Ưu Đãi Follower",
              desc: "Khuyến khích người mua theo dõi Shop bằng cách tặng voucher cho Người theo dõi mới",
              icon: <Engagement02Svg style={{ margin: "0 0 -3px" }} />,
            },
            {
              title: "YooSeller Live",
              desc: "Kết nối trực tuyến với người mua và trả lời các câu hỏi liên quan đến việc mua hàng một cách dễ dàng",
              icon: <Engagement03Svg style={{ margin: "0 0 -3px" }} />,
            },
            {
              title: "Xu thưởng đánh giá",
              desc: "Tặng Xu thưởng để khuyến khích người mua để lại đánh giá cho sản phẩm của Shop",
              icon: <Engagement04Svg style={{ margin: "0 0 -3px" }} />,
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
                  backgroundColor: rgba("#1baf9d", 0.2),
                  color: "#1baf9d",
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

      <Flex vertical gap={8} style={{}}>
        <Typography.Text strong type="secondary">
          Tăng lượt truy cập cho shop của bạn
        </Typography.Text>
        <Flex gap={8} wrap="wrap">
          {[
            {
              title: "Quảng cáo YooSeller",
              desc: "Tăng mức độ hiển thị sản phẩm, thúc đẩy doanh số bán hàng",
              icon: <IncreaseTraffic01Svg style={{ margin: "0 0 -2px" }} />,
            },
            {
              title: "Top Sản phẩm nổi bật",
              desc: "Tăng lượng truy cập của sản phẩm bằng cách hiển thị sản phẩm đó nổi bật trên những trang sản phẩm khác của Shop",
              icon: <IncreaseTraffic02Svg style={{ margin: "0 0 -3px" }} />,
            },
            {
              title: "Quản lý mã UTM",
              desc: "Tăng lượng truy cập của Shop bằng các đường dẫn traffic từ Ngoại sàn",
              icon: <IncreaseTraffic03Svg style={{ margin: "0 0 -3px" }} />,
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
                  backgroundColor: rgba("#ffbf00", 0.2),
                  color: "#ffbf00",
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
    &:hover {
      box-shadow: var(--box-shadow);
    }
  }
`;

export default MarketingToolsCard;

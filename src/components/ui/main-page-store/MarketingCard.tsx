import Link from "@/components/next/Link";
import Tag from "@/components/tag/Tag";
import styled from "@emotion/styled";
import { Card, CardProps, Divider, Space, Typography } from "antd";
import Image from "next/image";
import { useId } from "react";

type TMarketingCardProps = CardProps & { storeId?: number };

const MarketingCard = ({ storeId, ...props }: TMarketingCardProps) => {
  const uid = useId();
  const tools = [
    {
      href: "/",
      imageUrl: "/images/voucher.png",
      title: "Mã Giảm Giá Của Shop",
      desc: "Công cụ tăng đơn hàng bằng cách tạo mã giảm giá tặng cho người mua",
      tag: (
        <Tag bordered={false} color="warning">
          Được đề xuất
        </Tag>
      ),
    },
    {
      href: "/",
      imageUrl: "/images/discount.png",
      title: "Chương Trình Của Shop",
      desc: "Công cụ tăng đơn hàng bằng cách tạo chương trình giảm giá",
    },
    {
      href: "/",
      imageUrl: "/images/bundle.png",
      title: "Combo Khuyến Mãi",
      desc: "Tạo Combo Khuyến Mãi để tăng giá trị đơn hàng trên mỗi Người mua",
    },
    {
      href: "/",
      imageUrl: "/images/shop-flash-sale.png",
      title: "Flash Sale Của Shop",
      desc: "Công cụ giúp tăng doanh số bằng cách tạo khuyến mãi khủng trong các khung giờ nhất định",
    },
    {
      href: "/",
      imageUrl: "/images/follow-prize.png",
      title: "Ưu Đãi Follower",
      desc: "Khuyến khích người mua theo dõi Shop bằng cách tặng voucher cho Người theo dõi mới",
    },
  ];

  return (
    <StyledWrapper
      title="Kênh Marketing"
      size="default"
      extra={<Link href={"/"}>Xem thêm ➔</Link>}
      {...props}
    >
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        Công cụ Marketing & Đăng ký chương trình Khuyến Mãi
      </Typography.Text>
      <Divider type="horizontal" style={{ margin: "8px 0" }} />

      <Typography.Text strong>Công Cụ Marketing</Typography.Text>
      <Space
        className="tools"
        split={<Divider type="vertical" />}
        style={{ margin: "4px 0 4px" }}
        size={0}
      >
        {tools.map((item, index) => (
          <Link href={item.href} className="tools-item" key={uid + index + String(storeId)}>
            <Image className="tools-item-icon" src={item.imageUrl} alt="" width={56} height={56} />
            <Typography.Text className="tools-item-title" strong style={{ lineHeight: 1.1 }}>
              {item.title}
            </Typography.Text>
            <Typography.Text
              type="secondary"
              className="tools-item-desc"
              style={{ lineHeight: 1.1, marginBottom: 4 }}
            >
              {item.desc}
            </Typography.Text>
            {item.tag}
          </Link>
        ))}
      </Space>
    </StyledWrapper>
  );
};

export const MarketingCardFarm = ({ storeId, ...props }: TMarketingCardProps) => {
  const uid = useId();
  const tools = [
    {
      href: "/",
      imageUrl: "/images/voucher.png",
      title: "Mã Giảm Giá Của Shop",
      desc: "Công cụ tăng đơn hàng bằng cách tạo mã giảm giá tặng cho người mua",
      tag: (
        <Tag bordered={false} color="warning">
          Được đề xuất
        </Tag>
      ),
    },
    {
      href: "/",
      imageUrl: "/images/discount.png",
      title: "Chương Trình Của Shop",
      desc: "Công cụ tăng đơn hàng bằng cách tạo chương trình giảm giá",
    },
    {
      href: "/",
      imageUrl: "/images/bundle.png",
      title: "Combo Khuyến Mãi",
      desc: "Tạo Combo Khuyến Mãi để tăng giá trị đơn hàng trên mỗi Người mua",
    },
    {
      href: "/",
      imageUrl: "/images/shop-flash-sale.png",
      title: "Flash Sale Của Shop",
      desc: "Công cụ giúp tăng doanh số bằng cách tạo khuyến mãi khủng trong các khung giờ nhất định",
    },
    {
      href: "/",
      imageUrl: "/images/follow-prize.png",
      title: "Ưu Đãi Follower",
      desc: "Khuyến khích người mua theo dõi Shop bằng cách tặng voucher cho Người theo dõi mới",
    },
  ];

  return (
    <StyledWrapper
      title="Kênh Marketing"
      size="default"
      extra={<Link href={"/"}>Xem thêm ➔</Link>}
      {...props}
    >
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        Công cụ Marketing & Đăng ký chương trình Khuyến Mãi
      </Typography.Text>
      <Divider type="horizontal" style={{ margin: "8px 0" }} />

      <Typography.Text strong>Công Cụ Marketing</Typography.Text>
      <Space
        className="tools"
        split={<Divider type="vertical" />}
        style={{ margin: "4px 0 4px" }}
        size={0}
      >
        {tools.map((item, index) => (
          <Link href={item.href} className="tools-item" key={uid + index + String(storeId)}>
            <Image className="tools-item-icon" src={item.imageUrl} alt="" width={56} height={56} />
            <Typography.Text className="tools-item-title" strong style={{ lineHeight: 1.1 }}>
              {item.title}
            </Typography.Text>
            <Typography.Text
              type="secondary"
              className="tools-item-desc"
              style={{ lineHeight: 1.1, marginBottom: 4 }}
            >
              {item.desc}
            </Typography.Text>
            {item.tag}
          </Link>
        ))}
      </Space>
    </StyledWrapper>
  );
};

const StyledWrapper = styled(Card)`
  & .ant-card-body {
    display: flex;
    flex-direction: column;
  }
  & .tools-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 200px;
    min-height: 200px;
    padding: 8px 4px;
    border-radius: 8px;
    &-icon {
      width: 56px;
      height: 56px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 8px;
    }
    &-title {
      min-height: 32px;
      text-align: center;
      font-size: 14px;
    }
    &-desc {
      text-align: center;
      font-size: 12px;
    }
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
      &-title {
        text-decoration: underline;
      }
    }
  }
`;

export default MarketingCard;

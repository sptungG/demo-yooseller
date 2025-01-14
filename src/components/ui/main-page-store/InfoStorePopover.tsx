import { AvatarGroup } from "@/components/avatar/Avatar";
import Button from "@/components/button/Button";
import Link from "@/components/next/Link";
import Container from "@/components/shared/Container";
import DeliveryMethodTag from "@/components/tag/DeliveryMethodTag";
import StoreWorkTime from "@/components/tag/StoreWorkTime";
import Tag from "@/components/tag/Tag";
import useChangeLocale from "@/hooks/useChangeLocale";
import useGetProviderTypes from "@/hooks/useGetProviderTypes";
import { useGetProviderByIdQuery } from "@/redux/query/provider.query";
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/query";
import { Avatar, Descriptions, Flex, Popover, Tabs, Typography } from "antd";
import { useId, useState } from "react";
import { MdStarRate } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";

type TInfoStorePopoverProps = { storeId?: number; style?: React.CSSProperties };

const InfoStorePopover = ({ storeId, style }: TInfoStorePopoverProps) => {
  const uid = useId();
  const { colorPrimary } = useTheme();
  const { i18n } = useChangeLocale();
  const { mappedTypes } = useGetProviderTypes();
  const [open, setOpen] = useState<boolean>(false);
  const { data: getProviderByIdRes, isLoading } = useGetProviderByIdQuery(
    storeId ? { id: storeId } : skipToken,
    { refetchOnMountOrArgChange: true },
  );
  const storeData = getProviderByIdRes?.data;
  const [selectedTab, setSelectedTab] = useState<string>();

  if (!storeData) return <></>;

  return (
    <Popover
      placement="bottomLeft"
      content={
        <StyledContent suppressScrollX>
          <div className="info-wrapper">
            <div className="header-wrapper">
              <div className="images-wrapper">
                <AvatarGroup key={uid + storeData.id + "images"} maxCount={3}>
                  {storeData.imageUrls.map((item, index) => (
                    <Avatar
                      size={index === 0 ? 64 : 56}
                      key={uid + storeData.id + "image" + index}
                      src={item}
                      shape={index === 0 ? "square" : "circle"}
                    ></Avatar>
                  ))}
                </AvatarGroup>
              </div>
              <div className="actions-wrapper">
                <Button
                  type="link"
                  icon={<RiEdit2Fill size={22} />}
                  href={`/supplier/store/${String(storeData.id)}/edit`}
                ></Button>
              </div>
            </div>

            <div className="name-wrapper">
              <Typography.Title
                level={2}
                style={{ marginBottom: 0, fontSize: 22 }}
                ellipsis={{
                  tooltip: {
                    title: storeData.name,
                    placement: "bottomLeft",
                    overlayInnerStyle: { maxWidth: 290 },
                  },
                }}
              >
                {storeData.name || ""}
              </Typography.Title>
            </div>

            <div
              className="detail-desc"
              dangerouslySetInnerHTML={{ __html: storeData.description }}
            ></div>

            <div className="type-wrapper" style={{ maxWidth: "100%" }}>
              <Tag
                bordered={false}
                className="line-clamp-2"
                style={{ lineHeight: 1.2, padding: "4px 6px" }}
              >
                {`${mappedTypes(storeData.groupType)}${
                  !!mappedTypes(storeData.type) ? " / " + mappedTypes(storeData.type) : ""
                }`}
              </Tag>
            </div>
            <div className="other-wrapper">
              <div className="rate-wrapper">
                <Tag
                  color={!!+storeData.ratePoint ? "gold" : "default"}
                  bordered={false}
                  icon={<MdStarRate />}
                >
                  {(+storeData.ratePoint).toFixed(2) || "0"}
                </Tag>
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  <span style={{ margin: 2 }}>•</span>
                  <span style={{ fontWeight: 600 }}>{storeData.countRate}</span>{" "}
                  {i18n["Đánh giá"].toLowerCase()}
                </Typography.Text>
              </div>
            </div>

            <Tabs
              tabPosition="top"
              size="small"
              tabBarGutter={12}
              style={{ marginTop: 4 }}
              tabBarStyle={{ marginBottom: 8 }}
              activeKey={selectedTab}
              onChange={setSelectedTab}
              items={
                [
                  {
                    key: "contact",
                    label: (
                      <Typography.Text strong={selectedTab === "contact"}>
                        {i18n["Liên hệ"]}
                      </Typography.Text>
                    ),
                    children: (
                      <Descriptions
                        layout="vertical"
                        size="small"
                        column={1}
                        labelStyle={{ marginBottom: 0 }}
                        contentStyle={{ marginTop: -10, lineHeight: 1.2 }}
                      >
                        <Descriptions.Item label={i18n["Số điện thoại"]}>
                          {storeData.phoneNumber}
                        </Descriptions.Item>
                        <Descriptions.Item label={i18n["Tên liên hệ"]}>
                          {storeData.contact}
                        </Descriptions.Item>
                        <Descriptions.Item label={"Email"}>{storeData.email}</Descriptions.Item>
                        <Descriptions.Item label={i18n["Địa chỉ"]}>
                          {storeData.address}
                        </Descriptions.Item>
                        <Descriptions.Item label={i18n["Đơn vị vận chuyển"]}>
                          <Flex gap={8} wrap="wrap" style={{ marginTop: 4 }}>
                            {storeData?.carrierList.map((item, index) => (
                              <DeliveryMethodTag
                                key={uid + "carrierList" + index}
                                bordered={false}
                                method={item}
                              />
                            ))}
                          </Flex>
                        </Descriptions.Item>
                      </Descriptions>
                    ),
                  },
                  !!storeData.workTime
                    ? {
                        key: "workTime",
                        label: (
                          <Typography.Text strong={selectedTab === "workTime"}>
                            {i18n["Thời gian làm việc"]}
                          </Typography.Text>
                        ),
                        children: <StoreWorkTime workTime={storeData.workTime} />,
                      }
                    : undefined,
                ].filter((t) => !!t) as any[]
              }
            />
          </div>
          <div className="actions-bottom">
            <Link href={`/supplier/store/${storeId}`}>
              <Button block size="large" type="primary">
                Xem chi tiết ➔
              </Button>
            </Link>
          </div>
        </StyledContent>
      }
      overlayInnerStyle={{ maxWidth: 320, padding: 0 }}
      arrow={false}
      open={open}
      onOpenChange={setOpen}
      trigger={["hover"]}
    >
      <StyledContainer style={{ border: open ? `1px solid ${colorPrimary}` : undefined, ...style }}>
        <Avatar
          shape="square"
          style={{ flexShrink: 0, marginRight: 8 }}
          src={storeData.imageUrls?.[0]}
          size={36}
        >
          {storeData.name?.[0]}
        </Avatar>
        <Flex vertical style={{ flex: "1 1 auto", minWidth: 0, maxWidth: 200 }}>
          <Typography.Title
            level={5}
            ellipsis
            style={{ maxWidth: "100%", lineHeight: 1.1, margin: 0 }}
          >
            {storeData.name}
          </Typography.Title>
          <Typography.Text type="secondary" ellipsis style={{ fontSize: 12, lineHeight: 1.1 }}>
            {storeData.name}
          </Typography.Text>
        </Flex>

        {/* <FaCircleChevronDown size={16} style={{ opacity: 0.2, marginLeft: 4 }} /> */}
        <Typography.Text
          style={{
            marginLeft: "auto",
            fontSize: 12,
            textDecoration: open ? "underline" : undefined,
            whiteSpace: "nowrap",
          }}
        >
          Xem thông tin
        </Typography.Text>
      </StyledContainer>
    </Popover>
  );
};

const StyledContainer = styled.button`
  --box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02),
    0 2px 4px 0 rgba(0, 0, 0, 0.02);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  text-align: left;
  width: 100%;
  border-radius: 8px;
  padding: 6px 6px;
  cursor: pointer;
  user-select: none;
  pointer-events: none;
  border: 1px solid #fff;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 10;
  box-shadow: var(--box-shadow);
`;

const StyledContent = styled(Container)`
  display: flex;
  flex-direction: column;
  position: relative;
  max-height: calc(100dvh - 134px);
  border-radius: 8px;
  & .actions-bottom {
    margin-top: auto;
    position: sticky;
    bottom: 0;
    padding: 8px 8px;
    background-color: #fff;
  }
  & > .info-wrapper {
    padding: 8px;
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #fff;
    .header-wrapper {
      position: relative;
      .images-wrapper {
        position: relative;
      }
      .actions-wrapper {
        position: absolute;
        top: 0;
        right: 0;
      }
    }
    .name-wrapper {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      position: relative;
    }
    .type-wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 8px;
    }
    .detail-desc {
      opacity: 0.45;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-word;
      margin-bottom: 12px;
      flex-shrink: 0;
    }
    .contact-wrapper {
      display: flex;
      flex-direction: column;
      max-width: 100%;
    }
    .other-wrapper {
      display: flex;
      align-items: center;
      .rate-wrapper {
        display: flex;
        align-items: center;
        gap: 2px;
        & .ant-tag {
          line-height: 0;
          gap: 4px;
          padding: 2px 6px;
        }
        & .ant-typography {
          font-size: 13px;
        }
      }
    }
  }
`;

export default InfoStorePopover;

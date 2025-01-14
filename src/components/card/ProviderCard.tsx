import useGetProviderFarm from "@/hooks/useGetProviderFarm";
import styled from "@emotion/styled";
import { useSafeState } from "ahooks";
import { Descriptions, Flex, Skeleton, Tabs, Typography } from "antd";
import { useId } from "react";
import { MdStarRate } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProvider from "src/hooks/useGetProvider";
import useGetProviderTypes from "src/hooks/useGetProviderTypes";
import Avatar, { AvatarGroup } from "../avatar/Avatar";
import Button from "../button/Button";
import StoreRating from "../list/StoreRating";
import DeliveryMethodTag from "../tag/DeliveryMethodTag";
import StoreWorkTime from "../tag/StoreWorkTime";
import Tag from "../tag/Tag";

type TProviderCardProps = { id?: number };

const ProviderCard = ({ id }: TProviderCardProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { gSelectedProvider, isLoading } = useGetProvider({ id });
  const { mappedTypes } = useGetProviderTypes();
  const [selectedTab, setSelectedTab] = useSafeState<string>();
  const [showStoreRating, setShowStoreRating] = useSafeState<boolean>(false);

  if (isLoading)
    return (
      <ProviderCardStyled>
        <div className="header-wrapper" style={{ marginBottom: 12 }}>
          <Skeleton.Image active />
          <div className="actions-wrapper">
            <Skeleton.Button active size="small" />
          </div>
        </div>
        <div className="name-wrapper" style={{ marginBottom: 12 }}>
          <Skeleton.Input active />
        </div>
        <div className="other-wrapper" style={{ marginBottom: 12 }}>
          <Skeleton active />
        </div>
      </ProviderCardStyled>
    );
  if (!gSelectedProvider) return <ProviderCardStyled></ProviderCardStyled>;

  return (
    <ProviderCardStyled>
      <div className="header-wrapper">
        <div className="images-wrapper">
          <AvatarGroup key={uid + gSelectedProvider.id + "images"} maxCount={3}>
            {gSelectedProvider.imageUrls.map((item, index) => (
              <Avatar
                size={index === 0 ? 80 : 64}
                key={uid + gSelectedProvider.id + "image" + index}
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
            href={`/supplier/store/${String(gSelectedProvider.id)}/edit`}
          ></Button>
        </div>
      </div>

      <div className="name-wrapper">
        <Typography.Title
          level={2}
          style={{ marginBottom: 0 }}
          ellipsis={{
            tooltip: {
              title: gSelectedProvider.name,
              placement: "bottomLeft",
              overlayInnerStyle: { maxWidth: 290 },
            },
          }}
        >
          {gSelectedProvider.name || ""}
        </Typography.Title>
      </div>

      <div
        className="detail-desc"
        dangerouslySetInnerHTML={{ __html: gSelectedProvider.description }}
      ></div>

      <div className="type-wrapper" style={{ maxWidth: "100%" }}>
        <Tag
          bordered={false}
          className="line-clamp-2"
          style={{ lineHeight: 1.2, padding: "4px 6px" }}
        >
          {`${mappedTypes(gSelectedProvider.groupType)}${
            !!mappedTypes(gSelectedProvider.type) ? " / " + mappedTypes(gSelectedProvider.type) : ""
          }`}
        </Tag>
      </div>
      <div className="other-wrapper">
        <div
          className="rate-wrapper"
          onClick={() => {
            setShowStoreRating(true);
          }}
        >
          <Tag
            color={!!+gSelectedProvider.ratePoint ? "gold" : "default"}
            bordered={false}
            icon={<MdStarRate />}
          >
            {(+gSelectedProvider.ratePoint).toFixed(2) || "0"}
          </Tag>
          <Button type="link">
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              <span style={{ margin: 2 }}>•</span>
              <span style={{ fontWeight: 600 }}>{gSelectedProvider.countRate}</span>{" "}
              {i18n["Đánh giá"].toLowerCase()}
            </Typography.Text>
          </Button>
        </div>
        {!!showStoreRating && (
          <StoreRating open={!!showStoreRating} onClose={() => setShowStoreRating(false)} />
        )}
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
                    {gSelectedProvider.phoneNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label={i18n["Tên liên hệ"]}>
                    {gSelectedProvider.contact}
                  </Descriptions.Item>
                  <Descriptions.Item label={"Email"}>{gSelectedProvider.email}</Descriptions.Item>
                  <Descriptions.Item label={i18n["Địa chỉ"]}>
                    {gSelectedProvider.address}
                  </Descriptions.Item>
                  <Descriptions.Item label={i18n["Đơn vị vận chuyển"]}>
                    <Flex gap={8} wrap="wrap" style={{ marginTop: 4 }}>
                      {gSelectedProvider?.carrierList.map((item, index) => (
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
            !!gSelectedProvider.workTime
              ? {
                  key: "workTime",
                  label: (
                    <Typography.Text strong={selectedTab === "workTime"}>
                      {i18n["Thời gian làm việc"]}
                    </Typography.Text>
                  ),
                  children: <StoreWorkTime workTime={gSelectedProvider.workTime} />,
                }
              : undefined,
          ].filter((t) => !!t) as any[]
        }
      />
    </ProviderCardStyled>
  );
};

export const ProviderFarmCard = ({ id }: TProviderCardProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { gSelectedProvider, isLoading } = useGetProviderFarm();
  const { mappedTypes } = useGetProviderTypes();
  const [selectedTab, setSelectedTab] = useSafeState<string>();

  if (isLoading)
    return (
      <ProviderCardStyled>
        <div className="header-wrapper" style={{ marginBottom: 12 }}>
          <Skeleton.Image active />
          <div className="actions-wrapper">
            <Skeleton.Button active size="small" />
          </div>
        </div>
        <div className="name-wrapper" style={{ marginBottom: 12 }}>
          <Skeleton.Input active />
        </div>
        <div className="other-wrapper" style={{ marginBottom: 12 }}>
          <Skeleton active />
        </div>
      </ProviderCardStyled>
    );
  if (!gSelectedProvider) return <ProviderCardStyled></ProviderCardStyled>;

  return (
    <ProviderCardStyled>
      <div className="header-wrapper">
        <div className="images-wrapper">
          <AvatarGroup key={uid + gSelectedProvider.id + "images"} maxCount={3}>
            {((gSelectedProvider?.imageUrls || []) as any[]).map((item, index) => (
              <Avatar
                size={index === 0 ? 80 : 64}
                key={uid + gSelectedProvider.id + "image" + index}
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
            href={`/supplier/farm/${String(gSelectedProvider.id)}/edit`}
          ></Button>
        </div>
      </div>

      <div className="name-wrapper">
        <Typography.Title
          level={2}
          style={{ marginBottom: 0 }}
          ellipsis={{
            tooltip: {
              title: gSelectedProvider.name,
              placement: "bottomLeft",
              overlayInnerStyle: { maxWidth: 290 },
            },
          }}
        >
          {gSelectedProvider.name || ""}
        </Typography.Title>
      </div>

      <div
        className="detail-desc"
        dangerouslySetInnerHTML={{ __html: gSelectedProvider.description }}
      ></div>

      <div className="type-wrapper" style={{ maxWidth: "100%" }}>
        <Tag
          bordered={false}
          className="line-clamp-2"
          style={{ lineHeight: 1.2, padding: "4px 6px" }}
        >
          {`${mappedTypes(gSelectedProvider.groupType)}${
            !!mappedTypes(gSelectedProvider.type) ? " / " + mappedTypes(gSelectedProvider.type) : ""
          }`}
        </Tag>
      </div>
      <div className="other-wrapper">
        <div className="rate-wrapper">
          <Tag
            color={!!+gSelectedProvider.ratePoint ? "gold" : "default"}
            bordered={false}
            icon={<MdStarRate />}
          >
            {+gSelectedProvider.ratePoint || "0"}
          </Tag>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            <span style={{ margin: 2 }}>•</span>
            <span style={{ fontWeight: 600 }}>{gSelectedProvider.countRate}</span>{" "}
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
                    {gSelectedProvider.phoneNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label={i18n["Tên liên hệ"]}>
                    {gSelectedProvider.contact}
                  </Descriptions.Item>
                  <Descriptions.Item label={"Email"}>{gSelectedProvider.email}</Descriptions.Item>
                  <Descriptions.Item label={i18n["Địa chỉ"]}>
                    {gSelectedProvider.address}
                  </Descriptions.Item>
                  <Descriptions.Item label={i18n["Đơn vị vận chuyển"]}>
                    <Flex gap={8} wrap="wrap" style={{ marginTop: 4 }}>
                      {(gSelectedProvider?.carrierList as any[]).map((item, index) => (
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
            !!gSelectedProvider.workTime
              ? {
                  key: "workTime",
                  label: (
                    <Typography.Text strong={selectedTab === "workTime"}>
                      {i18n["Thời gian làm việc"]}
                    </Typography.Text>
                  ),
                  children: <StoreWorkTime workTime={gSelectedProvider.workTime} />,
                }
              : undefined,
          ].filter((t) => !!t) as any[]
        }
      />
    </ProviderCardStyled>
  );
};

const ProviderCardStyled = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  height: 100%;
  border-radius: 8px;
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
`;

export default ProviderCard;

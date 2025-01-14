import { ProviderFarmCard } from "@/components/card/ProviderCard";
import { EcofarmSvg } from "@/components/icons";
import Container from "@/components/shared/Container";
import { ItemsRankingCardFarm } from "@/components/ui/main-page-store/ItemsRankingCard";
import { MarketingCardFarm } from "@/components/ui/main-page-store/MarketingCard";
import { StatisticCardFarm } from "@/components/ui/main-page-store/StatisticCard";
import { TodoListFarm } from "@/components/ui/main-page-store/TodoList";
import useGetProviderFarm from "@/hooks/useGetProviderFarm";
import styled from "@emotion/styled";
import { Card, Skeleton } from "antd";
import { useId } from "react";
import Avatar from "src/components/avatar/Avatar";
import withAuth from "src/components/hoc/withAuth";
import BreadcrumbHeader from "src/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "src/components/layout/SiderHeaderLayout";
import StyledPage from "src/components/layout/StyledPage";

const Page = () => {
  const uid = useId();

  const { gSelectedProvider, bgImage } = useGetProviderFarm();
  const selectedStore = gSelectedProvider?.id;

  return (
    <SiderHeaderLayout
      headerLeft={
        <BreadcrumbHeader
          items={[{ "/supplier/farm": <EcofarmSvg width={26} /> }]}
          current={
            <Avatar
              shape="square"
              key={String(gSelectedProvider?.id) + uid}
              src={gSelectedProvider?.imageUrls[0]}
              size={26}
            />
          }
        />
      }
      style={{ height: "100dvh" }}
    >
      <PageWrapper>
        {selectedStore ? (
          <Container className="left-wrapper" suppressScrollX>
            <TodoListFarm
              storeId={selectedStore}
              style={{ marginBottom: 12 }}
              bodyStyle={{ padding: "0 8px 8px" }}
              headStyle={{
                border: "none",
                padding: "0 0 0 8px",
                minHeight: 36,
                marginBottom: -12,
              }}
            />
            <StatisticCardFarm
              storeId={selectedStore}
              style={{ marginBottom: 12 }}
              headStyle={{
                border: "none",
                padding: "0 0 0 8px",
                minHeight: 36,
                marginBottom: -12,
              }}
              bodyStyle={{ padding: "0 8px 8px" }}
            />
            <ItemsRankingCardFarm
              storeId={selectedStore}
              style={{ marginBottom: 12 }}
              headStyle={{
                border: "none",
                padding: "0 0 0 8px",
                minHeight: 36,
                marginBottom: -12,
              }}
              bodyStyle={{ padding: "0 0 8px" }}
            />
            <MarketingCardFarm
              storeId={selectedStore}
              headStyle={{
                border: "none",
                padding: "0 8px 0 8px",
                minHeight: 36,
                marginBottom: -8,
              }}
              bodyStyle={{ padding: "0 8px 8px" }}
            />
          </Container>
        ) : (
          <div className="left-wrapper">
            <Card size="small" style={{ marginBottom: 12 }}>
              <Skeleton paragraph={{ rows: 4 }} />
            </Card>
            <Card size="small" style={{ marginBottom: 12 }}>
              <Skeleton paragraph={{ rows: 6 }} />
            </Card>
            <Card size="small" style={{ marginBottom: 12 }}>
              <Skeleton paragraph={{ rows: 6 }} />
            </Card>
            <Card size="small" style={{ marginBottom: 0 }}>
              <Skeleton paragraph={{ rows: 6 }} />
            </Card>
          </div>
        )}
        <div className="right-wrapper">
          <ProviderFarmCard />
          {/* <Image src={bgImage} alt="" fill style={{ objectFit: "cover", opacity: 0.2 }} /> */}
        </div>
      </PageWrapper>
    </SiderHeaderLayout>
  );
};

const PageWrapper = styled(StyledPage)`
  flex-direction: row;
  max-width: 1440px;
  margin: 0 auto;
  position: relative;
  & > .right-wrapper {
    flex: 0 0 300px;
    max-width: 300px;
    padding: 12px 12px 12px 0;
    position: relative;
  }

  & > .left-wrapper {
    padding: 12px 12px 12px;
    display: flex;
    flex-direction: column;
    align-self: flex-start;
    flex: 1 1 auto;
    min-width: 0;
    height: 100%;
  }
`;

export default withAuth(Page);

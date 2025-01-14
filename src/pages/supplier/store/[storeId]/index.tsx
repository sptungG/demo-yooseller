import ProviderCard from "@/components/card/ProviderCard";
import Container from "@/components/shared/Container";
import ItemsRankingCard from "@/components/ui/main-page-store/ItemsRankingCard";
import MarketingCard from "@/components/ui/main-page-store/MarketingCard";
import StatisticCard from "@/components/ui/main-page-store/StatisticCard";
import TodoList from "@/components/ui/main-page-store/TodoList";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { useRouter } from "next/router";
import { useId } from "react";
import { MdOutlineStore } from "react-icons/md";
import Avatar from "src/components/avatar/Avatar";
import Card from "src/components/card/Card";
import withAuth from "src/components/hoc/withAuth";
import BreadcrumbHeader from "src/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "src/components/layout/SiderHeaderLayout";
import StyledPage from "src/components/layout/StyledPage";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProvider from "src/hooks/useGetProvider";

const Page = () => {
  const uid = useId();
  const {
    query: { storeId },
  } = useRouter();
  const selectedStore = !!storeId ? +String(storeId) : undefined;
  const { i18n } = useChangeLocale();

  const { gSelectedProvider } = useGetProvider({});

  return (
    <SiderHeaderLayout
      headerLeft={
        <BreadcrumbHeader
          items={[{ "/supplier/store": <MdOutlineStore size={26} /> }]}
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
            <TodoList
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
            <StatisticCard
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
            <ItemsRankingCard
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
            <MarketingCard
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
          <ProviderCard />
        </div>
      </PageWrapper>
    </SiderHeaderLayout>
  );
};

const PageWrapper = styled(StyledPage)`
  flex-direction: row;
  max-width: 1440px;
  margin: 0 auto;
  & > .right-wrapper {
    flex: 0 0 300px;
    max-width: 300px;
    padding: 12px 12px 12px 0;
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

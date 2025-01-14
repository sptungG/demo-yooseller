import MainPageStores from "@/components/ui/main-page-store/MainPageStores";
import styled from "@emotion/styled";
import withAuth from "src/components/hoc/withAuth";
import BreadcrumbHeader from "src/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "src/components/layout/SiderHeaderLayout";
import StyledPage from "src/components/layout/StyledPage";

function HomePage() {
  return (
    <SiderHeaderLayout hideSider headerLeft={<BreadcrumbHeader />} style={{ height: "100dvh" }}>
      <PageWrapper>
        <MainPageStores />
      </PageWrapper>
    </SiderHeaderLayout>
  );
}

const PageWrapper = styled(StyledPage)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 8px;
`;

export default withAuth(HomePage);

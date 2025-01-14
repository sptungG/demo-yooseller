import BreadcrumbHeader from "@/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "@/components/layout/SiderHeaderLayout";
import StyledPage from "@/components/layout/StyledPage";
import MainPageFarms from "@/components/ui/main-page-farm/MainPageFarms";
import styled from "@emotion/styled";
import Image from "next/image";

//type TPageProps = {};

function Page() {
  return (
    <SiderHeaderLayout
      hideSider
      headerLeft={<BreadcrumbHeader showText />}
      style={{ height: "100dvh" }}
    >
      <PageWrapper>
        <MainPageFarms />
      </PageWrapper>
      <Image
        src={"/images/farm-bg-05.png"}
        alt=""
        fill
        className="bg-img"
        quality={90}
        style={{
          objectFit: "cover",
          objectPosition: "bottom",
          zIndex: -1,
          opacity: 0.3,
        }}
      />
    </SiderHeaderLayout>
  );
}

const PageWrapper = styled(StyledPage)`
  --box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02),
    0 2px 4px 0 rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 8px;
`;

export default Page;

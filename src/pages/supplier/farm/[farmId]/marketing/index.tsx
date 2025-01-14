import Avatar from "@/components/avatar/Avatar";
import { EcofarmSvg } from "@/components/icons";
import Image from "@/components/next/Image";
import Container from "@/components/shared/Container";
import MockCard from "@/components/ui/main-page-farm/MockCard";
import EventsCard from "@/components/ui/marketing-main-page/EventsCard";
import MarketingToolsCard from "@/components/ui/marketing-main-page/MarketingToolsCard";
import useGetProviderFarm from "@/hooks/useGetProviderFarm";
import styled from "@emotion/styled";
import { Carousel, Form } from "antd";
import { useRouter } from "next/router";
import { useId } from "react";
import withAuth from "src/components/hoc/withAuth";
import BreadcrumbHeader from "src/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "src/components/layout/SiderHeaderLayout";
import StyledPage from "src/components/layout/StyledPage";
import useChangeLocale from "src/hooks/useChangeLocale";

const bannerImages = [
  "https://down-sg.img.susercontent.com/sg-11134213-7rbn8-lpzyvlyf2fif2a",
  "https://down-sg.img.susercontent.com/sg-11134213-7rbn8-lpzyvlyf2fif2a",
  "https://down-sg.img.susercontent.com/sg-11134213-7rbn8-lpzyvlyf2fif2a",
];

const Page = () => {
  const uid = useId();
  const {
    replace,
    query: { farmId },
  } = useRouter();
  const { i18n, locale } = useChangeLocale();
  const [form] = Form.useForm();
  const { gSelectedProvider } = useGetProviderFarm();

  return (
    <SiderHeaderLayout
      headerLeft={
        <BreadcrumbHeader
          items={[
            { "/supplier/farm": <EcofarmSvg width={26} /> },
            {
              [`/supplier/farm/${farmId}`]: (
                <Avatar
                  shape="square"
                  key={String(gSelectedProvider?.id) + uid}
                  src={gSelectedProvider?.imageUrls[0]}
                  size={26}
                />
              ),
            },
          ]}
          current={i18n["Kênh marketing"]}
        />
      }
      style={{ height: "100dvh" }}
    >
      <PageWrapper>
        <Container
          suppressScrollX
          className="left-wrapper"
          style={{ flex: "1 1 auto", minWidth: 0, maxHeight: "100%" }}
        >
          <Carousel autoplay style={{ borderRadius: 6, overflow: "hidden", marginBottom: 12 }}>
            {bannerImages.map((item, index) => (
              <Image
                preview={false}
                src={item}
                alt=""
                key={item + index}
                style={{ height: 80, width: "100%", objectFit: "cover", borderRadius: 8 }}
              />
            ))}
          </Carousel>
          <EventsCard
            storeId={gSelectedProvider?.id}
            style={{ marginBottom: 12 }}
            bodyStyle={{ padding: "0 12px 12px" }}
            headStyle={{ border: "none", padding: "0 0 0 12px", minHeight: 36 }}
          />
          <MarketingToolsCard
            storeId={gSelectedProvider?.id}
            style={{ marginBottom: 0 }}
            bodyStyle={{ padding: "0 12px 24px" }}
            headStyle={{ border: "none", padding: "0 0 0 12px", minHeight: 36 }}
          />
        </Container>
        <Container
          suppressScrollX
          className="right-wrapper"
          style={{ flex: "0 0 320px", width: 320, maxHeight: "100%" }}
        >
          <MockCard
            bodyStyle={{ padding: "0 8px 8px" }}
            headStyle={{ border: "none", padding: "0 0 0 8px", minHeight: 36, marginBottom: -12 }}
            title={"Thông báo"}
            desc={"Thông báo"}
            paragraph={{ rows: 8 }}
          />
        </Container>
      </PageWrapper>
    </SiderHeaderLayout>
  );
};

const PageWrapper = styled(StyledPage)`
  padding: 12px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: row;
  max-width: 1440px;
  margin: 0 auto;
  & > .left-wrapper {
    display: flex;
    flex-direction: column;
    margin-right: 12px;
  }
  & > .right-wrapper {
    display: flex;
    flex-direction: column;
  }
`;

export default withAuth(Page);

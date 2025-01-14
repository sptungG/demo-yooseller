import Button from "@/components/button/Button";
import Container from "@/components/shared/Container";
import useChangeLocale from "@/hooks/useChangeLocale";
import useGetProvider from "@/hooks/useGetProvider";
import { useGetPageInformationsByProviderIdQuery } from "@/redux/query/pageprivate.query";
import { EyeOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Card, Divider, Flex, Skeleton, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useId } from "react";
import { MdOutlineStore } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import Avatar from "src/components/avatar/Avatar";
import withAuth from "src/components/hoc/withAuth";
import BreadcrumbHeader from "src/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "src/components/layout/SiderHeaderLayout";
import StyledPage from "src/components/layout/StyledPage";
const { Title } = Typography;
const Page = () => {
  const uid = useId();
  const {
    query: { storeId },
  } = useRouter();
  const { i18n, locale } = useChangeLocale();
  const { gSelectedProvider } = useGetProvider({});
  const selectedStore = gSelectedProvider?.id;

  const { data: rsWebsite, isLoading } = useGetPageInformationsByProviderIdQuery(
    { providerId: +(storeId as string) },
    { refetchOnMountOrArgChange: true, skip: !storeId },
  );
  const dataWebsite = rsWebsite?.data;
  console.log("isLoading", isLoading);
  return (
    <SiderHeaderLayout
      headerLeft={
        <BreadcrumbHeader
          items={[
            { "/supplier/store": <MdOutlineStore size={26} /> },
            {
              [`/supplier/store/${storeId}`]: (
                <Avatar
                  shape="square"
                  key={String(gSelectedProvider?.id) + uid}
                  src={gSelectedProvider?.imageUrls[0]}
                  size={26}
                />
              ),
            },
          ]}
          current={i18n["Tất cả đơn hàng"]}
        />
      }
    >
      <PageWrapper>
        {selectedStore ? (
          <Container className="left-wrapper" suppressScrollX>
            {!isLoading ? (
              <div>
                {dataWebsite ? (
                  <div style={{ padding: 50 }}>
                    <h2>Giao diện</h2>
                    <Flex justify="space-between" align="center">
                      <Link href={dataWebsite?.website} target="_blank">
                        <EyeOutlined size={22} /> Xem website của bạn
                      </Link>
                      <Link href={"/supplier/store/" + storeId + "/website/edit"}>
                        <RiEdit2Fill /> Tùy chỉnh giao diện
                      </Link>
                    </Flex>
                    <Divider />
                    <Flex justify="space-between">
                      <div style={{ width: 300 }}>
                        <h3>Giao diện đang sử dụng</h3>
                        <p>Khách hàng sẽ thấy giao diện này khi họ xem website của bạn.</p>
                      </div>
                      <iframe
                        src="http://localhost:3000/supplier/store/121"
                        width="700"
                        height="500"
                        allowFullScreen={false}
                      ></iframe>
                    </Flex>
                  </div>
                ) : (
                  <div>
                    <Card style={{ width: "100%", fontSize: 16 }}>
                      <p>
                        Xin chào đến với trang landing page của seller, vui lòng tạo trang landing
                        page để có website riêng của bạn
                      </p>
                    </Card>
                    <Flex justify="center" align="center" style={{ margin: 15 }}>
                      <Title style={{ marginRight: 15 }} level={4}>
                        Bắt đầu tạo trang landing page
                      </Title>
                      <Button type="primary" href={`/supplier/store/${storeId}/website/create`}>
                        Tạo landing page
                      </Button>
                    </Flex>
                  </div>
                )}
              </div>
            ) : (
              <div>Loading</div>
            )}
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
const StyledWrapper = styled(Card)`
  & .statistic-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    & .ant-space-item {
      width: 100%;
      flex-grow: 1;
      height: 100%;
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 8px;
      }
    }
    & .statistic-item {
      display: flex;
      padding: 0 8px;
      height: 100%;
      & .ant-statistic {
        display: flex;
        flex-direction: column-reverse;
      }

      & .ant-statistic-title {
        font-size: 11px;
        line-height: 1.1;
      }
    }
  }
`;
export default withAuth(Page);

import Button from "@/components/button/Button";
import { EcofarmSvg } from "@/components/icons";
import Container from "@/components/shared/Container";
import useGetProviderFarm from "@/hooks/useGetProviderFarm";
import useModalDangerConfirm from "@/hooks/useModalDangerConfirm";
import {
  useGetPageInformationsByProviderIdQuery,
  useUpdateStatusPageInformationsMutation,
} from "@/redux/query/pageprivate.query";
import { TEPageInformationStatus } from "@/types/pageprivate.types";
import { EyeOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Card, Divider, Flex, Skeleton, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useId } from "react";
import { RiEdit2Fill } from "react-icons/ri";
import Avatar from "src/components/avatar/Avatar";
import withAuth from "src/components/hoc/withAuth";
import BreadcrumbHeader from "src/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "src/components/layout/SiderHeaderLayout";
import StyledPage from "src/components/layout/StyledPage";
import useApp from "src/hooks/useApp";
const { Title, Text } = Typography;
const Page = () => {
  const uid = useId();
  const {
    query: { farmId },
  } = useRouter();
  const { message } = useApp();
  const { gSelectedProvider, bgImage } = useGetProviderFarm();
  const selectedStore = gSelectedProvider?.id;

  const { data: rsWebsite, isLoading } = useGetPageInformationsByProviderIdQuery(
    { providerId: +(farmId as string) },
    { refetchOnMountOrArgChange: true, skip: !farmId },
  );
  const [updateStatus] = useUpdateStatusPageInformationsMutation();
  const dataWebsite = rsWebsite?.data;
  const { handleConfirm: handleConfirmHide } = useModalDangerConfirm({
    onOk: (id) => {
      updateStatus({ id, status: TEPageInformationStatus.Hide })
        .unwrap()
        .then(() => {
          message.success("Ẩn website thành công");
        })
        .catch(() => {
          message.error("Đã có lỗi trong quá trình ẩn website");
        });
    },
  });

  const { handleConfirm: handleConfirmShow } = useModalDangerConfirm({
    onOk: (id) => {
      updateStatus({ id, status: TEPageInformationStatus.Approved })
        .unwrap()
        .then(() => {
          message.success("Hiển thị website thành công");
        })
        .catch(() => {
          message.error("Đã có lỗi trong quá trình hiển thị website");
        });
    },
  });
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
            {!isLoading ? (
              <div>
                {dataWebsite ? (
                  <div style={{ padding: 50 }}>
                    <h2>Giao diện</h2>
                    <Flex justify="space-between" align="center">
                      <Link href={dataWebsite?.website} target="_blank">
                        <EyeOutlined size={22} /> Xem website của bạn
                      </Link>
                      <div>
                        <Link href={"/supplier/farm/" + farmId + "/website/edit"}>
                          <RiEdit2Fill /> Tùy chỉnh giao diện
                        </Link>
                      </div>
                    </Flex>
                    <Divider />
                    <Flex justify="space-between">
                      <div style={{ width: 300 }}>
                        <h3>Giao diện đang sử dụng</h3>
                        <p>Khách hàng sẽ thấy giao diện này khi họ xem website của bạn.</p>
                        <h3 style={{ paddingTop: 30 }}>Trạng thái trang web</h3>
                        <p>
                          {dataWebsite.status == TEPageInformationStatus.Pending && (
                            <Text type="warning">Chờ phê duyệt</Text>
                          )}
                          {dataWebsite.status == TEPageInformationStatus.Approved && (
                            <Text type="success">Đã phê duyệt</Text>
                          )}
                          {dataWebsite.status == TEPageInformationStatus.Lock && (
                            <Text type="danger">Đang bị khóa</Text>
                          )}
                          {dataWebsite.status == TEPageInformationStatus.Hide && (
                            <Text>Đang bị ẩn</Text>
                          )}
                        </p>
                        {dataWebsite.status == TEPageInformationStatus.Approved && (
                          <Button
                            onClick={() =>
                              handleConfirmHide(
                                dataWebsite.id,
                                dataWebsite.provider?.name,
                                "hiển thị",
                              )
                            }
                          >
                            Ẩn trang
                          </Button>
                        )}
                        {dataWebsite.status == TEPageInformationStatus.Hide && (
                          <Button
                            onClick={() =>
                              handleConfirmShow(
                                dataWebsite.id,
                                dataWebsite.provider?.name,
                                "hiển thị",
                              )
                            }
                            type="primary"
                          >
                            Hiển thị trang web
                          </Button>
                        )}
                      </div>
                      <iframe
                        src={dataWebsite?.website}
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
                      <Button type="primary" href={`/supplier/farm/${farmId}/website/create`}>
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

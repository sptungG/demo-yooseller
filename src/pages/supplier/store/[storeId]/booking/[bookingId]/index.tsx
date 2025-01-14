import styled from "@emotion/styled";
import { useIsomorphicLayoutEffect } from "ahooks";
import { Typography } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import { RiEdit2Fill } from "react-icons/ri";
import Button from "src/components/button/Button";
import withAuth from "src/components/hoc/withAuth";
import Breadcrumb from "src/components/layout/Breadcrumb";
import SiderHeaderLayout from "src/components/layout/SiderHeaderLayout";
import StyledPage from "src/components/layout/StyledPage";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProvider from "src/hooks/useGetProvider";
import { useGetBookingByIdQuery } from "src/redux/query/booking.query";

const Page = () => {
  const {
    query: { storeId, bookingId },
    replace,
  } = useRouter();
  const { i18n } = useChangeLocale();
  const { gSelectedProvider } = useGetProvider({});
  const { data } = useGetBookingByIdQuery(
    { id: +(bookingId as string) },
    { refetchOnMountOrArgChange: true },
  );
  const itemData = data?.result.data;
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (gSelectedProvider?.groupType === 2) {
      replace("/");
    }
  }, [gSelectedProvider?.groupType]);

  return (
    <SiderHeaderLayout>
      <PageWrapper>
        <div className="page-header">
          <div className="left-wrapper">
            <Breadcrumb items={[{ "/supplier/booking": "Dịch vụ" }]} current={String(bookingId)} />
            <Typography.Title level={2}>{itemData?.name || ""}</Typography.Title>
          </div>
          <div className="right-wrapper">
            <Button
              type="primary"
              icon={<RiEdit2Fill />}
              href={`/supplier/booking/${String(bookingId)}/edit`}
            >
              Cập nhật
            </Button>
          </div>
        </div>
      </PageWrapper>
    </SiderHeaderLayout>
  );
};

const PageWrapper = styled(StyledPage)`
  padding: 12px;
`;

export default withAuth(Page);

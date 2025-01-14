import Container from "@/components/shared/Container";
import useChangeLocale from "@/hooks/useChangeLocale";
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Card, Divider, Empty, Skeleton, Typography } from "antd";
import { parseAsInteger, useQueryState } from "next-usequerystate";
import Link from "next/link";
import { useId } from "react";
import Button from "../../button/Button";
import { ItemsRankingCardFarm } from "../main-page-store/ItemsRankingCard";
import { MarketingCardFarm } from "../main-page-store/MarketingCard";
import NotificationsCard from "../main-page-store/NotificationsCard";
import { StatisticCardFarm } from "../main-page-store/StatisticCard";
import TabsLink from "../main-page-store/TabsLink";
import { TodoListFarm } from "../main-page-store/TodoList";
import ChatPopover from "./ChatPopover";
import FarmList from "./FarmList";
import FarmMenu from "./FarmMenu";
import InfoFarmPopover from "./InfoFarmPopover";

type TMainPageFarmsProps = {};

const MainPageFarms = ({}: TMainPageFarmsProps) => {
  const uid = useId();

  const { i18n } = useChangeLocale();
  const { colorPrimary } = useTheme();
  const [selectedStore, setSelectedStore] = useQueryState("s", parseAsInteger);

  return (
    <StyledPanel>
      <div className="left-wrapper">
        <FarmList
          selectedStore={selectedStore || undefined}
          onClickCard={(id) => setSelectedStore(id || null)}
          actionsHeader={<TabsLink />}
        />
        <div className="footer-wrapper">
          <div className="left-wrapper">
            <Link href={"/supplier/farm/create"}>
              <Button type="primary" size="large">
                {i18n["Thêm trang trại"]}
              </Button>
            </Link>
            <Divider type="vertical" />
            <Button
              size="large"
              type="link"
              href={"/supplier/farm/list"}
              style={{ fontSize: 16, padding: 0 }}
            >
              Quản lý trang trại
            </Button>
          </div>
        </div>
      </div>
      {selectedStore ? (
        <div className="right-wrapper">
          <Container className="left-wrapper" suppressScrollX>
            <TodoListFarm
              storeId={selectedStore}
              style={{ marginBottom: 8 }}
              bodyStyle={{ padding: "0 8px 8px" }}
              headStyle={{ border: "none", padding: "0 0 0 8px", minHeight: 36, marginBottom: -12 }}
            />
            <StatisticCardFarm
              storeId={selectedStore}
              style={{ marginBottom: 8 }}
              bodyStyle={{ padding: "0 8px 8px" }}
              headStyle={{ border: "none", padding: "0 0 0 8px", minHeight: 36, marginBottom: -12 }}
            />
            <ItemsRankingCardFarm
              storeId={selectedStore}
              style={{ marginBottom: 8 }}
              bodyStyle={{ padding: "0 0 8px" }}
              headStyle={{ border: "none", padding: "0 0 0 8px", minHeight: 36, marginBottom: -12 }}
            />
            <MarketingCardFarm
              storeId={selectedStore}
              bodyStyle={{ padding: "0 8px 8px" }}
              headStyle={{ border: "none", padding: "0 0 0 8px", minHeight: 36, marginBottom: -12 }}
            />
          </Container>
          <Container className="right-wrapper" suppressScrollX>
            <InfoFarmPopover storeId={selectedStore} style={{ marginBottom: 8 }} />
            <NotificationsCard
              storeId={selectedStore}
              style={{ marginBottom: 8 }}
              bodyStyle={{ padding: "0 0 8px" }}
              headStyle={{ border: "none", padding: "0 0 0 8px", minHeight: 36, marginBottom: -12 }}
              title={"Thông báo"}
            />
            <FarmMenu
              storeId={selectedStore}
              style={{ marginBottom: 8 }}
              bodyStyle={{ padding: "8px 8px" }}
              headStyle={{
                border: "none",
                padding: "4px 0px 8px 8px",
                minHeight: 36,
                marginBottom: -12,
              }}
            />
            <ChatPopover storeId={selectedStore} />
          </Container>
        </div>
      ) : (
        <div className="right-wrapper empty">
          <div className="left-wrapper empty">
            <Card size="small" style={{ marginBottom: 8 }}>
              <Skeleton paragraph={{ rows: 4 }} />
            </Card>
            <Card size="small" style={{ marginBottom: 8 }}>
              <Skeleton paragraph={{ rows: 6 }} />
            </Card>
            <Card size="small" style={{ marginBottom: 8 }}>
              <Skeleton paragraph={{ rows: 6 }} />
            </Card>
            <Card size="small" style={{ marginBottom: 8 }}>
              <Skeleton paragraph={{ rows: 6 }} />
            </Card>
          </div>
          <div className="right-wrapper empty">
            <Card size="small" style={{ marginBottom: 8 }}>
              <Skeleton active avatar paragraph={false} />
            </Card>
            <Card size="small" style={{ marginBottom: 8 }}>
              <Skeleton paragraph={{ rows: 4 }} />
            </Card>
            <Card size="small" style={{ marginBottom: 8 }}>
              <Skeleton paragraph={{ rows: 4 }} />
            </Card>
            <Card size="small" style={{ marginBottom: 8 }}>
              <Skeleton paragraph={{ rows: 4 }} />
            </Card>
            <Card size="small" style={{}}>
              <Skeleton paragraph={{ rows: 4 }} />
            </Card>
          </div>
          <div className="get-stared-wrapper">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Typography.Text strong type="secondary">
                  Hãy chọn trang trại để bắt đầu trải nghiệm
                </Typography.Text>
              }
            ></Empty>
          </div>
        </div>
      )}
    </StyledPanel>
  );
};

const StyledPanel = styled.div`
  max-width: 100vw;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  border-radius: 8px;
  & > .left-wrapper {
    flex: 0 0 320px;
    min-width: 320px;
    border-right: 1px solid rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    background-color: #fff;
    & > .header-wrapper {
    }
    & > .list-wrapper {
    }
    & > .footer-wrapper {
      margin-top: auto;
      display: flex;
      align-items: center;
      height: fit-content;
      padding: 8px 8px;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
      background-color: #fff;
      border-radius: 0 0 8px 8px;
      & > .left-wrapper {
      }
      & > .right-wrapper {
        flex: 1 1 auto;
        min-width: 0px;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  & > .right-wrapper {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    background-color: rgba(0, 0, 0, 0.04);
    position: relative;
    &.empty {
      overflow: hidden;
    }
    & > .left-wrapper {
      flex: 1 1 auto;
      min-width: 0;
      padding: 0 8px;
      max-width: calc(1440px - 320px);
      margin-left: auto;
      &.empty {
        display: flex;
        flex-direction: column;
      }
    }
    & > .right-wrapper {
      flex: 0 0 320px;
      max-width: 320px;
      position: relative;
      /* padding-bottom: 48px; */
      margin-right: auto;
      &.empty {
        padding-bottom: 0;
      }
    }
    & > .get-stared-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      background-color: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(2px);
      & .ant-empty {
        background-color: #fff;
        padding: 24px;
        border: 1px solid rgba(0, 0, 0, 0.05);
      }
    }
  }
`;

export default MainPageFarms;

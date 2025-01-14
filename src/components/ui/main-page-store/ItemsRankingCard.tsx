import Container from "@/components/shared/Container";
import ItemTableStyled from "@/components/table/ItemTable";
import useItemRankingColumns from "@/components/table/useItemRankingColumns";
import { useGetItemRankingQuery as useGetItemRankingFarmQuery } from "@/redux/query/farm.query";
import { useGetItemRankingQuery } from "@/redux/query/order.query";
import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/query";
import { Card, CardProps, Typography } from "antd";

type TItemsRankingCardProps = CardProps & {
  storeId?: number;
};

const ItemsRankingCard = ({ storeId, ...props }: TItemsRankingCardProps) => {
  const { rankingNameCombined, sales, count } = useItemRankingColumns({});

  const { data: getItemRankingRes } = useGetItemRankingQuery(
    storeId ? { providerId: storeId } : skipToken,
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const listItemRanking = getItemRankingRes?.data || [];

  return (
    <StyledWrapper title={"Thứ hạng sản phẩm"} {...props}>
      <Typography.Text type="secondary" style={{ fontSize: 12, padding: "0 8px" }}>
        Thứ hạng sản phẩm
      </Typography.Text>
      <Container style={{ maxHeight: 300 }}>
        <ItemTableStyled
          showHeader={false}
          showSorterTooltip={false}
          columns={[rankingNameCombined, sales, count] as any[]}
          dataSource={listItemRanking}
          pagination={false}
          rowKey={(item: any) => item.id}
          scroll={{ x: "100%" }}
          size="small"
        />
      </Container>
    </StyledWrapper>
  );
};

export const ItemsRankingCardFarm = ({ storeId, ...props }: TItemsRankingCardProps) => {
  const { rankingNameCombined, sales, count } = useItemRankingColumns({});

  const { data: getItemRankingRes } = useGetItemRankingFarmQuery(
    storeId ? { providerId: storeId } : skipToken,
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const listItemRanking = getItemRankingRes?.data || [];

  return (
    <StyledWrapper title={"Thứ hạng sản phẩm"} {...props}>
      <Typography.Text type="secondary" style={{ fontSize: 12, padding: "0 8px" }}>
        Thứ hạng sản phẩm
      </Typography.Text>
      <Container style={{ maxHeight: 300 }}>
        <ItemTableStyled
          showHeader={false}
          showSorterTooltip={false}
          columns={[rankingNameCombined, sales, count] as any[]}
          dataSource={listItemRanking}
          pagination={false}
          rowKey={(item: any) => item.id}
          scroll={{ x: "100%" }}
          size="small"
        />
      </Container>
    </StyledWrapper>
  );
};

const StyledWrapper = styled(Card)``;

export default ItemsRankingCard;

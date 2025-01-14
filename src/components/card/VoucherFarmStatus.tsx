import useChangeLocale from "@/hooks/useChangeLocale";
import { dayjs, isAfterDate } from "@/utils/utils-date";
import styled from "@emotion/styled";
import { TagProps } from "antd";
import { TVoucherItem } from "src/types/farm.types";
import Tag from "../tag/Tag";

type TVoucherFarmStatusProps = { item: TVoucherItem } & TagProps;

const VoucherFarmStatus = ({ item, bordered = false, ...props }: TVoucherFarmStatusProps) => {
  const { i18n } = useChangeLocale();

  const mappedStateLabel = item
    ? isAfterDate(item.dateStart, dayjs())
      ? i18n["Sắp diễn ra"]
      : isAfterDate(item.dateEnd, dayjs())
      ? i18n["Đang diễn ra"]
      : i18n["Hết hạn"]
    : "_______";
  // console.log("dateStart" + item.id, dayjs(item.dateStart));
  // console.log("dateEnd" + item.id, dayjs(item.dateEnd));
  // console.log("now" + item.id, new Date());
  const mappedStateColor = item
    ? isAfterDate(item.dateStart, dayjs())
      ? "red"
      : isAfterDate(item.dateEnd, dayjs())
      ? "green"
      : "gray"
    : "gray";
  return (
    <VoucherFarmStatusStyled
      color={mappedStateColor === "gray" ? "default" : mappedStateColor}
      bordered={bordered}
      {...props}
    >
      {mappedStateLabel}
    </VoucherFarmStatusStyled>
  );
};
const VoucherFarmStatusStyled = styled(Tag)`
  font-weight: 500;
`;

export default VoucherFarmStatus;

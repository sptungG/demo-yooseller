import styled from "@emotion/styled";
import { useId } from "react";
import { AiOutlineSwapRight } from "react-icons/ai";
import { DaysWeek } from "src/configs/constant.config";
import useChangeLocale from "src/hooks/useChangeLocale";
import { formatDate } from "src/utils/utils-date";
import Tag from "./Tag";

type TStoreWorkTimeProps = { workTime?: string };

const StoreWorkTime = ({ workTime }: TStoreWorkTimeProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const mappedWorkTime = !!workTime ? (JSON.parse(workTime) as any[]) : [];

  if (!workTime) return <></>;

  return (
    <StoreWorkTimeStyled>
      {mappedWorkTime.map((times, index) => (
        <Tag
          key={uid + index}
          bordered={false}
          color={!!times ? "blue" : "default"}
          className="tag-wrapper"
        >
          <div className="day">{i18n[DaysWeek[index]]}:</div>

          {!!times ? (
            <div className="start-end">
              <div className="start">{formatDate(times[0], "HH:mm")}</div>
              <AiOutlineSwapRight size={22} />
              <div className="end">{formatDate(times[1], "HH:mm")}</div>
            </div>
          ) : (
            <div className="empty">{"___"}</div>
          )}
        </Tag>
      ))}
    </StoreWorkTimeStyled>
  );
};

const StoreWorkTimeStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  .tag-wrapper {
    font-size: 14px;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
    min-height: 32px;
  }
  .day {
    margin-right: 8px;
  }
  .start-end {
    margin-left: auto;
    display: flex;
    align-items: center;
  }
  .empty {
    margin-left: auto;
  }
`;

export default StoreWorkTime;

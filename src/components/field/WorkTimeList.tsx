import styled from "@emotion/styled";
import { Form, Switch, Typography } from "antd";
import { useId } from "react";
import { DaysWeek } from "src/configs/constant.config";
import useChangeLocale from "src/hooks/useChangeLocale";
import { dayjs } from "src/utils/utils-date";
import RangeTimePicker from "../picker/RangeTimePicker";
import { CheckableTag } from "../tag/Tag";

type TWorkTimeListProps = {};

const WorkTimeList = ({}: TWorkTimeListProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const form = Form.useFormInstance();
  const workTimeWatch = Form.useWatch("workTime", form);

  const initialValue = [
    undefined,
    ...Array(5).fill([dayjs().hour(8).startOf("hour"), dayjs().hour(17).startOf("hour")]),
    undefined,
  ];

  return (
    <WorkTimeListStyled>
      <div className="title-wrapper">
        <Typography.Paragraph>{i18n["Thời gian làm việc"]}</Typography.Paragraph>
        <Switch
          checked={!!(workTimeWatch || [])?.some((item: any) => !!item)}
          onChange={(checked) => {
            form.setFieldValue(["workTime"], !!checked ? initialValue : Array(7).fill(undefined));
          }}
        />
      </div>
      <div className="options-wrapper">
        <Form.List name="workTime" initialValue={Array(7).fill(undefined)}>
          {(fields, { add, remove, move }) => {
            return fields.map(({ key, name, ...restField }) => (
              <WorkTimeStyled
                key={"workTime" + name + key + String(!!workTimeWatch?.[name])}
                className={`${!!workTimeWatch?.[name] ? "hasWorkTime" : ""}`}
              >
                <CheckableTag
                  checked={!!workTimeWatch?.[name]}
                  onChange={(checked) => {
                    form.setFieldValue(
                      ["workTime", name],
                      checked
                        ? [dayjs().hour(8).startOf("hour"), dayjs().hour(17).startOf("hour")]
                        : undefined,
                    );
                  }}
                >
                  {i18n[DaysWeek[name]]}
                </CheckableTag>
                <Form.Item name={[name]} hidden={!workTimeWatch?.[name]} noStyle>
                  <RangeTimePicker
                    format={"HH:mm"}
                    style={{ width: "100%" }}
                    minuteStep={5}
                    changeOnBlur
                    popupClassName="hide-confirm"
                  />
                </Form.Item>
              </WorkTimeStyled>
            ));
          }}
        </Form.List>
      </div>
    </WorkTimeListStyled>
  );
};
const WorkTimeListStyled = styled.div`
  .title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    .ant-typography {
      margin-bottom: 0;
    }
  }
  .options-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
`;

const WorkTimeStyled = styled.div`
  display: flex;
  flex-wrap: nowrap;
  .ant-tag-checkable {
    margin-right: 0;
    flex: 0 0 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
  }
  &.hasWorkTime {
    order: -1;
    .ant-tag-checkable {
      border-radius: 8px 0 0 8px;
    }
    .ant-picker-range {
      border-radius: 0 8px 8px 0;
    }
  }
`;

export default WorkTimeList;

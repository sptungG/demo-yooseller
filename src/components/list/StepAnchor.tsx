import styled from "@emotion/styled";
import { useIsomorphicLayoutEffect, useSafeState } from "ahooks";
import { Anchor, AnchorProps, Form, Progress, Steps, StepsProps } from "antd";
import { vietnameseSlug } from "src/utils/utils";

type TStepAnchorProps = {
  items: {
    title: string;
    percent?: number;
    formFields?: (string | number)[][];
    key?: string;
  }[];
  anchorProps?: Omit<AnchorProps, "items">;
  stepProps?: Omit<StepsProps, "items">;
};

const StepAnchor = ({ items, stepProps, anchorProps }: TStepAnchorProps) => {
  const form = Form.useFormInstance();
  const [current, setCurrent] = useSafeState<number>();

  const formWatch = Form.useWatch([], form);
  const [internalItems, setInternalItems] = useSafeState(
    items.map((item) => ({
      key: !!item?.key ? item.key : vietnameseSlug(item.title, "-"),
      href: `#${!!item?.key ? item.key : vietnameseSlug(item.title, "-")}`,
      title: item.title,
      percent: item?.percent || 0,
    })),
  );

  useIsomorphicLayoutEffect(() => {
    setTimeout(() => {
      const mappedItemsWithPercent = items.map((item) => {
        return {
          key: !!item?.key ? item.key : vietnameseSlug(item.title, "-"),
          href: `#${!!item?.key ? item.key : vietnameseSlug(item.title, "-")}`,
          title: item.title,
          percent: !!item.formFields?.length
            ? (item.formFields.filter((field) => {
                const fieldValue = form.getFieldValue(field);
                const fieldErrors = form.getFieldError(field);
                return (
                  !!(typeof fieldValue === "object"
                    ? Object.keys(fieldValue || {})?.length
                    : fieldValue) && !fieldErrors?.length
                );
              }).length /
                item.formFields.length) *
              100
            : 0,
        };
      });
      setInternalItems(mappedItemsWithPercent);
    }, 10);
  }, [items, formWatch]);

  return (
    <StepAnchorStyled>
      <Steps
        direction="vertical"
        current={current}
        items={internalItems.map((item, index) => ({
          title: item.title,
          icon: (
            <div className="icon-wrapper">
              <Progress
                type="circle"
                percent={item?.percent || 0}
                size={24}
                format={() => ""}
                trailColor={"rgba(0,0,0,0.08)"}
              />
            </div>
          ),
        }))}
        {...stepProps}
      />
      <Anchor
        className="hidden"
        affix={false}
        onChange={(link) => {
          const foundItem = internalItems.findIndex((item) => item.href === link);
          setCurrent(foundItem);
        }}
        items={internalItems.map((item) => ({
          key: item.key,
          title: item.title,
          href: item.href,
        }))}
        {...anchorProps}
      />
    </StepAnchorStyled>
  );
};
const StepAnchorStyled = styled.div`
  padding: 4px 0 6px;
  .icon-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
  }
  .ant-steps-vertical > .ant-steps-item {
    .ant-steps-item-icon {
      margin-inline-end: 6px;
    }
    & > .ant-steps-item-container > .ant-steps-item-tail {
      padding: 31px 0 3px;
    }
    .ant-steps-item-content {
      padding: 4px 0 0 0;
      .ant-steps-item-title {
        padding: 0;
        line-height: 1.2;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-word;
      }
    }
    &:last-of-type {
      .ant-steps-item-content {
        min-height: 39px;
      }
    }
  }
  .ant-steps-item-description {
    display: none;
  }
`;

export default StepAnchor;

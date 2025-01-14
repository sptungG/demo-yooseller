import styled from "@emotion/styled";
import { Cascader, CascaderProps, Form } from "antd";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProviderTypes from "src/hooks/useGetProviderTypes";
import { vietnameseSlug } from "src/utils/utils";

type TGroupTypeCombinedCascaderProps = {
  isUsedTypeDisabled?: boolean;
} & CascaderProps;

const GroupTypeCombinedCascader = ({
  isUsedTypeDisabled,
  ...props
}: TGroupTypeCombinedCascaderProps) => {
  const { i18n, locale } = useChangeLocale();
  const form = Form.useFormInstance();
  const { data: providerTypesData } = useGetProviderTypes();

  const mappedGroupTypeOptions = providerTypesData
    .filter(
      ({ value, type }) =>
        (value < 200 ||
          (value > 1000 &&
            providerTypesData.every((item) => +(value / 100).toFixed(0) !== item.value))) &&
        type < 4,
    )
    .map((grItem) => {
      // if ([4].includes(grItem.value))
      //   return { ...grItem, children: [{ value: 0, label: grItem.label }] };
      return {
        ...grItem,
        children: providerTypesData
          .filter((item) => item.value > 200 && +(item.value / 100).toFixed(0) === grItem.value)
          .map(({ value, label }) => {
            return { value, label };
          }),
      };
    });

  return (
    <Cascader
      allowClear
      options={mappedGroupTypeOptions}
      placeholder={i18n["Chọn loại cửa hàng"]}
      dropdownRender={(menus) => <DropdownCascaderStyled>{menus}</DropdownCascaderStyled>}
      expandTrigger={"click"}
      showSearch={{
        filter: (inputValue, path) =>
          path.some(
            (option) =>
              vietnameseSlug(String(option.label), " ").indexOf(vietnameseSlug(inputValue, " ")) >
              -1,
          ),
      }}
      {...props}
    />
  );
};

const DropdownCascaderStyled = styled.div`
  min-width: 240px;
  .ant-cascader-menu {
    &:first-of-type {
      min-width: 240px;
    }
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background-color: #f1f3f4;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #70757a;
    }
  }
`;

export default GroupTypeCombinedCascader;

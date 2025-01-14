import styled from "@emotion/styled";
import { Cascader, CascaderProps } from "antd";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProviderFarmTypes from "src/hooks/useGetProviderFarmTypes";
import { vietnameseSlug } from "src/utils/utils";

type TGroupFarmCombinedProps = {
  isUsedTypeDisabled?: boolean;
} & CascaderProps;

// eslint-disable-next-line no-unused-vars
const GroupFarmCombined = ({ isUsedTypeDisabled, ...props }: TGroupFarmCombinedProps) => {
  const { i18n } = useChangeLocale();
  const { data: providerTypesData } = useGetProviderFarmTypes();

  const mappedGroupTypeOptions = providerTypesData
    .filter(({ value, type }) => type == 4 && value <= 102)
    .map((grItem) => {
      return {
        ...grItem,
        children: providerTypesData
          .filter((item) => item.value > 100 && +(item.value / 100).toFixed(0) === grItem.value)
          .map(({ value, label }) => {
            return { value, label };
          }),
      };
    });
  return (
    <Cascader
      allowClear
      options={mappedGroupTypeOptions}
      placeholder={i18n["Chọn phân loại trang trại"]}
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
  min-width: 200px;
  .ant-cascader-menu {
    &:first-of-type {
      min-width: 200px;
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

export default GroupFarmCombined;

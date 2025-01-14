import useGetProviderTypes from "@/hooks/useGetProviderTypes";
import { Form, FormItemProps, Select } from "antd";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useGetAllProvidersByPartnerQuery } from "src/redux/query/provider.query";
import { vietnameseSlug } from "src/utils/utils";

type TGroupTypeCombinedSelectProps = {
  groupTypeFormProps?: FormItemProps;
  typeFormProps?: FormItemProps;
  isUsedTypeDisabled?: boolean;
  type?: number; //type: 1-store | 2 - farm
};

const GroupTypeCombinedSelect = ({
  groupTypeFormProps,
  typeFormProps,
  isUsedTypeDisabled,
}: TGroupTypeCombinedSelectProps) => {
  const { i18n, locale } = useChangeLocale();
  const { data } = useGetAllProvidersByPartnerQuery({});
  const selectedTypes = data?.data.map(({ type }) => type) || [];

  const form = Form.useFormInstance();
  const groupTypeFormWatch = Form.useWatch("groupType", form);
  const { data: providerTypesData } = useGetProviderTypes();

  const mappedGroupTypeOptions = providerTypesData.filter(
    ({ value, type }) => value < 200 && type < 4,
  );
  const mappedTypeOptions = providerTypesData
    .filter(
      ({ value, type }) =>
        (value < 200 ||
          (value > 1000 &&
            providerTypesData.every((item) => +(value / 100).toFixed(0) !== item.value))) &&
        type < 4,
    )
    .map((grItem) => {
      if ([4].includes(grItem.value))
        return { label: grItem.label, options: [{ value: 0, label: grItem.label }] };
      return {
        value: grItem.value,
        label: grItem.label,
        options: providerTypesData
          .filter((item) => item.value > 100 && +(item.value / 100).toFixed(0) === grItem.value)
          .map(({ value, label }) => {
            if (selectedTypes.includes(value))
              return { value, label, disabled: !!isUsedTypeDisabled };
            else return { value, label };
          }),
      };
    });

  const mappedTypesOptions = !!groupTypeFormWatch
    ? mappedTypeOptions.filter(({ value }) => value === groupTypeFormWatch)
    : mappedTypeOptions;

  return (
    <>
      <Form.Item label={i18n["Nhóm cửa hàng"]} name="groupType" {...groupTypeFormProps}>
        <Select
          allowClear
          options={mappedGroupTypeOptions}
          placeholder={i18n["Chọn nhóm cửa hàng"]}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            vietnameseSlug(String(option?.label || ""), " ").indexOf(vietnameseSlug(input, " ")) >=
            0
          }
          onSelect={() => {
            form.setFieldValue("type", undefined);
          }}
          onClear={() => {
            form.setFieldValue("type", undefined);
          }}
        />
      </Form.Item>
      <Form.Item label={i18n["Loại cửa hàng"]} name="type" {...typeFormProps}>
        <Select
          placeholder={i18n["Chọn loại cửa hàng"]}
          allowClear
          options={mappedTypesOptions}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            vietnameseSlug(String(option?.label || ""), " ").indexOf(vietnameseSlug(input, " ")) >=
            0
          }
        />
      </Form.Item>
    </>
  );
};

export const GroupTypeCombinedSelectFarm = ({
  groupTypeFormProps,
  typeFormProps,
  isUsedTypeDisabled,
}: TGroupTypeCombinedSelectProps) => {
  const { i18n, locale } = useChangeLocale();
  const { data } = useGetAllProvidersByPartnerQuery({});
  const selectedTypes = data?.data.map(({ type }) => type) || [];

  const form = Form.useFormInstance();
  const groupTypeFormWatch = Form.useWatch("groupType", form);
  const { data: providerTypesData } = useGetProviderTypes();

  const mappedGroupTypeOptions = providerTypesData.filter(
    ({ value, type }) => value < 200 && type > 3,
  );
  const mappedTypeOptions = providerTypesData
    .filter(
      ({ value, type }) =>
        (value < 200 ||
          (value > 1000 &&
            providerTypesData.every((item) => +(value / 100).toFixed(0) !== item.value))) &&
        type > 3,
    )
    .map((grItem) => {
      if ([4].includes(grItem.value))
        return { label: grItem.label, options: [{ value: 0, label: grItem.label }] };
      return {
        value: grItem.value,
        label: grItem.label,
        options: providerTypesData
          .filter((item) => item.value > 100 && +(item.value / 100).toFixed(0) === grItem.value)
          .map(({ value, label }) => {
            if (selectedTypes.includes(value))
              return { value, label, disabled: !!isUsedTypeDisabled };
            else return { value, label };
          }),
      };
    });

  const mappedTypesOptions = !!groupTypeFormWatch
    ? mappedTypeOptions.filter(({ value }) => value === groupTypeFormWatch)
    : mappedTypeOptions;

  return (
    <>
      <Form.Item label={i18n["Nhóm trang trại"]} name="groupType" {...groupTypeFormProps}>
        <Select
          allowClear
          options={mappedGroupTypeOptions}
          placeholder={i18n["Chọn nhóm trang trại"]}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            vietnameseSlug(String(option?.label || ""), " ").indexOf(vietnameseSlug(input, " ")) >=
            0
          }
          onSelect={() => {
            form.setFieldValue("type", undefined);
          }}
          onClear={() => {
            form.setFieldValue("type", undefined);
          }}
        />
      </Form.Item>
      <Form.Item label={i18n["Loại trang trại"]} name="type" {...typeFormProps}>
        <Select
          placeholder={i18n["Chọn loại trang trại"]}
          allowClear
          options={mappedTypesOptions}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            vietnameseSlug(String(option?.label || ""), " ").indexOf(vietnameseSlug(input, " ")) >=
            0
          }
        />
      </Form.Item>
    </>
  );
};

export default GroupTypeCombinedSelect;

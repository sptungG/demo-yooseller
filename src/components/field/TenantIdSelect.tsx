import { Select } from "antd";
import { useState } from "react";
import { useGetAllTenantNameQuery, useIsTenantAvailableMutation } from "src/redux/query/auth.query";
import { vietnameseSlug } from "src/utils/utils";

type TTenantIdSelectProps = {
  placeholder?: string;
  value?: number;
  onChange?: (v?: number) => void;
};

function TenantIdSelect({ placeholder, value, onChange }: TTenantIdSelectProps) {
  const [internalValue, setInternalValue] = useState<string | undefined>();
  const { data } = useGetAllTenantNameQuery({});
  const allTenantData = data?.result || [];

  const [isTenantAvailableMutate, { isLoading: isTenantAvailableLoading }] =
    useIsTenantAvailableMutation();

  return (
    <Select
      value={internalValue}
      placeholder={placeholder}
      loading={isTenantAvailableLoading}
      options={allTenantData.map(({ displayName, tenancyName }) => ({
        value: tenancyName,
        label: displayName,
      }))}
      allowClear
      showSearch
      optionFilterProp="children"
      filterOption={(input, option) =>
        vietnameseSlug(String(option?.label || ""), " ").indexOf(vietnameseSlug(input, " ")) >= 0
      }
      onSelect={(tenancyName) => {
        isTenantAvailableMutate({ tenancyName })
          .unwrap()
          .then(({ result }) => {
            if (!!result.tenantId) {
              onChange?.(result.tenantId);
              setInternalValue(tenancyName);
            } else {
              onChange?.(undefined);
              setInternalValue(undefined);
            }
          })
          .catch((err) => {
            onChange?.(undefined);
            setInternalValue(undefined);
          });
      }}
      onClear={() => {
        onChange?.(undefined);
        setInternalValue(undefined);
      }}
    />
  );
}

export default TenantIdSelect;

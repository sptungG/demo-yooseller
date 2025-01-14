import { Form, FormItemProps, Space } from "antd";
import { useState } from "react";
import useChangeLocale from "src/hooks/useChangeLocale";
import {
  useGetDistrictsQuery,
  useGetProvincesQuery,
  useGetWardsQuery,
} from "src/redux/query/province.query";
import AddressSelect from "./AddressSelect";

type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;

type TFormAddressNameSelectsProps = {
  provinceFormProps: RequiredField<FormItemProps, "name"> & { placeholder?: string };
  districtFormProps: RequiredField<FormItemProps, "name"> & { placeholder?: string };
  wardFormProps: RequiredField<FormItemProps, "name"> & { placeholder?: string };
  isCompactWrapper?: boolean;
};

const FormAddressNameSelects = ({
  provinceFormProps,
  districtFormProps,
  wardFormProps,
  isCompactWrapper,
}: TFormAddressNameSelectsProps) => {
  const { i18n } = useChangeLocale();
  const { placeholder: provincePlaceholder, ...restProvinceFormProps } = provinceFormProps;
  const { placeholder: districtPlaceholder, ...restDistrictFormProps } = districtFormProps;
  const { placeholder: wardPlaceholder, ...restWardFormProps } = wardFormProps;
  const form = Form.useFormInstance();
  const [provinceId, setProvinceId] = useState<number>();
  const [districtId, setDistrictId] = useState<number>();
  const { data: getProvincesRes, isFetching: getProvincesFetching } = useGetProvincesQuery({});
  const getProvincesData = getProvincesRes?.result || [];
  const { data: getDistrictsRes, isFetching: getDistrictsFetching } =
    useGetDistrictsQuery(provinceId);
  const getDistrictsData = getDistrictsRes?.result || [];
  const { data: getWardsRes, isFetching: getWardsFetching } = useGetWardsQuery(districtId);
  const getWardsData = getWardsRes?.result || [];

  const formItemProvince = (
    <Form.Item noStyle rules={[{ type: "string", required: true }]} {...restProvinceFormProps}>
      <AddressSelect
        placeholder={provincePlaceholder || i18n["Tỉnh thành"]}
        onSelect={(value, option) => {
          form.setFieldValue(restProvinceFormProps.name, option.label);
          form.setFieldValue(restDistrictFormProps.name, undefined);
          form.setFieldValue(restWardFormProps.name, undefined);
          setProvinceId(value);
        }}
        onClear={() => form.setFieldsValue({ district: undefined, ward: undefined })}
        loading={getProvincesFetching}
        options={(getProvincesData || []).map(({ code, fullName }) => ({
          label: fullName,
          value: code.trim(),
        }))}
      />
    </Form.Item>
  );
  const formItemDistrict = (
    <Form.Item noStyle rules={[{ type: "string", required: true }]} {...restDistrictFormProps}>
      <AddressSelect
        placeholder={districtPlaceholder || i18n["Quận huyện"]}
        onSelect={(value, option) => {
          form.setFieldValue(restDistrictFormProps.name, option.label);
          form.setFieldValue(restWardFormProps.name, undefined);
          setDistrictId(value);
        }}
        onClear={() => form.setFieldsValue({ ward: undefined })}
        loading={getDistrictsFetching}
        options={(getDistrictsData || []).map(({ code, fullName }) => ({
          label: fullName,
          value: code.trim(),
        }))}
      />
    </Form.Item>
  );
  const formItemWard = (
    <Form.Item noStyle rules={[{ type: "string", required: true }]} {...restWardFormProps}>
      <AddressSelect
        placeholder={wardPlaceholder || i18n["Phường xã"]}
        onSelect={(value, option) => {
          form.setFieldValue(restWardFormProps.name, option.label);
          setDistrictId(value);
        }}
        loading={getWardsFetching}
        options={(getWardsData || []).map(({ code, fullName }) => ({
          label: fullName,
          value: code.trim(),
        }))}
      />
    </Form.Item>
  );

  if (isCompactWrapper)
    return (
      <Space.Compact block size="large">
        {formItemProvince}
        {formItemDistrict}
        {formItemWard}
      </Space.Compact>
    );

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {formItemProvince}
      {formItemDistrict}
      {formItemWard}
    </Space>
  );
};

export default FormAddressNameSelects;

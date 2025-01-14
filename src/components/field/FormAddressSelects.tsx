import { Form, FormItemProps, Space } from "antd";
import useChangeLocale from "src/hooks/useChangeLocale";
import {
  useGetDistrictsQuery,
  useGetProvincesQuery,
  useGetWardsQuery,
} from "src/redux/query/province.query";
import AddressSelect from "./AddressSelect";

type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;
type TFormAddressSelectsProps = {
  size?: "small" | "middle" | "large" | undefined;
  provinceFormProps: RequiredField<FormItemProps, "name"> & { placeholder?: string };
  districtFormProps: RequiredField<FormItemProps, "name"> & { placeholder?: string };
  wardFormProps: RequiredField<FormItemProps, "name"> & { placeholder?: string };
};

const FormAddressSelects = ({
  size = "middle",
  provinceFormProps,
  districtFormProps,
  wardFormProps,
}: TFormAddressSelectsProps) => {
  const { i18n } = useChangeLocale();
  const form = Form.useFormInstance();
  const { placeholder: provincePlaceholder, ...restProvinceFormProps } = provinceFormProps;
  const { placeholder: districtPlaceholder, ...restDistrictFormProps } = districtFormProps;
  const { placeholder: wardPlaceholder, ...restWardFormProps } = wardFormProps;

  const formProvinceWatch = Form.useWatch(restProvinceFormProps.name, form);
  const formDistrictWatch = Form.useWatch(restDistrictFormProps.name, form);
  const { data: getProvincesRes, isFetching: getProvincesFetching } = useGetProvincesQuery({});
  const getProvincesData = getProvincesRes?.result || [];
  const { data: getDistrictsRes, isFetching: getDistrictsFetching } =
    useGetDistrictsQuery(formProvinceWatch);
  const getDistrictsData = getDistrictsRes?.result || [];
  const { data: getWardsRes, isFetching: getWardsFetching } = useGetWardsQuery(formDistrictWatch);
  const getWardsData = getWardsRes?.result || [];

  return (
    <Space.Compact block size={size}>
      <Form.Item noStyle label={i18n["Tỉnh thành"]} {...restProvinceFormProps}>
        <AddressSelect
          placeholder={provincePlaceholder || i18n["Chọn tỉnh thành"]}
          onSelect={() => form.setFieldsValue({ districtId: undefined, wardId: undefined })}
          onClear={() => form.setFieldsValue({ districtId: undefined, wardId: undefined })}
          loading={getProvincesFetching}
          options={(getProvincesData || []).map(({ code, fullName }) => ({
            label: fullName,
            value: code.trim(),
          }))}
        />
      </Form.Item>
      <Form.Item noStyle label={i18n["Quận huyện"]} {...restDistrictFormProps}>
        <AddressSelect
          placeholder={districtPlaceholder || i18n["Chọn quận huyện"]}
          onSelect={() => form.setFieldsValue({ wardId: undefined })}
          onClear={() => form.setFieldsValue({ wardId: undefined })}
          loading={getDistrictsFetching}
          options={(getDistrictsData || []).map(({ code, fullName }) => ({
            label: fullName,
            value: code.trim(),
          }))}
        />
      </Form.Item>
      <Form.Item noStyle label={i18n["Phường xã"]} {...restWardFormProps}>
        <AddressSelect
          placeholder={wardPlaceholder || i18n["Chọn phường xã"]}
          loading={getWardsFetching}
          options={(getWardsData || []).map(({ code, fullName }) => ({
            label: fullName,
            value: code.trim(),
          }))}
        />
      </Form.Item>
    </Space.Compact>
  );
};

export const FormAddressSelectsCode = ({
  size = "middle",
  provinceFormProps,
  districtFormProps,
  wardFormProps,
}: TFormAddressSelectsProps) => {
  const { i18n } = useChangeLocale();
  const form = Form.useFormInstance();
  const { placeholder: provincePlaceholder, ...restProvinceFormProps } = provinceFormProps;
  const { placeholder: districtPlaceholder, ...restDistrictFormProps } = districtFormProps;
  const { placeholder: wardPlaceholder, ...restWardFormProps } = wardFormProps;

  const formProvinceWatch = Form.useWatch(restProvinceFormProps.name, form);
  const formDistrictWatch = Form.useWatch(restDistrictFormProps.name, form);
  const { data: getProvincesRes, isFetching: getProvincesFetching } = useGetProvincesQuery({});
  const getProvincesData = getProvincesRes?.result || [];
  const { data: getDistrictsRes, isFetching: getDistrictsFetching } =
    useGetDistrictsQuery(formProvinceWatch);
  const getDistrictsData = getDistrictsRes?.result || [];
  const { data: getWardsRes, isFetching: getWardsFetching } = useGetWardsQuery(formDistrictWatch);
  const getWardsData = getWardsRes?.result || [];

  return (
    <Space.Compact block size={size}>
      <Form.Item noStyle label={i18n["Tỉnh thành"]} {...restProvinceFormProps}>
        <AddressSelect
          placeholder={provincePlaceholder || i18n["Chọn tỉnh thành"]}
          onSelect={() => form.setFieldsValue({ districtId: undefined, wardId: undefined })}
          onClear={() => form.setFieldsValue({ districtId: undefined, wardId: undefined })}
          loading={getProvincesFetching}
          options={(getProvincesData || []).map(({ code, fullName }) => ({
            label: fullName,
            value: code.trim(),
          }))}
        />
      </Form.Item>
      <Form.Item noStyle label={i18n["Quận huyện"]} {...restDistrictFormProps}>
        <AddressSelect
          placeholder={districtPlaceholder || i18n["Chọn quận huyện"]}
          onSelect={() => form.setFieldsValue({ wardId: undefined })}
          onClear={() => form.setFieldsValue({ wardId: undefined })}
          loading={getDistrictsFetching}
          options={(getDistrictsData || []).map(({ code, fullName }) => ({
            label: fullName,
            value: code.trim(),
          }))}
        />
      </Form.Item>
      <Form.Item noStyle label={i18n["Phường xã"]} {...restWardFormProps}>
        <AddressSelect
          placeholder={wardPlaceholder || i18n["Chọn phường xã"]}
          loading={getWardsFetching}
          options={(getWardsData || []).map(({ code, fullName }) => ({
            label: fullName,
            value: code.trim(),
          }))}
        />
      </Form.Item>
    </Space.Compact>
  );
};

export default FormAddressSelects;

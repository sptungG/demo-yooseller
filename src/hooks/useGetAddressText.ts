import {
  useGetProvincesQuery,
  useMutateGetDistrictsMutation,
  useMutateGetWardsMutation,
} from "src/redux/query/province.query";

type TProps = {
  districtId?: string;
  fullAddress?: string;
  name?: string;
  phone?: string;
  provinceId?: string;
  wardId?: string;
} | null;

function useGetAddressText() {
  const { data: getProvincesRes, isFetching: getProvincesFetching } = useGetProvincesQuery({});
  const getProvincesData = getProvincesRes?.result || [];
  const [mutateGetDistricts] = useMutateGetDistrictsMutation();
  const [mutateGetWards] = useMutateGetWardsMutation();

  const getAddressText = async (data: TProps) => {
    try {
      if (!data) return;
      const districtsRes = await mutateGetDistricts(data.provinceId).unwrap();
      const wardsRes = await mutateGetWards(data.districtId).unwrap();
      const province = getProvincesData.find(
        ({ code }) => data?.provinceId?.trim() === code.trim(),
      );
      const district = districtsRes.result.find(
        ({ code }) => data?.districtId?.trim() === code.trim(),
      );
      const ward = wardsRes.result.find(({ code }) => data?.wardId?.trim() === code.trim());
      return { province, district, ward };
    } catch (error) {
      return;
    }
  };

  return {
    getAddressText,
  };
}

export default useGetAddressText;

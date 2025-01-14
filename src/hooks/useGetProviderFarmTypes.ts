import { useGetFarmProviderTypesQuery } from "src/redux/query/providerType.query";
import useChangeLocale from "./useChangeLocale";

function useGetProviderFarmTypes() {
  const { locale } = useChangeLocale();
  const { data: getProviderTypesRes, isFetching } = useGetFarmProviderTypesQuery({ locale });
  // const providerTypesData = !!getProviderTypesRes
  //   ? (JSON.parse(
  //       ((getProviderTypesRes as any) || "").replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, ""),
  //     ) as any[])
  //   : [];

  const providerTypesData = getProviderTypesRes || [];

  const mappedFarmTypes = (v: number) =>
    providerTypesData.find(({ value }) => v === value)?.label || "";

  const mappedFarmTypeStore = (v: number) =>
    providerTypesData.find(({ value }) => v === value)?.type || 0;

  return { data: providerTypesData, mappedFarmTypes, mappedFarmTypeStore };
}

export default useGetProviderFarmTypes;

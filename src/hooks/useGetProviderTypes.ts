import { useGetProviderTypesQuery } from "src/redux/query/providerType.query";
import useChangeLocale from "./useChangeLocale";

function useGetProviderTypes() {
  const { locale } = useChangeLocale();
  const { data: getProviderTypesRes, isFetching } = useGetProviderTypesQuery({ locale });
  // const providerTypesData = !!getProviderTypesRes
  //   ? (JSON.parse(
  //       ((getProviderTypesRes as any) || "").replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, ""),
  //     ) as any[])
  //   : [];

  const providerTypesData = getProviderTypesRes || [];

  const mappedTypes = (v: number) =>
    providerTypesData.find(({ value }) => v === value)?.label || "";

  const mappedTypeStore = (v: number) =>
    providerTypesData.find(({ value }) => v === value)?.type || 0;

  return { data: providerTypesData, mappedTypes, mappedTypeStore };
}

export default useGetProviderTypes;

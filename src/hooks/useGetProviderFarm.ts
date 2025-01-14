import { useRouter } from "next/router";
import { useGetProviderEcofarmByIdQuery } from "src/redux/query/farm.query";
import useGetProviderFarmTypes from "./useGetProviderFarmTypes";

function useGetProviderFarm() {
  const {
    query: { farmId },
  } = useRouter();
  const { data: getProviderByIdRes, isLoading } = useGetProviderEcofarmByIdQuery(
    { id: +(farmId as string) },
    { refetchOnMountOrArgChange: true, skip: !farmId },
  );
  const gSelectedProvider = getProviderByIdRes?.data;

  const { mappedFarmTypeStore } = useGetProviderFarmTypes();

  return {
    farmId,
    isLoading,
    gSelectedProvider,
    gTypeProvider: !!gSelectedProvider
      ? mappedFarmTypeStore(
          !!gSelectedProvider?.type ? gSelectedProvider.type : gSelectedProvider.groupType,
        )
      : 0,
    bgImage: (
      {
        [100]: "/images/farm-bg-02-transformed.png",
        [101]: "/images/farm-bg-03-transformed.png",
      } as Record<string, string>
    )?.[gSelectedProvider?.groupType],
  };
}

export default useGetProviderFarm;

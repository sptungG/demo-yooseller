import { useRouter } from "next/router";
import { useGetProviderByIdQuery } from "src/redux/query/provider.query";
import useGetProviderTypes from "./useGetProviderTypes";

function useGetProvider({ id }: { id?: number }) {
  const {
    query: { storeId },
  } = useRouter();
  const { data: getProviderByIdRes, isLoading } = useGetProviderByIdQuery(
    { id: id || +(storeId as string) },
    { refetchOnMountOrArgChange: true, skip: !id && !storeId },
  );
  const gSelectedProvider = getProviderByIdRes?.data;

  const { mappedTypeStore } = useGetProviderTypes();

  return {
    storeId,
    isLoading,
    gSelectedProvider,
    gTypeProvider: !!gSelectedProvider
      ? mappedTypeStore(
          !!gSelectedProvider?.type ? gSelectedProvider.type : gSelectedProvider.groupType,
        )
      : 0,
  };
}

export default useGetProvider;

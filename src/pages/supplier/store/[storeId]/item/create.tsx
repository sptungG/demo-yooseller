import Loader from "@/components/loader/Loader";
import useBeforeUnload from "@/hooks/useBeforeUnload";
import { useRouter } from "next/router";
import ShoppingItemCreateForm from "src/components/form/ShoppingItemCreateForm";
import withAuth from "src/components/hoc/withAuth";
import useGetProvider from "src/hooks/useGetProvider";
const Page = () => {
  const {
    query: { storeId },
  } = useRouter();
  const { gSelectedProvider, gTypeProvider } = useGetProvider({});

  useBeforeUnload(true, "You have unsaved changes, are you sure?");

  if (!gSelectedProvider?.id) return <Loader />;

  // if (!gSelectedProvider?.type || !gSelectedProvider?.groupType) return <DefaultItemCreateForm />;
  // if ([1].includes(gTypeProvider)) return <ShoppingItemCreateForm />;
  // if ([2302, 2303, 2406].includes(gSelectedProvider.type)) return <EducationItemCreateForm />;
  // if ([2501].includes(gSelectedProvider.type)) return <DefaultItemCreateStadium />;
  // if ([3304].includes(gSelectedProvider.type)) return <CreateBookingHotelForm />;
  return <ShoppingItemCreateForm />;
};

export default withAuth(Page);

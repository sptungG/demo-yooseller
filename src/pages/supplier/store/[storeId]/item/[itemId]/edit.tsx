import { useRouter } from "next/router";
import ShoppingItemUpdateForm from "src/components/form/ShoppingItemUpdateForm";
import withAuth from "src/components/hoc/withAuth";
import useGetProvider from "src/hooks/useGetProvider";

const Page = () => {
  const {
    query: { storeId },
  } = useRouter();
  const { gSelectedProvider, gTypeProvider } = useGetProvider({});

  // if (!gSelectedProvider?.type || !gSelectedProvider?.groupType) return <DefaultItemUpdateForm />;
  // if ([1].includes(gTypeProvider)) return <ShoppingItemUpdateForm />;
  // if ([2302, 2303, 2406].includes(gSelectedProvider.type)) return <EducationItemUpdateForm />;
  // if ([2501].includes(gSelectedProvider.type)) return <DefaultItemUpdateStadium />;
  // if ([3304].includes(gSelectedProvider.type)) return <UpdateBookingHotelForm />;
  return <ShoppingItemUpdateForm />;
};

export default withAuth(Page);

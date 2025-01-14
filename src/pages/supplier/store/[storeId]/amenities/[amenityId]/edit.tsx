import AmenityUpdateForm from "@/components/form/AmenityUpdateForm";
import { useRouter } from "next/router";
import withAuth from "src/components/hoc/withAuth";
import useGetProvider from "src/hooks/useGetProvider";

const Page = () => {
  const {
    query: { storeId, amenityId },
  } = useRouter();
  const { gSelectedProvider, gTypeProvider } = useGetProvider({});

  return <AmenityUpdateForm />;
};

export default withAuth(Page);

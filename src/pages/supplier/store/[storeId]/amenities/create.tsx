import AmenityCreateForm from "@/components/form/AmenityCreateForm";
import Loader from "@/components/loader/Loader";
import { useRouter } from "next/router";
import withAuth from "src/components/hoc/withAuth";
import useGetProvider from "src/hooks/useGetProvider";

const Page = () => {
  const {
    query: { storeId },
  } = useRouter();
  const { gSelectedProvider, gTypeProvider } = useGetProvider({});
  if (!gSelectedProvider?.id) return <Loader />;

  return <AmenityCreateForm />;
};

export default withAuth(Page);

import VoucherUpdateForm from "@/components/form/VoucherUpdateForm";
import { useRouter } from "next/router";
import withAuth from "src/components/hoc/withAuth";
import useGetProvider from "src/hooks/useGetProvider";

const Page = () => {
  const {
    query: { storeId, voucherId },
  } = useRouter();
  const { gSelectedProvider, gTypeProvider } = useGetProvider({});

  return <VoucherUpdateForm />;
};

export default withAuth(Page);

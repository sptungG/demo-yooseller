import AmenitiesGroupUpdateForm from "@/components/form/AmenitiesGroupUpdateForm";
import withAuth from "@/components/hoc/withAuth";
import { useRouter } from "next/router";

const Page = () => {
  const {
    query: { storeId, amenityGroupId },
  } = useRouter();

  return <AmenitiesGroupUpdateForm />;
};

export default withAuth(Page);

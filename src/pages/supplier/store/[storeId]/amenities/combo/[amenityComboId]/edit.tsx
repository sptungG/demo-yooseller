import AmenitiesComboUpdateForm from "@/components/form/AmenitiesComboUpdateForm";
import withAuth from "@/components/hoc/withAuth";
import { useRouter } from "next/router";

const Page = () => {
  const {
    query: { storeId, amenityGroupId },
  } = useRouter();

  return <AmenitiesComboUpdateForm />;
};

export default withAuth(Page);

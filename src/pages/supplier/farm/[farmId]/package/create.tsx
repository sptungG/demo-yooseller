import PackageCreateForm from "@/components/form/PackageCreateForm";
import withAuth from "src/components/hoc/withAuth";
const Page = () => {
  return <PackageCreateForm />;
};

export default withAuth(Page);

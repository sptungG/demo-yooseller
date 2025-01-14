import EcofarmItemUpdateForm from "src/components/form/EcofarmItemUpdateForm";
import withAuth from "src/components/hoc/withAuth";

const Page = () => {
  return <EcofarmItemUpdateForm />;
};

export default withAuth(Page);

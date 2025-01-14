import EcoFarmItemCreateForm from "src/components/form/EcoFarmItemCreateForm";
import withAuth from "src/components/hoc/withAuth";
const Page = () => {
  return <EcoFarmItemCreateForm />;
};

export default withAuth(Page);

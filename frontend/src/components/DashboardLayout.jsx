import BuyerDashboard from "./BuyerDashboard";
import SupplierDashboard from "./SupplierDashboard";
import BuilderDashboard from "./BuilderDashboard";
import { useAuth } from "../auth/useAuth";

const DashboardLayout = () => {
  const { role } = useAuth();

  const renderDashboards = () => {
    switch (role) {
      case "buyer":
        return <BuyerDashboard />;
      case "builder":
        return <BuilderDashboard />;
      case "supplier":
        return <SupplierDashboard />;
      default:
        return <div>Content</div>;
    }
  };

  return <div>{renderDashboards()}</div>;
};

export default DashboardLayout;

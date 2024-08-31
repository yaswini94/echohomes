import BuyerDashboard from "./BuyerDashboard";
import SupplierDashboard from "./SupplierDashboard";
import BuilderDashboard from "./BuilderDashboard";
import { useAuth } from "../auth/useAuth";
import { userRoles } from "../utils/constants";

const DashboardLayout = () => {
  const { role } = useAuth();

  // Function to render role based dashboard view
  const renderDashboards = () => {
    switch (role) {
      case userRoles.BUYERS:
        return <BuyerDashboard />;
      case userRoles.BUILDERS:
        return <BuilderDashboard />;
      case userRoles.SUPPLIERS:
        return <SupplierDashboard />;
      default:
        return <div>Content</div>;
    }
  };

  return <div>{renderDashboards()}</div>;
};

export default DashboardLayout;

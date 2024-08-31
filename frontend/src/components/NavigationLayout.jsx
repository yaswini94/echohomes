import React from "react";
import { Layout, Menu, theme } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { userRoles } from "../utils/constants";
const { Sider } = Layout;

const NavigationLayout = () => {
  const location = useLocation();
  const { role } = useAuth();

  // List of navigations
  const items = {
    [userRoles.BUILDERS]: [
      {
        label: <Link to="/">Home</Link>,
        key: "/",
      },
      {
        label: <Link to="/ventures">Venture Management</Link>,
        key: "/ventures",
      },
      {
        label: <Link to="/suppliers">Supplier Management</Link>,
        key: "/suppliers",
      },
      {
        label: <Link to="/buyers">Buyer Management</Link>,
        key: "/buyers",
      },
      {
        label: <Link to="/features">Feature Management</Link>,
        key: "/features",
      },
      {
        label: <Link to="orders">Orders</Link>,
        key: "/orders",
      },
    ],
    [userRoles.BUYERS]: [
      { label: <Link to="/">Home</Link>, key: "/" },
      {
        label: <Link to="/buyer-configuration">Choices Configuration</Link>,
        key: "/buyerConfiguration",
      },
      {
        label: <Link to="/in-budget-suggestions">In-Budget Suggestions</Link>,
        key: "/inBudgetSuggestions",
      },
      {
        label: <Link to="/comparision-tool">Comparision Tool</Link>,
        key: "/comparisionTool",
      },
    ],
    [userRoles.SUPPLIERS]: [
      { label: <Link to="/">Home</Link>, key: "/" },
      {
        label: <Link to="/supplier-orders">Orders</Link>,
        key: "/supplierOrdersManagement",
      },
      // { label: "Invoices", key: "invoices" },
    ],
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  if (!items[role]) {
    return null;
  }

  return (
    // Sider template from ant design for the navigation options
    <Sider
      width={240}
      style={{
        background: colorBgContainer,
      }}
    >
      {/* Menu template from ant design to display navigation oprions based on role */}
      <Menu
        mode="inline"
        defaultSelectedKeys={["home"]}
        defaultOpenKeys={["home"]}
        style={{
          height: "100%",
          borderRight: 0,
        }}
        selectedKeys={[location.pathname]}
        items={items[role]}
      />
    </Sider>
  );
};

export default NavigationLayout;

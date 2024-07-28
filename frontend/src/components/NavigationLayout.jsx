import React from "react";
import { Layout, Menu, theme } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
const { Sider } = Layout;

const NavigationLayout = () => {
  const location = useLocation();
  const { role } = useAuth();

  const items = {
    builder: [
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
    buyer: [
      { label: "Home", key: "home" },
      { label: "Choices Configuration", key: "choicesConfiguration" },
      { label: "In-Budget Suggestions", key: "inBudgetSuggestions" },
      { label: "Payments/ Invoice", key: "payments/invoice" },
    ],
    supplier: [
      { label: "Home", key: "home" },
      { label: "Orders", key: "orders" },
      { label: "Invoices", key: "invoices" },
    ],
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  if (!items[role]) {
    return null;
  }

  return (
    <Sider
      width={200}
      style={{
        background: colorBgContainer,
      }}
    >
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

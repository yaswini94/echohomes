import React from "react";
import { Layout, Menu, theme } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { userRoles } from "../utils/constants";
import { useTranslation } from "react-i18next";
const { Sider } = Layout;

const NavigationLayout = () => {
  const location = useLocation();
  const { role } = useAuth();
  const { t } = useTranslation();

  // List of navigations
  const items = {
    [userRoles.BUILDERS]: [
      {
        label: <Link to="/dashboard">{t("home")}</Link>,
        key: "/dashboard",
      },
      {
        label: <Link to="/ventures">{t("ventureManagement")}</Link>,
        key: "/ventures",
      },
      {
        label: <Link to="/suppliers">{t("supplierManagement")}</Link>,
        key: "/suppliers",
      },
      {
        label: <Link to="/buyers">{t("buyerManagement")}</Link>,
        key: "/buyers",
      },
      {
        label: <Link to="/features">{t("featureManagement")}</Link>,
        key: "/features",
      },
      {
        label: <Link to="/orders">{t("orders")}</Link>,
        key: "/orders",
      },
    ],
    [userRoles.BUYERS]: [
      { label: <Link to="/dashboard">{t("home")}</Link>, key: "/dashboard" },
      {
        label: (
          <Link to="/buyer-configuration">{t("choicesConfiguration")}</Link>
        ),
        key: "/buyerConfiguration",
      },
      {
        label: (
          <Link to="/in-budget-suggestions">{t("inBudgetSuggestions")}</Link>
        ),
        key: "/inBudgetSuggestions",
      },
      {
        label: <Link to="/comparision-tool">{t("comparisonTool")}</Link>,
        key: "/comparisionTool",
      },
    ],
    [userRoles.SUPPLIERS]: [
      { label: <Link to="/dashboard">{t("home")}</Link>, key: "/dashboard" },
      {
        label: <Link to="/supplier-orders">{t("orders")}</Link>,
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

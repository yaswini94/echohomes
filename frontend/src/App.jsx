import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./components/Login";
import Registration from "./components/Registration";
import DashboardLayout from "./components/DashboardLayout";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { AuthProvider, useAuth } from "./auth/useAuth";
import VentureDetail from "./components/VentureDetail";
// import ResetPassword from "./components/ResetPassword";
import { ConfigProvider, Layout, theme } from "antd";
import HeaderLayout from "./components/HeaderLayout";
import NavigationLayout from "./components/NavigationLayout";
import BuyerManagement from "./components/BuyerManagement";
import OrdersManagement from "./components/OrdersManagement";
import VentureManagement from "./components/VentureManagement";
import SupplierManagement from "./components/SupplierManagement";
import FeatureManagement from "./components/FeatureManagement";
import BuyerConfiguration from "./components/BuyerConfiguration";
import BudgetBasedSuggestions from "./components/BudgetBasedSuggestions";
import SupplierOrderManagement from "./components/SupplierOrderManagement";
import ComparisionTool from "./components/ComparisionTool";

const { Content } = Layout;

const AppLayout = ({ children }) => {
  const [userSettings, setUserSettings] = useState({});
  const location = useLocation();
  const isPublicPages =
    location.pathname === "/login" || location.pathname === "/register";

  const {
    token: { fontFamily, fontSize, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    // Function to handle storage
    const handleStorage = () => {
      const _settings = localStorage.getItem("settings");
      if (_settings) {
        setUserSettings(JSON.parse(_settings));
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  if (isPublicPages) {
    return (
      <Layout className="mainLayout">
        <Content>{children}</Content>
      </Layout>
    );
  }

  return (
    // Ant design templates used to render view
    <ConfigProvider
      theme={{
        algorithm:
          userSettings?.theme === "dark"
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,
        token: {
          fontFamily: userSettings?.font || fontFamily,
          fontSize: userSettings?.fontSize || fontSize,
        },
      }}
    >
      <Layout className="mainLayout">
        <HeaderLayout />
        <Layout>
          <NavigationLayout />
          <Layout
            style={{
              padding: "0 24px 24px",
              margin: "24px 0",
            }}
          >
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 872,
                background:
                  userSettings?.theme === "dark" ? "transparent" : "#fff",
                borderRadius: borderRadiusLG,
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Registration />
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              key="home"
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            />
            <Route
              path="/ventures"
              key="ventureManagement"
              element={
                <PrivateRoute>
                  <VentureManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/ventures/:id"
              key="ventureDetailManagement"
              element={
                <PrivateRoute>
                  <VentureDetail />
                </PrivateRoute>
              }
            />
            {/* <Route
            path="/suppliers"
            key="supplierDashboard"
            element={
              <PrivateRoute>
                <SupplierDashboard />
              </PrivateRoute>
            }
          /> */}
            <Route
              path="/suppliers"
              key="supplierManagement"
              element={
                <PrivateRoute>
                  <SupplierManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/buyers"
              key="buyerManagement"
              element={
                <PrivateRoute>
                  <BuyerManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/buyer-configuration"
              key="buyerConfiguration"
              element={
                <PrivateRoute>
                  <BuyerConfiguration />
                </PrivateRoute>
              }
            />
            <Route
              path="/in-budget-suggestions"
              key="inBudgetSuggestions"
              element={
                <PrivateRoute>
                  <BudgetBasedSuggestions />
                </PrivateRoute>
              }
            />
            <Route
              path="/features"
              key="featureManagement"
              element={
                <PrivateRoute>
                  <FeatureManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              key="ordersManagement"
              element={
                <PrivateRoute>
                  <OrdersManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/supplier-orders"
              key="supplierOrdersManagement"
              element={
                <PrivateRoute>
                  <SupplierOrderManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/comparision-tool"
              key="comparisionTool"
              element={
                <PrivateRoute>
                  <ComparisionTool />
                </PrivateRoute>
              }
            />
            {/* <Route
              path="/resetPassword"
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              }
            /> */}
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;

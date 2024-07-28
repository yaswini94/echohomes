import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Registration from "./components/Registration";
import DashboardLayout from "./components/DashboardLayout";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { AuthProvider } from "./auth/useAuth";
import VentureDetail from "./components/VentureDetail";
import ResetPassword from "./components/ResetPassword";
// import Settings from "./components/Settings";

function App() {
  return (
    <AuthProvider>
      <Router>
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
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          />
          <Route
            path="/ventures/:id"
            element={
              <PrivateRoute>
                <VentureDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/resetPassword"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />
          {/* <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          /> */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

import React, { useState } from 'react';
import { Layout, Breadcrumb } from 'antd';
import HeaderLayout from './HeaderLayout';
import NavigationLayout from './NavigationLayout';
// import MainContentComponent from './MainContentComponent';
import BuyerDashboard from './BuyerDashboard';
import SupplierDashboard from './SupplierDashboard';
import BuilderDashboard from './BuilderDashboard';
import { useAuth } from "../auth/useAuth";
import { supabase } from "../supabase";

const DashboardLayout = () => {
  const [userType, setUserType] = useState("");
  const [selectedKey, setSelectedKey] = useState("home");
  const { user } = useAuth();

  const handleMenuClick = (key, label) => {
    setSelectedKey(key);
  };

  if (user?.id) determineUserType(user?.id);
  async function determineUserType(userId) {
    try {
      // Check if the user is a builder
      const isBuilder = await checkIdExists('builders', userId, 'builder_id');
      if (isBuilder) {
        setUserType("builder");
        return;
      }

      // Check if the user is a supplier
      const isSupplier = await checkIdExists('suppliers', userId, 'supplier_id');
      if (isSupplier) {
        setUserType("supplier");
        return;
      }

      // Check if the user is buyer
      const isBuyer = await checkIdExists('buyers', userId, 'buyer_id');
      if (isBuyer) {
        setUserType("buyer");
        return;
      }

      // If none of the above, set a default or handle the user differently
      console.log("No specific user type found.");
    } catch (err) {
      console.error('Error:', err);
    }
  }

  async function checkIdExists(tableName, id, key) {
    const { data, error } = await supabase
        .from(tableName)
        .select(key)
        .eq(key, id)
        .single();

    if (error) {
        console.error('Error fetching data:', error);
        return false;
    }

    return data ? true : false;
  }
  const renderDashboards = () => {
    switch(userType) {
      case "buyer":
        return <BuyerDashboard />;
      case "builder":
        return <BuilderDashboard selectedKey={selectedKey} />;
      case "supplier":
        return <SupplierDashboard />;
      default:
        return <div>Content</div>;
    }
  };
  
  return (
    <Layout className="mainLayout">
      <HeaderLayout />
      <Layout>
        <NavigationLayout userType={userType} onMenuClick={handleMenuClick} />
        <Layout
          style={{
            padding: '0 24px 24px',
            margin: '24px 0'
          }}
        >
          <div>
            {renderDashboards()}
          </div>
        </Layout>
        {/* <MainContentComponent userType={userType} /> */}
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;

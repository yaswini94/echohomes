import React from 'react';
import { Layout, Breadcrumb } from 'antd';
import HeaderLayout from './HeaderLayout';
import NavigationLayout from './NavigationLayout';
// import MainContentComponent from './MainContentComponent';
import BuyerDashboard from './BuyerDashboard';
import SupplierDashboard from './SupplierDashboard';
import BuilderDashboard from './BuilderDashboard';

const DashboardLayout = () => {
  const userType = "builder"; // This should be dynamically set based on actual user data
  const renderDashboards = () => {
    switch(userType) {
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
  
  return (
    <Layout className="mainLayout">
      <HeaderLayout />
      <Layout>
        <NavigationLayout userType={userType} />
        <Layout
          style={{
            padding: '0 24px 24px',
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            {/* <Breadcrumb.Item>List</Breadcrumb.Item> */}
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
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

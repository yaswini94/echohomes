import React from 'react';
import { Layout, theme } from 'antd';
import VentureManagement from './VentureManagement';
import SupplierManagement from './SupplierManagement';
const { Content } = Layout;

const BuilderDashboard = ({ selectedKey }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Content
      style={{
        padding: 24,
        margin: 0,
        minHeight: 280,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <div>
        {/* Render different content based on selectedKey */}
        {selectedKey === 'home' && <p>Home</p>}
        {selectedKey === 'ventureManagement' && <VentureManagement />}
        {selectedKey === 'supplierManagement' && <SupplierManagement />}
        {/* {selectedKey === 'buyerManagement' && <BuyerManagement />} */}
      </div>
    </Content>
  )
};
export default BuilderDashboard;
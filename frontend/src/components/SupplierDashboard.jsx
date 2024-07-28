import React from 'react';
import { Layout, theme } from 'antd';
const { Content } = Layout;

const SupplierDashboard = () => {
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
        {selectedKey === 'orders' && <p>Orders</p>}
        {selectedKey === 'invoices' && <p>Invoices</p>}
        {/* {selectedKey === 'orders' && <ChoicesConfiguration />} */}
      </div>
    </Content>
  )
};
export default SupplierDashboard;
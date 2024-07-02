import React from 'react';
import { Layout, theme } from 'antd';
const { Content } = Layout;

const BuyerDashboard = () => {
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
      Buyer Content
    </Content>
  )
};
export default BuyerDashboard;
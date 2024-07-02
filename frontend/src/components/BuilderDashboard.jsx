import React from 'react';
import { Layout, theme } from 'antd';
const { Content } = Layout;

const BuilderDashboard = () => {
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
      Builder Content
    </Content>
  )
};
export default BuilderDashboard;
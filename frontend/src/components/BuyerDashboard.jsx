import React from 'react';
import { Layout, theme } from 'antd';
import ChoicesConfiguration from './ChoicesConfiguration';
const { Content } = Layout;

const BuyerDashboard = ({ selectedKey }) => {
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
        {selectedKey === 'choicesConfiguration' && <ChoicesConfiguration />}
        {selectedKey === 'inBudgetSuggestions' && <ChoicesConfiguration />}
        {selectedKey === 'payments/invoice' && <ChoicesConfiguration />}
      </div>
    </Content>
  )
};
export default BuyerDashboard;
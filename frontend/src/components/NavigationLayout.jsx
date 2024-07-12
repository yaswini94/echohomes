import React from 'react';
import { Layout, Menu, theme } from 'antd';
import {
  HomeOutlined
} from '@ant-design/icons';
const { Sider } = Layout;

const NavigationLayout = ({ userType, onMenuClick }) => {
  const items = {
    builder: [{ label: 'Home', key: 'home' }, { label: 'Venture Management', key: 'ventureManagement' }, { label: 'Supplier Management', key: 'supplierManagement' }, { label: 'Buyer Management', key: 'buyerManagement' }, { label: 'Feature Management', key: 'featureManagement' }, { label: 'Orders', key: 'orders' }],
    // builder: [{ label: 'Home', key: 'home', icon: <HomeOutlined /> }, { label: 'Venture Management', key: 'ventureManagement' }, { label: 'Supplier Management', key: 'supplierManagement' }, { label: 'Buyer Management', key: 'buyerManagement' }, { label: 'Feature Management', key: 'featureManagement' }, { label: 'Orders', key: 'orders' }],
    buyer: [{ label: 'Home', key: 'home' }, { label: 'Choices Configuration', key: 'choicesConfiguration' }, { label: 'In-Budget Suggestions', key: 'inBudgetSuggestions' }, { label: 'Payments/ Invoice', key: 'payments/invoice' }],
    supplier: [{ label: 'Home', key: 'home' }, { label: 'Orders', key: 'orders' }, { label: 'Invoices', key: 'invoices' }]
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleClick = (item) => {
    // console.log(`Clicked on ${item.key} in ${userType}`);
    onMenuClick(item.key); // Call the passed function with the selected key
  };

  return (
    <Sider
      width={200}
      style={{
        background: colorBgContainer,
      }}
    >
    <Menu
      mode="inline"
      defaultSelectedKeys={['home']}
      defaultOpenKeys={['home']}
      style={{
        height: '100%',
        borderRight: 0,
      }}
      items={items[userType]}
      onClick={handleClick}
    />
    </Sider>
  );
};

export default NavigationLayout;

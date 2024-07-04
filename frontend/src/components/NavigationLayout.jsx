import React from 'react';
import { Layout, Menu, theme } from 'antd';
import {
  HomeOutlined
} from '@ant-design/icons';
const { Sider } = Layout;

const NavigationLayout = ({ userType }) => {
  const items = {
    builder: [{ label: 'Home', key: 'home', icon: <HomeOutlined /> }, { label: 'Venture Management', key: 'ventureManagement' }, { label: 'Supplier Management', key: 'supplierManagement' }, { label: 'Buyer Management', key: 'buyerManagement' }, { label: 'Feature Management', key: 'featureManagement' }, { label: 'Orders', key: 'orders' }],
    buyer: [{ label: 'Home', key: 'home' }, { label: 'Choices Configuration', key: 'choicesConfiguration' }, { label: 'In-Budget Suggestions', key: 'inBudgetSuggestions' }, { label: 'Payments/ Invoice', key: 'payments/invoice' }],
    supplier: [{ label: 'Home', key: 'home' }, { label: 'Orders', key: 'orders' }, { label: 'Invoices', key: 'invoices' }]
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Sider
      width={200}
      style={{
        background: colorBgContainer,
      }}
    >
    <Menu
      mode="inline"
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['1']}
      style={{
        height: '100%',
        borderRight: 0,
      }}
      items={items[userType]}
    />
    </Sider>
  );
};

export default NavigationLayout;

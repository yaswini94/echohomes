import React from 'react';
import { Layout, Menu, theme } from 'antd';

const { Sider } = Layout;

const NavigationLayout = ({ userType }) => {
  const items = {
    buyer: [{ label: 'buyer', key: 'dashboard' }, { label: 'Settings', key: 'settings' }],
    builder: [{ label: 'builder', key: 'dashboard' }, { label: 'Settings', key: 'settings' }],
    supplier: [{ label: 'supplier', key: 'profile' }, { label: 'Projects', key: 'projects' }]
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

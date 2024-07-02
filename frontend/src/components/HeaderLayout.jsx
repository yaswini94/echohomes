import React from 'react';
import { Layout, Menu, Avatar, Badge } from 'antd';
import { UserOutlined, SettingOutlined, BellOutlined } from '@ant-design/icons';
import logo from '../assets/echohomes.png';

const { Header } = Layout;

const HeaderLayout = () => {
  const items1 = [{1:1, label:'Logo'}, {2:2, label:'notification'}, {3:3, label:'Settings'}];
  return (
    // <Header
    //   style={{
    //     display: 'flex',
    //     alignItems: 'center',
    //   }}
    // >
    //   <div className="demo-logo" />
    //   <Menu
    //     theme="dark"
    //     mode="horizontal"
    //     defaultSelectedKeys={['2']}
    //     items={items1}
    //     style={{
    //       flex: 1,
    //       minWidth: 0,
    //     }}
    //   />
    // </Header>

    <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 50px' }}>
      <div className='top-margin'>
        <img src={logo} alt="Logo" style={{ height: '32px' }} />
      </div>
      <div>
        <Menu mode="horizontal" theme="dark" style={{flex: 1, minWidth: 0}} selectable={false}>
          <Menu.Item key="language">EN-US</Menu.Item>
          <Menu.Item key="notifications">
            {/* <Badge count={5}> */}
              <BellOutlined style={{ fontSize: '50%'}}/>
            {/* </Badge> */}
          </Menu.Item>
          <Menu.Item key="settings"><SettingOutlined /></Menu.Item>
          <Menu.Item key="user">
            <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00', fontSize: '100%' }} icon={<UserOutlined />} />
          </Menu.Item>
        </Menu>
      </div>
    </Header>
  );
};

export default HeaderLayout;

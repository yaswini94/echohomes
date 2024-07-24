import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Select,
  Badge,
  Dropdown,
  Space,
  Typography,
} from "antd";
import {
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  DownOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import axiosInstance from "../helpers/axiosInstance";
import titleLogo from "../assets/echohomesTitle.png";
import exitLogo from "../assets/exit.png";
import { supabase } from "../supabase";
const { Header } = Layout;

const HeaderLayout = ({ userType }) => {
  // const [language, setLanguage] = useState("EN-GB");
  const [ventures, setVentures] = useState([]);
  const [selectedVenture, setSelectedVenture] = useState(null);

  // const onLanguageChange = (value) => {
  //   switch (value) {
  //     case 'en-us':
  //       setLanguage("EN-US");
  //       form.setFieldsValue({
  //         note: 'en-us!',
  //       });
  //       setUsertype(value);
  //       break;
  //     case 'en-gb':
  //       setLanguage("EN-GB");
  //       form.setFieldsValue({
  //         note: 'en-gb!',
  //       });
  //       break;
  //     default:
  //   }
  // };

  useEffect(() => {
    const fetchVentures = async () => {
      try {
        const response = await axiosInstance.get("/ventures");
        const _ventures = (response?.data || []).map((venture) => {
          return {
            value: venture.venture_id,
            label: venture.name,
          };
        });
        setVentures(_ventures);
        const _selectedVenture = _ventures?.[0].value;
        setSelectedVenture(_selectedVenture);
        localStorage.setItem("selectedVenture", _selectedVenture);
      } catch (error) {
        console.log("Error fetching ventures:", error);
      }
    };

    fetchVentures();
  }, []);

  const onSelectVenture = (value) => {
    setSelectedVenture(value);
    localStorage.setItem("selectedVenture", value);
  };

  const user_items = [
    {
      key: "1",
      label: (
        <a target="_blank" rel="noopener noreferrer" href="">
          Settings
        </a>
      ),
      icon: <SettingOutlined />,
    },
    {
      key: "2",
      label: (
        <>
          <a target="_blank" rel="noopener noreferrer" href="">
            Notifications
          </a>
          {/* <Badge count={5} style={{marginLeft: "8px"}}></Badge> */}
        </>
      ),
      icon: <BellOutlined />,
    },
    {
      key: "3",
      label: (
        <a rel="noopener noreferrer" onClick={() => supabase.auth.signOut()}>
          Signout
        </a>
      ),
      icon: <Avatar src={exitLogo} style={{ height: "18px", width: "18px" }} />,
    },
  ];

  const languages = [
    {
      key: "1",
      label: (
        <a target="_blank" rel="noopener noreferrer" href="">
          EN-GB
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a target="_blank" rel="noopener noreferrer" href="">
          EN-US
        </a>
      ),
    },
  ];

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
      }}
    >
      <div style={{ marginTop: "20px" }}>
        <img src={titleLogo} alt="Title Logo" style={{ height: "32px" }} />
      </div>
      <div>
        {/* <p>Use Venture: </p> */}
        {/* {console.log({ selectedVenture })} */}
        {userType === 'builder' && (<Select
          value={selectedVenture}
          style={{ width: "auto", minWidth: "160px", marginRight: "16px", color: "white" }}
          onChange={onSelectVenture}
          options={ventures}
        />)}
        <MessageOutlined
          style={{ color: "white" }}
          onClick={(event) => event.preventDefault()}
        />
        {/* <Dropdown menu={{languages}}> */}
        <a
          style={{ margin: "0 20px", color: "white" }}
          onClick={(event) => event.preventDefault()}
        >
          EN-GB
        </a>
        {/* <Select key="language"
            style={{color: "white", border: "none"}}
            // placeholder={{language}}
            onClick={(event) => event.preventDefault()}
            onChange={onLanguageChange}
            value={language}
            allowClear
          >
            <Option value="en-us">EN-US</Option>
            <Option value="en-gb">EN-GB</Option>
          </Select> */}
        {/* </Dropdown> */}
        <Dropdown menu={{ items: user_items }}>
          <a
            style={{ color: "white" }}
            onClick={(event) => event.preventDefault()}
          >
            <span>
              <Space>
                <Avatar
                  style={{
                    backgroundColor: "#fde3cf",
                    color: "#f56a00",
                    fontSize: "100%",
                  }}
                  icon={<UserOutlined />}
                />
                <DownOutlined />
              </Space>
            </span>
          </a>
        </Dropdown>
        {/* <Menu mode="horizontal" theme="dark" style={{flex: 1, minWidth: 0}} selectable={false}>
          <Menu.Item key="language">EN-US
            <Select
              // placeholder={{language}}
              onChange={onLanguageChange}
              value={language}
              allowClear
            >
              <Option value="en-us">EN-US</Option>
              <Option value="en-gb">EN-GB</Option>
            </Select>
          </Menu.Item>
          <Menu.Item key="notifications">
            <Badge count={5}>
              <BellOutlined style={{ fontSize: '50%'}}/>
            </Badge>
          </Menu.Item>
          <Menu.Item key="settings"><SettingOutlined /></Menu.Item>
          <Menu.Item key="user">
            <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00', fontSize: '100%' }} icon={<UserOutlined />} />
          </Menu.Item>
          <Menu.Item key="signout" onClick={() => supabase.auth.signOut()}>
            Signout
          </Menu.Item>
        </Menu> */}
      </div>
    </Header>
  );
};

export default HeaderLayout;

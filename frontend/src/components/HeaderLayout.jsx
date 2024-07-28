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
  Button,
  Modal,
  Form,
  InputNumber
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
  const [language, setLanguage] = useState("EN-GB");
  const [ventures, setVentures] = useState([]);
  const [selectedVenture, setSelectedVenture] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [initalSettings, setInitalSettings] = useState({font: 'Arial', fontSize: '14', theme: 'light'});
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  
  const onLanguageChange = (value) => {
    setLanguage(value);
    localStorage.setItem("language", value);
  };

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

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    console.log(initalSettings);
    console.log(settings);
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // const updateKeys = () => {
  //   let updatedSettings = {
  //     font: (settings?.font) ? settings?.font : initalSettings.font,
  //     fontSize: (settings?.fontSize) ? settings?.fontSize : initalSettings.fontSize,
  //     theme: (settings?.theme) ? settings?.theme : initalSettings.theme
  //   };
  //   return updatedSettings;
  // };

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const user_items = [
    {
      key: "1",
      label: 
      <>
        <Button type="text" onClick={showModal}>Settings</Button>,
        <div>
          <Modal
            title="Settings"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={handleOk}
              >
                {loading ? "Updating..." : "Save"}
              </Button>,
            ]}
          >
            <Form layout="vertical">
              <Form.Item label="Font" name="font" initialValue={initalSettings?.font}>
                <Select value={settings?.font} onChange={(value) => handleChange('font', value)}>
                  <Option value="Arial">Arial</Option>
                  <Option value="Georgia">Georgia</Option>
                  <Option value="Verdana">Verdana</Option>
                  <Option value="Courier New">Courier New</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Font Size" name="fontSize" initialValue={initalSettings?.fontSize}>
                <InputNumber min={10} max={30} value={settings?.value} onChange={(value) => handleChange('fontSize', value)}/>
              </Form.Item>
              <Form.Item label="Theme" name="theme" initialValue={initalSettings?.theme}>
                <Select value={settings?.theme} onChange={(value) => handleChange('theme', value)}>
                  <Option value="light">Light</Option>
                  <Option value="dark">Dark</Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </>,
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
      value: 'en-gb',
      label: 'EN-GB'
    },
    {
      value: 'en-us',
      label: 'EN-US'
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
          style={{ width: "auto", minWidth: "160px", marginRight: "24px", color: "white" }}
          onChange={onSelectVenture}
          options={ventures}
        />)}
        <Select key="language"
          style={{width: 'auto', minWidth: '80px', marginRight: '24px'}}
          onClick={(event) => event.preventDefault()}
          onChange={onLanguageChange}
          value={language}
          options={languages}
        >
          <Option value="en-us">EN-US</Option>
          <Option value="en-gb">EN-GB</Option>
        </Select>
        <MessageOutlined
          style={{ color: "white", fontSize: "24px", width: "24px", height: "24px", marginRight: "24px" }}
          onClick={(event) => event.preventDefault()}
        />
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
      </div>
    </Header>
  );
};

export default HeaderLayout;

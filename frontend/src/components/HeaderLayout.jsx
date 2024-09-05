import { useEffect, useState } from "react";
import {
  Layout,
  Avatar,
  Select,
  Dropdown,
  Space,
  Button,
  Modal,
  Form,
  InputNumber,
} from "antd";
import {
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import axiosInstance from "../helpers/axiosInstance";
import titleLogo from "../assets/echohomesTitle.png";
import exitLogo from "../assets/exit.png";
import { supabase } from "../supabase";
import { useAuth } from "../auth/useAuth";
import { userRoles } from "../utils/constants";
import useLocalStorage from "../utils/useLocalStorage";

const { Header } = Layout;

const HeaderLayout = () => {
  const { role, user } = useAuth();
  const selectedLanguage = localStorage.getItem("language");
  const [language, setLanguage] = useState(selectedLanguage || "en");
  const [ventures, setVentures] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [initialSettings, setinitialSettings] = useState({});
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [font, setFont] = useState("");
  const [fontSize, setFontSize] = useState();
  const [theme, setTheme] = useState("");
  const [ventureId, setVentureId] = useLocalStorage("selectedVenture", null);
  const { i18n } = useTranslation();

  // Function to handle language change for globalisation
  const onLanguageChange = (value) => {
    setLanguage(value);
    localStorage.setItem("language", value);
  };

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  // Function to handle fetch user settings
  const fetchUserSettings = async (role) => {
    if (role) {
      try {
        const response = await axiosInstance.get(`/settings/${role}`);
        setFont(response?.data?.font);
        setFontSize(response?.data?.fontSize);
        setTheme(response?.data?.theme);
        setinitialSettings(response?.data);
        localStorage.setItem("settings", JSON.stringify(response?.data));
        window.dispatchEvent(new Event("storage"));
      } catch (error) {
        console.log("Error fetching user settings:", error);
      }
    }
  };

  useEffect(() => {
    if (role !== userRoles.BUILDERS) {
      fetchUserSettings(role);
      return;
    }

    if (role) {
      // Function to handle fetch ventures
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
          const _selectedVenture = _ventures?.[0]?.value;
          setVentureId(_selectedVenture);
        } catch (error) {
          console.log("Error fetching ventures:", error);
        }
      };

      fetchVentures();
      fetchUserSettings(role);
    }
  }, [role]);

  // Function to handle venture change
  const onSelectVenture = (value) => {
    setVentureId(value);
  };

  // Function to handle show settings modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Function to handle save settings button
  const handleOk = () => {
    saveSettings(settings);
    setIsModalVisible(false);
  };

  // Function to handle cancel updating settings
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Function to handle select option change dynamically
  const handleChange = (key, value) => {
    switch (key) {
      case "font":
        setFont(value);
        break;
      case "fontSize":
        setFontSize(value);
        break;
      case "theme":
        setTheme(value);
        break;
    }
    setSettings({ ...settings, [key]: value });
  };

  const user_items = [
    {
      key: "1",
      icon: <SettingOutlined />,
      label: (
        <a type="text" onClick={showModal}>
          Settings
        </a>
      ),
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
      value: "en",
      label: "English (UK)",
    },
    {
      value: "es",
      label: "Español",
    },
    {
      value: "zh",
      label: "中文",
    },
  ];

  // Function to hanlde the formating of settings object
  const fillSettings = (settings) => {
    let data = { ...settings };
    if (Object.keys(settings).length < 3) {
      if (!data?.font) {
        data["font"] = initialSettings.font;
      }
      if (!data?.fontSize) {
        data["fontSize"] = initialSettings.fontSize;
      }
      if (!data?.theme) {
        data["theme"] = initialSettings.theme;
      }
    }
    return data;
  };

  // Function to handle save settings dynamically based on role
  const saveSettings = async (settings) => {
    setLoading(true);
    let _settings = fillSettings(settings);

    try {
      switch (role) {
        case userRoles.BUILDERS:
          const data = await axiosInstance.post("/updateBuilder", {
            builder_id: user?.id,
            settings: _settings,
          });
          fetchUserSettings(role);
          break;
        case userRoles.BUYERS:
          const dataBuyer = await axiosInstance.post("/updateBuyer", {
            buyer_id: user?.id,
            settings: _settings,
          });
          fetchUserSettings(role);
          break;
        case userRoles.SUPPLIERS:
          const dataSupplier = await axiosInstance.post("/updateSupplier", {
            supplier_id: user?.id,
            settings: _settings,
          });
          fetchUserSettings(role);
          break;
      }
    } catch (error) {
      console.log("Error updating settings:", error);
    }
    setLoading(false);
  };

  return (
    // Header template from ant design for the header view
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
        height: "80px",
      }}
    >
      <div style={{ marginTop: "20px" }}>
        <img src={titleLogo} alt="Title Logo" style={{ height: "32px" }} />
      </div>
      <div>
        {/* Modal template from ant design for the settings modal */}
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
            {/* Form item for the font */}
            <Form.Item label="Font">
              <Select
                defaultValue={font}
                value={font}
                onChange={(value) => handleChange("font", value)}
              >
                <Option value="Arial">Arial</Option>
                <Option value="Georgia">Georgia</Option>
                <Option value="Verdana">Verdana</Option>
                <Option value="Courier New">Courier New</Option>
              </Select>
            </Form.Item>
            {/* Form item for the theme */}
            <Form.Item label="Theme">
              <Select
                defaultValue={theme}
                value={theme}
                onChange={(value) => handleChange("theme", value)}
              >
                <Option value="light">Light</Option>
                <Option value="dark">Dark</Option>
              </Select>
            </Form.Item>
            {/* Form item for the font size */}
            <Form.Item label="Font Size">
              <InputNumber
                defaultValue={fontSize}
                style={{ width: "100%" }}
                min={12}
                max={32}
                value={fontSize}
                step={2}
                onChange={(value) => handleChange("fontSize", value)}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <div>
        {/* Switch venture for the builder */}
        {role === userRoles.BUILDERS &&
          (ventures.length > 0 ? (
            <Select
              value={ventureId}
              style={{
                width: "auto",
                minWidth: "160px",
                marginRight: "24px",
                color: "white",
              }}
              onChange={onSelectVenture}
              options={ventures}
            />
          ) : (
            <Select
              value="No ventures available"
              style={{
                width: "auto",
                minWidth: "160px",
                marginRight: "24px",
                color: "white",
              }}
            />
          ))}
        {/* Language change for the globalisation */}
        <Select
          key="language"
          style={{ width: "125px", minWidth: "80px", marginRight: "24px" }}
          onClick={(event) => event.preventDefault()}
          onChange={onLanguageChange}
          value={language}
          options={languages}
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
                {user?.email}
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

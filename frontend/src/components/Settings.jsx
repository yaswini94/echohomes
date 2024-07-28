import React, { useState } from 'react';
import { Form, Select, InputNumber, Button, Layout, ConfigProvider } from 'antd';
import 'antd/dist/reset.css';  // Import Ant Design styles

const { Option } = Select;
const { Header, Content } = Layout;

const Settings = ({ onSettingsChange }) => {
  const [font, setFont] = useState('Arial');
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState('light');

  const handleFontChange = (value) => {
    setFont(value);
    onSettingsChange({ font: value, fontSize, theme });
  };

  const handleFontSizeChange = (value) => {
    setFontSize(value);
    onSettingsChange({ font, fontSize: value, theme });
  };

  const handleThemeChange = (value) => {
    setTheme(value);
    onSettingsChange({ font, fontSize, theme: value });
  };

  return (
    <Form layout="vertical" style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <Form.Item label="Font">
        <Select value={font} onChange={handleFontChange}>
          <Option value="Arial">Arial</Option>
          <Option value="Georgia">Georgia</Option>
          <Option value="Verdana">Verdana</Option>
          <Option value="Courier New">Courier New</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Font Size">
        <InputNumber min={10} max={30} value={fontSize} onChange={handleFontSizeChange} />
      </Form.Item>
      <Form.Item label="Theme">
        <Select value={theme} onChange={handleThemeChange}>
          <Option value="light">Light</Option>
          <Option value="dark">Dark</Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export default Settings;

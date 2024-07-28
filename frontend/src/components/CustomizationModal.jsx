// CustomizationModal.js
import React, { useState } from "react";
import { Modal, Form, Input, Select, Button } from "antd";

const CustomizationModal = ({ visible, onClose, onSave }) => {
  const [form] = Form.useForm();
  
  const handleSave = () => {
    form.validateFields().then((values) => {
      onSave(values);
      onClose();
    });
  };

  return (
    <Modal
      title="Customize Settings"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Font" name="font" rules={[{ required: true, message: 'Please select a font!' }]}>
          <Select>
            <Select.Option value="Arial">Arial</Select.Option>
            <Select.Option value="Helvetica">Helvetica</Select.Option>
            <Select.Option value="Times New Roman">Times New Roman</Select.Option>
            {/* Add more font options as needed */}
          </Select>
        </Form.Item>
        <Form.Item label="Font Size" name="fontSize" rules={[{ required: true, message: 'Please enter a font size!' }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Color Theme" name="colorTheme" rules={[{ required: true, message: 'Please select a color theme!' }]}>
          <Select>
            <Select.Option value="light">Light</Select.Option>
            <Select.Option value="dark">Dark</Select.Option>
            {/* Add more color theme options as needed */}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CustomizationModal;

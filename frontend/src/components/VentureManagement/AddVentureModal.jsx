import { Button, Input, Form, Modal, Select, InputNumber } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../helpers/axiosInstance";

const AddVentureModal = ({ isOpened, handleOk, handleCancel }) => {
  const { t: translate } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([
    { key: 1, label: translate("1Bed"), value: 0 },
    { key: 2, label: translate("2Bed"), value: 0 },
    { key: 3, label: translate("3Bed"), value: 0 },
  ]);
  const [name, setName] = useState(null);
  const [address, setAddress] = useState(null);
  const [description, setDescription] = useState(null);

  // Function to handle property count changes
  const handleValueChange = (value, index) => {
    const updatedProperties = properties.map((property, i) =>
      i === index ? { ...property, value } : property
    );
    setProperties(updatedProperties);
  };

  // Function to handle add venture
  const handleAddVenture = async () => {
    if (!name || !address) {
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post("/addVenture", {
        name,
        address,
        description,
        properties,
      });
    } catch (error) {
      console.log("Error adding venture:", error);
    }
    handleOk();
    setLoading(false);
  };

  const [form] = Form.useForm();

  return (
    // Modal template from the ant design for view
    <Modal
      title="Add New Venture"
      open={isOpened}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button
          key="back"
          onClick={handleCancel}
          data-testid="cancelAddVentureButton"
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          htmlType="submit"
          onClick={() => form.submit()}
          data-testid="addVentureButton"
        >
          {loading ? "Adding..." : "Add Venture"}
        </Button>,
      ]}
    >
      <Form
        layout="vertical"
        name="add-venture-modal"
        form={form}
        onFinish={handleAddVenture}
      >
        {/* Form item for the venture name with validation */}
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "name is required" }]}
        >
          <Input
            placeholder="Venture Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Item>
        {/* Form item for the address of venture with validation */}
        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "address is required" }]}
        >
          <Input
            placeholder="Address"
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </Form.Item>
        {/* Form item for the desctiption of the venture */}
        <Form.Item label="Description" name="description">
          <Input.TextArea
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Item>
        <p>Select Properties</p>
        {properties?.map((property, index) => (
          // Dynamic form item for the properties to change count
          <Form.Item
            name={`property${property.key}`}
            key={property.key}
            label={property.label}
          >
            <Input.Group compact>
              <Select style={{ width: 120 }} value={property.label} disabled>
                <Option value="1">{translate("1Bed")}</Option>
                <Option value="2">{translate("2Bed")}</Option>
                <Option value="3">{translate("3Bed")}</Option>
              </Select>
              <Form.Item
                name={`propertyValue${property.key}`}
                noStyle
                rules={[{ required: true, message: "Value is required" }]}
              >
                <InputNumber
                  min={0}
                  value={property.value}
                  onChange={(value) => {
                    handleValueChange(value, index);
                  }}
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default AddVentureModal;

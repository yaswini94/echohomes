import { Button, Input, Form, Modal, Select, InputNumber } from "antd";
import { useState } from "react";
import axiosInstance from "../../helpers/axiosInstance";

const AddVentureModal = ({ isOpened, handleOk, handleCancel }) => {
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([
    { key: 1, label: "1 Bed", value: 0 },
    { key: 2, label: "2 Bed", value: 0 },
    { key: 3, label: "3 Bed", value: 0 },
  ]);
  const [name, setName] = useState(null);
  const [address, setAddress] = useState(null);
  const [description, setDescription] = useState(null);

  const handleValueChange = (value, index) => {
    const updatedProperties = properties.map((property, i) =>
      i === index ? { ...property, value } : property
    );
    setProperties(updatedProperties);
  };

  const handleAddVenture = async () => {
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

  return (
    <Modal
      title="Add New Venture"
      open={isOpened}
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
          onClick={handleAddVenture}
        >
          {loading ? "Adding..." : "Add Venture"}
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="Name">
          <Input
            placeholder="Venture Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Item>
        <Form.Item label="Address">
          <Input
            placeholder="Address"
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </Form.Item>
        <Form.Item label="Description">
          <Input.TextArea
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Item>
        <p>Select Properties</p>
        {properties?.map((property, index) => (
          <Form.Item name={`property${property.key}`} key={property.key}>
            <Select
              style={{ width: 120, marginRight: 8 }}
              value={property.label}
              disabled
            >
              <Option value="1">1 Bed</Option>
              <Option value="2">2 Bed</Option>
              <Option value="3">3 Bed</Option>
            </Select>
            <InputNumber
              min={0}
              value={property.value}
              onChange={(value) => {
                handleValueChange(value, index);
              }}
            />
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default AddVentureModal;

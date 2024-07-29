import { Button, Input, Form, Modal, Select, InputNumber } from "antd";
import { useState } from "react";
import axiosInstance from "../../helpers/axiosInstance";

const EditVentureModal = ({ isOpened, venture, handleOk, handleCancel }) => {
  console.log({ venture });
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState(
    venture.properties || [
      { key: 1, label: "1 Bed", value: 0 },
      { key: 2, label: "2 Bed", value: 0 },
      { key: 3, label: "3 Bed", value: 0 },
    ]
  );
  const [name, setName] = useState(venture.name);
  const [address, setAddress] = useState(venture.address);
  const [description, setDescription] = useState(venture.description);

  const handleValueChange = (value, index) => {
    const updatedProperties = properties.map((property, i) =>
      i === index ? { ...property, value } : property
    );
    setProperties(updatedProperties);
  };

  const editVenture = async () => {
    setLoading(true);

    try {
      await axiosInstance.post("/updateVenture", {
        ventureId: venture.venture_id,
        name,
        address,
        description,
        properties,
      });
    } catch (error) {
      console.log("Error updaing venture:", error);
    }

    handleOk();
    setLoading(false);
  };

  return (
    <Modal
      title="Edit Venture"
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
          onClick={editVenture}
          //   disabled={!isChanged}
        >
          {loading ? "Updating..." : "Edit Venture"}
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="Name">
          <Input
            placeholder="Venture Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Item>
        <Form.Item label="Address">
          <Input
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </Form.Item>
        <Form.Item label="Description">
          <Input.TextArea
            value={description}
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Item>
        <p>Select Properties</p>
        {properties?.map((property, index) => (
          <Form.Item name="properties" key={property.key}>
            <Select
              style={{ width: 120, marginRight: 8 }}
              value={property.label}
              disabled
            >
              <Option value="1 Bed">1 Bed</Option>
              <Option value="2 Bed">2 Bed</Option>
              <Option value="3 Bed">3 Bed</Option>
            </Select>
            <InputNumber
              min={0}
              value={property.value}
              onChange={(value) => handleValueChange(value, index)}
            />
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default EditVentureModal;

import { Button, Input, Form, Modal, Select, InputNumber } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../helpers/axiosInstance";

const EditVentureModal = ({ isOpened, venture, handleOk, handleCancel }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState(
    venture.properties || [
      { key: 1, label: t("1Bed"), value: 0 },
      { key: 2, label: t("2Bed"), value: 0 },
      { key: 3, label: t("3Bed"), value: 0 },
    ]
  );
  const [name, setName] = useState(venture.name);
  const [address, setAddress] = useState(venture.address);
  const [description, setDescription] = useState(venture.description);

  // Function to handle property count change
  const handleValueChange = (value, index) => {
    const updatedProperties = properties.map((property, i) =>
      i === index ? { ...property, value } : property
    );
    setProperties(updatedProperties);
  };

  // Function to handle edit venture
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
    // Modal template from the ant design for view
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
        >
          {loading ? "Updating..." : "Edit Venture"}
        </Button>,
      ]}
    >
      <Form layout="vertical">
        {/* Form item for the venture name */}
        <Form.Item label="Name">
          <Input
            placeholder="Venture Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Item>
        {/* Form item for the address of venture */}
        <Form.Item label="Address">
          <Input
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </Form.Item>
        {/* Form item for the desctiption of the venture */}
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
          // Dynamic form item for the properties to change count
          <Form.Item name="properties" key={property.key}>
            <Select
              style={{ width: 120, marginRight: 8 }}
              value={property.label}
              disabled
            >
              <Option value="1">{t("1Bed")}</Option>
              <Option value="2">{t("2Bed")}</Option>
              <Option value="3">{t("3Bed")}</Option>
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

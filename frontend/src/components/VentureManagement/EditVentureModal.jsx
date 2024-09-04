import { Button, Input, Form, Modal, Select, InputNumber } from "antd";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../helpers/axiosInstance";

const EditVentureModal = ({ isOpened, venture, handleOk, handleCancel }) => {
  const { t: translate } = useTranslation();
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

  useEffect(() => {
    form.setFieldsValue({
      name: venture.name,
      address: venture.address,
      description: venture.description,
      ...properties.reduce((acc, property) => {
        acc[`propertyValue${property.key}`] = property.value;
        return acc;
      }, {}),
    });
  }, [venture, properties]);

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
      console.log("Error updating venture:", error);
    }

    handleOk();
    setLoading(false);
  };

  const [form] = Form.useForm();

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
          onClick={() => form.submit()}
        >
          {loading ? "Updating..." : "Edit Venture"}
        </Button>,
      ]}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={editVenture}
        initialValues={{
          name: venture.name,
          address: venture.address,
          description: venture.description,
          ...properties.reduce((acc, property) => {
            acc[`propertyValue${property.key}`] = property.value;
            return acc;
          }, {}),
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please input the venture name!" },
          ]}
        >
          <Input
            placeholder="Venture Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Item>
        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please input the address!" }]}
        >
          <Input
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input the description!" }]}
        >
          <Input.TextArea
            value={description}
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Item>
        <p>Select Properties</p>
        {properties?.map((property, index) => (
          <Form.Item
            name={`property${property.key}`}
            key={property.key}
            label={property.label}
          >
            <Input.Group compact>
              <Select style={{ width: 120 }} value={property.label} disabled>
                <Select.Option value="1">{translate("1Bed")}</Select.Option>
                <Select.Option value="2">{translate("2Bed")}</Select.Option>
                <Select.Option value="3">{translate("3Bed")}</Select.Option>
              </Select>
              <Form.Item
                name={`propertyValue${property.key}`}
                noStyle
                rules={[{ required: true, message: "Value is required" }]}
              >
                <InputNumber
                  min={0}
                  value={property.value}
                  onChange={(value) => handleValueChange(value, index)}
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default EditVentureModal;

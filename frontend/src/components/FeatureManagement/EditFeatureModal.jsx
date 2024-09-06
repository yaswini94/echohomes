import { useState } from "react";
import { Button, Input, Form, Modal } from "antd";
import axiosInstance from "../../helpers/axiosInstance";

const EditFeatureModal = ({ isOpened, feature, handleOk, handleCancel }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(feature.name);
  const [details, setDetails] = useState(feature.details);
  const [price, setPrice] = useState(feature.price || 0);

  // Function to update the Feature
  const updateFeature = async () => {
    setLoading(true);

    try {
      await axiosInstance.post("/updateFeature", {
        name,
        details,
        price,
        feature_id: feature.feature_id,
      });
    } catch (error) {
      console.log("Error updating feature:", error);
    }

    setLoading(false);
    handleOk();
  };

  const [form] = Form.useForm();

  return (
    // Modal template from the ant design to create edit feature view
    <Modal
      title="Edit Feature"
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
          disabled={!(name && details && price)}
          loading={loading}
          onClick={() => form.submit()}
        >
          {loading ? "Updating..." : "Edit Feature"}
        </Button>,
      ]}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={updateFeature}
        initialValues={{
          name: feature.name,
          details: feature.details,
          price: feature.price,
        }}
      >
        {/* Form item for the feature name with validation */}
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the name of the feature!",
            },
          ]}
        >
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Item>
        {/* Form item for the details */}
        <Form.Item label="Details" name="details">
          <Input
            placeholder="Details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
          />
        </Form.Item>
        {/* Form item for the price  with validation */}
        <Form.Item
          label="Price"
          name="price"
          rules={[
            {
              required: true,
              message: "Please input the price of the feature!",
            },
          ]}
        >
          <Input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditFeatureModal;

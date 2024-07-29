import React, { useState } from "react";
import { Button, Input, Form, Modal } from "antd";
import axiosInstance from "../../helpers/axiosInstance";

const EditFeatureModal = ({ isOpened, feature, handleOk, handleCancel }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(feature.name);
  const [details, setDetails] = useState(feature.details);
  const [price, setPrice] = useState(feature.price || 0);

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

  return (
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
          loading={loading}
          onClick={updateFeature}
        >
          {loading ? "Updating..." : "Edit Feature"}
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="Name">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Item>
        <Form.Item label="Details">
          <Input
            placeholder="Details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
          />
        </Form.Item>
        <Form.Item label="Price">
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

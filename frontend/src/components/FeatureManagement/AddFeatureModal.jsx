import React, { useState } from "react";
import {
  Button,
  Input,
  Form,
  Modal,
} from "antd";
import axiosInstance from "../../helpers/axiosInstance";

const AddFeatureModal = ({ isOpened, handleOk, handleCancel }) => {
  const [loading, setLoading] = useState("");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState(0);

  const addFeature = async () => {
    setLoading(true);

    try {
      await axiosInstance.post("/addFeature", {
        name,
        price,
        details,
      });
    } catch (error) {
      console.log("Error adding supplier:", error);
    }
    setLoading(false);
    handleOk();
  };

  return (
    <Modal
      title="Add New Feature"
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
          onClick={addFeature}
        >
          {loading ? "Adding..." : "Add Feature"}
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

export default AddFeatureModal;
import React, { useState } from "react";
import { Button, Input, Form, Modal } from "antd";
import axiosInstance from "../../helpers/axiosInstance";
import useLocalStorage from "../../utils/useLocalStorage";

const AddSupplierModal = ({ isOpened, handleOk, handleCancel }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [ventureId] = useLocalStorage("selectedVenture", null);

  const addSupplier = async () => {
    setLoading(true);

    try {
      const data = await axiosInstance.post("/addSupplier", {
        company_name: companyName,
        name: name,
        contact_email: email,
        phone_number: phoneNumber,
        address: address,
        venture_id: ventureId,
      });
    } catch (error) {
      console.log("Error adding supplier:", error);
    }

    handleOk();
    setLoading(false);
  };

  return (
    <Modal
      title="Add New Supplier"
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
          onClick={addSupplier}
        >
          {loading ? "Adding..." : "Add Supplier"}
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="Name">
          <Input
            placeholder="John T"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Item>
        <Form.Item label="Company Name">
          <Input
            placeholder="Mulberry Homes"
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </Form.Item>
        <Form.Item label="Phone Number">
          <Input
            placeholder="09999999999"
            type="tel"
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </Form.Item>
        <Form.Item label="Contact Email">
          <Input
            type="email"
            placeholder="abc@domain.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Item>
        <Form.Item label="Address">
          <Input
            placeholder="Jarrom st, Leicester"
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddSupplierModal;

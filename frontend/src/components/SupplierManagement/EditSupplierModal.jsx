import React, { useState } from "react";
import { Button, Input, Form, Modal } from "antd";
import axiosInstance from "../../helpers/axiosInstance";

const EditSupplierModal = ({ isOpened, supplier, handleOk, handleCancel }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(supplier.name);
  const [companyName, setCompanyName] = useState(supplier.company_name);
  const [phoneNumber, setPhoneNumber] = useState(supplier.phone_number);
  const [address, setAddress] = useState(supplier.address);
  const [email, setEmail] = useState(supplier.email);

  const updateSupplier = async () => {
    setLoading(true);

    try {
      await axiosInstance.post("/updateSupplier", {
        company_name: companyName,
        name: name,
        contact_email: email,
        phone_number: phoneNumber,
        address: address,
        supplier_id: supplier.supplier_id,
      });
    } catch (error) {
      console.log("Error adding supplier:", error);
    }

    handleOk();
    setLoading(false);
  };

  return (
    <Modal
      title="Edit Supplier"
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
          onClick={updateSupplier}
        >
          {loading ? "Updating..." : "Edit Supplier"}
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="Name">
          <Input
            placeholder="John T"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Item>
        <Form.Item label="Company Name">
          <Input
            placeholder="Mulberry Homes"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </Form.Item>
        <Form.Item label="Phone Number">
          <Input
            placeholder="09999999999"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </Form.Item>
        <Form.Item label="Contact Email">
          <Input
            type="email"
            placeholder="abc@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Item>
        <Form.Item label="Address">
          <Input
            placeholder="Jarrom st, Leicester"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditSupplierModal;

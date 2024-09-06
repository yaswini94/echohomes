import { useState } from "react";
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

  // Function to generate a random password
  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8); // Simple random password generator
  };

  // Function to add supplier
  const addSupplier = async () => {
    setLoading(true);
    const tempPassword = generateRandomPassword();

    try {
      const data = await axiosInstance.post("/invite/supplier", {
        company_name: companyName,
        password: tempPassword,
        name: name,
        email: email,
        phone_number: phoneNumber,
        address: address,
        venture_id: ventureId,
      });
      console.log("email invite sent:", data.data);
    } catch (error) {
      console.log("Error adding supplier:", error);
    }

    handleOk();
    setLoading(false);
  };

  const [form] = Form.useForm();

  return (
    // Modal template from ant design to create view
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
          onClick={() => form.submit()}
        >
          {loading ? "Adding..." : "Add Supplier"}
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form} onFinish={addSupplier}>
        {/* Form item for the supplier name */}
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the supplier's name",
            },
          ]}
        >
          <Input
            placeholder="John T"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Item>
        {/* Form item for the company name */}
        <Form.Item label="Company Name" name="companyName">
          <Input
            placeholder="Mulberry Homes"
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </Form.Item>
        {/* Form item for the phone number */}
        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            {
              required: true,
              message: "Please input the phone number",
            },
          ]}
        >
          <Input
            placeholder="09999999999"
            type="tel"
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </Form.Item>
        {/* Form item for the contact email */}
        <Form.Item
          label="Contact Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input the email",
            },
          ]}
        >
          <Input
            type="email"
            placeholder="abc@domain.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Item>
        {/* Form item for the address */}
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

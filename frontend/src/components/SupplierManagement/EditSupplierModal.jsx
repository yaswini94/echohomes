import { useState } from "react";
import { Button, Input, Form, Modal } from "antd";
import axiosInstance from "../../helpers/axiosInstance";

const EditSupplierModal = ({ isOpened, supplier, handleOk, handleCancel }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(supplier.name);
  const [companyName, setCompanyName] = useState(supplier.company_name);
  const [phoneNumber, setPhoneNumber] = useState(supplier.phone_number);
  const [address, setAddress] = useState(supplier.address);
  const [email, setEmail] = useState(supplier.email);

  // Function to update the supplier
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

  const [form] = Form.useForm();

  return (
    // Modal template from ant design for view
    <Modal
      title="Edit Supplier"
      open={isOpened}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button
          key="back"
          onClick={handleCancel}
          data-testid="cancelEditSupplierButton"
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
          data-testid="editSupplierButton"
        >
          {loading ? "Updating..." : "Edit Supplier"}
        </Button>,
      ]}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          name: supplier.name,
          companyName: supplier.company_name,
          phoneNumber: supplier.phone_number,
          email: supplier.contact_email,
          address: supplier.address,
        }}
        onFinish={updateSupplier}
      >
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Item>
        {/* Form item for the company name */}
        <Form.Item label="Company Name" name="companyName">
          <Input
            placeholder="Mulberry Homes"
            value={companyName}
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
            value={phoneNumber}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Item>
        {/* Form item for the address */}
        <Form.Item label="Address" name="address">
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

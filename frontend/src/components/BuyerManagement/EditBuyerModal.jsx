import { useState } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../helpers/axiosInstance";
import { Space, Button, Input, Form, Modal, Dropdown, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";

const EditBuyerModal = ({ isOpened, buyer, handleOk, handleCancel }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(buyer.contact_email);
  const [name, setName] = useState(buyer.name);
  const [phoneNumber, setPhoneNumber] = useState(buyer.phone_number);
  const [address, setAddress] = useState(buyer.address);
  const [houseType, setHouseType] = useState(buyer.house_type);

  const { t: translate } = useTranslation();

  const items = [
    {
      key: "1",
      label: translate("1bed"),
    },
    {
      key: "2",
      label: translate("2bed"),
    },
    {
      key: "3",
      label: translate("3bed"),
    },
  ];

  // To update housetype when user updates it
  const onHouseTypeChange = (value) => {
    const selectedItem = items.find((item) => item.key === value.key);
    form.setFieldsValue({ houseType: value.key });
    setHouseType(selectedItem ? selectedItem.key : null);
  };

  const editBuyer = async () => {
    setLoading(true);

    try {
      // Triggers updateBuyer API with payload
      await axiosInstance.post("/updateBuyer", {
        contact_email: email,
        name,
        address,
        phone_number: phoneNumber,
        house_type: houseType,
        buyer_id: buyer.buyer_id,
      });
    } catch (error) {
      console.log("Error updating buyer:", error);
    }

    setLoading(false);
    handleOk();
  };

  const [form] = Form.useForm();

  return (
    // Modal template from the Ant design components to edit buyer
    <Modal
      title="Edit Buyer"
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
          {loading ? "Updating..." : "Edit Buyer"}
        </Button>,
      ]}
    >
      {/* Form template from the Ant design components to update details */}
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          email: buyer.contact_email,
          name: buyer.name,
          phoneNumber: buyer.phone_number,
          address: buyer.address,
          houseType: buyer.house_type,
        }}
        onFinish={editBuyer}
      >
        {/* Form item for the buyer name */}
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please input the buyer's name!" },
          ]}
        >
          <Input
            placeholder="John T"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
              message: "Please input the buyer's phone number!",
            },
            { pattern: /^\d{10,11}$/, message: "0-9(10 to 11 digits)" },
          ]}
        >
          <Input
            type="tel"
            placeholder="09999999999"
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
            { type: "email", message: "The input is not valid E-mail!" },
            { required: true, message: "Please input the buyer's email!" },
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
        {/* Form item for the house type */}
        <Form.Item
          label="House Type"
          name="houseType"
          rules={[{ required: true, message: "Please select the house type!" }]}
        >
          <Dropdown
            menu={{
              items,
              selectable: true,
              onClick: onHouseTypeChange,
            }}
          >
            <Typography.Link
              style={{
                width: "100%",
                height: "32px",
                padding: "4px 11px",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                color: "rgba(0, 0, 0, 0.85)",
                lineHeight: "1.5715",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                {houseType ? (
                  <Space>{houseType}</Space>
                ) : (
                  <Space>Select House Type</Space>
                )}
              </div>
              <div>
                <DownOutlined />
              </div>
            </Typography.Link>
          </Dropdown>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditBuyerModal;

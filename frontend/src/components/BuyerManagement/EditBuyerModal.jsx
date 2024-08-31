import React, { useState } from "react";
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

  const items = [
    {
      key: "1",
      label: "1 bed",
    },
    {
      key: "2",
      label: "2 bed",
    },
    {
      key: "3",
      label: "3 bed",
    },
  ];

  // To update housetype when user updates it
  const onHouseTypeChange = (value) => {
    const selectedItem = items.find((item) => item.key === value.key);
    setHouseType(selectedItem ? selectedItem.label : null);
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
          onClick={editBuyer}
        >
          {loading ? "Updating..." : "Edit Buyer"}
        </Button>,
      ]}
    >
      {/* Form template from the Ant design components to update details */}
      <Form layout="vertical">
        {/* Form item for the buyer name */}
        <Form.Item label="Name">
          <Input
            placeholder="John T"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Item>
        {/* Form item for the phone number */}
        <Form.Item label="Phone Number">
          <Input
            type="tel"
            placeholder="09999999999"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </Form.Item>
        {/* Form item for the contact email */}
        <Form.Item label="Contact Email">
          <Input
            type="email"
            placeholder="abc@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Item>
        {/* Form item for the address */}
        <Form.Item label="Address">
          <Input
            placeholder="Jarrom st, Leicester"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </Form.Item>
        {/* Form item for the house type */}
        <Form.Item label="House Type">
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

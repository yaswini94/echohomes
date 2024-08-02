import React, { useState } from "react";
import axiosInstance from "../../helpers/axiosInstance";
import { Space, Button, Input, Form, Modal, Dropdown, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";
import useLocalStorage from "../../utils/useLocalStorage";

const AddBuyerModal = ({ isOpened, handleOk, handleCancel }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [houseType, setHouseType] = useState("");
  const [ventureId] = useLocalStorage("selectedVenture", null);

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

  const onHouseTypeChange = (value) => {
    const selectedItem = items.find((item) => item.key === value.key);
    setHouseType(selectedItem ? selectedItem.label : null);
  };

  // Function to generate a random password
  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8); // Simple random password generator
  };

  async function inviteBuyer() {
    setLoading(true);
    const tempPassword = generateRandomPassword();

    try {
      const resp = await axiosInstance.post("http://localhost:3001/invite", {
        email,
        password: tempPassword,
        name,
        address,
        phone_number: phoneNumber,
        house_type: houseType,
        venture_id: ventureId,
      });
      console.log("email invite sent:", resp.data);
    } catch (error) {
      console.error(
        "Error inviting user:",
        error.response ? error.response.data : error.message
      );
    }
    setLoading(false);
    handleOk();
  }

  return (
    <Modal
      title="Add New Buyer"
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
          onClick={inviteBuyer}
        >
          {loading ? "Adding..." : "Add Buyer"}
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
        <Form.Item label="Phone Number">
          <Input
            type="tel"
            placeholder="09999999999"
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

export default AddBuyerModal;

import React, { useState, useEffect } from "react";
import axiosInstance from "../helpers/axiosInstance";
// import nodemailer from 'nodemailer';
import { supabase } from "../supabase";
import {
  Space,
  Table,
  Row,
  Col,
  Button,
  Avatar,
  Input,
  Form,
  Modal,
  Dropdown,
  Typography,
} from "antd";
import { PlusOutlined, DownOutlined } from "@ant-design/icons";
import deleteIcon from "../assets/delete.png";

function BuyerInvite({ builderId }) {
  const [buyers, setBuyers] = useState([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [houseType, setHouseType] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const items = [
    {
      key: "1",
      label: "2 bed",
      // trigger: method(),
    },
    {
      key: "2",
      label: "3 bed",
    },
    {
      key: "3",
      label: "4 bed",
    },
  ];
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    inviteBuyer();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      // render: (text) => <a>{`/ventures/${venture.venture_id}`}</a>,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Contact Email",
      dataIndex: "contact_email",
      key: "contact_email",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "House Type",
      dataIndex: "house_type",
      key: "house_type",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a>
            <Avatar
              src={deleteIcon}
              style={{ height: "18px", width: "18px" }}
              onClick={() => deleteBuyer(record?.buyer_id)}
            />
          </a>
        </Space>
      ),
    },
  ];

  // Function to generate a random password
  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8); // Simple random password generator
  };

  async function inviteBuyer() {
    const tempPassword = generateRandomPassword();
    try {
      const resp = await axiosInstance.post("http://localhost:3001/invite", {
        email,
        password: tempPassword,
        name,
        address,
        phone_number: phoneNumber,
        house_type: houseType,
      });
      console.log("email invite sent:", resp.data);
      fetchBuyers();
    } catch (error) {
      console.error(
        "Error inviting user:",
        error.response ? error.response.data : error.message
      );
    }
  }

  const deleteBuyer = async (id) => {
    if (id) {
      const { data, error } = await supabase
        .from("buyers")
        .delete()
        .match({ buyer_id: id });

      if (error) {
        console.error("Error deleting buyer:", error);
        return { error };
      }

      fetchBuyers();
    }
  };

  // Function to load Buyers from Supabase
  const fetchBuyers = async () => {
    try {
      const response = await axiosInstance.get("/buyers");
      setBuyers(response.data);
    } catch (error) {
      console.log("Error fetching buyers:", error);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  return (
    <div>
      <Row justify="space-between" align="middle">
        <Col>
          <h3>Buyer Management</h3>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Add
          </Button>
        </Col>
      </Row>

      <div>
        <Modal
          title="Add New Buyer"
          open={isModalVisible}
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
              onClick={handleOk}
            >
              {loading ? "Adding..." : "Add Buyer"}
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="Name">
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Phone Number">
              <Input
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Contact Email">
              <Input
                placeholder="Contact Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Address">
              <Input
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="House Type">
              <Dropdown
                menu={{
                  items,
                  selectable: true,
                  // defaultSelectedKeys: [''],
                }}
              >
                <Typography.Link>
                  <Space>
                    House type
                    <DownOutlined />
                  </Space>
                </Typography.Link>
              </Dropdown>
              {/* <Input
                placeholder="House type"
                value={houseType}
                onChange={e => setHouseType(e.target.value)}
              /> */}
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <div>
        {buyers.length === 0 && <p>No Buyer exist !</p>}
        {buyers.length > 0 && <Table columns={columns} dataSource={buyers} />}
      </div>
    </div>
  );
}

export default BuyerInvite;

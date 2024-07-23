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
import editIcon from "../assets/edit.png";

function BuyerInvite() {
  const [buyers, setBuyers] = useState([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [houseType, setHouseType] = useState("");
  const [buyerId, setBuyerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
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
    setAddress("");
    setName("");
    setPhoneNumber("");
    setEmail("");
    setHouseType("");
    setBuyerId("");
    setIsModalVisible(true);
  };

  const handleOk = () => {
    inviteBuyer();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const showEditModal = () => {
    setIsEditModalVisible(true);
  };

  const handleEditOk = () => {
    editBuyer();
    setIsEditModalVisible(false);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  const onHouseTypeChange = (value) => {
    const selectedItem = items.find(item => item.key === value.key);
    setHouseType(selectedItem ? selectedItem.label : null);
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
              src={editIcon}
              style={{ height: "18px", width: "18px" }}
              onClick={() => {
                setAddress(record?.address);
                setName(record?.name);
                setBuyerId(record?.buyer_id);
                setPhoneNumber(record?.phone_number);
                setEmail(record?.contact_email);
                setHouseType(record?.house_type);
                showEditModal();
              }}
            />
          </a>
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

  const editBuyer = async () => {
    setLoading(true);

    try {
      const data = await axiosInstance.post("/updateBuyer", {
        contact_email: email,
        name,
        address,
        phone_number: phoneNumber,
        house_type: houseType,
        buyer_id: buyerId
      });
      setAddress("");
      setName("");
      setPhoneNumber("");
      setEmail("");
      setHouseType("");
      setBuyerId("");
      fetchBuyers();
    } catch (error) {
      console.log("Error updating buyer:", error);
    }
    setLoading(false);
  };
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
                  onClick: onHouseTypeChange
                }}
              >
                <Typography.Link style={{
                  width: '100%',
                  height: '32px',
                  padding: '4px 11px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  color: 'rgba(0, 0, 0, 0.85)',
                  lineHeight: '1.5715',
                  display: 'flex', 
                  justifyContent: 'space-between'
                  }}
                >
                  <div>
                    {houseType ? (
                      <Space>
                        {houseType}
                      </Space>
                      ) : (<Space>
                        Select House Type
                      </Space>
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
        <Modal
          title="Edit Buyer"
          open={isEditModalVisible}
          onOk={handleEditOk}
          onCancel={handleEditCancel}
          footer={[
            <Button key="back" onClick={handleEditCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={handleEditOk}
            >
              {loading ? "Updating..." : "Edit Buyer"}
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
                  onClick: onHouseTypeChange
                }}
              >
                <Typography.Link style={{
                  width: '100%',
                  height: '32px',
                  padding: '4px 11px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  color: 'rgba(0, 0, 0, 0.85)',
                  lineHeight: '1.5715',
                  display: 'flex', 
                  justifyContent: 'space-between'
                  }}
                >
                  <div>
                    {houseType ? (
                      <Space>
                        {houseType}
                      </Space>
                      ) : (<Space>
                        Select House Type
                      </Space>
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
      </div>
      <div>
        {buyers.length === 0 && <p>No Buyer exist !</p>}
        {buyers.length > 0 && <Table columns={columns} dataSource={buyers} />}
      </div>
    </div>
  );
}

export default BuyerInvite;

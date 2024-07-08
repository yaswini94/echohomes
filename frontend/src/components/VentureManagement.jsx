import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { useAuth } from "../auth/useAuth";
import { Space, Table, Row, Col, Button, Avatar, Input, Form, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import deleteIcon from "../assets/delete.png";

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    // render: (text) => <a>{`/venture/${venture.venture_id}`}</a>,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        {/* <a>Invite {record?.name}</a> */}
        <a><Avatar src={deleteIcon} style={{ height: '18px', width: '18px' }} /></a>
      </Space>
    ),
  }
];

function VentureManagement() {
  const [ventures, setVentures] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    addVenture();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Function to load ventures from Supabase
  const fetchVentures = async () => {
    const { data, error } = await supabase.from("ventures").select("*");
    if (error) {
      console.log("Error fetching ventures:", error);
    } else {
      setVentures(data);
    }
  };

  // Function to add a new venture
  const addVenture = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("ventures").insert([
      {
        builder_id: user.id,
        name: name,
        address: address,
        description: description,
      },
    ]);
    if (error) {
      console.log("Error adding venture:", error);
    } else {
      fetchVentures();
      setVentures([...ventures, data]);
      setName("");
      setAddress("");
      setDescription("");
    }
    setLoading(false);
  };

  // Fetch ventures on component mount
  useEffect(() => {
    fetchVentures();
  }, []);

  return (
    <div>
      <Row justify="space-between" align="middle">
        <Col>
          <h3>Venture Management</h3>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Add
          </Button>
        </Col>
      </Row>
      <Modal
        title="Add New Venture"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            {loading ? "Adding..." : "Add Venture"}
          </Button>,
        ]}
      >
        <Form>
          <Form.Item>
            <Input
              placeholder="Venture Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Input.TextArea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
      
      <div>
        {/* <h3>Existing Ventures</h3> */}
        {ventures.length === 0 && <p>No ventures exist !</p>}
        {ventures.length > 0 && (
        <Table onRow={(record, rowIndex) => {return { onClick: (event) => {useNavigate(`/venture/${record.venture_id}`)} }}} columns={columns} dataSource={ventures} />)}
        {/* <ul>
          {ventures.map((venture, index) => (
            <li key={venture.venture_id}>
              <Link to={`/venture/${venture.venture_id}`}>
                <strong>{venture.venture_name}</strong> - {venture.location}{" "}
                <br />
                <em>{venture.description}</em>
              </Link>
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
}

export default VentureManagement;

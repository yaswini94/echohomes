import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import { Space, Table, Row, Col, Button, Avatar, Input, Form, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import deleteIcon from "../assets/delete.png";

function SupplierManagement() {
  const [suppliers, setSuppliers] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    addSupplier();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      // render: (text) => <a>{`/venture/${venture.venture_id}`}</a>,
    },
    {
      title: 'Company Name',
      dataIndex: 'company_name',
      key: 'company_name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Contact Email',
      dataIndex: 'contact_email',
      key: 'contact_email',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a><Avatar src={deleteIcon} style={{ height: '18px', width: '18px' }} onClick={() => deleteSupplier(record?.supplier_id)}/></a>
        </Space>
      ),
    }
  ];

  const deleteSupplier = async (id) => {
    if(id) {
      const { data, error } = await supabase
        .from("suppliers")
        .delete()
        .match({ supplier_id: id });
  
      if (error) {
        console.error("Error deleting supplier:", error);
        return { error };
      }
  
      fetchSuppliers();
    }
  }
  
  // Function to load suppliers from Supabase
  const fetchSuppliers = async () => {
    const { data, error } = await supabase.from("suppliers").select("*");
    if (error) {
      console.log("Error fetching suppliers:", error);
    } else {
      setSuppliers(data);
    }
  };

  // Function to add a new supplier
  const addSupplier = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("suppliers").insert([
      {
        company_name: companyName,
        name: name,
        contact_email: email,
        phone_number: phoneNumber,
        address: address,
        registered_date: new Date().toISOString()
      },
    ]);
    if (error) {
      console.log("Error adding supplier:", error);
    } else {
      fetchSuppliers();
      setSuppliers([...suppliers, data]);
      setName("");
      setPhoneNumber("");
      setAddress("");
      setEmail("");
      setCompanyName("");
    }
    setLoading(false);
  };

  // Fetch ventures on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <div>
      <Row justify="space-between" align="middle">
        <Col>
          <h3>Supplier Management</h3>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Add
          </Button>
        </Col>
      </Row>

      <div>
        <Modal
          title="Add New Supplier"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
              {loading ? "Adding..." : "Add Supplier"}
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="Name">
              <Input
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Company Name">
              <Input
                placeholder="Company Name"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Phone Number">
              <Input
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Contact Email">
              <Input
                placeholder="Contact Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Address">
              <Input
                placeholder="Address"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <div>
        {suppliers.length === 0 && <p>No suppliers exist !</p>}
        {suppliers.length > 0 && (
        <Table columns={columns} dataSource={suppliers} />)}
      </div>
    </div>
  );
}

export default SupplierManagement;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import { Space, Table, Row, Col, Button, Avatar, Input, Form, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import deleteIcon from "../assets/delete.png";
import editIcon from "../assets/edit.png";
import axiosInstance from "../helpers/axiosInstance";

function SupplierManagement() {
  const [suppliers, setSuppliers] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [initialFormData, setInitialFormData] = useState();

  const showModal = () => {
    setName("");
    setPhoneNumber("");
    setAddress("");
    setEmail("");
    setCompanyName("");
    setIsModalVisible(true);
  };

  const handleOk = () => {
    addSupplier();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const showEditModal = (supplier) => {
    setInitialFormData(supplier);
    setIsEditModalVisible(true);
  };

  const handleEditOk = () => {
    updateSupplier();
    setIsEditModalVisible(false);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
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
        (record?.venture_id) ? 
          <Space size="middle">
            <a>
              <Avatar
                src={editIcon}
                style={{ height: "18px", width: "18px" }}
                onClick={() => {
                  setAddress(record?.address);
                  setName(record?.name);
                  setSupplierId(record?.supplier_id);
                  setPhoneNumber(record?.phone_number);
                  setEmail(record?.contact_email);
                  setCompanyName(record?.company_name);
                  showEditModal(record);
                }}
              />
            </a>
            <a><Avatar src={deleteIcon} style={{ height: '18px', width: '18px' }} onClick={() => deleteSupplier(record?.supplier_id)}/></a>
          </Space>
        : 
          <p>-</p>
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
    const ventureId = localStorage.getItem("selectedVenture");

    try {
      const data = await axiosInstance.post("/addSupplier", {
        company_name: companyName,
        name: name,
        contact_email: email,
        phone_number: phoneNumber,
        address: address,
        venture_id: ventureId
      });
      fetchSuppliers();
    } catch (error) {
      console.log("Error adding supplier:", error);
    }
    setLoading(false);
  };

  // Function to update  supplier
  const updateSupplier = async () => {
    setLoading(true);

    try {
      const data = await axiosInstance.post("/updateSupplier", {
        company_name: companyName,
        name: name,
        contact_email: email,
        phone_number: phoneNumber,
        address: address,
        supplier_id: supplierId
      });
      fetchSuppliers();
      setName("");
      setPhoneNumber("");
      setAddress("");
      setEmail("");
      setCompanyName("");
      setSupplierId("");
    } catch (error) {
      console.log("Error adding supplier:", error);
    }
    setLoading(false);
  };

  // Fetch suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
    const hasChanges = () => {
      if (
        name !== initialFormData?.name ||
        companyName !== initialFormData?.company_name ||
        address !== initialFormData?.address ||
        phoneNumber !== initialFormData?.phone_number ||
        email !== initialFormData?.contact_email
      ) {
        return true;
      }
      return false;
    };
    setIsChanged(hasChanges());
  }, [name, companyName, email, phoneNumber, address]);

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
                placeholder="John T"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </Form.Item>
            <Form.Item label="Company Name">
              <Input
                placeholder="Mulberry Homes"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                required
              />
            </Form.Item>
            <Form.Item label="Phone Number">
              <Input
                placeholder="09999999999"
                type="tel"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                required
              />
            </Form.Item>
            <Form.Item label="Contact Email">
              <Input
                type="email"
                placeholder="abc@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </Form.Item>
            <Form.Item label="Address">
              <Input
                placeholder="Jarrom st, Leicester"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
              />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Edit Supplier"
          open={isEditModalVisible}
          onOk={handleEditOk}
          onCancel={handleEditCancel}
          footer={[
            <Button key="back" onClick={handleEditCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={handleEditOk} disabled={!isChanged}>
              {loading ? "Updating..." : "Edit Supplier"}
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="Name">
              <Input
                placeholder="John T"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </Form.Item>
            <Form.Item label="Company Name">
              <Input
                placeholder="Mulberry Homes"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                required
              />
            </Form.Item>
            <Form.Item label="Phone Number">
              <Input
                placeholder="09999999999"
                type="tel"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                required
              />
            </Form.Item>
            <Form.Item label="Contact Email">
              <Input
                type="email"
                placeholder="abc@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </Form.Item>
            <Form.Item label="Address">
              <Input
                placeholder="Jarrom st, Leicester"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
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

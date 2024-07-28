import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import deleteIcon from "../../assets/delete.png";
import editIcon from "../../assets/edit.png";
import AddSupplierModal from "./AddSupplierModal";
import EditSupplierModal from "./EditSupplierModal";

function SupplierManagement() {
  const [suppliers, setSuppliers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // add supplier
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    fetchSuppliers();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // edit modal
  const showEditModal = (supplier) => {
    console.log("edit modal");
    setSelectedSupplier(supplier);
    setIsEditModalVisible(true);
  };

  const handleEditOk = () => {
    fetchSuppliers();
    setIsEditModalVisible(false);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      // render: (text) => <a>{`/venture/${venture.venture_id}`}</a>,
    },
    {
      title: "Company Name",
      dataIndex: "company_name",
      key: "company_name",
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
      title: "Action",
      key: "action",
      render: (_, record) =>
        record?.venture_id ? (
          <Space size="middle">
            <a>
              <Avatar
                src={editIcon}
                style={{ height: "18px", width: "18px" }}
                onClick={() => {
                  showEditModal(record);
                }}
              />
            </a>
            <a>
              <Avatar
                src={deleteIcon}
                style={{ height: "18px", width: "18px" }}
                onClick={() => deleteSupplier(record?.supplier_id)}
              />
            </a>
          </Space>
        ) : (
          <p>-</p>
        ),
    },
  ];

  const deleteSupplier = async (id) => {
    if (id) {
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
  };

  // Function to load suppliers from Supabase
  const fetchSuppliers = async () => {
    const { data, error } = await supabase.from("suppliers").select("*");
    if (error) {
      console.log("Error fetching suppliers:", error);
    } else {
      setSuppliers(data);
    }
  };

  // Fetch suppliers on component mount
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
        {isModalVisible && (
          <AddSupplierModal
            isOpened={isModalVisible}
            handleOk={handleOk}
            handleCancel={handleCancel}
          />
        )}
        {isEditModalVisible && (
          <EditSupplierModal
            supplier={selectedSupplier}
            isOpened={isEditModalVisible}
            handleOk={handleEditOk}
            handleCancel={handleEditCancel}
          />
        )}
      </div>
      <div>
        {suppliers.length === 0 && <p>No suppliers exist !</p>}
        {suppliers.length > 0 && (
          <Table columns={columns} dataSource={suppliers} />
        )}
      </div>
    </div>
  );
}

export default SupplierManagement;

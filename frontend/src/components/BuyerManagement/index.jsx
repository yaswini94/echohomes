import React, { useState, useEffect } from "react";
import axiosInstance from "../../helpers/axiosInstance";
import { supabase } from "../../supabase";
import { Space, Table, Row, Col, Button, Avatar } from "antd";
import { Link } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import deleteIcon from "../../assets/delete.png";
import editIcon from "../../assets/edit.png";
import AddBuyerModal from "./AddBuyerModal";
import EditBuyerModal from "./EditBuyerModal";

function BuyerInvite() {
  const [buyers, setBuyers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

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

  // add modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    fetchBuyers();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // edit modal
  const showEditModal = (buyer) => {
    setSelectedBuyer(buyer);
    setIsEditModalVisible(true);
  };

  const handleEditOk = () => {
    fetchBuyers();
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
      render: (_, record) => (
        <Link to={`/buyerDetails/${record?.buyer_id}`}>{record?.name}</Link>
        // <a >{`/buyerDetails/${record?.buyer_id}`}</a>
      ),
      // render: (text) => <a>{`/buyerDetails/${buyer_id}`}</a>,
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
                showEditModal(record);
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
    // const ventureId = localStorage.getItem("selectedVenture");

    try {
      // const response = await axiosInstance.get(`/buyers/${ventureId}`);
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
        {isModalVisible && (
          <AddBuyerModal
            isOpened={isModalVisible}
            handleOk={handleOk}
            handleCancel={handleCancel}
          />
        )}
        {isEditModalVisible && (
          <EditBuyerModal
            isOpened={isEditModalVisible}
            buyer={selectedBuyer}
            handleOk={handleEditOk}
            handleCancel={handleEditCancel}
          />
        )}
      </div>
      <div>
        {buyers.length === 0 && <p>No Buyer exist !</p>}
        {buyers.length > 0 && <Table columns={columns} dataSource={buyers} />}
      </div>
    </div>
  );
}

export default BuyerInvite;

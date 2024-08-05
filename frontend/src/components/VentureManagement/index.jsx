import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../helpers/axiosInstance";
import { supabase } from "../../supabase";
import {
  Row,
  Col,
  Button,
  Avatar,
  Card,
  message
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import deleteIcon from "../../assets/delete.png";
import editIcon from "../../assets/edit.png";
import AddVentureModal from "./AddVentureModal";
import EditVentureModal from "./EditVentureModal";

function VentureManagement() {
  const [ventures, setVentures] = useState([]);
  const [selectedVenture, setSelectedVenture] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [messageApi, messageHolder] = message.useMessage();

  // add modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    messageApi.open({
      type: 'success',
      content: 'Venture Created',
    });
    fetchVentures();
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // edit modal
  const showEditModal = (venture) => {
    setSelectedVenture(venture);
    setIsEditModalVisible(true);
  };

  const handleEditOk = () => {
    messageApi.open({
      type: 'success',
      content: 'Venture Updated',
    });
    fetchVentures();
    setSelectedVenture(null);
    setIsEditModalVisible(false);
  };

  const handleEditCancel = () => {
    setSelectedVenture(null);
    setIsEditModalVisible(false);
  };

  const deleteVenture = async (id) => {
    if (!id) {
      return;
    }

    const { data, error } = await supabase
      .from("ventures")
      .delete()
      .match({ venture_id: id });

    messageApi.open({
      type: 'success',
      content: 'Venture Deleted',
    });
    if (error) {
      messageApi.open({
        type: 'error',
        content: 'Error deleting venture',
      });
      console.error("Error deleting venture:", error);
      return { error };
    }

    fetchVentures();
  };

  // Function to load ventures from Supabase
  const fetchVentures = async () => {
    try {
      const response = await axiosInstance.get("/ventures");
      setVentures(response.data);
    } catch (error) {
      console.log("Error fetching ventures:", error);
    }
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
      <div>
        {isModalVisible && (
          <AddVentureModal
            isOpened={isModalVisible}
            handleOk={handleOk}
            handleCancel={handleCancel}
          />
        )}
        {isEditModalVisible && (
          <EditVentureModal
            isOpened={isEditModalVisible}
            venture={selectedVenture}
            handleOk={handleEditOk}
            handleCancel={handleEditCancel}
          />
        )}
      </div>
      <div>
        {ventures.length === 0 && <p>No ventures exist !</p>}
        {ventures.length > 0 && (
          <Row gutter={16}>
            {ventures.map((venture, index) => (
              <Col key={venture.venture_id} span={8}>
                <Card
                  title={
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Link to={`/ventures/${venture?.venture_id}`}>
                          <strong>{venture?.name}</strong> - {venture?.address}
                        </Link>
                      </Col>
                      <Col>
                        <a style={{ marginRight: "6px" }}>
                          <Avatar
                            src={editIcon}
                            style={{ height: "18px", width: "18px" }}
                            onClick={() => {
                              showEditModal(venture);
                            }}
                          />
                        </a>
                        <a>
                          <Avatar
                            src={deleteIcon}
                            style={{ height: "18px", width: "18px" }}
                            onClick={() => deleteVenture(venture?.venture_id)}
                          />
                        </a>
                      </Col>
                    </Row>
                  }
                  style={{ border: "1px solid black", margin: "8px 0" }}
                  bordered={false}
                >
                  <p>
                    <b>Description: </b>
                    {venture?.description}
                  </p>
                  <p>
                    <b>Properties: </b>
                  </p>
                  {venture?.properties?.map((property) => (
                    <p key={property.key}>
                      {property.label} - {property.value}
                    </p>
                  ))}
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
      {messageHolder}
    </div>
  );
}

export default VentureManagement;

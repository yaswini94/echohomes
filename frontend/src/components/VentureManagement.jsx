import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../helpers/axiosInstance";
import { supabase } from "../supabase";
import { Row, Col, Button, Avatar, Input, Form, Modal, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import deleteIcon from "../assets/delete.png";
import editIcon from "../assets/edit.png";

function VentureManagement() {
  const [ventures, setVentures] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [ventureId, setVentureId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
    address: "",
    description: "",
    ventureId: ""
  });

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    addVenture();
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setName("");
    setAddress("");
    setDescription("");
    setVentureId("");
    setIsModalVisible(false);
  };

  const showEditModal = () => {
    setIsEditModalVisible(true);
  };

  const handleEditOk = () => {
    editVenture();
    setIsEditModalVisible(false);
  };

  const handleEditCancel = () => {
    setName("");
    setAddress("");
    setDescription("");
    setVentureId("");
    setIsEditModalVisible(false);
  };

  const deleteVenture = async (id) => {
    if (id) {
      const { data, error } = await supabase
        .from("ventures")
        .delete()
        .match({ venture_id: id });

      if (error) {
        console.error("Error deleting venture:", error);
        return { error };
      }

      fetchVentures();
    }
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

  // Function to add a new venture
  const addVenture = async () => {
    setLoading(true);

    try {
      const data = await axiosInstance.post("/addVenture", {
        name,
        address,
        description,
      });
      // setName("");
      // setAddress("");
      // setDescription("");
      fetchVentures();
    } catch (error) {
      console.log("Error adding venture:", error);
    }
    setLoading(false);
  };

  const editVenture = async () => {
    setLoading(true);

    try {
      const data = await axiosInstance.post("/UpdateVenture", {
        name,
        address,
        description,
        ventureId
      });

      setName("");
      setAddress("");
      setDescription("");
      setVentureId("");
      fetchVentures();
    } catch (error) {
      console.log("Error updaing venture:", error);
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
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            {loading ? "Adding..." : "Add Venture"}
          </Button>,
        ]}
      >
        <Form layout="vertical" initialValues={initialValues}>
          <Form.Item label="Name" name="name">
            <Input
              placeholder="Venture Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Edit Venture"
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
            {loading ? "Updating..." : "Edit Venture"}
          </Button>,
        ]}
      >
        <Form layout="vertical" initialValues={initialValues}>
          <Form.Item label="Name" name="name">
            <Input
              placeholder="Venture Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
      <div>
        {ventures.length === 0 && <p>No ventures exist !</p>}
        {ventures.length > 0 && (
          <Row gutter={16}>
            {ventures.map((venture, index) => (
              <Col span={8}>
                <Card
                  title={
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Link to={`/ventures/${venture?.venture_id}`}>
                          <strong>{venture?.name}</strong> - {venture?.address}
                        </Link>
                      </Col>
                      <Col>
                        <a>
                          <Avatar
                            src={editIcon}
                            style={{ height: "18px", width: "18px" }}
                            onClick={() => {
                              showEditModal();
                              setAddress(venture?.address);
                              setName(venture?.name);
                              setDescription(venture?.description);
                              setVentureId(venture?.venture_id);
                              setInitialValues({
                                name: venture?.name || "",
                                address: venture?.address || "",
                                description: venture?.description || "",
                                ventureId: venture?.venture_id || ""
                              });
                            }}
                          />
                        </a>
                        {/* <a><Avatar src={editIcon} style={{ height: '18px', width: '18px', paddingRight: '16px' }} onClick={() => editVenture(venture?.venture_id)}/></a> */}
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
                  style={{ border: "1px solid black" }}
                  bordered={false}
                >
                  <p>{venture?.description}</p>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default VentureManagement;

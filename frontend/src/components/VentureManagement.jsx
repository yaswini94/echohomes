import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../helpers/axiosInstance";
import { supabase } from "../supabase";
import {
  Row,
  Col,
  Button,
  Avatar,
  Input,
  Form,
  Modal,
  Card,
  Select,
  InputNumber,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import deleteIcon from "../assets/delete.png";
import editIcon from "../assets/edit.png";

function VentureManagement() {
  const [ventures, setVentures] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [properties, setProperties] = useState([
    { key: 1, type: "1 Bed", value: 0 },
    { key: 2, type: "2 Bed", value: 0 },
    { key: 3, type: "3 Bed", value: 0 },
  ]);
  const [editProperties, setEditProperties] = useState([
    { key: 1, type: "1 Bed", value: 0 },
    { key: 2, type: "2 Bed", value: 0 },
    { key: 3, type: "3 Bed", value: 0 },
  ]);
  const [ventureId, setVentureId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
    address: "",
    description: "",
    properties: [
      { key: 1, type: "1 Bed", value: 0 },
      { key: 2, type: "2 Bed", value: 0 },
      { key: 3, type: "3 Bed", value: 0 },
    ],
    ventureId: "",
  });

  const handleTypeChange = (value, index) => {
    const newProperties = [...properties];
    newProperties[index].type = value;
    setProperties(newProperties);
  };

  const handleValueChange = (value, index) => {
    const newProperties = [...initialValues.properties];
    newProperties[index].value = value;
    setProperties(newProperties);
  };

  const showModal = () => {
    setName("");
    setAddress("");
    setDescription("");
    setProperties([
      { key: 1, type: "1 Bed", value: 0 },
      { key: 2, type: "2 Bed", value: 0 },
      { key: 3, type: "3 Bed", value: 0 },
    ]);
    setVentureId("");
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
    setProperties([
      { key: 1, type: "1 Bed", value: 0 },
      { key: 2, type: "2 Bed", value: 0 },
      { key: 3, type: "3 Bed", value: 0 },
    ]);
    setVentureId("");
    setIsModalVisible(false);
  };

  const showEditModal = (venture) => {
    setInitialValues({
      name: venture?.name || "",
      address: venture?.address || "",
      description: venture?.description || "",
      ventureId: venture?.venture_id || "",
      properties: venture?.properties || [
        { key: 1, type: "1 Bed", value: 0 },
        { key: 2, type: "2 Bed", value: 0 },
        { key: 3, type: "3 Bed", value: 0 },
      ],
    });
    setEditProperties(venture?.properties);
    setAddress(venture?.address);
    setName(venture?.name);
    setDescription(venture?.description);
    setVentureId(venture?.venture_id);
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
    setProperties([
      { key: 1, type: "1 Bed", value: 0 },
      { key: 2, type: "2 Bed", value: 0 },
      { key: 3, type: "3 Bed", value: 0 },
    ]);
    setVentureId("");
    setIsEditModalVisible(false);
    // setInitialValues
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
        properties,
      });
      fetchVentures();
      setName("");
      setAddress("");
      setDescription("");
      setProperties([
        { key: 1, type: "1 Bed", value: 0 },
        { key: 2, type: "2 Bed", value: 0 },
        { key: 3, type: "3 Bed", value: 0 },
      ]);
      setVentureId("");
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
        properties,
        ventureId,
      });

      setName("");
      setAddress("");
      setDescription("");
      setProperties([
        { key: 1, type: "1 Bed", value: 0 },
        { key: 2, type: "2 Bed", value: 0 },
        { key: 3, type: "3 Bed", value: 0 },
      ]);
      setVentureId("");
      fetchVentures();
      setIsEditModalVisible(false);
    } catch (error) {
      console.log("Error updaing venture:", error);
      setIsEditModalVisible(false);
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
              required
            />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Item>
          {/* <Form.Item label="Properties" name="properties">
            <Select
              value={properties}
              style={{ width: 120 }}
              onChange={onSelectVenture}
              options={ventures}
            />
          </Form.Item> */}
          <p>Select Properties</p>
          {properties?.map((property, index) => (
            <Form.Item name="properties" key={property.key}>
              <Select
                style={{ width: 120, marginRight: 8 }}
                value={property.type}
                onChange={(value) => handleTypeChange(value, index)}
              >
                <Option value="1 Bed">1 Bed</Option>
                <Option value="2 Bed">2 Bed</Option>
                <Option value="3 Bed">3 Bed</Option>
              </Select>
              <InputNumber
                min={0}
                value={property.value}
                onChange={(value) => handleValueChange(value, index)}
              />
            </Form.Item>
          ))}
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
              required
            />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Item>
          <p>Select Properties</p>
          {editProperties?.map((property, index) => (
            <Form.Item name="properties" key={property.key}>
              <Select
                style={{ width: 120, marginRight: 8 }}
                value={property.type}
                onChange={(value) => handleTypeChange(value, index)}
              >
                <Option value="1 Bed">1 Bed</Option>
                <Option value="2 Bed">2 Bed</Option>
                <Option value="3 Bed">3 Bed</Option>
              </Select>
              <InputNumber
                min={0}
                value={property.value}
                onChange={(value) => handleValueChange(value, index)}
              />
            </Form.Item>
          ))}
        </Form>
      </Modal>
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
                  style={{ border: "1px solid black" }}
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
                      {property.type} - {property.value}
                    </p>
                  ))}
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

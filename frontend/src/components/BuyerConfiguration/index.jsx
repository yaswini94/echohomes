import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabase";
import { Space, Table, Row, Col, Button, Avatar, Input, Form, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axiosInstance from "../../helpers/axiosInstance";
import { useAuth } from "../../auth/useAuth";

function BuyerConfiguration() {
  const [choices, setChoices] = useState([]);
  const [extras, setExtras] = useState([]);
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState();
  const [buyerInfo, setBuyerInfo] = useState({});
  const { user } = useAuth();

  const fetchBuyerInfo = async() => {
    try {
      const response = await axiosInstance.get(`/buyers/${user?.id}`);
      setBuyerInfo(response.data);
    } catch(error) {
      console.log("Error fetching Buyer Info", error);
    }
  };

  useEffect(() => {
    fetchBuyerInfo();
  }, [user]);

  return (
    <div>
      <h3>Choices Configuration</h3>
      <p><b>{buyerInfo?.house_type}</b></p>
      <Row justify="space-between" align="middle">
        <Col>
        <p><b>Choices</b></p>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={console.log()}>
            Add
          </Button>
        </Col>
      </Row>
      <div>
        {choices.length === 0 && <p>No Choices exist !</p>}
        {choices.length > 0 && (
        <Table columns={choicesColumns} dataSource={choices} />)}
      </div>
      <Row justify="space-between" align="middle">
        <Col>
        <p><b>Extras</b></p>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={console.log()}>
            Add
          </Button>
        </Col>
      </Row>
      <div>
        {extras.length === 0 && <p>No Extras exist !</p>}
        {extras.length > 0 && (
        <Table columns={extrasColumns} dataSource={extras} />)}
      </div>
    </div>
  );
}
export default BuyerConfiguration;

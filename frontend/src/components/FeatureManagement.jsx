import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import { Space, Table, Row, Col, Button, Avatar, Input, Form, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import deleteIcon from "../assets/delete.png";
import editIcon from "../assets/edit.png";
import axiosInstance from "../helpers/axiosInstance";

function FeatureManagement() {
  const [choices, setChoices] = useState([]);
  const [extras, setExtras] = useState([]);
  const [visible, setVisible] = useState(false);
  const [scaleStep, setScaleStep] = useState(0.5);

  const choicesColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      // render: (text) => <a>{`/venture/${venture.venture_id}`}</a>,
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text) => <img src={text} alt="image" style={{ width: 50, height: 50 }} />,
      // render: (_, record) => {
      //   <Space size="middle">
      //     <Button type="primary" onClick={() => setVisible(true)}>
      //       show image preview
      //     </Button>
      //     <Image
      //       width={200}
      //       style={{ display: 'none' }}
      //       src={record?.Image}
      //       preview={{
      //         visible,
      //         scaleStep,
      //         src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      //         onVisibleChange: (value) => {
      //           setVisible(value);
      //         },
      //       }}
      //     />
      //   </Space>
      // }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>
            <Avatar
              src={editIcon}
              style={{ height: "18px", width: "18px" }}
              // onClick={() => {
                // setAddress(record?.address);
                // setName(record?.name);
                // setSupplierId(record?.supplier_id);
                // setPhoneNumber(record?.phone_number);
                // setEmail(record?.contact_email);
                // setCompanyName(record?.company_name);
                // showEditModal();
              // }}
            />
          </a>
          <a><Avatar src={deleteIcon} style={{ height: '18px', width: '18px' }} /></a>
        </Space>
      ),
    }
  ];
  const extrasColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      // render: (text) => <a>{`/venture/${venture.venture_id}`}</a>,
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (_, record) => (
        // <space size="middle">
          <p>£ {record?.price}</p>
        // </space>
      )
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text) => <img src={text} alt="image" style={{ width: 50, height: 50 }} />,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>
            <Avatar
              src={editIcon}
              style={{ height: "18px", width: "18px" }}
              // onClick={() => {
                // setAddress(record?.address);
                // setName(record?.name);
                // setSupplierId(record?.supplier_id);
                // setPhoneNumber(record?.phone_number);
                // setEmail(record?.contact_email);
                // setCompanyName(record?.company_name);
                // showEditModal();
              // }}
            />
          </a>
          <a><Avatar src={deleteIcon} style={{ height: '18px', width: '18px' }} /></a>
        </Space>
      ),
    }
  ];
  // Fetch features on component mount
  useEffect(() => {
    setChoices([
      {name: 'Carpet', feature_type: 'choice', details: 'extra text', image: '../assets/edit.png'}, 
      {name: 'Washbasin', feature_type: 'choice', details: 'new text', image: '../assets/edit.png'},
      {name: 'Low Quality Carpet', feature_type: 'choice', details: 'new text', image: '../assets/edit.png'}
    ]);
    setExtras([
      {name: 'Boiler', feature_type: 'extras', price: 500, details: 'some text', image: '../assets/edit.png'},
      {name: 'Curtains', feature_type: 'extras', price: 20, details: 'extra text', image: '../assets/edit.png'}, 
      {name: 'High Quality Carpet', feature_type: 'extras', price: 100, details: 'new text', image: '../assets/edit.png'}
    ]);
  }, []);
  return (
    <div>
      <h3>Feature Management</h3>
      <p><b>2 Bed</b></p>
      <Row justify="space-between" align="middle">
        <Col>
        <h4>Choices</h4>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />}>
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
        <h4>Extras</h4>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />}>
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
export default FeatureManagement;
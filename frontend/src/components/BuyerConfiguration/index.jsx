import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabase";
import { Space, Table, Row, Col, Button, Avatar, Input, Form, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axiosInstance from "../../helpers/axiosInstance";
import { useAuth } from "../../auth/useAuth";
import AddChoicesModal from "./ChoicesConfiguration/AddChoicesModal";
import EditChoicesModal from "./ChoicesConfiguration/EditChoicesModal";
import AddExtrasModal from "./ExtrasConfiguration/AddExtrasModal";
import EditExtrasModal from "./ExtrasConfiguration/EditExtrasModal";

function BuyerConfiguration() {
  const [choices, setChoices] = useState([{name: 'hi', price: 0, details: 'djssd'}]);
  const [extras, setExtras] = useState([{name: 'hi', price: 10, details: 'djssd', quantity: 2}]);
  const [buyerInfo, setBuyerInfo] = useState({});
  const [isChoiceModalVisible, setIsChoiceModalVisible] = useState(false);
  const [isEditChoiceModalVisible, setIsEditChoiceModalVisible] = useState(false);
  const [isExtrasModalVisible, setIsExtrasModalVisible] = useState(false);
  const [isEditExtrasModalVisible, setIsEditExtrasModalVisible] = useState(false);
  const { user } = useAuth();

  // add Choice
  const showChoiceModal = () => {
    setIsChoiceModalVisible(true);
  };

  const handleChoiceOk = () => {
    // fetchSuppliers();
    setIsChoiceModalVisible(false);
  };

  const handleChoiceCancel = () => {
    setIsChoiceModalVisible(false);
  };

  // edit choice modal
  const showEditChoiceModal = (supplier) => {
    // setSelectedSupplier(supplier);
    setIsEditChoiceModalVisible(true);
  };

  const handleEditChoiceOk = () => {
    // fetchSuppliers();
    setIsEditChoiceModalVisible(false);
  };

  const handleEditChoiceCancel = () => {
    setIsEditChoiceModalVisible(false);
  };

  // add extras
  const showExtrasModal = () => {
    setIsExtrasModalVisible(true);
  };

  const handleExtrasOk = () => {
    // fetchSuppliers();
    setIsExtrasModalVisible(false);
  };

  const handleExtrasCancel = () => {
    setIsExtrasModalVisible(false);
  };

  // edit extras modal
  const showEditExtrasModal = (supplier) => {
    // setSelectedSupplier(supplier);
    setIsEditExtrasModalVisible(true);
  };

  const handleEditExtrasOk = () => {
    // fetchSuppliers();
    setIsEditExtrasModalVisible(false);
  };

  const handleEditExtrasCancel = () => {
    setIsEditExtrasModalVisible(false);
  };

  const choicesColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <a>
    //         <Avatar
    //           src={editIcon}
    //           style={{ height: "18px", width: "18px" }}
    //           onClick={() => {
    //             showEditModal(record);
    //           }}
    //         />
    //       </a>
    //       <a>
    //         <Avatar
    //           src={deleteIcon}
    //           style={{ height: "18px", width: "18px" }}
    //           onClick={() => deleteFeature(record?.feature_id)}
    //         />
    //       </a>
    //     </Space>
    //   ),
    // },
  ];

  const extrasColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <a>
    //         <Avatar
    //           src={editIcon}
    //           style={{ height: "18px", width: "18px" }}
    //           onClick={() => {
    //             showEditModal(record);
    //           }}
    //         />
    //       </a>
    //       <a>
    //         <Avatar
    //           src={deleteIcon}
    //           style={{ height: "18px", width: "18px" }}
    //           onClick={() => deleteFeature(record?.feature_id)}
    //         />
    //       </a>
    //     </Space>
    //   ),
    // },
  ];

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
          <Button type="primary" icon={<PlusOutlined />} onClick={showChoiceModal}>
            Configure
          </Button>
        </Col>
      </Row>
      <div>
        {isChoiceModalVisible && (
          <AddChoicesModal
            isOpened={isChoiceModalVisible}
            handleOk={handleChoiceOk}
            handleCancel={handleChoiceCancel}
          />
        )}
        {isEditChoiceModalVisible && (
          <EditChoicesModal
            // feature={selectedFeature}
            isOpened={isEditChoiceModalVisible}
            handleOk={handleEditChoiceOk}
            handleCancel={handleEditChoiceCancel}
          />
        )}
      </div>
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
          <Button type="primary" icon={<PlusOutlined />} onClick={showExtrasModal}>
            Configure
          </Button>
        </Col>
      </Row>
      <div>
         {isExtrasModalVisible && (
          <AddExtrasModal
            isOpened={isExtrasModalVisible}
            handleOk={handleExtrasOk}
            handleCancel={handleExtrasCancel}
          />
        )}
        {isEditExtrasModalVisible && (
          <EditExtrasModal
            // feature={selectedFeature}
            isOpened={isEditExtrasModalVisible}
            handleOk={handleEditExtrasOk}
            handleCancel={handleEditExtrasCancel}
          />
        )}
      </div>
      <div>
        {extras.length === 0 && <p>No Extras exist !</p>}
        {extras.length > 0 && (
        <Table columns={extrasColumns} dataSource={extras} />)}
      </div>
    </div>
  );
}
export default BuyerConfiguration;

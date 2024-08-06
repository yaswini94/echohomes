import React, { useState, useEffect } from "react";
import axiosInstance from "../../helpers/axiosInstance";
import { supabase } from "../../supabase";
import { Space, Table, Row, Col, Button, Avatar, Tag, message, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import deleteIcon from "../../assets/delete.png";
import editIcon from "../../assets/edit.png";
import AddBuyerModal from "./AddBuyerModal";
import EditBuyerModal from "./EditBuyerModal";
import useLocalStorage from "../../utils/useLocalStorage";

const BuyerManagement = ({ ventureId: ventureIdParam }) => {
  const [buyers, setBuyers] = useState([]);
  // const [features, setFeatures] = useState();
  const [allFeatures, setAllFeatures] = useState(null);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [ventureId] = useLocalStorage("selectedVenture", null);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [messageApi, messageHolder] = message.useMessage();

  // add modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    messageApi.open({
      type: 'success',
      content: 'Buyer Created',
    });
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
    messageApi.open({
      type: 'success',
      content: 'Buyer Updated',
    });
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
      render: (_, record) => record?.house_type + " Bed"
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
    Table.EXPAND_COLUMN
  ];

  const deleteBuyer = async (id) => {
    if (id) {
      const { data, error } = await supabase
        .from("buyers")
        .delete()
        .match({ buyer_id: id });
      messageApi.open({
        type: 'success',
        content: 'Buyer Deleted',
      });
      if (error) {
        messageApi.open({
          type: 'error',
          content: 'Error deleting buyer',
        });
        console.error("Error deleting buyer:", error);
        return { error };
      }

      fetchBuyers();
    }
  };

  // Function to load Buyers from Supabase
  const fetchBuyers = async () => {
    try {
      const response = await axiosInstance.get(
        `/buyers?venture_id=${ventureIdParam || ventureId}`
      );
      if (response?.data?.length > 0) {
        // setFeatures(response.data.features);
        setBuyers(response.data);
      } else {
        console.log("No Buyers found");
        setBuyers([]);
      }
    } catch (error) {
      console.log("Error fetching buyers:", error);
    }
  };

  useEffect(() => {
    fetchBuyers();
    fetchFeatures();
  }, [ventureIdParam, ventureId]);

  const fetchFeatures = async () => {
    try {
      const response = await axiosInstance.get("/features");
      const _featuresMap = response?.data?.reduce((acc, feature) => {
        acc[feature.feature_id] = feature;
        return acc;
      }, {});
      setAllFeatures(_featuresMap);
    } catch (error) {
      console.log("Error fetching features:", error);
    }
  };

  // Custom expand icon function
  const expandIcon = ({ expanded, onExpand, record }) => {
    const isExpanded = expandedRowId === record.buyer_id;
    const canExpand = record.features !== null; // Check if features are not null

    return canExpand && (
      isExpanded ? (
        <span onClick={e => onExpand(record, e)} style={{ cursor: 'pointer', color: 'blue' }}>
          Collapse
        </span>
      ) : (
        <span onClick={e => onExpand(record, e)} style={{ cursor: 'pointer', color: 'blue' }}>
          Expand
        </span>
      )
    );
  };

  // Custom function to handle expand changes
  const handleExpandChange = (expanded, record) => {
    if (expanded) {
      setExpandedRowId(record.buyer_id);
    } else {
      setExpandedRowId(null);
    }
  };

  const expandedRowRender = (record) => {
    const expandColumns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Details', dataIndex: 'details', key: 'details' },
      { title: 'Price', dataIndex: 'latPrice', key: 'latPrice', render: (_, record) => "£ " + record?.latPrice },
      { title: 'Quantity', dataIndex: 'latQuantity', key: 'latQuantity' },
      {
        title: 'Status',
        key: 'state',
        render: (status) => {
          switch (status) {
            case 'inprogress':
              return <Tag color="processing">Inprogress</Tag>;
            case 'done':
              return <Tag color="success">Installed</Tag>;
            default:
              return <Tag color="default">Not Started</Tag>;
          }
        },
        // render: () => <><Tag color="default">Not Started</Tag><Tag color="processing">Inprogress</Tag><Tag color="success">Installed</Tag></>
      },
      {
        title: 'Action',
        key: 'operation',
        render: (record) => (
          <Space size="middle">
            <Tooltip title="Change status">
              {record?.status === null && <a>Inprogress</a>}
              {record?.status === "inprogress" && <a>Done</a>}
              {record?.status === "done" && <p>-</p>}
            </Tooltip>
          </Space>
        ),
      },
    ];

    const choiceArray = Object.entries(record?.features.choices).map(([key, value]) => ({
      key,         
      ...value     
    }));
    const extrasArray = Object.entries(record?.features.extras).map(([key, value]) => ({
      key,         
      ...value     
    }));
    const featuresArray = [...choiceArray, ...extrasArray];
    return <Table columns={expandColumns} dataSource={featuresArray?.map((choice) => {
      console.log({ ...allFeatures[choice.key], key: choice.key, price: choice.price, quantity: choice.quantity, status: choice.status })
      return { ...allFeatures[choice.key], key: choice.key, latPrice: choice.price, latQuantity: choice.quantity, status: choice.status };
    })} pagination={false} />;
  };

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
        {buyers.length > 0 && <Table columns={columns} expandable={{
          expandedRowRender: (record) => expandedRowRender(record),
          rowExpandable: (record) => record.features !== null,
          expandIcon: expandIcon,
          expandedRowKeys: expandedRowId ? [expandedRowId] : [], // Control which row is expanded
          onExpand: handleExpandChange, // Handle expand and collapse actions
        }}
        rowKey="buyer_id"
        dataSource={buyers} />}
      </div>
      {messageHolder}
    </div>
  );
};

export default BuyerManagement;

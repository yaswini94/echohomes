import React, { useState, useEffect } from "react";
import axiosInstance from "../../helpers/axiosInstance";
import { supabase } from "../../supabase";
import {
  Space,
  Table,
  Row,
  Col,
  Button,
  Avatar,
  Tag,
  message,
  Tooltip,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import deleteIcon from "../../assets/delete.png";
import editIcon from "../../assets/edit.png";
import AddBuyerModal from "./AddBuyerModal";
import EditBuyerModal from "./EditBuyerModal";
import useLocalStorage from "../../utils/useLocalStorage";

import { useAuth } from "../../auth/useAuth";
import Chat from "../Chat/Chat";

const BuyerManagement = ({ ventureId: ventureIdParam }) => {
  const [buyers, setBuyers] = useState([]);
  // const [features, setFeatures] = useState();
  const [allFeatures, setAllFeatures] = useState(null);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [ventureId] = useLocalStorage("selectedVenture", null);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [selectedBuyerChat, setSelectedBuyerChat] = useState(null);
  const [messageApi, messageHolder] = message.useMessage();
  const { user } = useAuth();
  const builderId = user?.id;

  // const createChatRoom = async (userIds) => {
  //   try {
  //     const response = await axiosInstance.post("/chat-rooms", {
  //       userIds,
  //     });
  //     const data = response.data;
  //     if (!response.ok) throw new Error(data.error || "Something went wrong");
  //     return data.roomId;
  //   } catch (error) {
  //     console.error("Error creating chat room:", error);
  //     throw error;
  //   }
  // };

  // const startChat = (buyerId) => {
  //   if (!builderId || !buyerId) return;

  //   createChatRoom([builderId, buyerId]).then((roomId) => {
  //     console.log("Chat room created with ID:", roomId);
  //   });
  // };

  // add modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    messageApi.open({
      type: "success",
      content: "Buyer Created",
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
      type: "success",
      content: "Buyer Updated",
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
      render: (_, record) => record?.house_type + " Bed",
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
              onClick={() => record.buyer_id && deleteBuyer(record.buyer_id)}
            />
          </a>
        </Space>
      ),
    },
    {
      title: "",
      dataIndex: "chat",
      key: "chat",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() =>
              record.buyer_id
                ? setSelectedBuyerChat(record)
                : setSelectedBuyerChat(null)
            }
          >
            Chat
          </Button>
        </Space>
      ),
    },
    Table.EXPAND_COLUMN,
  ];

  const deleteBuyer = async (id) => {
    if (id) {
      const { data, error } = await supabase
        .from("buyers")
        .delete()
        .match({ buyer_id: id });
      messageApi.open({
        type: "success",
        content: "Buyer Deleted",
      });
      if (error) {
        messageApi.open({
          type: "error",
          content: "Error deleting buyer",
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

    return (
      canExpand &&
      (isExpanded ? (
        <span
          onClick={(e) => onExpand(record, e)}
          style={{ cursor: "pointer", color: "blue" }}
        >
          Collapse
        </span>
      ) : (
        <span
          onClick={(e) => onExpand(record, e)}
          style={{ cursor: "pointer", color: "blue" }}
        >
          Expand
        </span>
      ))
    );
  };

  const changeStatusHandle = async (status, record) => {
    console.log(record);
    const _updatedfeature = {
      id: record?.key,
      name: record?.name,
      notes: record?.notes,
      price: record?.latPrice,
      status: record?.status,
      quantity: record?.latQuantity,
    };
    // try {
    //   await axiosInstance.post("/updateBuyer", {
    //     status: status,
    //     features: features,
    //     buyer_id: record.buyer_id,
    //   });
    // } catch (error) {
    //   console.log("Error updating buyer:", error);
    // }
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
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Details", dataIndex: "details", key: "details" },
      {
        title: "Unit Price",
        dataIndex: "latPrice",
        key: "latPrice",
        render: (_, record) => "£ " + record?.latPrice,
      },
      { title: "Quantity", dataIndex: "latQuantity", key: "latQuantity" },
      {
        title: "Total",
        dataIndex: "total",
        key: "total",
        render: (_, record) =>
          `£ ${(record?.latQuantity || 0) * (record?.latPrice || 0)}`,
      },
      {
        title: "Notes",
        dataIndex: "notes",
        key: "notes",
        render: (_, record) => {
          return `${record?.notes || "-"}`;
        },
      },
      {
        title: "Status",
        key: "state",
        render: (_, record) => {
          console.log(record?.status);
          switch (record?.status) {
            case "inprogress":
              return <Tag color="processing">Inprogress</Tag>;
            case "done":
              return <Tag color="success">Installed</Tag>;
            default:
              return <Tag color="default">Not Started</Tag>;
          }
        },
      },
      {
        title: "Action",
        key: "operation",
        render: (record) => (
          <Space size="middle">
            <Tooltip title="Change status">
              {record?.status === null && (
                <a onClick={() => changeStatusHandle("inprogress", record)}>
                  Inprogress
                </a>
              )}
              {record?.status === "inprogress" && (
                <a onClick={() => changeStatusHandle("done", record)}>Done</a>
              )}
            </Tooltip>
            {record?.status === "done" && <a>-</a>}
          </Space>
        ),
      },
    ];

    const choiceArray = Object.entries(record?.features.choices).map(
      ([key, value]) => ({
        key,
        ...value,
      })
    );
    const extrasArray = Object.entries(record?.features.extras).map(
      ([key, value]) => ({
        key,
        ...value,
      })
    );
    const featuresArray = [...choiceArray, ...extrasArray];
    return (
      <Table
        columns={expandColumns}
        dataSource={featuresArray?.map((choice) => {
          return {
            ...allFeatures[choice.key],
            key: choice.key,
            latPrice: choice.price,
            latQuantity: choice.quantity,
            status: choice.status,
            notes: choice.notes,
          };
        })}
        pagination={false}
      />
    );
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
        {buyers.length > 0 && (
          <Table
            columns={columns}
            expandable={{
              expandedRowRender: (record) => expandedRowRender(record),
              rowExpandable: (record) => record.features !== null,
              expandIcon: expandIcon,
              expandedRowKeys: expandedRowId ? [expandedRowId] : [], // Control which row is expanded
              onExpand: handleExpandChange, // Handle expand and collapse actions
            }}
            rowKey="buyer_id"
            dataSource={buyers}
          />
        )}
      </div>
      {builderId && selectedBuyerChat ? (
        <div>
          <Chat
            builderId={builderId}
            buyerId={selectedBuyerChat.buyer_id}
            name={selectedBuyerChat.name}
          />
        </div>
      ) : null}
      {messageHolder}
    </div>
  );
};

export default BuyerManagement;

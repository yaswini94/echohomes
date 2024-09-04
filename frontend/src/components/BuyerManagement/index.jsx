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
import { useTranslation } from "react-i18next";
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

  const { t: translate } = useTranslation();

  // To show add modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // To handle ok button in add modal
  const handleOk = () => {
    messageApi.open({
      type: "success",
      content: "Buyer Created",
    });
    fetchBuyers();
    setIsModalVisible(false);
  };

  // To handle cancel button in add modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // To show edit modal
  const showEditModal = (buyer) => {
    setSelectedBuyer(buyer);
    setIsEditModalVisible(true);
  };

  // To handle edit modal ok button
  const handleEditOk = () => {
    messageApi.open({
      type: "success",
      content: "Buyer Updated",
    });
    fetchBuyers();
    setIsEditModalVisible(false);
  };

  // To handle edit modal cancel button
  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  // Columns to display in the buyer management table
  const columns = [
    {
      title: translate("name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: translate("address"),
      dataIndex: "address",
      key: "address",
    },
    {
      title: translate("contactEmail"),
      dataIndex: "contact_email",
      key: "contact_email",
    },
    {
      title: translate("phoneNumber"),
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: translate("houseType"),
      dataIndex: "house_type",
      key: "house_type",
      render: (_, record) => record?.house_type + " Bed",
    },
    {
      title: translate("action"),
      key: "action",
      render: (_, record) => (
        // To diaply action icons edit, delete, expand
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

  // To delete the buyer
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
    if (!ventureId) {
      return;
    }

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

  // To fetch features list
  const fetchFeatures = async () => {
    try {
      const response = await axiosInstance.get(
        `/features?builder_id=${builderId}`
      );
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

  // To handle the status change of buyer configuration list
  const changeStatusHandle = async (status, record) => {
    console.log({ status, record });
    const _selectedBuyer = buyers.find(
      (buyer) => buyer.buyer_id === expandedRowId
    );
    const _features = _selectedBuyer.features;
    const _updatedChoices = {};
    Object.entries(_features.choices).forEach(([key, value]) => {
      if (key === record.feature_id) {
        _updatedChoices[key] = {
          ...value,
          status,
        };
      } else {
        _updatedChoices[key] = value;
      }
    });

    const _updatedExtras = {};
    Object.entries(_features.extras).forEach(([key, value]) => {
      if (key === record.feature_id) {
        _updatedExtras[key] = {
          ...value,
          status,
        };
      } else {
        _updatedExtras[key] = value;
      }
    });

    const _updatedfeatures = {
      choices: _updatedChoices,
      extras: _updatedExtras,
    };

    console.log({ updatedfeatures: _updatedfeatures });

    try {
      await axiosInstance.post("/update-buyer-features", {
        features: _updatedfeatures,
        buyer_id: expandedRowId,
      });

      fetchBuyers();
    } catch (error) {
      console.log("Error updating buyer:", error);
    }
  };

  // Custom function to handle expand changes
  const handleExpandChange = (expanded, record) => {
    if (expanded) {
      setExpandedRowId(record.buyer_id);
    } else {
      setExpandedRowId(null);
    }
  };

  // To render nested table expanded row
  const expandedRowRender = (record) => {
    const expandColumns = [
      { title: translate("name"), dataIndex: "name", key: "name" },
      { title: translate("details"), dataIndex: "details", key: "details" },
      {
        title: translate("unitPrice"),
        dataIndex: "latPrice",
        key: "latPrice",
        render: (_, record) => "£ " + record?.latPrice,
      },
      {
        title: translate("Quantity"),
        dataIndex: "latQuantity",
        key: "latQuantity",
      },
      {
        title: translate("total"),
        dataIndex: "total",
        key: "total",
        render: (_, record) =>
          `£ ${(record?.latQuantity || 0) * (record?.latPrice || 0)}`,
      },
      {
        title: translate("notes"),
        dataIndex: "notes",
        key: "notes",
        render: (_, record) => {
          return `${record?.notes || "-"}`;
        },
      },
      {
        title: translate("status"),
        key: "state",
        render: (_, record) => {
          switch (record?.status) {
            case "inprogress":
              return <Tag color="processing">{translate("inprogress")}</Tag>;
            case "done":
              return <Tag color="success">{translate("installed")}</Tag>;
            default:
              return <Tag color="default">{translate("notStarted")}</Tag>;
          }
        },
      },
      {
        title: translate("action"),
        key: "operation",
        render: (record) => (
          <Space size="middle">
            <Tooltip title="Change status">
              {!record?.status && (
                <Button
                  onClick={() => changeStatusHandle("inprogress", record)}
                >
                  {translate("markInprogress")}
                </Button>
              )}
              {record?.status === "inprogress" && (
                <Button onClick={() => changeStatusHandle("done", record)}>
                  {translate("markDone")}
                </Button>
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
      // Based on Table template from Ant design
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
          <h3>{translate("buyerManagement")}</h3>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showModal}
            disabled={!ventureId}
          >
            {translate("add")}
          </Button>
        </Col>
      </Row>

      <div>
        {/* add modal visible */}
        {isModalVisible && (
          <AddBuyerModal
            isOpened={isModalVisible}
            handleOk={handleOk}
            handleCancel={handleCancel}
          />
        )}
        {/* edit modal visible */}
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
            onClose={() => setSelectedBuyerChat(null)}
          />
        </div>
      ) : null}
      {messageHolder}
    </div>
  );
};

export default BuyerManagement;

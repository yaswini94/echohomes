import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { Space, Table, Row, Col, Button, Avatar, Rate, message } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import deleteIcon from "../../assets/delete.png";
import editIcon from "../../assets/edit.png";
import AddSupplierModal from "./AddSupplierModal";
import EditSupplierModal from "./EditSupplierModal";
import axiosInstance from "../../helpers/axiosInstance";
import useLocalStorage from "../../utils/useLocalStorage";
const describeRate = ["Terrible", "Bad", "Normal", "Good", "Wonderful"];

function SupplierManagement() {
  const [suppliers, setSuppliers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [messageApi, messageHolder] = message.useMessage();

  const [ventureId] = useLocalStorage("selectedVenture");

  const { t: translate } = useTranslation();

  // Function to show add supplier modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Function to handle add supplier
  const handleOk = () => {
    messageApi.open({
      type: "success",
      content: "Supplier Created",
    });
    fetchSuppliers();
    setIsModalVisible(false);
  };

  // Function to handle cancel add supplier
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Function to handle show edit modal
  const showEditModal = (supplier) => {
    setSelectedSupplier(supplier);
    setIsEditModalVisible(true);
  };

  // Function to handle edit modal update button
  const handleEditOk = () => {
    messageApi.open({
      type: "success",
      content: "Supplier Updated",
    });
    fetchSuppliers();
    setIsEditModalVisible(false);
  };

  // Function to handle edit supplier cancel
  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  const columns = [
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("companyName"),
      dataIndex: "company_name",
      key: "company_name",
    },
    {
      title: t("address"),
      dataIndex: "address",
      key: "address",
    },
    {
      title: t("contactEmail"),
      dataIndex: "contact_email",
      key: "contact_email",
    },
    {
      title: t("phoneNumber"),
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: t("action"),
      key: "action",
      render: (_, record) =>
        // Action buttons view for edit and delete the supplier
        record?.venture_id ? (
          <Space size="middle">
            <Rate
              style={{ marginRight: "8px" }}
              tooltips={describeRate}
              onChange={(value) => {
                addFeedback(record?.supplier_id, value);
              }}
              value={record?.feedback}
            />
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
                onClick={() => deleteSupplier(record?.supplier_id)}
              />
            </a>
          </Space>
        ) : (
          <>
            <Rate
              style={{ marginRight: "8px" }}
              tooltips={describeRate}
              onChange={(value) => {
                addFeedback(record?.supplier_id, value);
              }}
              value={record?.feedback}
            />
            <MinusOutlined style={{ marginLeft: "16px" }} />
          </>
        ),
    },
  ];

  // Function to delete the supplier
  const deleteSupplier = async (id) => {
    if (id) {
      const { data, error } = await supabase
        .from("suppliers")
        .delete()
        .match({ supplier_id: id });
      messageApi.open({
        type: "success",
        content: "Supplier Deleted",
      });
      if (error) {
        messageApi.open({
          type: "error",
          content: "Error deleting supplier",
        });
        console.error("Error deleting supplier:", error);
        return { error };
      }

      fetchSuppliers();
    }
  };

  // Function to load suppliers from Supabase
  const fetchSuppliers = async () => {
    const queryParam = ventureId ? `?venture_id=${ventureId}` : "";

    try {
      const response = await axiosInstance.get(`/suppliers${queryParam}`);
      setSuppliers(response.data);
    } catch (error) {
      console.log("Error fetching suppliers:", error);
    }
  };

  // Function to add feedback to the supplier
  const addFeedback = async (id, feedback) => {
    if (!feedback) return;
    try {
      const dbFeedback = await supabase
        .from("suppliers")
        .select("feedback")
        .eq("supplier_id", id)
        .single();
      if (dbFeedback.data.feedback?.length) {
        const updatedFeedback = [...dbFeedback.data.feedback, feedback];
        console.log(updatedFeedback);
        await axiosInstance.post("/updateSupplier", {
          feedback: updatedFeedback,
          supplier_id: id,
        });
      } else {
        await axiosInstance.post("/updateSupplier", {
          feedback: [feedback],
          supplier_id: id,
        });
      }
      fetchSuppliers();
    } catch (error) {
      console.log("Error adding supplier:", error);
    }
  };

  // Fetch suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <div>
      <Row justify="space-between" align="middle">
        <Col>
          <h3>{translate("supplierManagement")}</h3>
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
        {isModalVisible && (
          <AddSupplierModal
            isOpened={isModalVisible}
            handleOk={handleOk}
            handleCancel={handleCancel}
          />
        )}
        {isEditModalVisible && (
          <EditSupplierModal
            supplier={selectedSupplier}
            isOpened={isEditModalVisible}
            handleOk={handleEditOk}
            handleCancel={handleEditCancel}
          />
        )}
      </div>
      <div>
        {suppliers.length === 0 && <p>No suppliers exist !</p>}
        {suppliers.length > 0 && (
          <Table columns={columns} dataSource={suppliers} />
        )}
      </div>
      {messageHolder}
    </div>
  );
}

export default SupplierManagement;

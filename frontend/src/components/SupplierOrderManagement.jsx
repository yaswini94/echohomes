import React, { useEffect, useState } from "react";
import useLocalStorage from "../utils/useLocalStorage";
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
import axiosInstance from "../helpers/axiosInstance";

const SupplierOrderManagement = () => {
  const [supplierOrders, setSupplierOrders] = useState([]);
  const [ventureId] = useLocalStorage("selectedVenture", null);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get(`/supplier-orders`);
      console.log({ supplier: response, response: response.data });
      const _supplierOrders = response.data;
      setSupplierOrders(_supplierOrders);
    } catch (error) {
      console.error("Error fetching supplier orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const orderColumns = [
    { title: "Item Name", dataIndex: "name", key: "name" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (_, record) => "£ " + record?.price,
    },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    {
      title: "Order Status",
      key: "order status",
      render: (_, record) => {
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
            {record?.status === null && <a>Inprogress</a>}
            {record?.status === "inprogress" && <a>Done</a>}
            {record?.status === "done" && <p>-</p>}
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h3>Orders</h3>
      {supplierOrders.length === 0 && <p>No Orders exist !</p>}
      {supplierOrders.length > 0 &&
        supplierOrders.map((order) => (
          <div key={order.po_id}>
            <p>
              Order for <b>{order.venture.name}</b> by Builder{" "}
              {order.venture.builder_id}
            </p>
            <Table columns={orderColumns} dataSource={order.orders_list} />
          </div>
        ))}
    </div>
  );
};

export default SupplierOrderManagement;

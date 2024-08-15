import React, { useEffect, useState } from "react";
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

const BudgetBasedSuggestions = () => {
  const [supplierOrders, setSupplierOrders] = useState([]);
  const [ventureId] = useLocalStorage("selectedVenture", null);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get(
        `/supplier-orders?venture_id=${ventureId}`
      );
      const _supplierOrders = response.data.map((order) => {
        order.supplier = suppliers.find(
          (supplier) => supplier.supplier_id === order.supplier_id
        );
        order.total = order.orders_list.reduce((accumulator, item) => {
          if (item.quantity > 1) {
            return accumulator + (item.price * item.quantity);
          }
          return accumulator;
        }, 0)
        return order;
      });
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
    { title: "Price", dataIndex: "price", key: "price", render: (_, record) => "£ " + record?.price },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
  ];

  return (
    <div>
      <Table
        columns={orderColumns}
        dataSource={supplierOrders}
      />
    </div>
  )
};

export default BudgetBasedSuggestions;
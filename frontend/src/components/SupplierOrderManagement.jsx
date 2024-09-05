import { useEffect, useState } from "react";
import { Button, Space, Table, Tag, Tooltip } from "antd";
import axiosInstance from "../helpers/axiosInstance";
import { useTranslation } from "react-i18next";

const SupplierOrderManagement = () => {
  const [supplierOrders, setSupplierOrders] = useState([]);
  const { t: translate } = useTranslation();

  // Function to handle fetch order
  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get(`/supplier-orders`);
      const _supplierOrders = response.data;
      setSupplierOrders(_supplierOrders);
    } catch (error) {
      console.error("Error fetching supplier orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const changeStatusHandle = async (status, record, order) => {
    try {
      await axiosInstance.post("/update-purchase-order-status", {
        po_id: order.po_id,
        feature_id: record.feature_id,
        status,
      });

      fetchOrders();
    } catch (error) {
      console.log("Error updating order status:", error);
    }
  };

  // Columns to display in supplier orders table
  const orderColumns = (order) => [
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
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Change status">
            {!record?.status && (
              <Button
                onClick={() => changeStatusHandle("inprogress", record, order)}
              >
                {translate("markInprogress")}
              </Button>
            )}
            {record?.status === "inprogress" && (
              <Button onClick={() => changeStatusHandle("done", record, order)}>
                {translate("markDone")}
              </Button>
            )}
          </Tooltip>
          {record?.status === "done" && <a>-</a>}
        </Space>
      ),
    },
  ];

  return (
    // Supplier orders view to render
    <div>
      <h3>Orders</h3>
      {supplierOrders.length === 0 && <p>No Orders exist !</p>}
      {supplierOrders.length > 0 &&
        supplierOrders.map((order) => (
          <div key={order.po_id}>
            <p>
              Order for <b>{order.venture.name}</b> venture
            </p>
            <Table
              columns={orderColumns(order)}
              dataSource={order.orders_list}
            />
          </div>
        ))}
    </div>
  );
};

export default SupplierOrderManagement;

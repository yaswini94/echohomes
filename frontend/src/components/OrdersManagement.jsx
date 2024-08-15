import React, { useEffect, useState } from "react";
import axiosInstance from "../helpers/axiosInstance";
import useLocalStorage from "../utils/useLocalStorage";
import {
  Space,
  Table,
  Row,
  Col,
  Button,
  Avatar,
  Tabs,
  InputNumber,
  Select,
} from "antd";

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [features, setFeatures] = useState({});
  const [ventureId] = useLocalStorage("selectedVenture", null);
  const [quantityMap, setQuantityMap] = useState({});
  const [ordersTableData, setOrdersTableData] = useState([]);
  const [orderSuggestionsTableData, setOrderSuggestionsTableData] = useState(
    []
  );
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [supplierOrders, setSupplierOrders] = useState([]);

  const handleSupplierOrder = async () => {
    const _orders = orderSuggestionsTableData.map((order) => ({
      feature_id: order.feature_id,
      name: order.name,
      price: order.price,
      quantity: quantityMap[order.feature_id],
    }));

    try {
      const response = await axiosInstance.post("/orders", {
        venture_id: ventureId,
        supplier_id: selectedSupplierId,
        orders_list: _orders,
      });
      console.log("Order placed successfully:", response);
      fetchOrders();
      fetchSuppliers();
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const fetchSupplierOrders = async () => {
    try {
      const response = await axiosInstance.get(
        `/supplier-orders?venture_id=${ventureId}`
      );
      const _supplierOrders = response.data.map((order) => {
        order.supplier = suppliers.find(
          (supplier) => supplier.supplier_id === order.supplier_id
        );
        return order;
      });
      setSupplierOrders(_supplierOrders);
    } catch (error) {
      console.error("Error fetching supplier orders:", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axiosInstance.get("/suppliers");
      const _suppliers = response.data;
      _suppliers.sort((a, b) => b.feedback - a.feedback);
      setSuppliers(_suppliers);
    } catch (error) {
      console.log("Error fetching suppliers:", error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
    fetchSupplierOrders();
  }, []);

  useEffect(() => {
    fetchSupplierOrders();
  }, [suppliers]);

  const ordersColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      // dataIndex: "details",
      key: "status",
      render: (_, record) => {
        const _featureId = record.id;
        const _quantity = record.quantity;
        const _availableQuantity = features[_featureId]?.quantity;
        if (_quantity > _availableQuantity) {
          return (
            <Space direction="vertical">
              <p>Create Purchase Order</p>
            </Space>
          );
        }

        if (_quantity <= 5) {
          return (
            <Space direction="vertical">
              <p>Low Stock</p>
            </Space>
          );
        }

        return <Space direction="vertical">In Stock</Space>;
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
  ];

  const orderSuggestionsColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Unit Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record) => {
        console.log({ record });
        return (
          <InputNumber
            type="number"
            value={quantityMap[record.feature_id] || 0}
            min={0}
            onChange={(value) => {
              setQuantityMap({
                ...quantityMap,
                [record.feature_id]: value,
              });
            }}
          />
        );
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (_, record) => (
        <div>
          <p>£ {record.price * (quantityMap[record.feature_id] || 0)}</p>
        </div>
      ),
    },
  ];

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get(
        `/orders?venture_id=${ventureId}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFeatures = async () => {
    try {
      const response = await axiosInstance.get("/features");
      const _featuresMap = response?.data?.reduce((acc, feature) => {
        acc[feature.feature_id] = feature;
        return acc;
      }, {});
      setFeatures(_featuresMap);
    } catch (error) {
      console.log("Error fetching features:", error);
    }
  };

  useEffect(() => {
    fetchFeatures();
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!orders.length) return;

    const _allFeatureOrders = {};

    orders.forEach((order) => {
      const _features = order.features;
      const _choices = _features.choices;
      const _extras = _features.extras;

      Object.keys(_choices).forEach((_choice) => {
        if (!_allFeatureOrders[_choice]) {
          _allFeatureOrders[_choice] = _choices[_choice];
        } else {
          _allFeatureOrders[_choice].quantity += _choices[_choice].quantity;
        }
      });

      Object.keys(_extras).forEach((_extra) => {
        if (!_allFeatureOrders[_extra]) {
          _allFeatureOrders[_extra] = _extras[_extra];
        } else {
          _allFeatureOrders[_extra].quantity += _extras[_extra].quantity;
        }
      });
    });

    setOrdersTableData(Object.values(_allFeatureOrders));
    const _quantityMap = {};

    const _suggestions = Object.values(_allFeatureOrders)
      .filter(
        (order) =>
          order.quantity < 5 || order.quantity > features[order.id].quantity
      )
      .map((order) => {
        _quantityMap[order.id] = 10;
        return features[order.id];
      });

    setQuantityMap(_quantityMap);
    setOrderSuggestionsTableData(_suggestions);
  }, [orders]);

  console.log({ supplierOrders });

  return (
    <div>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: "Buyer Orders",
            key: "1",
            children: (
              <>
                <Row justify="space-between" align="middle">
                  <Col>
                    <h3>Buyer Orders</h3>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      style={{ margin: "6px" }}
                      onClick={() => setShowSuggestions(true)}
                    >
                      <Avatar
                        // src={linkIcon}
                        style={{
                          height: "18px",
                          width: "18px",
                          color: "white",
                        }}
                      />{" "}
                      Suggest Orders
                    </Button>
                  </Col>
                </Row>
                <div>
                  {showSuggestions &&
                    (orderSuggestionsTableData?.length === 0 ? (
                      <p>No order suggestions exist !</p>
                    ) : (
                      <>
                        <Table
                          columns={orderSuggestionsColumns}
                          dataSource={orderSuggestionsTableData}
                        />
                        <Select
                          value={selectedSupplierId}
                          onChange={(value) => setSelectedSupplierId(value)}
                          options={suppliers.map((supplier) => ({
                            label: `${supplier.name} (${supplier.feedback}*)`,
                            value: supplier.supplier_id,
                          }))}
                          style={{
                            width: "auto",
                            minWidth: "160px",
                            marginRight: "24px",
                            color: "white",
                          }}
                        />
                        <Button
                          key="submit"
                          type="primary"
                          // loading={loading}
                          onClick={handleSupplierOrder}
                        >
                          Order from Supplier
                        </Button>
                      </>
                    ))}
                  {ordersTableData?.length === 0 ? (
                    <p>No buyer orders exist !</p>
                  ) : (
                    <Table
                      columns={ordersColumns}
                      dataSource={ordersTableData}
                    />
                  )}
                </div>
              </>
            ),
          },
          {
            label: "Supplier Orders",
            key: "2",
            children: (
              <>
                <div>
                  <h3>Supplier Orders</h3>
                  <Table columns={ordersColumns} dataSource={supplierOrders} />
                </div>
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

export default OrdersManagement;

import React, { useEffect, useState } from "react";
import axiosInstance from "../helpers/axiosInstance";
import useLocalStorage from "../utils/useLocalStorage";
import {
  Space,
  Table,
  Row,
  Col,
  Button,
  Tag,
  Tabs,
  InputNumber,
  Select,
} from "antd";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "../auth/useAuth";
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

const OrdersManagement = () => {
  const { user } = useAuth();
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
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [paymentSession, setPaymentSession] = useState(null);

  // Function to handle builder orders to suppliers
  const handleSupplierOrder = async () => {
    const _orders = orderSuggestionsTableData.map((order) => ({
      feature_id: order.feature_id,
      name: order.name,
      price: order.price,
      quantity: quantityMap[order.feature_id],
    }));

    const _total = _orders.reduce((accumulator, order) => {
      if (order.quantity > 1) {
        return accumulator + order.price * order.quantity;
      }
      return accumulator;
    }, 0);

    try {
      const stripe = await loadStripe(stripePublishableKey);

      const response = await axiosInstance.post(
        "/create-builder-supplier-checkout-session",
        {
          orders: _orders,
          supplier_id: selectedSupplierId,
        }
      );

      const { id } = response.data;

      await axiosInstance.post("/orders", {
        venture_id: ventureId,
        supplier_id: selectedSupplierId,
        orders_list: _orders,
        total: _total,
        stripe_session_id: id,
        builder_id: user?.id,
      });

      const result = await stripe.redirectToCheckout({
        sessionId: id,
      });

      if (result.error) {
        console.log("Error redirecting to checkout:", result.error.message);
      }
    } catch (error) {
      console.log("Error updating buyer:", error);
    }
  };

  // Function to handle fetch supplier orders
  const fetchSupplierOrders = async () => {
    try {
      const response = await axiosInstance.get(`/supplier-orders/${ventureId}`);
      const _supplierOrders = response.data.map((order) => {
        order.supplier = suppliers.find(
          (supplier) => supplier.supplier_id === order.supplier_id
        );
        order.total = order.orders_list.reduce((accumulator, item) => {
          if (item.quantity > 1) {
            return accumulator + item.price * item.quantity;
          }
          return accumulator;
        }, 0);
        return order;
      });
      fetchStripeSession(_supplierOrders);
    } catch (error) {
      console.error("Error fetching supplier orders:", error);
    }
  };

  // Function to handle fetch suppliers
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

  // Function to handle process payment
  const processPayment = async (id) => {
    const stripe = await loadStripe(stripePublishableKey);

    const result = await stripe.redirectToCheckout({
      sessionId: id,
    });

    if (result.error) {
      console.log("Error redirecting to checkout:", result.error.message);
    }
  };

  // Columns to display in buyer orders table
  const ordersColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Stock Status",
      key: "stock status",
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
              <Tag color="error">Low Stock</Tag>
            </Space>
          );
        }

        return <Space direction="vertical">In Stock</Space>;
      },
    },
    {
      title: "Supplier Order Status",
      key: "supplier order status",
      render: (_, record) => {
        if (supplierOrders.length > 0) {
          return <p>Ordered from supplier</p>;
        }

        return <p>Not Ordered</p>;
      },
    },
  ];

  // Columns to display in supplier orders table
  const supplierOrdersColumns = [
    {
      title: "Supplier Name",
      key: "supplier name",
      render: (_, record) => {
        `record?.supplier?.name`;
        return record?.supplier?.name;
      },
    },
    {
      title: "Order Total",
      key: "order total",
      dataIndex: "total",
      render: (_, record) => `£ ${record.total || 0}`,
    },
    {
      title: "Order Status",
      key: "order status",
      render: (_, record) => {
        switch (record?.status) {
          case "preparing":
            return <Tag color="processing">Preparing</Tag>;
          case "intransit":
            return <Tag color="default">In-Transit</Tag>;
          case "delivered":
            return <Tag color="success">Delivered</Tag>
          default:
            return <Tag color="default">Not Started</Tag>;
        }
      },
    },
    {
      title: "Payment Status",
      key: "payment status",
      render: (_, record) => {
        switch (record?.stripe_session?.payment_status) {
          case "paid":
            return <Tag color="success">Paid</Tag>;
          case "unpaid":
            return (
              <div>
                <Tag color="error">Unpaid</Tag>
                <Button
                  type="primary"
                  onClick={() => processPayment(record.stripe_session_id)}
                >
                  Pay Now
                </Button>
              </div>
            );
          default:
            return null;
        }
      },
    },
  ];

  // Columns to display in suggested orders
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
      render: (_, record) => `£ ${record.price || 0}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record) => {
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

  // Function to hanlde fetch orders
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

  // Function to handle fetch features
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

  const fetchStripeSession = async (orders) => {
    // for each order make an api call to /get-stripe-session and add the session to the order and return the orders
    const _orders = await Promise.all(
      orders.map(async (order) => {
        try {
          const response = await axiosInstance.post(`/get-stripe-session`, {
            stripe_session_id: order.stripe_session_id,
          });
          order.stripe_session = response.data;
          return order;
        } catch (error) {
          console.error("Error fetching stripe session:", error);
          return order;
        }
      })
    );

    setSupplierOrders(_orders);
  };

  useEffect(() => {
    fetchFeatures();
    fetchOrders();
  }, []);

  // Function to handle toggle suggestions
  const toggleSuggestions = () => {
    if (showSuggestions) {
      setShowSuggestions(false);
    } else {
      setShowSuggestions(true);
    }
  };

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

  // Function to handle expanded row rendering
  const expandedRowRender = (record) => {
    const expandColumns = [
      { title: "Item Name", dataIndex: "name", key: "name" },
      {
        title: "Unit Price",
        dataIndex: "price",
        key: "price",
        render: (_, record) => "£ " + record?.price,
      },
      { title: "Quantity", dataIndex: "quantity", key: "quantity" },
      {
        title: "Total",
        dataIndex: "total",
        key: "total",
        render: (_, record) => (
          <div>
            <p>£ {record.price * record.quantity}</p>
          </div>
        ),
      },
    ];

    return (
      // Table template from ant design for view
      <Table
        columns={expandColumns}
        dataSource={record?.orders_list}
        pagination={false}
      />
    );
  };

  // Custom function to handle expand changes
  const handleExpandChange = (expanded, record) => {
    if (expanded) {
      setExpandedRowId(record.po_id);
    } else {
      setExpandedRowId(null);
    }
  };

  return (
    <div>
      {/* Tabs template from ant design for the view */}
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: "Buyer Orders",
            key: "1",
            children: (
              <>
                {/* Buyer orders view to render */}
                <Row justify="space-between" align="middle">
                  <Col>
                    <h3>Buyer Orders</h3>
                  </Col>
                  <Col>
                    {supplierOrders.length === 0 &&
                      (showSuggestions ? (
                        <Button type="primary" onClick={toggleSuggestions}>
                          Hide Suggested Orders
                        </Button>
                      ) : (
                        <Button type="primary" onClick={toggleSuggestions}>
                          Show Suggested Orders
                        </Button>
                      ))}
                  </Col>
                </Row>
                <div>
                  {showSuggestions &&
                    (orderSuggestionsTableData?.length === 0 ? (
                      <p>No suggestions exist !</p>
                    ) : (
                      <div
                        style={{
                          border: "1px grey solid",
                          margin: "8px 48px",
                          padding: "8px",
                        }}
                      >
                        <Row justify="space-between" align="middle">
                          <Col>
                            <h3>Suggested Orders</h3>
                          </Col>
                          <Col>
                            <Select
                              value={selectedSupplierId}
                              placeholder="Select a supplier"
                              onChange={(value) => setSelectedSupplierId(value)}
                              options={suppliers.map((supplier) => ({
                                label: `${supplier.name} (${supplier.feedback}*)`,
                                value: supplier.supplier_id,
                              }))}
                              style={{
                                width: "auto",
                                minWidth: "200px",
                                marginRight: "24px",
                                color: "white",
                              }}
                            />
                            <Button
                              key="submit"
                              type="primary"
                              style={{ margin: "6px" }}
                              disabled={!selectedSupplierId}
                              onClick={handleSupplierOrder}
                            >
                              Place Order to supplier
                            </Button>
                          </Col>
                        </Row>
                        <Table
                          columns={orderSuggestionsColumns}
                          dataSource={orderSuggestionsTableData}
                          pagination={false}
                        />
                      </div>
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
                {/* Supplier orders view to render */}
                <div>
                  <h3>Supplier Orders</h3>
                  {supplierOrders.length === 0 && (
                    <p>No Supplier Orders exist !</p>
                  )}
                  {supplierOrders.length > 0 && (
                    <Table
                      columns={supplierOrdersColumns}
                      dataSource={supplierOrders}
                      expandable={{
                        expandedRowRender: (record) =>
                          expandedRowRender(record),
                        rowExpandable: (record) => record.orders_list !== null,
                        expandedRowKeys: expandedRowId ? [expandedRowId] : [], // Control which row is expanded
                        onExpand: handleExpandChange, // Handle expand and collapse actions
                      }}
                      rowKey="po_id"
                    />
                  )}
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

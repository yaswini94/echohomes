import React, { useEffect, useState } from "react";
import axiosInstance from "../helpers/axiosInstance";
import useLocalStorage from "../utils/useLocalStorage";
import { Space, Table, Row, Col, Button, Avatar, Tabs } from "antd";

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [features, setFeatures] = useState({});
  const [ventureId] = useLocalStorage("selectedVenture", null);
  const [ordersTableData, setOrdersTableData] = useState([]);

  const ordersColumns = [
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
      render: (_, record) => "£ " + record?.price,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a>
            <Avatar
              // src={editIcon}
              style={{ height: "18px", width: "18px" }}
              // onClick={() => {
              //   showEditModal(record);
              // }}
            />
            update status
          </a>
        </Space>
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
  }, [orders]);

  console.log({ features, ordersTableData });

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
                      // onClick={showLinkModal}
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
                  {/* {Object.keys(features).length === 0 && ( */}
                    <p>No buyer orders exist !</p>
                  {/* )} */}
                  {/* {Object.keys(features).length > 0 && ( */}
                    <Table
                      columns={ordersColumns}
                      dataSource={Object.values(features)}
                    />
                  {/* )} */}
                </div>
              </>
            ),
          },
          {
            label: "Supplier Orders",
            key: "2",
            // disabled: !Boolean(linkedFeatures.length),
            children: (
              <>
                <div>
                  <h3>Supplier Orders</h3>
                  <Table columns={ordersColumns} dataSource={orders} />
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

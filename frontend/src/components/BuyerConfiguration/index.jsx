import React, { useState, useEffect } from "react";
import { Row, Col, Table, Space, Button } from "antd";
import axiosInstance from "../../helpers/axiosInstance";
import { useAuth } from "../../auth/useAuth";

const BuyerConfiguration = () => {
  const { user } = useAuth();
  const [buyer, setBuyer] = useState(null);
  const [venture, setVenture] = useState(null);
  const [features, setFeatures] = useState(null);
  const [configuration, setConfiguration] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <Button>Add</Button>
    //     </Space>
    //   ),
    // },
  ];

  useEffect(() => {
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

    fetchFeatures();
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const fetchBuyer = async () => {
      try {
        const response = await axiosInstance.get(`/buyers/${user.id}`);
        setBuyer(response.data);
      } catch (error) {
        console.log("Error fetching ventures:", error);
      }
    };

    fetchBuyer();
  }, [user.id]);

  useEffect(() => {
    if (!buyer?.buyer_id) return;

    const fetchVenture = async () => {
      try {
        const response = await axiosInstance.get(
          `/ventures/${buyer.venture_id}`
        );
        const _venture = response.data;
        setVenture(_venture);
        const _configuration = (_venture?.properties || []).filter(
          (property) => property.key === buyer.house_type
        );
        setConfiguration(_configuration[0]);
      } catch (error) {
        console.log("Error fetching ventures:", error);
      }
    };

    fetchVenture();
  }, [buyer?.buyer_id]);

  return (
    <div>
      <p>Venture Name: {venture?.name}</p>
      <p>House Type: {buyer?.house_type} Bed</p>
      {features && configuration && (
        <>
          <Row>
            <Col span={24}>
              <h3>Choices</h3>
              {/* {configuration?.choices?.map((choice) => {
                const feature = features[choice];
                return (
                  <div key={feature.feature_id}>
                    <p>{feature.name}</p>
                  </div>
                );
              })} */}
              {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
              <Table rowSelection={rowSelection} columns={columns} dataSource={configuration?.choices?.map((choice) => { console.log(features[choice]); return features[choice]})} />
              {/* <Table columns={columns} dataSource={configuration?.choices?.map((choice) => { return features[choice]})} /> */}
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <h3>Extras</h3>
              {/* {configuration?.extras?.map((extra) => {
                const feature = features[extra];
                return (
                  <div key={feature.feature_id}>
                    <p>{feature.name}</p>
                  </div>
                );
              })} */}
              {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
              <Table rowSelection={rowSelection} columns={columns} dataSource={configuration?.extras?.map((extra) => { console.log(features[extra]); return features[extra]})} />
              {/* <Table columns={columns} dataSource={configuration?.extra?.map((extra) => { return features[extra]})} /> */}
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default BuyerConfiguration;

import React, { useState, useEffect } from "react";
import { Row, Col, Table, Button, InputNumber } from "antd";
import axiosInstance from "../../helpers/axiosInstance";
import { useAuth } from "../../auth/useAuth";

const BuyerConfiguration = () => {
  const { user } = useAuth();
  const [buyer, setBuyer] = useState(null);
  const [venture, setVenture] = useState(null);
  const [allFeatures, setAllFeatures] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState(null);
  const [configuration, setConfiguration] = useState(null);
  const [selectedChoices, setSelectedChoices] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [quantityMap, setQuantityMap] = useState({});

  const onSelectChoiceChange = (newSelectedRowKeys) => {
    setSelectedChoices(newSelectedRowKeys);
  };

  const onSelectExtrasChange = (newSelectedRowKeys) => {
    setSelectedExtras(newSelectedRowKeys);
  };

  const rowChoiceSelection = {
    selectedRowKeys: selectedChoices,
    onChange: onSelectChoiceChange,
    getCheckboxProps: (record) => ({
      // Disable the checkbox if the selection count is 3 and the item is not selected
      disabled:
        Boolean(selectedFeatures) ||
        (selectedChoices.length >= 3 && !selectedChoices.includes(record.key)),
    }),
    hideSelectAll: true,
  };

  const rowExtrasSelection = {
    selectedRowKeys: selectedExtras,
    onChange: onSelectExtrasChange,
    getCheckboxProps: () => ({
      disabled: Boolean(selectedFeatures),
    }),
    hideSelectAll: Boolean(selectedFeatures),
  };

  const choicesColumns = [
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
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (_, record) => 
        <div>
          <p>£ {record.price} (inclusive)</p> 
        </div>
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
  ];

  const extrasColumns = [
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
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (_, record) => 
        <div>
          <p>£ {record.price}</p> 
        </div>
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record) => {
        return (
          <InputNumber
            type="number"
            disabled={Boolean(selectedFeatures)}
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
  ];

  useEffect(() => {
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

    fetchFeatures();
  }, []);

  const fetchBuyer = async () => {
    try {
      const response = await axiosInstance.get(`/buyers/${user.id}`);
      const data = response.data;
      setBuyer(data);
      const _features = data?.features || null;
      setSelectedFeatures(_features);

      if (Object.keys(_features || {})?.length === 0) return;

      const _selectedChoices = Object.keys(_features?.choices || {});
      const _selectedExtras = Object.keys(_features?.extras || {});

      setSelectedChoices(_selectedChoices);
      setSelectedExtras(_selectedExtras);

      const _qtyMapExtras = Object.keys(_features?.extras || {}).reduce(
        (acc, extra) => {
          acc[extra] = _features?.extras[extra].quantity;
          return acc;
        },
        {}
      );

      const _qtyMapChoices = Object.keys(_features?.choices || {}).reduce(
        (acc, choice) => {
          acc[choice] = _features?.choices[choice].quantity;
          return acc;
        },
        {}
      );

      setQuantityMap({
        ..._qtyMapExtras,
        ..._qtyMapChoices,
      });
    } catch (error) {
      console.log("Error fetching ventures:", error);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

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

  const handleConfirmOrder = async () => {
    const selections = {
      choices: {},
      extras: {},
    };

    selections.choices = selectedChoices.reduce((acc, choice) => {
      acc[choice] = {
        price: 0,
        quantity: 1,
        status: null
      };

      return acc;
    }, {});

    selections.extras = selectedExtras.reduce((acc, extra) => {
      acc[extra] = {
        price: allFeatures[extra].price,
        quantity: quantityMap[extra] || 1,
        status: null
      };

      return acc;
    }, {});
    try {
      await axiosInstance.post("/updateBuyer", {
        features: selections,
        buyer_id: user?.id,
      });

      fetchBuyer();
    } catch (error) {
      console.log("Error updating buyer:", error);
    }
  };

  return (
    <div>
      <Row justify="space-between" align="middle">
        <Col>
          <p><b>Venture Name: </b>{venture?.name}</p>
          <p><b>House Type: </b>{buyer?.house_type} Bed</p>
        </Col>
        <Col>
          <Button type="primary" disabled={!selectedChoices?.length && !selectedExtras?.length} onClick={handleConfirmOrder}>Confirm Order</Button>
        </Col>
      </Row>
      
      {allFeatures && configuration && (
        <>
          <Row>
            <Col span={24}>
              <h3>Choices</h3>
              {selectedChoices?.length > 0
                ? <p>Selected {selectedChoices.length} choices</p>
                : null}
              <Table
                rowSelection={rowChoiceSelection}
                columns={choicesColumns}
                dataSource={configuration?.choices?.map((choice) => {
                  return { ...allFeatures[choice], key: choice, quantity: 1, status: null };
                })}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <h3>Extras</h3>
              {selectedExtras?.length > 0
                ? <p>Selected {selectedExtras.length} extras</p>
                : null}
              <Table
                rowSelection={rowExtrasSelection}
                columns={extrasColumns}
                dataSource={configuration?.extras?.map((extra) => {
                  return { ...allFeatures[extra], key: extra, quantity: 0, status: null };
                })}
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default BuyerConfiguration;

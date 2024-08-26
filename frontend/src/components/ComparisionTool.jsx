import React, { useState, useEffect } from "react";
import { Row, Col, Table, InputNumber } from "antd";
import axiosInstance from "../helpers/axiosInstance";
import { useAuth } from "../auth/useAuth";

const ComparisionTool = () => {
  const { user } = useAuth();
  const [buyer, setBuyer] = useState(null);
  const [venture, setVenture] = useState(null);
  const [allFeatures, setAllFeatures] = useState(null);
  // const [selectedFeatures, setSelectedFeatures] = useState(null);
  const [configuration, setConfiguration] = useState(null);
  const [selectedChoices, setSelectedChoices] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [quantityMap, setQuantityMap] = useState({});
  const [selectedChoices1, setSelectedChoices1] = useState([]);
  const [selectedExtras1, setSelectedExtras1] = useState([]);
  const [quantityMap1, setQuantityMap1] = useState({});

  const onSelectChoiceChange = (newSelectedRowKeys) => {
    setSelectedChoices(newSelectedRowKeys);
  };

  const onSelectExtrasChange = (newSelectedRowKeys) => {
    setSelectedExtras(newSelectedRowKeys);
    const _newQty = {};
    newSelectedRowKeys.forEach((extra) => {
      _newQty[`extras_${extra}`] = quantityMap[`extras_${extra}`] || 1;
    });
    setQuantityMap(_newQty);
  };

  const rowChoiceSelection = {
    selectedRowKeys: selectedChoices,
    onChange: onSelectChoiceChange,
    getCheckboxProps: (record) => ({
      // Disable the checkbox if the selection count is 3 and the item is not selected
      disabled:
        (selectedChoices.length >= 3 && !selectedChoices.includes(record.key)),
    }),
    hideSelectAll: true,
  };

  const rowExtrasSelection = {
    selectedRowKeys: selectedExtras,
    onChange: onSelectExtrasChange,
  };

  const onSelectChoiceChange1 = (newSelectedRowKeys) => {
    setSelectedChoices1(newSelectedRowKeys);
  };

  const onSelectExtrasChange1 = (newSelectedRowKeys) => {
    setSelectedExtras1(newSelectedRowKeys);
    const _newQty = {};
    newSelectedRowKeys.forEach((extra) => {
      _newQty[`extras_${extra}`] = quantityMap1[`extras_${extra}`] || 1;
    });
    setQuantityMap1(_newQty);
  };

  const rowChoiceSelection1 = {
    selectedRowKeys: selectedChoices1,
    onChange: onSelectChoiceChange1,
    getCheckboxProps: (record) => ({
      // Disable the checkbox if the selection count is 3 and the item is not selected
      disabled:
        (selectedChoices1.length >= 3 && !selectedChoices1.includes(record.key)),
    }),
    hideSelectAll: true,
  };

  const rowExtrasSelection1 = {
    selectedRowKeys: selectedExtras1,
    onChange: onSelectExtrasChange1,
  };

  const extrasColumns1 = [
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
      title: "Unit Price",
      dataIndex: "price",
      key: "price",
      render: (_, record) => (
        <div>
          <p>£ {record.price}</p>
        </div>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record) => {
        return (
          (selectedExtras1.includes(record.key)) ? (
            <InputNumber
              type="number"
              disabled={
                !selectedExtras1.includes(record.key)
              }
              value={quantityMap1[`extras_${record.feature_id}`] || 0}
              min={0}
              onChange={(value) => {
                setQuantityMap1({
                  ...quantityMap1,
                  [`extras_${record.feature_id}`]: value,
                });
              }}
              required={selectedExtras1.includes(record.key)}
            />
          ) : `${quantityMap1[`extras_${record.feature_id}`] || 0}`
        );
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (_, record) => (
        <div>
          <p>
            £ {record.price * (quantityMap1[`extras_${record.feature_id}`] || 0)}
          </p>
        </div>
      ),
    },
  ];

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
      render: (_, record) => (
        <div>
          <p>£ {record.price} (inclusive)</p>
        </div>
      ),
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
      title: "Unit Price",
      dataIndex: "price",
      key: "price",
      render: (_, record) => (
        <div>
          <p>£ {record.price}</p>
        </div>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record) => {
        return (
          (selectedExtras.includes(record.key)) ? (
            <InputNumber
              type="number"
              disabled={
                !selectedExtras.includes(record.key)
              }
              value={quantityMap[`extras_${record.feature_id}`] || 0}
              min={0}
              onChange={(value) => {
                setQuantityMap({
                  ...quantityMap,
                  [`extras_${record.feature_id}`]: value,
                });
              }}
              required={selectedExtras.includes(record.key)}
            />
          ) : `${quantityMap[`extras_${record.feature_id}`] || 0}`
        );
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (_, record) => (
        <div>
          <p>
            £ {record.price * (quantityMap[`extras_${record.feature_id}`] || 0)}
          </p>
        </div>
      ),
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
      // const _features = data?.features || null;
      // setSelectedFeatures(_features);

      // if (Object.keys(_features || {})?.length === 0) return;

      // const _selectedChoices = Object.keys(_features?.choices || {});
      // const _selectedExtras = Object.keys(_features?.extras || {});

      // setSelectedChoices(_selectedChoices);
      // setSelectedExtras(_selectedExtras);

      // const _qtyMapExtras = Object.keys(_features?.extras || {}).reduce(
      //   (acc, extra) => {
      //     acc[`extras_${extra}`] = _features?.extras[extra].quantity;
      //     return acc;
      //   },
      //   {}
      // );

      // const _qtyMapChoices = Object.keys(_features?.choices || {}).reduce(
      //   (acc, choice) => {
      //     acc[`choice_${choice}`] = _features?.choices[choice].quantity;
      //     return acc;
      //   },
      //   {}
      // );

      // setQuantityMap({
      //   ..._qtyMapExtras,
      //   ..._qtyMapChoices,
      // });
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

  const getSelectedPrice = () => {
    if (!allFeatures) return 0;

    return selectedExtras.reduce((acc, extra) => {
      return (
        acc + (allFeatures[extra]?.price || 0) * quantityMap[`extras_${extra}`]
      );
    }, 0);
  };
  const getSelectedPrice1 = () => {
    if (!allFeatures) return 0;

    return selectedExtras1.reduce((acc, extra) => {
      return (
        acc + (allFeatures[extra]?.price || 0) * quantityMap1[`extras_${extra}`]
      );
    }, 0);
  };

  return (
    <div>
      <h3>Comparision Tool</h3>
      <p>
        <b>Venture Name: </b>
        {venture?.name}
      </p>
      <p>
        <b>House Type: </b>
        {buyer?.house_type} Bed
      </p>
      <Row justify="space-evenly" align="middle">
        <Col>
          <Row justify="space-between" align="middle">
            <h3>Total: £ {getSelectedPrice()}</h3>
          </Row>

          {allFeatures && configuration && (
            <>
              <Row>
                <Col span={24}>
                  <h3>
                    Choices
                    <span className="sub-text"> (Select Upto 3 Choices)</span>
                  </h3>
                  {selectedChoices?.length > 0 ? (
                    <p>Selected {selectedChoices.length} choices</p>
                  ) : null}
                  <Table
                    rowSelection={rowChoiceSelection}
                    columns={choicesColumns}
                    dataSource={configuration?.choices?.map((choice) => {
                      return {
                        ...allFeatures[choice],
                        key: choice,
                        quantity: 1,
                        status: null,
                      };
                    })}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <h3>Extras</h3>
                  {selectedExtras?.length > 0 ? (
                    <p>Selected {selectedExtras.length} extras</p>
                  ) : null}
                  <Table
                    rowSelection={rowExtrasSelection}
                    columns={extrasColumns}
                    dataSource={configuration?.extras?.map((extra) => {
                      return {
                        ...allFeatures[extra],
                        key: extra,
                        quantity: 0,
                        status: null,
                      };
                    })}
                  />
                </Col>
              </Row>
            </>
          )}
        </Col>
        <Col>
          <Row justify="space-between" align="middle">
            <h3>Total: £ {getSelectedPrice1()}</h3>
          </Row>

          {allFeatures && configuration && (
            <>
              <Row>
                <Col span={24}>
                  <h3>
                    Choices
                    <span className="sub-text"> (Select Upto 3 Choices)</span>
                  </h3>
                  {selectedChoices1?.length > 0 ? (
                    <p>Selected {selectedChoices1.length} choices</p>
                  ) : null}
                  <Table
                    rowSelection={rowChoiceSelection1}
                    columns={choicesColumns}
                    dataSource={configuration?.choices?.map((choice) => {
                      return {
                        ...allFeatures[choice],
                        key: choice,
                        quantity: 1,
                        status: null,
                      };
                    })}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <h3>Extras</h3>
                  {selectedExtras1?.length > 0 ? (
                    <p>Selected {selectedExtras1.length} extras</p>
                  ) : null}
                  <Table
                    rowSelection={rowExtrasSelection1}
                    columns={extrasColumns1}
                    dataSource={configuration?.extras?.map((extra) => {
                      return {
                        ...allFeatures[extra],
                        key: extra,
                        quantity: 0,
                        status: null,
                      };
                    })}
                  />
                </Col>
              </Row>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ComparisionTool;
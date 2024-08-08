import React, { useState, useEffect } from "react";
import { Row, Col, Table, Button, InputNumber } from "antd";
import axiosInstance from "../../helpers/axiosInstance";
import { useAuth } from "../../auth/useAuth";
import { loadStripe } from "@stripe/stripe-js";

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

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
  const [paymentStatus, setPaymentStatus] = useState();

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
          <InputNumber
            type="number"
            disabled={
              Boolean(selectedFeatures) || !selectedExtras.includes(record.key)
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
      const _features = data?.features || null;
      setSelectedFeatures(_features);

      if (Object.keys(_features || {})?.length === 0) return;

      const _selectedChoices = Object.keys(_features?.choices || {});
      const _selectedExtras = Object.keys(_features?.extras || {});

      setSelectedChoices(_selectedChoices);
      setSelectedExtras(_selectedExtras);

      const _qtyMapExtras = Object.keys(_features?.extras || {}).reduce(
        (acc, extra) => {
          acc[`extras_${extra}`] = _features?.extras[extra].quantity;
          return acc;
        },
        {}
      );

      const _qtyMapChoices = Object.keys(_features?.choices || {}).reduce(
        (acc, choice) => {
          acc[`choice_${choice}`] = _features?.choices[choice].quantity;
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

    const fetchStripeSession = async () => {
      try {
        const response = await axiosInstance.post(`/stripe-session`, {
          buyer_id: buyer?.buyer_id,
        });
        const data = response.data;
        console.log("Stripe Session:", data);
        if (data.payment_status === "paid") {
          setPaymentStatus("paid");
        } else {
          setPaymentStatus("unpaid");
        }
      } catch (error) {
        console.log("Error fetching stripe session:", error);
      }
    };

    fetchStripeSession();
    fetchVenture();
  }, [buyer?.buyer_id]);

  const handleConfirmOrder = async () => {
    const selections = {
      choices: {},
      extras: {},
    };

    selections.choices = selectedChoices.reduce((acc, choice) => {
      acc[choice] = {
        id: choice,
        name: allFeatures[choice].name,
        price: 0,
        quantity: 1,
        status: null,
      };

      return acc;
    }, {});

    selections.extras = selectedExtras.reduce((acc, extra) => {
      acc[extra] = {
        id: extra,
        name: allFeatures[extra].name,
        price: allFeatures[extra].price,
        quantity: quantityMap[`extras_${extra}`] || 1,
        status: null,
      };

      return acc;
    }, {});
    try {
      const stripe = await loadStripe(stripePublishableKey);

      const response = await fetch(
        `http://localhost:3001/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            features: selections,
            buyer_id: user?.id,
          }),
        }
      );

      const { id } = await response.json();

      await axiosInstance.post("/updateBuyer", {
        features: selections,
        stripe_session_id: id,
        buyer_id: user?.id,
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

  const getSelectedPrice = () => {
    if (!allFeatures) return 0;

    return selectedExtras.reduce((acc, extra) => {
      return (
        acc + (allFeatures[extra]?.price || 0) * quantityMap[`extras_${extra}`]
      );
    }, 0);
  };

  return (
    <div>
      <Row justify="space-between" align="middle">
        <Col>
          <p>
            <b>Venture Name: </b>
            {venture?.name}
          </p>
          <p>
            <b>House Type: </b>
            {buyer?.house_type} Bed
          </p>
        </Col>
        {paymentStatus === "paid" ? (
          <p>Total: <b>£ {getSelectedPrice()}</b> - Payment Completed</p>
        ) : (
          <Col>
            <h3>Total: £ {getSelectedPrice()}</h3>
            <Button
              type="primary"
              disabled={!selectedChoices?.length && !selectedExtras?.length}
              onClick={handleConfirmOrder}
            >
              {paymentStatus === "unpaid"
                ? "Continue Payment"
                : "Confirm Order"}
            </Button>
          </Col>
        )}
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
    </div>
  );
};

export default BuyerConfiguration;

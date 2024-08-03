import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import axiosInstance from "../../helpers/axiosInstance";
import { useAuth } from "../../auth/useAuth";

const BuyerConfiguration = () => {
  const { user } = useAuth();
  const [buyer, setBuyer] = useState(null);
  const [venture, setVenture] = useState(null);
  const [features, setFeatures] = useState(null);
  const [configuration, setConfiguration] = useState(null);

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
              {configuration?.choices?.map((choice) => {
                const feature = features[choice];
                return (
                  <div key={feature.feature_id}>
                    <p>{feature.name}</p>
                  </div>
                );
              })}
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <h3>Extras</h3>
              {configuration?.extras?.map((extra) => {
                const feature = features[extra];
                return (
                  <div key={feature.feature_id}>
                    <p>{feature.name}</p>
                  </div>
                );
              })}
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default BuyerConfiguration;

import React, { useState, useEffect } from "react";
import { Col, Row, Statistic, Card, Rate } from "antd";
import { useTranslation } from "react-i18next";
import axiosInstance from "../helpers/axiosInstance";
import { useAuth } from "../auth/useAuth";
import Chat from "./Chat/Chat";

const BuyerDashboard = () => {
  const describeRate = ["Terrible", "Bad", "Normal", "Good", "Wonderful"];
  const [buyer, setBuyer] = useState(null);
  const [builder, setBuilder] = useState(null);
  const [venture, setVenture] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    completed: 0,
    inprogress: 0,
    pending: 0,
  });

  const { user } = useAuth();
  const { t } = useTranslation();

  // Function to fetch builder based on id
  const fetchBuilder = async (id) => {
    try {
      const response = await axiosInstance.get(`/builders/${id}`);
      setBuilder(response.data);
    } catch (error) {
      console.log("Error fetching builders:", error);
    }
  };

  // Function to handle fetch venture based on id
  const fetchVenture = async (id) => {
    try {
      const response = await axiosInstance.get(`/ventures/${id}`);
      setVenture(response.data);
      fetchBuilder(response.data.builder_id);
    } catch (error) {
      console.log("Error fetching ventures:", error);
    }
  };

  // Function to handle add feedback to builder
  const addFeedback = async (value) => {
    try {
      await axiosInstance.post("/updateBuyer", {
        feedback: value,
        buyer_id: user?.id,
      });
      fetchBuyer();
    } catch (error) {
      console.log("Error updating buyer:", error);
    }
  };

  // Function to handle dashboard data
  const fetchDashboardData = (buyer) => {
    setDashboardData({ completed: 0, inprogress: 0, pending: 0 });

    const _choices = buyer?.features?.choices || {};
    const _extras = buyer?.features?.extras || {};
    const choices = Object.values(_choices);
    const extras = Object.values(_extras);

    const completedChoices = choices.filter(
      (choice) => choice.status === "completed"
    );
    const inprogressChoices = choices.filter(
      (choice) => choice.status === "inprogress"
    );
    const pendingChoices = choices.filter(
      (choice) => !choice.status || choice.status === "pending"
    );

    const completedExtras = extras.filter(
      (extra) => extra.status === "completed"
    );
    const inprogressExtras = extras.filter(
      (extra) => extra.status === "inprogress"
    );
    const pendingExtras = extras.filter(
      (extra) => !extra.status || extra.status === "pending"
    );

    setDashboardData({
      completed: completedChoices.length + completedExtras.length,
      inprogress: inprogressChoices.length + inprogressExtras.length,
      pending: pendingChoices.length + pendingExtras.length,
    });
  };

  // Function to handle fetch buyer
  const fetchBuyer = async () => {
    try {
      const response = await axiosInstance.get(`/buyers/${user.id}`);
      const data = response.data;
      fetchDashboardData(data);
      setBuyer(data);
      fetchVenture(data.venture_id);
    } catch (error) {
      console.log("Error fetching ventures:", error);
    }
  };
  useEffect(() => {
    fetchBuyer();
  }, []);

  return (
    <div>
      <Row gutter={24}>
        <Col span={12}>
          <Card
            title={t("statusOfFittings")}
            bordered={false}
            style={{ border: "1px solid grey", minHeight: "306px" }}
          >
            <Statistic title={t("completed")} value={dashboardData.completed} />
            <Statistic title={t("inprogress")} value={dashboardData.inprogress} />
            <Statistic title={t("pending")} value={dashboardData.pending} />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={t("provideFeedbackToBuilder")}
            bordered={false}
            style={{ border: "1px solid grey", minHeight: "306px" }}
          >
            <Rate
              style={{ margin: "24px", backgroundColor: "white" }}
              tooltips={describeRate}
              onChange={(value) => {
                addFeedback(value);
              }}
              value={buyer?.feedback || 0}
            />
          </Card>
        </Col>
      </Row>
      {venture?.builder_id && (
        <Chat
          buyerId={user.id}
          builderId={venture.builder_id}
          name={builder?.name ? `${builder.name} (Builder)` : "Builder"}
          defaultIsMinimized
        />
      )}
    </div>
  );
};

export default BuyerDashboard;

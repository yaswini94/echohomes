import React, { useState, useEffect } from "react";
import { Col, Row, Statistic, Card, Rate } from "antd";
import axiosInstance from "../helpers/axiosInstance";
import { useAuth } from "../auth/useAuth";

const BuyerDashboard = () => {
  const describeRate = ["Terrible", "Bad", "Normal", "Good", "Wonderful"];
  const [buyer, setBuyer] = useState(null);
  const { user } = useAuth();

  const addFeedback = async (value) => {
    try {
      await axiosInstance.post("/updateBuyer", {
        feedback: value ,
        buyer_id: user?.id,
      });
      fetchBuyer();
    } catch (error) {
      console.log("Error updating buyer:", error);
    }
  };

  const fetchBuyer = async () => {
    try {
      const response = await axiosInstance.get(`/buyers/${user.id}`);
      const data = response.data;
      setBuyer(data);
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
          <Card title="Status of Fittings" bordered={false} style={{border: "1px solid grey", minHeight: "306px"}}>
            <Statistic title="Completed" value={3} />
            <Statistic title="Inprogress" value={4} />
            <Statistic title="Pending" value={2} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Provide Feedback" bordered={false} style={{border: "1px solid grey", minHeight: "306px"}}>
            <Rate
            style={{ marginRight: "8px", backgroundColor: "white" }}
            tooltips={describeRate}
            onChange={(value) => {
              addFeedback(value);
            }}
            value={buyer?.feedback || 0} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default BuyerDashboard;

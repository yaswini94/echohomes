import React, { useState, useEffect } from "react";
import { Col, Row, Statistic, Card, Rate } from "antd";
import axiosInstance from "../helpers/axiosInstance";
import { useAuth } from "../auth/useAuth";

const BuyerDashboard = () => {
  const describeRate = ["Terrible", "Bad", "Normal", "Good", "Wonderful"];
  const [buyer, setBuyer] = useState(null);
  const [dashboardData, setDashboardData] = useState({completed: 0, inprogress: 0, pending: 0});
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

  const fetchDashboardData = (buyer) => {
    setDashboardData({completed: 0, inprogress: 0, pending: 0});

    let data = dashboardData;
    const updateObject = (row, type) => {
      switch(type === 'choice' ? buyer.features.choices[row].status : buyer.features.extras[row].status) {
        case "inprogress":
          data.inprogress++;
          break;
        case "completed":
          data.completed++;
          break;
        default:
          data.pending++
          break;
      }
      // setDashboardData(data);
    };

    if (buyer.features) {
      Object.keys(buyer.features.choices).map(row => {updateObject(row, 'choice'); setDashboardData(data);});
      Object.keys(buyer.features.extras).map(row => {updateObject(row, 'extra'); setDashboardData(data);});
    }
  };


  const fetchBuyer = async () => {
    try {
      const response = await axiosInstance.get(`/buyers/${user.id}`);
      const data = response.data;
      fetchDashboardData(data);
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
            <Statistic title="Completed" value={dashboardData.completed} />
            <Statistic title="Inprogress" value={dashboardData.inprogress} />
            <Statistic title="Pending" value={dashboardData.pending} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Provide Feedback to Builder" bordered={false} style={{border: "1px solid grey", minHeight: "306px"}}>
            <Rate
            style={{ margin: "24px", backgroundColor: "white" }}
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

import React, { useState, useEffect } from "react";
import { Col, Row, Statistic, Card, Progress } from "antd";
import { useTranslation } from "react-i18next";
import axiosInstance from "../helpers/axiosInstance";
import useLocalStorage from "../utils/useLocalStorage";
import { supabase } from "../supabase";

const BuilderDashboard = () => {
  const [ventureId] = useLocalStorage("selectedVenture", null);
  const [houseInfo, setHouseInfo] = useState({
    totalHouses: 0,
    pendingHouses: 0,
    configuredHouses: 0,
  });
  const [totalFeedbackCount, setTotalFeedbackCount] = useState(0);
  const [feedback, setFeedback] = useState({
    fiveStar: 0,
    fourStar: 0,
    threeStar: 0,
    twoStar: 0,
    oneStar: 0,
  });
  const [orderInfo, setOrderInfo] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    invoiceAmount: 0,
  });

  const { t } = useTranslation();

  useEffect(() => {
    // Function to handle fetch venture based on id
    const fetchVenture = async (id) => {
      try {
        const response = await axiosInstance.get(`/ventures/${id}`);
        const _houseInfo = {
          totalHouses: 0,
          pendingHouses: 0,
          configuredHouses: 0,
        };

        response.data.properties.forEach((property) => {
          _houseInfo.totalHouses += property.value;
        });
        const buyers = await supabase
          .from("buyers")
          .select("*")
          .eq("venture_id", id);
        _houseInfo.pendingHouses = _houseInfo.totalHouses - buyers.data.length;
        buyers.data.forEach((buyer) => {
          if (buyer.features) {
            _houseInfo.configuredHouses += 1;
          }
        });
        setHouseInfo(_houseInfo);
      } catch (error) {
        console.log("Error fetching ventures:", error);
      }
    };

    // Function to handle fetch feedback
    const fetchFeedback = async (id) => {
      try {
        const buyersFeedback = await supabase
          .from("buyers")
          .select("*")
          .eq("venture_id", id)
          .not("feedback", "is", null);
        const _feedback = {
          fiveStar: 0,
          fourStar: 0,
          threeStar: 0,
          twoStar: 0,
          oneStar: 0,
        };
        setTotalFeedbackCount(buyersFeedback.data.length);
        buyersFeedback.data?.forEach((buyer) => {
          switch (buyer.feedback) {
            case 5:
              _feedback.fiveStar += 1;
              break;
            case 4:
              _feedback.fourStar += 1;
              break;
            case 3:
              _feedback.threeStar += 1;
              break;
            case 2:
              _feedback.twoStar += 1;
              break;
            case 1:
              _feedback.oneStar += 1;
              break;
            default:
              break;
          }
        });
        setFeedback(_feedback);
      } catch (error) {
        console.log("Error fetching feedback:", error);
      }
    };

    // Function to handle fetch orders
    const fetchOrders = async (id) => {
      try {
        const supplierOrders = await axiosInstance.get(
          `/supplier-orders/${id}`
        );
        const _orderInfo = {
          totalOrders: 0,
          pendingOrders: 0,
          invoiceAmount: 0,
        };
        supplierOrders.data.forEach((order) => {
          _orderInfo.totalOrders += 1;
          if (order.status === null) {
            _orderInfo.pendingOrders += 1;
          }
          _orderInfo.invoiceAmount += order.total;
        });
        setOrderInfo(_orderInfo);
      } catch (error) {
        console.log("Error fetching orders:", error);
      }
    };

    fetchVenture(ventureId);
    fetchFeedback(ventureId);
    fetchOrders(ventureId);
  }, [ventureId]);

  return (
    <div>
      {/* Row template from the ant design to split the view of dashboard */}
      <Row gutter={24}>
        <Col span={8}>
          <Card
            title={t("ventureInformation")}
            bordered={false}
            style={{ border: "1px solid grey", minHeight: "306px" }}
          >
            <Statistic title="Total Houses" value={houseInfo.totalHouses} />
            <Statistic title="Pending Houses" value={houseInfo.pendingHouses} />
            <Statistic
              title="Configured Houses"
              value={houseInfo.configuredHouses}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title={t("orders")}
            bordered={false}
            style={{ border: "1px solid grey", minHeight: "306px" }}
          >
            <Statistic title={t("totalOrders")} value={orderInfo.totalOrders} />
            <Statistic
              title={t("pendingOrders")}
              value={orderInfo.pendingOrders}
            />
            <Statistic
              title={t("invoiceAmount")}
              value={orderInfo.invoiceAmount}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title={t("feedback")}
            bordered={false}
            style={{ border: "1px solid grey", minHeight: "306px" }}
          >
            <Row justify="space-between" align="middle">
              <Col>
                <p>5 star</p>
              </Col>
              <Col>
                <Progress
                  size={[300, 20]}
                  percentPosition={{ align: "end", type: "inner" }}
                  percent={parseInt(
                    (feedback.fiveStar / totalFeedbackCount) * 100
                  )}
                  style={{ padding: "10px 0", color: "#ffffff" }}
                />
              </Col>
            </Row>
            <Row justify="space-between" align="middle">
              <Col>
                <p>4 star</p>
              </Col>
              <Col>
                <Progress
                  size={[300, 20]}
                  percentPosition={{ align: "end", type: "inner" }}
                  percent={parseInt(
                    (feedback.fourStar / totalFeedbackCount) * 100
                  )}
                  style={{ padding: "10px 0", color: "#ffffff" }}
                />
              </Col>
            </Row>
            <Row justify="space-between" align="middle">
              <Col>
                <p>3 star</p>
              </Col>
              <Col>
                <Progress
                  size={[300, 20]}
                  percentPosition={{ align: "end", type: "inner" }}
                  percent={parseInt(
                    (feedback.threeStar / totalFeedbackCount) * 100
                  )}
                  style={{ padding: "10px 0", color: "#ffffff" }}
                />
              </Col>
            </Row>
            <Row justify="space-between" align="middle">
              <Col>
                <p>2 star</p>
              </Col>
              <Col>
                <Progress
                  size={[300, 20]}
                  percentPosition={{ align: "end", type: "inner" }}
                  percent={parseInt(
                    (feedback.twoStar / totalFeedbackCount) * 100
                  )}
                  style={{ padding: "10px 0", color: "#ffffff" }}
                />
              </Col>
            </Row>
            <Row justify="space-between" align="middle">
              <Col>
                <p>1 star</p>
              </Col>
              <Col>
                <Progress
                  size={[300, 20]}
                  percentPosition={{ align: "end", type: "inner" }}
                  percent={parseInt(
                    (feedback.oneStar / totalFeedbackCount) * 100
                  )}
                  style={{ padding: "10px 0", color: "#ffffff" }}
                  status="exception"
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default BuilderDashboard;

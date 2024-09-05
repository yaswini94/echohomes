import { useState, useEffect } from "react";
import { Col, Row, Statistic, Card, Progress } from "antd";
import { supabase } from "../supabase";
import { useTranslation } from "react-i18next";
import useLocalStorage from "../utils/useLocalStorage";
import { useAuth } from "../auth/useAuth";

const SupplierDashboard = () => {
  const [ventureId] = useLocalStorage("selectedVenture", null);
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
  const [totalFeedbackCount, setTotalFeedbackCount] = useState(0);
  const { user } = useAuth();
  const { t: translate } = useTranslation();

  useEffect(() => {
    if (!user?.id) return;
    // Function to handle fetch feedback to display in dashboard
    const fetchFeedback = async () => {
      try {
        const supplierFeedback = await supabase
          .from("suppliers")
          .select("feedback")
          .eq("supplier_id", user?.id);
        const _feedback = {
          fiveStar: 2,
          fourStar: 1,
          threeStar: 0,
          twoStar: 0,
          oneStar: 0,
        };
        setTotalFeedbackCount(3);
        let _supplierFeedback = supplierFeedback.data[0].feedback;
        if (!Array.isArray(_supplierFeedback)) {
          _supplierFeedback = [_supplierFeedback];
        }
        // Sorting feedback into descending order
        _supplierFeedback?.sort((item1, item2) => item2 - item1);

        supplierFeedback?.data?.forEach((builder) => {
          switch (builder?.feedback) {
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
    // fetchOrders(ventureId);
    fetchFeedback();
  }, [user?.id]);

  useEffect(() => {
    // Function to handle fetch orders to display in dashboard
    const fetchOrders = async (ventureId) => {
      if (!ventureId) return;

      try {
        const orders = await supabase
          .from("purchase_orders")
          .select("*")
          .eq("venture_id", ventureId)
          .eq("supplier_id", user?.id);
        let _orderInfo = {
          totalOrders: 0,
          pendingOrders: 0,
          invoiceAmount: 0,
        };
        orders.data.forEach((order) => {
          _orderInfo.totalOrders += 1;
          if (!order.status) {
            _orderInfo.pendingOrders += 1;
          }
          _orderInfo.invoiceAmount += order.total;
        });
        setOrderInfo(_orderInfo);
      } catch (error) {
        console.log("Error fetching orders:", error);
      }
    };
    fetchOrders(ventureId);
  }, [ventureId]);

  return (
    // Supplier dashboard view to render using ant design templates for view
    <div>
      <Row gutter={24}>
        <Col span={12}>
          <Card
            title="Orders"
            bordered={false}
            style={{ border: "1px solid grey", minHeight: "306px" }}
          >
            <Statistic
              title={translate("totalOrders")}
              value={orderInfo.totalOrders}
            />
            <Statistic
              title={translate("pendingOrders")}
              value={orderInfo.pendingOrders}
            />
            <Statistic
              title={translate("invoiceAmount")}
              value={orderInfo.invoiceAmount}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Feedback"
            bordered={false}
            style={{ border: "1px solid grey", minHeight: "306px" }}
          >
            <Row justify="space-between" align="middle">
              <Col>
                <p>5 star</p>
              </Col>
              <Col>
                <Progress
                  size={[500, 20]}
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
                  size={[500, 20]}
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
                  size={[500, 20]}
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
                  size={[500, 20]}
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
                  size={[500, 20]}
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
export default SupplierDashboard;

import React from "react";
import { Col, Row, Statistic, Card } from "antd";

const BuyerDashboard = () => {
  return (
    <div>
      <Row gutter={24}>
        <Col span={12}>
          <Card title="Venture Information" bordered={false} style={{border: "1px solid grey", minHeight: "306px"}}>
            <Statistic title="Total Houses" value={770} />
            <Statistic title="Pending Houses" value={300} />
            <Statistic title="Configured Houses" value={320} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Orders" bordered={false} style={{border: "1px solid grey", minHeight: "306px"}}>
            <Statistic title="Total Orders" value={182} />
            <Statistic title="Purchase Order Amount (£)" value={230} precision={2} />
            <Statistic title="Invoice Amount (£)" value={670} precision={2} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default BuyerDashboard;

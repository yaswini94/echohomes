import React from "react";
import { Col, Row, Statistic, Card, Rate } from "antd";

const SupplierDashboard = () => {
  return (
    // Supplier dashboard view to render using ant design templates for view
    <div>
      <Row gutter={24}>
        <Col span={12}>
          <Card title="Orders" bordered={false} style={{border: "1px solid grey", minHeight: "306px"}}>
            <Statistic title="Total Orders" value={182} />
            <Statistic title="Purchase Order Amount (£)" value={230} precision={2} />
            <Statistic title="Invoice Amount (£)" value={670} precision={2} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Feedback" bordered={false} style={{border: "1px solid grey", minHeight: "306px"}}>
            <Row justify="space-between" align="middle">
              <Col><p>5 star</p></Col>
              <Col><Rate style={{marginRight: "8px"}} value={5} /></Col>
              <Col><p>11</p></Col>
            </Row>
            <Row justify="space-between" align="middle">
              <Col><p>4 star</p></Col>
              <Col><Rate style={{marginRight: "8px"}} value={3} /></Col>
              <Col><p>10</p></Col>
            </Row>
            <Row justify="space-between" align="middle">
              <Col><p>3 star</p></Col>
              <Col><Rate style={{marginRight: "8px"}} value={4} /></Col>
              <Col><p>5</p></Col>
            </Row>
            <Row justify="space-between" align="middle">
              <Col><p>2 star</p></Col>
              <Col><Rate style={{marginRight: "8px"}} value={2} /></Col>
              <Col><p>0</p></Col>
            </Row>
            <Row justify="space-between" align="middle">
              <Col><p>1 star</p></Col>
              <Col><Rate style={{marginRight: "8px"}} value={0} /></Col>
              <Col><p>0</p></Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default SupplierDashboard;

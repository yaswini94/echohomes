import React from "react";
import { Col, Row, Statistic, Card } from "antd";

const BuilderDashboard = () => {
  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Card title" bordered={false}>
            <Statistic title="Pending Houses" value={112893} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Card title" bordered={false}>
            <Statistic title="Pending Houses" value={112893} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Card title" bordered={false}>
            <Statistic title="Pending Houses" value={112893} />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Statistic title="feedback" value={112893} precision={2} />
        </Col>
        <Col span={12}>
          <Statistic title="xx" value={112893} precision={2} />
        </Col>
        <Col span={12}>
          <Statistic title="xx" value={112893} precision={2} />
        </Col>
      </Row>
    </div>
  );
};
export default BuilderDashboard;

import React from 'react';
import { Layout, theme, Col, Row, Statistic, Card } from 'antd';
import VentureManagement from './VentureManagement';
import SupplierManagement from './SupplierManagement';
import BuyerInvite from './BuyerInvite';
import FeatureManagement from './FeatureManagement';

const { Content } = Layout;

const BuilderDashboard = ({ selectedKey }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Content
      style={{
        padding: 24,
        margin: 0,
        minHeight: 280,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <div>
        {/* Render different content based on selectedKey */}
        {selectedKey === 'home' && 
          <>
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
          </>
        }
        {selectedKey === 'ventureManagement' && <VentureManagement />}
        {selectedKey === 'supplierManagement' && <SupplierManagement />}
        {selectedKey === 'buyerManagement' && <BuyerInvite />}
        {selectedKey === 'featureManagement' && <FeatureManagement />}
      </div>
    </Content>
  )
};
export default BuilderDashboard;
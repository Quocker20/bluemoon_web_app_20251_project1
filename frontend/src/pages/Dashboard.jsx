import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin, Typography } from 'antd';
import { HomeOutlined, UsergroupAddOutlined, DollarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';

const { Title } = Typography;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosClient.get('/dashboard');
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;
  if (!stats) return null;

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>Tổng quan Hệ thống</Title>
      
      <Row gutter={16}>
        <Col span={6}>
          <Card bordered={false} style={{ backgroundColor: '#e6f7ff' }}>
            <Statistic
              title="Tổng số Hộ khẩu"
              value={stats.totalHouseholds}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ backgroundColor: '#f6ffed' }}>
            <Statistic
              title="Tổng số Nhân khẩu"
              value={stats.totalResidents}
              prefix={<UsergroupAddOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ backgroundColor: '#fff7e6' }}>
            <Statistic
              title="Doanh thu Đã thu"
              value={stats.totalRevenue}
              precision={0}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ backgroundColor: '#fff1f0' }}>
            <Statistic
              title="Công nợ"
              value={stats.pendingRevenue}
              precision={0}
              prefix={<ClockCircleOutlined />}
              suffix="VNĐ"
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
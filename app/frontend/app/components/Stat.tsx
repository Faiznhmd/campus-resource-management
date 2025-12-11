'use client';

import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import api from '@/app/services/api';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

interface Booking {
  id: number;
  status: string;
}

export default function Stats() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    cancelled: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get<Booking[]>('/bookings/me');

        const bookings = res.data;

        const total = bookings.length;
        const active = bookings.filter(
          (b) =>
            b.status === 'APPROVED' ||
            b.status === 'PENDING' ||
            b.status === 'IN_PROGRESS'
        ).length;

        const cancelled = bookings.filter(
          (b) => b.status === 'CANCELLED' || b.status === 'REJECTED'
        ).length;

        setStats({ total, active, cancelled });
      } catch (err) {
        console.log('Failed to load stats');
      }
    };

    fetchStats();
  }, []);

  return (
    <Row gutter={24} style={{ marginBottom: 24 }}>
      <Col span={8}>
        <Card
          bordered={false}
          style={{
            borderRadius: 12,
            boxShadow: '0 3px 16px rgba(0,0,0,0.07)',
            transition: 'transform 0.2s ease',
          }}
        >
          <Statistic
            title="Total Bookings"
            value={stats.total}
            prefix={<CheckCircleOutlined style={{ color: '#1677ff' }} />}
          />
        </Card>
      </Col>

      <Col span={8}>
        <Card
          bordered={false}
          style={{ borderRadius: 12, boxShadow: '0 3px 16px rgba(0,0,0,0.07)' }}
        >
          <Statistic
            title="Active Bookings"
            value={stats.active}
            prefix={<ClockCircleOutlined style={{ color: '#52c41a' }} />}
          />
        </Card>
      </Col>

      <Col span={8}>
        <Card
          bordered={false}
          style={{ borderRadius: 12, boxShadow: '0 3px 16px rgba(0,0,0,0.07)' }}
        >
          <Statistic
            title="Cancelled / Rejected"
            value={stats.cancelled}
            prefix={<CloseCircleOutlined style={{ color: 'red' }} />}
          />
        </Card>
      </Col>
    </Row>
  );
}

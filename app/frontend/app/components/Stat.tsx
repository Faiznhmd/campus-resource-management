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
    <>
      <Row
        gutter={[24, 24]}
        style={{
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Col xs={24} sm={12} md={8}>
          <Card className="stats-box">
            <Statistic
              title="Total Bookings"
              value={stats.total}
              prefix={<CheckCircleOutlined style={{ color: '#1677ff' }} />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card className="stats-box">
            <Statistic
              title="Active Bookings"
              value={stats.active}
              prefix={<ClockCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card className="stats-box">
            <Statistic
              title="Cancelled / Rejected"
              value={stats.cancelled}
              prefix={<CloseCircleOutlined style={{ color: 'red' }} />}
            />
          </Card>
        </Col>
      </Row>

      <style jsx global>{`
        .stats-box {
          border-radius: 14px !important;
          padding: 20px !important;
          box-shadow: 0 3px 16px rgba(0, 0, 0, 0.07);
          transition: 0.2s ease;
        }

        .stats-box:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
        }

        /* MOBILE FIXES */
        @media (max-width: 768px) {
          .stats-box {
            margin-bottom: 10px;
            padding: 16px !important;
          }
          .ant-statistic-title {
            font-size: 14px !important;
          }
          .ant-statistic-content-value {
            font-size: 22px !important;
          }
        }
      `}</style>
    </>
  );
}

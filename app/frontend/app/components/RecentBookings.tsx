'use client';

import { useEffect, useState } from 'react';
import { Card, Table, Tag } from 'antd';
import api from '@/app/services/api';

interface Booking {
  id: number;
  resource: {
    name: string;
  };
  startTime: string;
  endTime: string;
  status: string;
}

export default function RecentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get<Booking[]>('/bookings/me');

        // Sort by latest booking first
        const sorted = res.data
          .sort(
            (a, b) =>
              new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
          )
          .slice(0, 5); // show only last 5

        setBookings(sorted);
      } catch (err) {
        console.log('Failed to load recent bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const columns = [
    {
      title: 'Resource',
      dataIndex: ['resource', 'name'],
      key: 'resource',
    },
    {
      title: 'Date',
      key: 'date',
      render: (record: Booking) =>
        new Date(record.startTime).toLocaleDateString(),
    },
    {
      title: 'Time',
      key: 'time',
      render: (record: Booking) => {
        const start = new Date(record.startTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        const end = new Date(record.endTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        return `${start} - ${end}`;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color =
          status === 'APPROVED'
            ? 'green'
            : status === 'PENDING'
            ? 'orange'
            : 'red';

        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <Card
      title="Recent Bookings"
      style={{
        marginBottom: 24,
        borderRadius: 12,
        boxShadow: '0 3px 16px rgba(0,0,0,0.07)',
      }}
    >
      <Table
        columns={columns}
        dataSource={bookings}
        loading={loading}
        rowKey="id"
        pagination={false}
      />
    </Card>
  );
}

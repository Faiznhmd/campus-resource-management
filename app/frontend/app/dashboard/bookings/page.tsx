'use client';

import { useEffect, useState } from 'react';
import { Table, Tag, Button } from 'antd';
import api from '../../services/api';
import { useRouter } from 'next/navigation';

interface Booking {
  id: number;
  startTime: string;
  endTime: string;
  status: 'pending' | 'approved' | 'rejected' | string;
  createdAt: string;
  resource: {
    id: number;
    name: string;
    description: string;
  };
  requiresApproval: boolean;
}

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get<Booking[]>('/bookings/me');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const columns = [
    {
      title: 'Resource',
      dataIndex: 'resource',
      key: 'resource',
      width: 180,
      render: (resource: Booking['resource']) => (
        <strong>{resource?.name}</strong>
      ),
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 160,
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 160,
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: Booking['status']) => {
        const color =
          status === 'approved'
            ? 'green'
            : status === 'pending'
            ? 'orange'
            : 'red';

        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Booked On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) =>
        new Date(date).toLocaleDateString() +
        ' ' +
        new Date(date).toLocaleTimeString(),
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      render: (_: unknown, record: Booking) => (
        <Button
          type="link"
          onClick={() =>
            router.push(`/dashboard/resources/${record.resource.id}`)
          }
        >
          Continue Booking
        </Button>
      ),
    },
  ];

  // ⭐ NEW USER (NO BOOKINGS)
  if (!loading && bookings.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          marginTop: 80,
        }}
      >
        <h1 style={{ fontSize: '32px', marginBottom: 10 }}>👋 Welcome!</h1>

        <p style={{ fontSize: '20px', marginBottom: 30 }}>
          You don’t have any bookings yet.
        </p>

        <Button
          type="primary"
          size="large"
          onClick={() => router.push('/dashboard/resources')}
        >
          Browse Resources
        </Button>
      </div>
    );
  }

  // ⭐ USER HAS BOOKINGS → SHOW TABLE
  return (
    <div style={{ margin: 20 }}>
      <h2
        style={{
          marginBottom: 20,
          fontSize: 24,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        My Bookings
        <Button
          type="primary"
          onClick={() => router.push('/dashboard/resources')}
        >
          All Resources
        </Button>
      </h2>

      <Table
        rowKey="id"
        dataSource={bookings}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 5 }}
        style={{ tableLayout: 'fixed' }}
      />
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Space } from 'antd';
import api from '../../services/api';
import { useRouter } from 'next/navigation';

interface ResourceInfo {
  id: number;
  name: string;
  description: string;
}

interface Booking {
  id: number;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  createdAt: string;
  resource: ResourceInfo;
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

  // ===============================
  // TABLE COLUMNS
  // ===============================
  const columns = [
    {
      title: 'Resource',
      dataIndex: 'resource',
      key: 'resource',
      width: 180,
      render: (resource: ResourceInfo) => <strong>{resource?.name}</strong>,
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
          status === 'APPROVED'
            ? 'green'
            : status === 'PENDING'
            ? 'orange'
            : 'red';

        return <Tag color={color}>{status}</Tag>;
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

  // ===============================
  // PAGE RENDER
  // ===============================
  return (
    <Card style={{ margin: 20 }}>
      {/** ⭐ NEW USER (NO BOOKINGS) */}
      {!loading && bookings.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
          }}
        >
          <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>
            👋 Welcome!
          </h1>
          <p style={{ fontSize: '20px', marginBottom: '25px' }}>
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
      ) : (
        <>
          {/** ⭐ HEADER */}
          <Space
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 15,
            }}
          >
            <h2 style={{ margin: 0 }}>My Bookings</h2>

            <Button
              type="primary"
              onClick={() => router.push('/dashboard/resources')}
            >
              All Resources
            </Button>
          </Space>

          {/** ⭐ BOOKINGS TABLE */}
          <Table
            rowKey="id"
            dataSource={bookings}
            columns={columns}
            loading={loading}
            pagination={{ pageSize: 5 }}
            style={{ tableLayout: 'fixed' }}
          />
        </>
      )}
    </Card>
  );
}

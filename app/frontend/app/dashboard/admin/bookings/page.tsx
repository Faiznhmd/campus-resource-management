'use client';

import { useEffect, useState } from 'react';
import api from '@/app/services/api';
import { Tabs, Table, Tag, Button } from 'antd';
import { useRouter } from 'next/navigation';

interface Booking {
  id: number;
  status: string;
  startTime: string;
  endTime: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  resource: {
    id: number;
    name: string;
    type: string;
  };
}

export default function AdminBookingsPage() {
  const [pending, setPending] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Fetch all data
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const pend = await api.get<Booking[]>('/bookings/pending');
      const all = await api.get<Booking[]>('/bookings');

      setPending(pend.data);
      setAllBookings(all.data);
    } catch (err) {
      console.log('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  // Approve booking
  const approveBooking = async (id: number) => {
    try {
      await api.patch(`/bookings/${id}/approve`);
      alert('Booking Approved');
      loadBookings();
    } catch {
      alert('Failed to approve booking');
    }
  };

  // Reject booking
  const rejectBooking = async (id: number) => {
    try {
      await api.patch(`/bookings/${id}/reject`);
      alert('Booking Rejected');
      loadBookings();
    } catch {
      alert('Failed to reject booking');
    }
  };

  // Columns for Ant Design Table
  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'User',
      key: 'user',
      render: (record: Booking) => (
        <>
          <strong>{record.user.name}</strong>
          <br />
          <span>{record.user.email}</span>
        </>
      ),
    },
    {
      title: 'Resource',
      key: 'resource',
      render: (record: Booking) => (
        <>
          <strong>{record.resource.name}</strong>
          <br />
          <span>{record.resource.type}</span>
        </>
      ),
    },
    {
      title: 'Time',
      key: 'time',
      render: (record: Booking) => (
        <>
          {new Date(record.startTime).toLocaleString()} <br /> →{' '}
          {new Date(record.endTime).toLocaleString()}
        </>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (record: Booking) => {
        const color =
          record.status === 'PENDING'
            ? 'gold'
            : record.status === 'APPROVED'
            ? 'green'
            : record.status === 'REJECTED'
            ? 'red'
            : 'blue';

        return <Tag color={color}>{record.status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Booking) =>
        record.status === 'PENDING' && (
          <>
            <Button
              type="primary"
              onClick={(e) => {
                e.stopPropagation();
                approveBooking(record.id);
              }}
              style={{ marginRight: '10px' }}
            >
              Approve
            </Button>

            <Button
              danger
              onClick={(e) => {
                e.stopPropagation();
                rejectBooking(record.id);
              }}
            >
              Reject
            </Button>
          </>
        ),
    },
  ];

  // Filter lists
  const approved = allBookings.filter((b) => b.status === 'APPROVED');
  const rejected = allBookings.filter((b) => b.status === 'REJECTED');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin - Booking Management</h1>

      <Tabs
        defaultActiveKey="pending"
        items={[
          {
            key: 'pending',
            label: 'Pending',
            children: (
              <Table
                loading={loading}
                dataSource={pending}
                columns={columns}
                rowKey="id"
                onRow={(record) => ({
                  onClick: () =>
                    router.push(`/dashboard/admin/bookings/${record.id}`),
                })}
              />
            ),
          },
          {
            key: 'approved',
            label: 'Approved',
            children: (
              <Table
                loading={loading}
                dataSource={approved}
                columns={columns}
                rowKey="id"
                onRow={(record) => ({
                  onClick: () =>
                    router.push(`/dashboard/admin/bookings/${record.id}`),
                })}
              />
            ),
          },
          {
            key: 'rejected',
            label: 'Rejected',
            children: (
              <Table
                loading={loading}
                dataSource={rejected}
                columns={columns}
                rowKey="id"
                onRow={(record) => ({
                  onClick: () =>
                    router.push(`/dashboard/admin/bookings/${record.id}`),
                })}
              />
            ),
          },
          {
            key: 'all',
            label: 'All Bookings',
            children: (
              <Table
                loading={loading}
                dataSource={allBookings}
                columns={columns}
                rowKey="id"
                onRow={(record) => ({
                  onClick: () =>
                    router.push(`/dashboard/admin/bookings/${record.id}`),
                })}
              />
            ),
          },
        ]}
      />
    </div>
  );
}

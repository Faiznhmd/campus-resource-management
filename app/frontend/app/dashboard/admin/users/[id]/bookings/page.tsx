'use client';

import { useEffect, useState } from 'react';
import { Table, Tag, Button, message } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import api from '@/app/services/api';

type Booking = {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
  resource: {
    name: string;
  };
};

export default function UserBookingsPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get<Booking[]>(`/bookings/user/${id}`);
      setData(res.data);
    } catch (err) {
      console.log(err);
      message.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadBookings();
  }, [id]);

  const columns = [
    { title: 'Booking ID', dataIndex: 'id' },
    { title: 'Resource', dataIndex: ['resource', 'name'] },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (s: string) => (
        <Tag
          color={
            s === 'APPROVED'
              ? 'green'
              : s === 'PENDING'
              ? 'orange'
              : s === 'REJECTED'
              ? 'red'
              : 'blue'
          }
        >
          {s}
        </Tag>
      ),
    },
    {
      title: 'Start',
      dataIndex: 'startTime',
      render: (t: string) => new Date(t).toLocaleString(),
    },
    {
      title: 'End',
      dataIndex: 'endTime',
      render: (t: string) => new Date(t).toLocaleString(),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">User Bookings</h1>

        {/* ⭐ NEW BUTTON HERE */}
        <Button
          onClick={() => router.push('/dashboard/admin/users')}
          type="default"
        >
          Back to Users
        </Button>
      </div>

      <Table
        rowKey="id"
        dataSource={data}
        columns={columns}
        loading={loading}
        bordered
      />
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Tag, Popconfirm, message } from 'antd';
import api from '@/app/services/api';
import { useRouter } from 'next/navigation';

type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: 'STUDENT' | 'STAFF' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  _count?: { bookings: number };
  bookingsCount?: number;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get<AdminUser[]>('/users');
      const formatted = res.data.map((u) => ({
        ...u,
        bookingsCount: u._count?.bookings ?? 0,
      }));
      setUsers(formatted);
    } catch (err) {
      console.error(err);
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const deleteUser = async (id: number) => {
    try {
      await api.delete(`/users/${id}`);
      message.success('User deleted');
      loadUsers();
    } catch {
      message.error('Failed to delete user');
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      await api.patch(`/users/${id}/toggle-status`);
      message.success('Status updated');
      loadUsers();
    } catch {
      message.error('Failed to update status');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Role', dataIndex: 'role', render: (r: string) => <Tag>{r}</Tag> },
    { title: 'Bookings', dataIndex: 'bookingsCount' },
    {
      title: 'Status',
      dataIndex: 'isActive',
      render: (a: boolean) =>
        a ? <Tag color="green">Active</Tag> : <Tag color="red">Disabled</Tag>,
    },
    {
      title: 'Actions',
      render: (_: unknown, record: AdminUser) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            type="primary"
            onClick={() =>
              router.push(`/dashboard/admin/users/${record.id}/edit`)
            }
          >
            Edit
          </Button>

          <Button
            onClick={() =>
              router.push(`/dashboard/admin/users/${record.id}/bookings`)
            }
          >
            Bookings
          </Button>

          <Button onClick={() => toggleStatus(record.id)}>
            {record.isActive ? 'Disable' : 'Enable'}
          </Button>

          <Popconfirm
            title="Delete user?"
            onConfirm={() => deleteUser(record.id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Users</h1>
      <Table
        rowKey="id"
        dataSource={users}
        columns={columns}
        loading={loading}
        bordered
      />
    </div>
  );
}

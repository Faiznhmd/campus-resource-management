'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Tag, Popconfirm, message } from 'antd';
import api from '@/app/services/api';
import { useRouter } from 'next/navigation';
import PageWrapper from '@/app/components/PageWrapper';

type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  _count?: { bookings: number };
  bookingsCount?: number;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // -------------------------
  // Load All Users
  // -------------------------
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get<AdminUser[]>('/users');

      const formatted = res.data.map((u) => ({
        ...u,
        bookingsCount: u._count?.bookings ?? 0, // ✅ FIXED booking count
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

  // -------------------------
  // Delete User
  // -------------------------
  const deleteUser = async (id: number) => {
    try {
      await api.delete(`/users/${id}`);
      message.success('User deleted');
      loadUsers();
    } catch {
      message.error('Failed to delete user');
    }
  };

  // -------------------------
  // Enable / Disable User
  // -------------------------
  const toggleStatus = async (id: number) => {
    try {
      await api.patch(`/users/${id}/toggle-status`);
      message.success('Status updated');
      loadUsers();
    } catch {
      message.error('Failed to update status');
    }
  };

  // -------------------------
  // Table Columns
  // -------------------------
  const columns = [
    { title: 'ID', dataIndex: 'id', width: 70 },

    { title: 'Name', dataIndex: 'name' },

    { title: 'Email', dataIndex: 'email' },

    {
      title: 'Role',
      dataIndex: 'role',
      render: (role: string) => <Tag>{role}</Tag>,
    },

    {
      title: 'Bookings',
      dataIndex: 'bookingsCount', // ✅ FIXED
    },

    {
      title: 'Status',
      dataIndex: 'isActive',
      render: (active: boolean) =>
        active ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Disabled</Tag>
        ),
    },

    {
      title: 'Actions',
      render: (_: unknown, record: AdminUser) => (
        <div className="flex gap-3">
          {/* Edit Button */}
          <Button
            type="primary"
            onClick={() =>
              router.push(`/dashboard/admin/users/${record.id}/edit`)
            }
          >
            Edit
          </Button>

          {/* View User Bookings */}
          <Button
            onClick={() =>
              router.push(`/dashboard/admin/users/${record.id}/bookings`)
            }
          >
            Bookings
          </Button>

          {/* Enable / Disable */}
          <Button onClick={() => toggleStatus(record.id)}>
            {record.isActive ? 'Disable' : 'Enable'}
          </Button>

          {/* Delete */}
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

  // -------------------------
  // Render Page
  // -------------------------
  return (
    <PageWrapper title="Manage Users">
      <Table
        rowKey="id"
        dataSource={users}
        columns={columns}
        loading={loading}
        bordered
        pagination={{ pageSize: 8 }}
      />
    </PageWrapper>
  );
}
